import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'demo-development-secret-key-change-in-production';
const DEMO_USERNAME = process.env.DEMO_USERNAME || 'admin';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'password';

app.use(cors());
app.use(express.json());

interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  jti: string;
  nonce: string;
  iat?: number;
  exp?: number;
}

app.post('/access_token', (req, res) => {
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
      
      const payload: TokenPayload = {
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

      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
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
});

app.get('/verify_token', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
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
});

app.listen(PORT, () => {
  console.log(`Authentication server running on port ${PORT}`);
});