import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

export default function Category() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/products?category=${encodeURIComponent(name)}`).then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, [name]);

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{
        padding: '28px 20px 24px',
        background: 'linear-gradient(180deg, #f5ede4 0%, #faf7f4 100%)',
        borderBottom: '1px solid #e8ddd4',
        marginBottom: 24
      }}>
        <Link to="/" style={{ color: '#9a8778', fontSize: 13, letterSpacing: 1, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          ← Retour
        </Link>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 30, fontStyle: 'italic', color: '#3a2e27', fontWeight: 300 }}>
          {name}
        </div>
        <div style={{ width: 32, height: 1, background: '#b8906a', marginTop: 8 }} />
      </div>

      <div style={{ padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#9a8778', padding: 60, fontFamily: 'Cormorant Garamond', fontSize: 18, fontStyle: 'italic' }}>
            Chargement...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9a8778', padding: 60, fontFamily: 'Cormorant Garamond', fontSize: 18, fontStyle: 'italic' }}>
            Aucun article dans cette collection
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}