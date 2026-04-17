import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true); setError('');
    try {
      const res = await API.post('/auth/login', { password });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('dzshark_token', token);
        setTimeout(() => nav('/admin', { replace: true }), 100);
      } else {
        setError('No token received');
      }
    } catch {
      setError('Mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5ede4 0%, #faf7f4 100%)'
    }}>
      <div style={{
        width: 360, padding: '48px 40px', background: '#fff',
        border: '1px solid #e8ddd4', borderRadius: 4,
        boxShadow: '0 20px 60px rgba(184,144,106,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/logo.png" alt="ND Outfits" style={{ width: 100, marginBottom: 16 }}
            onError={e => e.target.style.display = 'none'} />
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 14, color: '#9a8778', letterSpacing: 3, textTransform: 'uppercase' }}>
            Espace Admin
          </div>
        </div>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%', background: '#faf7f4', border: '1px solid #e8ddd4',
            borderRadius: 2, padding: '13px 16px', color: '#3a2e27',
            fontSize: 14, marginBottom: 12, outline: 'none'
          }}
        />
        {error && <div style={{ color: '#c0392b', marginBottom: 12, fontSize: 13, textAlign: 'center' }}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%',
          background: loading ? '#d4b896' : '#b8906a',
          color: '#fff', padding: '14px', borderRadius: 2,
          fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 500
        }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  );
}