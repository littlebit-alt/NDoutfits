import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #2a2a2a',
        transition: 'transform 0.2s, border-color 0.2s',
        cursor: 'pointer'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#00b4f0'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
      >
        <div style={{ position: 'relative', paddingTop: '100%', background: '#111' }}>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x300/111/333?text=No+Image'}
            alt={product.name}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {!product.inStock && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: '#ff3c00', color: '#fff', padding: '4px 10px',
              borderRadius: 6, fontSize: 11, fontWeight: 700
            }}>SOLD OUT</div>
          )}
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: 12, color: i <= (product.rating || 5) ? '#ffc400' : '#333' }}>★</span>
            ))}
          </div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#00b4f0', letterSpacing: 1 }}>
            {product.price.toLocaleString()} دج
          </div>
        </div>
      </div>
    </Link>
  );
}