import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/categories').then(res => {
      setCategories(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '52px 24px 40px',
        background: 'linear-gradient(180deg, #f5ede4 0%, #faf7f4 100%)',
        borderBottom: '1px solid #e8ddd4',
        marginBottom: 36
      }}>
        <img
          src="/logo.png"
          alt="ND Outfits"
          style={{ width: 160, objectFit: 'contain', marginBottom: 16 }}
          onError={e => {
            e.target.style.display = 'none';
          }}
        />
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 13, color: '#9a8778', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 20 }}>
          Mode Féminine · Algérie
        </div>
        <a href="https://wa.me/213" target="_blank" rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#25D366', color: '#fff',
            padding: '11px 26px', borderRadius: 2,
            fontSize: 13, letterSpacing: 1, fontWeight: 500
          }}>
          📱 Contactez-nous
        </a>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, color: '#3a2e27', fontStyle: 'italic', fontWeight: 300 }}>
            Nos Collections
          </div>
          <div style={{ width: 40, height: 1, background: '#b8906a', margin: '10px auto 0' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#9a8778', padding: 60, fontFamily: 'Cormorant Garamond', fontSize: 18, fontStyle: 'italic' }}>
            Chargement...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9a8778', padding: 60, fontFamily: 'Cormorant Garamond', fontSize: 18, fontStyle: 'italic' }}>
            Aucune collection pour le moment
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {categories.map((cat, i) => (
              <Link key={cat.name} to={`/category/${encodeURIComponent(cat.name)}`}>
                <div style={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid #e8ddd4',
                  background: '#fff',
                  transition: 'all 0.3s',
                  animationDelay: `${i * 0.1}s`,
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,144,106,0.2)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Category image */}
                  <div style={{ position: 'relative', paddingTop: '100%', background: '#f5ede4', overflow: 'hidden' }}>
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #f5ede4, #edddd0)'
                      }}>
                        <span style={{ fontSize: 36 }}>👗</span>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(58,46,39,0.55) 0%, transparent 60%)'
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center'
                    }}>
                      <div style={{
                        fontFamily: 'Cormorant Garamond', fontSize: 17, color: '#fff',
                        fontStyle: 'italic', letterSpacing: 1, textShadow: '0 1px 8px rgba(0,0,0,0.3)'
                      }}>
                        {cat.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '48px 24px 24px', color: '#9a8778', fontSize: 12, letterSpacing: 2 }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, fontStyle: 'italic', marginBottom: 6 }}>ND Outfits</div>
        MODE FÉMININE · ALGÉRIE
      </div>
    </div>
  );
}