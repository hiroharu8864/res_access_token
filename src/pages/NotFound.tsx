import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '72px', 
          color: '#4dabf7', 
          margin: '0',
          fontWeight: 'bold'
        }}>
          404
        </h1>
        <h2 style={{ 
          color: '#e0e0e0', 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'normal'
        }}>
          ページが見つかりません
        </h2>
        <p style={{ 
          color: '#b0b0b0', 
          fontSize: '16px', 
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          お探しのページは存在しないか、移動された可能性があります。<br />
          URLを確認するか、下のボタンからホームに戻ってください。
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <Link to="/">
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#4dabf7',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
            marginRight: '15px'
          }}>
            ホームに戻る
          </button>
        </Link>
        <Link to="/access_token">
          <button style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#4dabf7',
            border: '2px solid #4dabf7',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}>
            アクセストークンを取得
          </button>
        </Link>
      </div>

      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #404040'
      }}>
        <h3 style={{ color: '#e0e0e0', marginBottom: '15px', fontSize: '16px' }}>
          利用可能なページ:
        </h3>
        <ul style={{ 
          listStyle: 'none', 
          padding: '0', 
          margin: '0',
          color: '#b0b0b0'
        }}>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/" style={{ color: '#4dabf7', textDecoration: 'none' }}>
              ホーム - 認証サービスの概要
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/access_token" style={{ color: '#4dabf7', textDecoration: 'none' }}>
              アクセストークン - JWTトークンの生成
            </Link>
          </li>
          <li>
            <Link to="/verify_token" style={{ color: '#4dabf7', textDecoration: 'none' }}>
              トークン検証 - JWTトークンの検証
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}