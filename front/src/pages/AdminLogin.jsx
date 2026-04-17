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
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { password });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('dzshark_token', token);
        // small delay to ensure localStorage is written
        setTimeout(() => {
          nav('/admin', { replace: true });
        }, 100);
      } else {
        setError('No token received');
      }
    } catch {
      setError('Wrong password');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 360, margin: '100px auto', padding: 32, background: '#1a1a1a', borderRadius: 20, border: '1px solid #2a2a2a' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 40 }}>🦈</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: 3, color: '#00b4f0' }}>ADMIN LOGIN</div>
      </div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
        style={{
          width: '100%', background: '#111', border: '1px solid #333',
          borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 15, marginBottom: 12
        }}
      />
      {error && <div style={{ color: '#ff3c00', marginBottom: 10, fontSize: 13 }}>{error}</div>}
      <button onClick={handleLogin} disabled={loading} style={{
        width: '100%', background: loading ? '#333' : 'linear-gradient(135deg, #00b4f0, #0080c0)',
        color: '#fff', padding: 14, borderRadius: 10, fontSize: 16, fontWeight: 700
      }}>
        {loading ? 'Logging in...' : 'LOGIN'}
      </button>
    </div>
  );
}