import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CATEGORIES = ['SAC A MAIN', 'CASQUETTE', 'SAC A DOS', 'PORTEFEUILLE', 'CEINTURE', 'PROMO'];
const STATUS_COLORS = { pending: '#ffc400', confirmed: '#00b4f0', delivered: '#00e676', cancelled: '#ff3c00' };

export default function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: CATEGORIES[0], rating: 5 });
  const [imageFile, setImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [msg, setMsg] = useState('');
  const fileRef = useRef();

  const token = localStorage.getItem('dzshark_token');

  useEffect(() => {
    if (!token) { nav('/admin/login'); return; }
    loadOrders();
    loadProducts();
  }, []);

  const loadOrders = () => API.get('/orders').then(r => setOrders(r.data)).catch(() => nav('/admin/login'));
  const loadProducts = () => API.get('/products').then(r => setProducts(r.data));

  const handleLogout = () => { localStorage.removeItem('dzshark_token'); nav('/admin/login'); };

  const handleProductSubmit = async () => {
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('✅ Product updated!');
      } else {
        await API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('✅ Product added!');
      }
      setForm({ name: '', description: '', price: '', category: CATEGORIES[0], rating: 5 });
      setImageFile(null);
      setEditingProduct(null);
      loadProducts();
    } catch { setMsg('❌ Error'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await API.patch(`/orders/${id}/status`, { status });
    loadOrders();
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return;
    await API.delete(`/orders/${id}`);
    loadOrders();
  };

  const startEdit = (p) => {
    setEditingProduct(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category, rating: p.rating });
    setTab('add');
    window.scrollTo(0,0);
  };

  const inputStyle = {
    width: '100%', background: '#111', border: '1px solid #2a2a2a',
    borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 12
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 3, color: '#00b4f0' }}>🦈 ADMIN PANEL</div>
        <button onClick={handleLogout} style={{ background: '#ff3c00', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
          LOGOUT
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Orders', val: orders.length, color: '#00b4f0' },
          { label: 'Pending', val: orders.filter(o => o.status === 'pending').length, color: '#ffc400' },
          { label: 'Products', val: products.length, color: '#00e676' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: s.color }}>{s.val}</div>
            <div style={{ color: '#666', fontSize: 12 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['orders', 'products', 'add'].map(t => (
          <button key={t} onClick={() => { setTab(t); setEditingProduct(null); setMsg(''); }}
            style={{
              padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: tab === t ? '#00b4f0' : '#1a1a1a',
              color: tab === t ? '#000' : '#888',
              border: `1px solid ${tab === t ? '#00b4f0' : '#2a2a2a'}`
            }}>
            {t === 'orders' ? '📦 Orders' : t === 'products' ? '🛍 Products' : '➕ Add Product'}
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 && <div style={{ color: '#555', textAlign: 'center', padding: 40 }}>No orders yet</div>}
          {orders.map(o => (
            <div key={o._id} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 14, padding: 16, marginBottom: 14
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{o.name}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{o.phone} • {o.wilaya}, {o.commune}</div>
                </div>
                <div style={{
                  background: STATUS_COLORS[o.status] + '22', color: STATUS_COLORS[o.status],
                  border: `1px solid ${STATUS_COLORS[o.status]}44`,
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, height: 'fit-content'
                }}>
                  {o.status.toUpperCase()}
                </div>
              </div>
              <div style={{ color: '#ccc', fontSize: 14, marginBottom: 6 }}>
                📦 {o.productName} × {o.quantity} = <strong style={{ color: '#00b4f0' }}>{o.totalPrice?.toLocaleString()} دج</strong>
              </div>
              {o.notes && <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>Note: {o.notes}</div>}
              <div style={{ color: '#444', fontSize: 11, marginBottom: 12 }}>{new Date(o.createdAt).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
                  <button key={s} onClick={() => handleStatusChange(o._id, s)}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      background: o.status === s ? STATUS_COLORS[s] : '#111',
                      color: o.status === s ? '#000' : STATUS_COLORS[s],
                      border: `1px solid ${STATUS_COLORS[s]}`
                    }}>{s}</button>
                ))}
                <button onClick={() => handleDeleteOrder(o._id)}
                  style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: '#ff3c0022', color: '#ff3c00', border: '1px solid #ff3c0044', marginLeft: 'auto' }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, overflow: 'hidden' }}>
              <img src={p.imageUrl || 'https://via.placeholder.com/200'} alt={p.name}
                style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: '#888', fontSize: 12, marginBottom: 6 }}>{p.category}</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#00b4f0' }}>{p.price?.toLocaleString()} دج</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => startEdit(p)}
                    style={{ flex: 1, background: '#00b4f022', color: '#00b4f0', border: '1px solid #00b4f044', borderRadius: 8, padding: '6px 0', fontSize: 13, fontWeight: 700 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProduct(p._id)}
                    style={{ flex: 1, background: '#ff3c0022', color: '#ff3c00', border: '1px solid #ff3c0044', borderRadius: 8, padding: '6px 0', fontSize: 13, fontWeight: 700 }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT TAB */}
      {tab === 'add' && (
        <div style={{ maxWidth: 500 }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 2, color: '#00b4f0', marginBottom: 20 }}>
            {editingProduct ? '✏️ EDIT PRODUCT' : '➕ ADD PRODUCT'}
          </h2>
          {msg && <div style={{ color: msg.includes('✅') ? '#00e676' : '#ff3c00', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

          <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Product Name *</label>
          <input style={inputStyle} placeholder="e.g. Louis Vuitton Black Lux" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />

          <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Description</label>
          <textarea style={{...inputStyle, minHeight: 80}} placeholder="Product description..."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

          <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Price (DA) *</label>
          <input style={inputStyle} type="number" placeholder="e.g. 8800" value={form.price}
            onChange={e => setForm({...form, price: e.target.value})} />

          <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Category *</label>
          <select style={inputStyle} value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Rating (1-5)</label>
          <input style={inputStyle} type="number" min={1} max={5} value={form.rating}
            onChange={e => setForm({...form, rating: Number(e.target.value)})} />

          <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>Product Image</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => setImageFile(e.target.files[0])} />
          <button onClick={() => fileRef.current.click()}
            style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: imageFile ? '#00e676' : '#888' }}>
            {imageFile ? `✅ ${imageFile.name}` : '📷 Choose Image'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleProductSubmit}
              style={{
                flex: 1, background: 'linear-gradient(135deg, #00b4f0, #0080c0)',
                color: '#fff', padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700
              }}>
              {editingProduct ? 'UPDATE' : 'ADD PRODUCT'}
            </button>
            {editingProduct && (
              <button onClick={() => { setEditingProduct(null); setForm({ name: '', description: '', price: '', category: CATEGORIES[0], rating: 5 }); }}
                style={{ background: '#2a2a2a', color: '#888', padding: '14px 20px', borderRadius: 10, fontWeight: 700 }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}