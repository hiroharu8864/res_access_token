import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#e0e0e0', marginBottom: '20px', fontSize: '28px' }}>認証サービス</h1>
      <p style={{ color: '#b0b0b0', fontSize: '18px', marginBottom: '30px' }}>JWT形式のアクセストークンを疑似的に発行・検証するサービスです。</p>
      <Link to="/access_token">
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#4dabf7',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}>
          アクセストークンを取得
        </button>
      </Link>
    </div>
  );
}