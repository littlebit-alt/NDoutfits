import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const CATEGORY_EMOJIS = {
  'SAC A MAIN': '👜',
  'CASQUETTE': '🧢',
  'SAC A DOS': '🎒',
  'PORTEFEUILLE': '👛',
  'CEINTURE': '👔',
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/categories').then(res => {
      setCategories(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '30px 0 24px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a24 100%)',
        borderRadius: 20, marginBottom: 28,
        border: '1px solid #1a2a3a'
      }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🦈</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 42, letterSpacing: 6, color: '#00b4f0' }}>DZ SHARK</div>
        <div style={{ color: '#888', fontSize: 14 }}>Store Premium Algeria</div>
        <a href="https://wa.me/213773002781" target="_blank" rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 16, background: '#25D366', color: '#fff',
            padding: '10px 22px', borderRadius: 25, fontWeight: 700, fontSize: 14
          }}>
          📱 0773 002 781
        </a>
      </div>

      {/* Categories Grid */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 3, color: '#888', marginBottom: 16 }}>
          NOS CATÉGORIES
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#555', padding: 40 }}>Chargement...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {categories.map(cat => (
              <Link key={cat} to={`/category/${encodeURIComponent(cat)}`}>
                <div style={{
                  background: 'linear-gradient(135deg, #1a1a1a, #141414)',
                  border: '1px solid #2a2a2a',
                  borderRadius: 16,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#00b4f0'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <div style={{
                    background: 'linear-gradient(135deg, #0d1a24, #0a1520)',
                    padding: '32px 16px 16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 6 }}>{CATEGORY_EMOJIS[cat] || '📦'}</div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 2, color: '#00b4f0' }}>{cat}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div style={{
        marginTop: 24,
        background: 'linear-gradient(135deg, #1a0a00, #2a1000)',
        border: '1px solid #ff3c0040',
        borderRadius: 16, padding: '20px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#ff3c00', letterSpacing: 3 }}>🔥 PROMO 4000 DA</div>
        <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>Offres limitées disponibles</div>
        <Link to="/category/PROMO">
          <button style={{
            marginTop: 12,
            background: 'linear-gradient(135deg, #ff3c00, #cc2200)',
            color: '#fff', padding: '10px 24px',
            borderRadius: 20, fontWeight: 700, fontSize: 14
          }}>
            VOIR LES PROMOS →
          </button>
        </Link>
      </div>
    </div>
  );
}