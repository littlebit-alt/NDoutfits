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
    <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/" style={{ color: '#00b4f0', fontSize: 20 }}>←</Link>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 3, color: '#00b4f0' }}>{name}</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#555', padding: 60 }}>⏳ Chargement...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#555', padding: 60 }}>Aucun produit dans cette catégorie</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}