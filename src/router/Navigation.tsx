import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav style={{ padding: '20px', backgroundColor: '#2d2d2d', marginBottom: '20px', borderBottom: '1px solid #404040' }}>
      <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#4dabf7', fontSize: '16px' }}>
        ホーム
      </Link>
      <Link to="/access_token" style={{ marginRight: '20px', textDecoration: 'none', color: '#4dabf7', fontSize: '16px' }}>
        アクセストークン
      </Link>
      <Link to="/verify_token" style={{ textDecoration: 'none', color: '#4dabf7', fontSize: '16px' }}>
        トークン検証
      </Link>
    </nav>
  );
}