const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// シンプルなJWT実装（Vercel対応）
function base64UrlEncode(str) {
  try {
    // Node.js環境
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    // Vercel Edge Runtime環境での代替実装
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

function createJWT(payload, secret, expiresIn = '1h') {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // 有効期限の計算
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (expiresIn === '1h' ? 3600 : parseInt(expiresIn));

  const jwtPayload = {
    ...payload,
    iat: now,
    exp: exp,
    iss: 'auth-service',
    aud: 'client-app'
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(jwtPayload));
  
  const data = `${headerEncoded}.${payloadEncoded}`;
  
  // HMAC SHA256署名の作成
  let signature;
  try {
    // Node.js環境
    const crypto = require('crypto');
    signature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    // Vercel環境での代替実装
    signature = base64UrlEncode(data + secret).substring(0, 43);
  }

  return `${data}.${signature}`;
}

// Vercel互換の乱数生成関数
function generateRandomHex(byteLength) {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Web標準のcrypto API (Vercel Edge Runtime対応)
    const array = new Uint8Array(byteLength);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js環境用フォールバック
    try {
      const { randomBytes } = require('crypto');
      return randomBytes(byteLength).toString('hex');
    } catch (error) {
      // 最終フォールバック
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
  }
}

module.exports = async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['POST', 'OPTIONS']
    });
  }

  try {
    console.log('Request received:', {
      method: req.method,
      body: req.body,
      headers: req.headers
    });

    const { username, password } = req.body || {};
    
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({
        error: 'username and password are required'
      });
    }

    console.log('Credentials received:', { username, password: '***' });

    if (username === 'admin' && password === 'password') {
      const jti = generateRandomHex(16);
      const nonce = generateRandomHex(8);
      
      const payload = {
        userId: '12345',
        username: username,
        email: `${username}@example.com`,
        jti: jti,
        nonce: nonce
      };
      
      console.log('Generating token with payload:', payload);

      const accessToken = createJWT(payload, JWT_SECRET, '1h');

      console.log('Token generated successfully');

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.status(200).json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read write'
      });
    } else {
      console.log('Invalid credentials provided');
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};