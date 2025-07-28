const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// シンプルなJWT検証実装（Vercel対応）
function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
    
    // ペイロードのデコード
    let payload;
    try {
      // Node.js環境
      payload = JSON.parse(
        Buffer.from(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
      );
    } catch (error) {
      // Vercel Edge Runtime環境
      payload = JSON.parse(
        atob(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/'))
      );
    }

    // 有効期限チェック
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    // 署名検証（簡易実装）
    const data = `${headerEncoded}.${payloadEncoded}`;
    let expectedSignature;
    
    try {
      // Node.js環境
      const crypto = require('crypto');
      expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } catch (error) {
      // Vercel環境での代替実装
      const base64UrlEncode = (str) => {
        try {
          return Buffer.from(str)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        } catch (e) {
          return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        }
      };
      expectedSignature = base64UrlEncode(data + secret).substring(0, 43);
    }

    if (signatureEncoded !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    return payload;
  } catch (error) {
    throw error;
  }
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = verifyJWT(token, JWT_SECRET);
    
    res.json({
      valid: true,
      payload: decoded
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: 'Invalid token'
    });
  }
};