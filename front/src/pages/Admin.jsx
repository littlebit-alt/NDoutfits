import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const inputStyle = {
  width: '100%', background: '#faf7f4', border: '1px solid #e8ddd4',
  borderRadius: 2, padding: '11px 14px', color: '#3a2e27',
  fontSize: 14, marginBottom: 14, outline: 'none'
};
const labelStyle = { display: 'block', marginBottom: 6, color: '#9a8778', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' };
const STATUS_COLORS = { pending: '#b8906a', confirmed: '#6a8fb8', delivered: '#6ab87a', cancelled: '#b86a6a' };

export default function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [msg, setMsg] = useState('');

  // Product form
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: '', rating: 5 });
  const [productImage, setProductImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const productFileRef = useRef();

  // Category form
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const catFileRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('dzshark_token');
    if (!token) { nav('/admin/login', { replace: true }); return; }
    API.get('/orders')
      .then(r => { setOrders(r.data); setAuthChecked(true); })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('dzshark_token');
          nav('/admin/login', { replace: true });
        } else { setAuthChecked(true); }
      });
    loadProducts();
    loadCategories();
  }, []);

  const loadOrders = () => API.get('/orders').then(r => setOrders(r.data));
  const loadProducts = () => API.get('/products').then(r => setProducts(r.data));
  const loadCategories = () => API.get('/categories').then(r => setCategories(r.data));

  const handleLogout = () => { localStorage.removeItem('dzshark_token'); nav('/admin/login'); };

  // Product submit
  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      setMsg('❌ Nom, prix et catégorie requis'); return;
    }
    const data = new FormData();
    Object.entries(productForm).forEach(([k, v]) => data.append(k, v));
    if (productImage) data.append('image', productImage);
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('✅ Produit mis à jour!');
      } else {
        await API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('✅ Produit ajouté!');
      }
      setProductForm({ name: '', description: '', price: '', category: '', rating: 5 });
      setProductImage(null); setEditingProduct(null);
      loadProducts();
    } catch { setMsg('❌ Erreur'); }
  };

  // Category submit
  const handleCatSubmit = async () => {
    if (!catName) { setMsg('❌ Nom de catégorie requis'); return; }
    const data = new FormData();
    data.append('name', catName);
    if (catImage) data.append('image', catImage);
    try {
      if (editingCat) {
        await API.put(`/categories/${editingCat._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('✅ Catégorie mise à jour!');
      } else {
        await API.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMsg('✅ Catégorie ajoutée!');
      }
      setCatName(''); setCatImage(null); setEditingCat(null);
      loadCategories();
    } catch { setMsg('❌ Erreur'); }
  };

  const handleDeleteCat = async (id) => {
    if (!confirm('Supprimer cette catégorie?')) return;
    await API.delete(`/categories/${id}`);
    loadCategories();
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit?')) return;
    await API.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await API.patch(`/orders/${id}/status`, { status });
    loadOrders();
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Supprimer cette commande?')) return;
    await API.delete(`/orders/${id}`);
    loadOrders();
  };

  const startEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, description: p.description || '', price: p.price, category: p.category, rating: p.rating });
    setTab('addProduct'); window.scrollTo(0, 0);
  };

  const startEditCat = (c) => {
    setEditingCat(c); setCatName(c.name);
    setTab('addCat'); window.scrollTo(0, 0);
  };

  if (!authChecked) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#faf7f4', fontFamily: 'Cormorant Garamond', fontSize: 22, fontStyle: 'italic', color: '#b8906a' }}>
      Chargement...
    </div>
  );

  const tabs = [
    { key: 'orders', label: '📦 Commandes' },
    { key: 'products', label: '👗 Produits' },
    { key: 'addProduct', label: '+ Produit' },
    { key: 'categories', label: '🗂 Catégories' },
    { key: 'addCat', label: '+ Catégorie' },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px', background: '#faf7f4', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 28, fontStyle: 'italic', color: '#3a2e27' }}>Espace Admin</div>
          <div style={{ color: '#9a8778', fontSize: 12, letterSpacing: 2 }}>ND OUTFITS</div>
        </div>
        <button onClick={handleLogout} style={{ background: 'transparent', color: '#9a8778', border: '1px solid #e8ddd4', padding: '8px 18px', borderRadius: 2, fontSize: 12, letterSpacing: 1 }}>
          Déconnexion
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Commandes', val: orders.length },
          { label: 'En attente', val: orders.filter(o => o.status === 'pending').length },
          { label: 'Produits', val: products.length },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2, padding: '18px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 34, color: '#b8906a', fontWeight: 600 }}>{s.val}</div>
            <div style={{ color: '#9a8778', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setMsg(''); setEditingProduct(null); setEditingCat(null); }}
            style={{
              padding: '9px 16px', borderRadius: 2, fontSize: 12, fontWeight: 500, letterSpacing: 1,
              background: tab === t.key ? '#b8906a' : '#fff',
              color: tab === t.key ? '#fff' : '#9a8778',
              border: `1px solid ${tab === t.key ? '#b8906a' : '#e8ddd4'}`
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {msg && <div style={{ color: msg.includes('✅') ? '#6ab87a' : '#b86a6a', marginBottom: 16, fontSize: 14, padding: '10px 14px', background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2 }}>{msg}</div>}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 && <div style={{ textAlign: 'center', color: '#9a8778', padding: 60, fontFamily: 'Cormorant Garamond', fontSize: 20, fontStyle: 'italic' }}>Aucune commande</div>}
          {orders.map(o => (
            <div key={o._id} style={{ background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2, padding: 18, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 18, color: '#3a2e27' }}>{o.name}</div>
                  <div style={{ color: '#9a8778', fontSize: 13 }}>{o.phone} · {o.wilaya}, {o.commune}</div>
                </div>
                <div style={{
                  background: STATUS_COLORS[o.status] + '18', color: STATUS_COLORS[o.status],
                  border: `1px solid ${STATUS_COLORS[o.status]}40`,
                  padding: '4px 14px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', height: 'fit-content'
                }}>{o.status}</div>
              </div>
              <div style={{ color: '#3a2e27', fontSize: 14, marginBottom: 6 }}>
                {o.productName} × {o.quantity} = <strong style={{ color: '#b8906a' }}>{o.totalPrice?.toLocaleString()} دج</strong>
              </div>
              {o.notes && <div style={{ color: '#9a8778', fontSize: 13, marginBottom: 10 }}>Note: {o.notes}</div>}
              <div style={{ color: '#ccc', fontSize: 11, marginBottom: 12 }}>{new Date(o.createdAt).toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
                  <button key={s} onClick={() => handleStatusChange(o._id, s)}
                    style={{
                      padding: '6px 12px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
                      background: o.status === s ? STATUS_COLORS[s] : 'transparent',
                      color: o.status === s ? '#fff' : STATUS_COLORS[s],
                      border: `1px solid ${STATUS_COLORS[s]}`, borderRadius: 2
                    }}>{s}</button>
                ))}
                <button onClick={() => handleDeleteOrder(o._id)}
                  style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 11, background: 'transparent', color: '#b86a6a', border: '1px solid #b86a6a40', borderRadius: 2 }}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS LIST */}
      {tab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2, overflow: 'hidden' }}>
              <img src={p.imageUrl || 'https://via.placeholder.com/200x240/f5ede4/b8906a?text=ND'} alt={p.name}
                style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 15, color: '#3a2e27', marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: '#9a8778', fontSize: 11, marginBottom: 6, letterSpacing: 1 }}>{p.category}</div>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 17, color: '#b8906a', marginBottom: 10 }}>{p.price?.toLocaleString()} دج</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEditProduct(p)}
                    style={{ flex: 1, background: '#f5ede4', color: '#b8906a', border: '1px solid #e8ddd4', borderRadius: 2, padding: '6px 0', fontSize: 12 }}>
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteProduct(p._id)}
                    style={{ flex: 1, background: '#fff5f5', color: '#b86a6a', border: '1px solid #f0dada', borderRadius: 2, padding: '6px 0', fontSize: 12 }}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT PRODUCT */}
      {tab === 'addProduct' && (
        <div style={{ maxWidth: 500, background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2, padding: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontStyle: 'italic', color: '#3a2e27', marginBottom: 24 }}>
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </div>

          <label style={labelStyle}>Nom du produit *</label>
          <input style={inputStyle} placeholder="ex: Robe d'été fleurie" value={productForm.name}
            onChange={e => setProductForm({...productForm, name: e.target.value})} />

          <label style={labelStyle}>Description</label>
          <textarea style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="Description du produit..."
            value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />

          <label style={labelStyle}>Prix (DA) *</label>
          <input style={inputStyle} type="number" placeholder="ex: 4500" value={productForm.price}
            onChange={e => setProductForm({...productForm, price: e.target.value})} />

          <label style={labelStyle}>Catégorie *</label>
          <select style={inputStyle} value={productForm.category}
            onChange={e => setProductForm({...productForm, category: e.target.value})}>
            <option value="">Sélectionner une catégorie</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>

          <label style={labelStyle}>Note (1-5)</label>
          <input style={inputStyle} type="number" min={1} max={5} value={productForm.rating}
            onChange={e => setProductForm({...productForm, rating: Number(e.target.value)})} />

          <label style={labelStyle}>Photo du produit</label>
          <input ref={productFileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => setProductImage(e.target.files[0])} />
          <button onClick={() => productFileRef.current.click()}
            style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: productImage ? '#6ab87a' : '#9a8778', marginBottom: 20 }}>
            {productImage ? `✓ ${productImage.name}` : '📷 Choisir une photo'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleProductSubmit}
              style={{ flex: 1, background: '#b8906a', color: '#fff', padding: 14, borderRadius: 2, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingProduct && (
              <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', category: '', rating: 5 }); }}
                style={{ background: '#f5f0eb', color: '#9a8778', padding: '14px 20px', borderRadius: 2, fontSize: 13 }}>
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* CATEGORIES LIST */}
      {tab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {categories.map(c => (
            <div key={c._id} style={{ background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ position: 'relative', paddingTop: '80%', background: '#f5ede4' }}>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>👗</div>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, fontStyle: 'italic', color: '#3a2e27', marginBottom: 10 }}>{c.name}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEditCat(c)}
                    style={{ flex: 1, background: '#f5ede4', color: '#b8906a', border: '1px solid #e8ddd4', borderRadius: 2, padding: '6px 0', fontSize: 12 }}>
                    Modifier
                  </button>
                  <button onClick={() => handleDeleteCat(c._id)}
                    style={{ flex: 1, background: '#fff5f5', color: '#b86a6a', border: '1px solid #f0dada', borderRadius: 2, padding: '6px 0', fontSize: 12 }}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && <div style={{ color: '#9a8778', fontFamily: 'Cormorant Garamond', fontSize: 18, fontStyle: 'italic', padding: 40 }}>Aucune catégorie</div>}
        </div>
      )}

      {/* ADD/EDIT CATEGORY */}
      {tab === 'addCat' && (
        <div style={{ maxWidth: 400, background: '#fff', border: '1px solid #e8ddd4', borderRadius: 2, padding: 28 }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontStyle: 'italic', color: '#3a2e27', marginBottom: 24 }}>
            {editingCat ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </div>

          <label style={labelStyle}>Nom de la catégorie *</label>
          <input style={inputStyle} placeholder="ex: Robes, Tops, Pantalons..." value={catName}
            onChange={e => setCatName(e.target.value)} />

          <label style={labelStyle}>Photo de la catégorie</label>
          <input ref={catFileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => setCatImage(e.target.files[0])} />
          <button onClick={() => catFileRef.current.click()}
            style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', color: catImage ? '#6ab87a' : '#9a8778', marginBottom: 20 }}>
            {catImage ? `✓ ${catImage.name}` : '🖼 Choisir une photo'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCatSubmit}
              style={{ flex: 1, background: '#b8906a', color: '#fff', padding: 14, borderRadius: 2, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
              {editingCat ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingCat && (
              <button onClick={() => { setEditingCat(null); setCatName(''); }}
                style={{ background: '#f5f0eb', color: '#9a8778', padding: '14px 20px', borderRadius: 2, fontSize: 13 }}>
                Annuler
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}