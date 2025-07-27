import { useState } from 'react';

interface VerificationResult {
  valid: boolean;
  payload?: any;
  error?: string;
}

export default function VerifyToken() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyToken = async () => {
    if (!token.trim()) {
      setResult({
        valid: false,
        error: 'トークンを入力してください'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/verify_token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.trim()}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          valid: true,
          payload: data.payload
        });
      } else {
        setResult({
          valid: false,
          error: data.error || 'トークンの検証に失敗しました'
        });
      }
    } catch (error) {
      setResult({
        valid: false,
        error: 'サーバーに接続できませんでした'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyToken();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#1a1a1a', color: '#e0e0e0' }}>
      <h1 style={{ color: '#e0e0e0', marginBottom: '10px', fontSize: '24px' }}>トークン検証</h1>
      <p style={{ color: '#b0b0b0', marginBottom: '30px' }}>発行されたアクセストークンを検証します。</p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#e0e0e0' }}>
          アクセストークン:
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="ここにJWTトークンを貼り付けてください..."
          style={{
            width: '100%',
            height: '120px',
            padding: '15px',
            border: '1px solid #404040',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            resize: 'vertical',
            backgroundColor: '#2d2d2d',
            color: '#e0e0e0'
          }}
        />
      </div>

      <button
        onClick={verifyToken}
        disabled={loading || !token.trim()}
        style={{
          padding: '12px 24px',
          backgroundColor: loading || !token.trim() ? '#404040' : '#51cf66',
          color: loading || !token.trim() ? '#808080' : '#1a1a1a',
          border: 'none',
          borderRadius: '8px',
          cursor: loading || !token.trim() ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? '検証中...' : 'トークンを検証'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          {result.valid ? (
            <div style={{
              backgroundColor: '#1b2d1b',
              border: '1px solid #51cf66',
              color: '#51cf66',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#51cf66', fontSize: '18px' }}>
                ✅ 認証成功 (200 OK)
              </h3>
              <p style={{ color: '#b0b0b0' }}>トークンは有効です。</p>
              
              {result.payload && (
                <div>
                  <h4 style={{ color: '#51cf66', marginBottom: '10px', fontSize: '14px' }}>ペイロード情報:</h4>
                  <pre style={{
                    backgroundColor: '#2d2d2d',
                    padding: '15px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    overflow: 'auto',
                    color: '#e0e0e0',
                    border: '1px solid #404040'
                  }}>
                    {JSON.stringify(result.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#2d1b1b',
              border: '1px solid #ff6b6b',
              color: '#ff6b6b',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#ff6b6b', fontSize: '18px' }}>
                ❌ 認証失敗 (401 Unauthorized)
              </h3>
              <p style={{ color: '#b0b0b0' }}>{result.error}</p>
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: '30px',
        backgroundColor: '#1b2635',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #4dabf7'
      }}>
        <h3 style={{ color: '#4dabf7', marginBottom: '15px', fontSize: '16px' }}>使用方法:</h3>
        <ol style={{ color: '#b0b0b0' }}>
          <li>/access_token ページでアクセストークンを取得</li>
          <li>取得したトークンを上記のテキストエリアに貼り付け</li>
          <li>「トークンを検証」ボタンをクリック</li>
        </ol>
      </div>
    </div>
  );
}