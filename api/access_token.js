import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-development-secret-key-change-in-production';
const DEMO_USERNAME = process.env.DEMO_USERNAME || 'admin';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'password';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // デモ用途での動作ログ（本番環境では環境変数設定を推奨）
    if (JWT_SECRET === 'demo-development-secret-key-change-in-production' ||
        DEMO_USERNAME === 'admin' || 
        DEMO_PASSWORD === 'password') {
      console.log('Using default demo credentials. For production, please set custom environment variables.');
    }

    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        error: 'username and password are required'
      });
    }

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      const jti = randomBytes(16).toString('hex');
      const nonce = randomBytes(8).toString('hex');
      
      const payload = {
        userId: '12345',
        username: username,
        email: `${username}@example.com`,
        jti: jti,
        nonce: nonce
      };
      
      console.log('Generating token with JTI:', jti, 'Nonce:', nonce);

      const accessToken = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h',
        issuer: 'auth-service',
        audience: 'client-app'
      });

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read write'
      });
    } else {
      res.status(401).json({
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}