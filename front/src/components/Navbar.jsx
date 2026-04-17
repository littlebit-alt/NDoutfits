import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      background: 'rgba(250,247,244,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e8ddd4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo.png"
            alt="ND Outfits"
            style={{ height: 44, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 20, color: '#b8906a', letterSpacing: 3, fontWeight: 300 }}>
            ND Outfits
          </div>
        </div>
      </Link>
      <Link to="/admin" style={{
        border: '1px solid #b8906a',
        color: '#b8906a',
        padding: '7px 18px',
        borderRadius: 2,
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: 500,
        textTransform: 'uppercase'
      }}>
        Admin
      </Link>
    </nav>
  );
}