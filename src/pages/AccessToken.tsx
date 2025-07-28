import { useState, useEffect } from 'react';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export default function AccessToken() {
  const [token, setToken] = useState<TokenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decodedJWT, setDecodedJWT] = useState<{header: any, payload: any, signature: string} | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      return { header, payload, signature };
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  };

  const generateToken = async () => {
    console.log('=== generateToken called ===');
    setLoading(true);
    setError(null);
    setToken(null);
    setDecodedJWT(null);
    
    try {
      const timestamp = Date.now();
      console.log('Making request with timestamp:', timestamp);
      
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? `http://localhost:3001/access_token?t=${timestamp}`
        : `/api/access_token?t=${timestamp}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'password'
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data: TokenResponse = await response.json();
      console.log('Full response data:', data);
      console.log('New token received:', data.access_token.substring(0, 50) + '...');
      console.log('Token ends with:', data.access_token.substring(data.access_token.length - 10));
      
      setToken(data);
      
      const decoded = decodeJWT(data.access_token);
      console.log('Decoded JWT payload:', decoded?.payload);
      setDecodedJWT(decoded);
      
      // Force re-render by updating refresh key
      setRefreshKey(prev => {
        console.log('Updating refresh key from', prev, 'to', prev + 1);
        return prev + 1;
      });
    } catch (err) {
      console.error('Error in generateToken:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      console.log('=== generateToken finished ===');
    }
  };

  useEffect(() => {
    generateToken();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('トークンをクリップボードにコピーしました！');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#1a1a1a', color: '#e0e0e0' }}>
      <h1 style={{ color: '#e0e0e0', marginBottom: '20px', fontSize: '24px' }}>アクセストークン</h1>
      
      <button 
        onClick={generateToken} 
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: loading ? '#404040' : '#4dabf7',
          color: loading ? '#808080' : '#1a1a1a',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? '生成中...' : '新しいトークンを生成'}
      </button>

      {error && (
        <div style={{ 
          color: '#ff6b6b', 
          backgroundColor: '#2d1b1b', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #4d2626'
        }}>
          エラー: {error}
        </div>
      )}

      {token && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#e0e0e0', marginBottom: '20px', fontSize: '20px' }}>APIレスポンス</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#4dabf7', marginBottom: '10px', fontSize: '16px' }}>完全なJSONレスポンス</h3>
            <pre 
              key={`json-response-${refreshKey}`}
              style={{
                backgroundColor: '#2d2d2d',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '12px',
                overflow: 'auto',
                color: '#e0e0e0',
                border: '1px solid #404040'
              }}>
              {JSON.stringify(token, null, 2)}
            </pre>
          </div>

          <h2 style={{ color: '#e0e0e0', marginBottom: '20px', fontSize: '20px' }}>レスポンス詳細</h2>
          
          <div style={{ marginBottom: '15px', color: '#b0b0b0' }}>
            <strong style={{ color: '#e0e0e0' }}>トークンタイプ:</strong> {token.token_type}
          </div>
          
          <div style={{ marginBottom: '15px', color: '#b0b0b0' }}>
            <strong style={{ color: '#e0e0e0' }}>有効期限:</strong> {token.expires_in}秒
          </div>
          
          <div style={{ marginBottom: '15px', color: '#b0b0b0' }}>
            <strong style={{ color: '#e0e0e0' }}>スコープ:</strong> {token.scope}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#e0e0e0' }}>アクセストークン:</strong>
            <div 
              key={`token-${refreshKey}`}
              style={{
                backgroundColor: '#2d2d2d',
                padding: '15px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                wordBreak: 'break-all',
                border: '1px solid #404040',
                marginTop: '10px',
                position: 'relative',
                color: '#e0e0e0'
              }}>
              {token.access_token}
              <button
                onClick={() => copyToClipboard(token.access_token)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#51cf66',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                コピー
              </button>
            </div>
          </div>

          {decodedJWT && (
            <div key={`jwt-${refreshKey}`} style={{ marginTop: '30px' }}>
              <h3 style={{ color: '#e0e0e0', marginBottom: '20px', fontSize: '18px' }}>JWT形式の詳細</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#ff9f43', marginBottom: '10px', fontSize: '14px' }}>ヘッダー (Header)</h4>
                <pre style={{
                  backgroundColor: '#2d2d2d',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  overflow: 'auto',
                  color: '#e0e0e0',
                  border: '1px solid #404040'
                }}>
                  {JSON.stringify(decodedJWT.header, null, 2)}
                </pre>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#ff9f43', marginBottom: '10px', fontSize: '14px' }}>ペイロード (Payload)</h4>
                <pre style={{
                  backgroundColor: '#2d2d2d',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  overflow: 'auto',
                  color: '#e0e0e0',
                  border: '1px solid #404040'
                }}>
                  {JSON.stringify(decodedJWT.payload, null, 2)}
                </pre>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#ff9f43', marginBottom: '10px', fontSize: '14px' }}>署名 (Signature)</h4>
                <div style={{
                  backgroundColor: '#2d2d2d',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  color: '#e0e0e0',
                  border: '1px solid #404040',
                  fontFamily: 'monospace'
                }}>
                  {decodedJWT.signature}
                </div>
              </div>
            </div>
          )}

          <div style={{ 
            backgroundColor: '#1b2635', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #4dabf7'
          }}>
            <h3 style={{ color: '#4dabf7', marginBottom: '15px', fontSize: '16px' }}>使用例:</h3>
            <pre style={{ 
              backgroundColor: '#2d2d2d', 
              padding: '15px', 
              borderRadius: '6px',
              fontSize: '12px',
              overflow: 'auto',
              color: '#e0e0e0',
              border: '1px solid #404040'
            }}>
{`curl -H "Authorization: Bearer ${token.access_token}" \\
     /api/verify_token`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}