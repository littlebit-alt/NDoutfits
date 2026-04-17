import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`}>
      <div style={{
        background: '#fff',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #e8ddd4',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,144,106,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{ position: 'relative', paddingTop: '120%', background: '#f5f0eb', overflow: 'hidden' }}>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x360/f5f0eb/b8906a?text=ND'}
            alt={product.name}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {!product.inStock && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: '#3a2e27', color: '#fff', padding: '4px 10px',
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase'
            }}>Épuisé</div>
          )}
        </div>
        <div style={{ padding: '14px 12px' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond', fontSize: 16, color: '#3a2e27',
            marginBottom: 4, fontWeight: 400, lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: 10, color: i <= (product.rating || 5) ? '#b8906a' : '#ddd' }}>★</span>
            ))}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 18, color: '#b8906a', fontWeight: 600 }}>
            {product.price.toLocaleString()} دج
          </div>
        </div>
      </div>
    </Link>
  );
}