import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { password });
      localStorage.setItem('dzshark_token', res.data.token);
      nav('/admin');
    } catch {
      setError('Wrong password');
    }
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
      <button onClick={handleLogin} style={{
        width: '100%', background: 'linear-gradient(135deg, #00b4f0, #0080c0)',
        color: '#fff', padding: 14, borderRadius: 10, fontSize: 16, fontWeight: 700
      }}>LOGIN</button>
    </div>
  );
}