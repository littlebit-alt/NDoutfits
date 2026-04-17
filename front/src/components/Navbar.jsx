import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      background: '#0a0a0a',
      borderBottom: '1px solid #1e1e1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>🦈</span>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#00b4f0', letterSpacing: 2 }}>DZ</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#fff', letterSpacing: 3, marginTop: -6 }}>SHARK</div>
          </div>
        </div>
      </Link>
      <Link to="/admin" style={{
        background: 'linear-gradient(135deg, #00b4f0, #0080c0)',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700
      }}>
        ADMIN
      </Link>
    </nav>
  );
}