import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const iStyle = {
  width:'100%', background:'#faf7f4', border:'1px solid #e8ddd4',
  borderRadius:2, padding:'11px 14px', color:'#3a2e27',
  fontSize:14, marginBottom:14, outline:'none'
};
const lStyle = { display:'block', marginBottom:6, color:'#9a8778', fontSize:12, letterSpacing:1, textTransform:'uppercase' };
const STATUS_COLORS = { pending:'#b8906a', confirmed:'#6a8fb8', delivered:'#6ab87a', cancelled:'#b86a6a' };

const DEFAULT_POINTURES = ['36','37','38','39','40','41','42','43','44','45'];
const DEFAULT_TAILLES = ['XS','S','M','L','XL','XXL','XXXL'];

export default function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [msg, setMsg] = useState('');

  // Product form
  const [pForm, setPForm] = useState({
    name:'', description:'', price:'', category:'', rating:5,
    showPointure:false, pointures:[],
    showTaille:false, tailles:[],
  });
  const [productImages, setProductImages] = useState([]); // new files
  const [keepImages, setKeepImages] = useState([]); // existing urls to keep
  const [editingProduct, setEditingProduct] = useState(null);
  const productFileRef = useRef();

  // Category form
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const catFileRef = useRef();

  // Settings
  const [whatsappVal, setWhatsappVal] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('dzshark_token');
    if (!token) { nav('/admin/login', { replace:true }); return; }
    API.get('/orders')
      .then(r => { setOrders(r.data); setAuthChecked(true); })
      .catch(err => {
        if (err.response?.status === 401) { localStorage.removeItem('dzshark_token'); nav('/admin/login', { replace:true }); }
        else setAuthChecked(true);
      });
    loadProducts(); loadCategories();
    API.get('/settings/whatsapp').then(r => setWhatsappVal(r.data.value || ''));
  }, []);

  const loadOrders = () => API.get('/orders').then(r => setOrders(r.data));
  const loadProducts = () => API.get('/products').then(r => setProducts(r.data));
  const loadCategories = () => API.get('/categories').then(r => setCategories(r.data));
  const handleLogout = () => { localStorage.removeItem('dzshark_token'); nav('/admin/login'); };

  // Toggle pointure/taille item
  const toggleItem = (field, val) => {
    setPForm(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val] };
    });
  };

  // Product submit
  const handleProductSubmit = async () => {
    if (!pForm.name || !pForm.price || !pForm.category) { setMsg('❌ Nom, prix et catégorie requis'); return; }
    const data = new FormData();
    data.append('name', pForm.name);
    data.append('description', pForm.description);
    data.append('price', pForm.price);
    data.append('category', pForm.category);
    data.append('rating', pForm.rating);
    data.append('showPointure', pForm.showPointure);
    data.append('pointures', JSON.stringify(pForm.pointures));
    data.append('showTaille', pForm.showTaille);
    data.append('tailles', JSON.stringify(pForm.tailles));
    if (editingProduct) data.append('keepImages', JSON.stringify(keepImages));
    productImages.forEach(f => data.append('images', f));
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, data, { headers:{ 'Content-Type':'multipart/form-data' } });
        setMsg('✅ Produit mis à jour!');
      } else {
        await API.post('/products', data, { headers:{ 'Content-Type':'multipart/form-data' } });
        setMsg('✅ Produit ajouté!');
      }
      setPForm({ name:'', description:'', price:'', category:'', rating:5, showPointure:false, pointures:[], showTaille:false, tailles:[] });
      setProductImages([]); setKeepImages([]); setEditingProduct(null);
      loadProducts();
    } catch { setMsg('❌ Erreur'); }
  };

  // Category submit
  const handleCatSubmit = async () => {
    if (!catName) { setMsg('❌ Nom requis'); return; }
    const data = new FormData();
    data.append('name', catName);
    if (catImage) data.append('image', catImage);
    try {
      if (editingCat) {
        await API.put(`/categories/${editingCat._id}`, data, { headers:{ 'Content-Type':'multipart/form-data' } });
        setMsg('✅ Catégorie mise à jour!');
      } else {
        await API.post('/categories', data, { headers:{ 'Content-Type':'multipart/form-data' } });
        setMsg('✅ Catégorie ajoutée!');
      }
      setCatName(''); setCatImage(null); setEditingCat(null);
      loadCategories();
    } catch { setMsg('❌ Erreur'); }
  };

  const handleSaveWhatsapp = async () => {
    await API.post('/settings/whatsapp', { value: whatsappVal });
    setMsg('✅ WhatsApp mis à jour!');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { setMsg('❌ Les mots de passe ne correspondent pas'); return; }
    if (newPassword.length < 4) { setMsg('❌ Mot de passe trop court'); return; }
    await API.post('/settings/password', { newPassword });
    setMsg('✅ Mot de passe changé!');
    setNewPassword(''); setConfirmPassword('');
  };

  const handleDeleteProduct = async (id) => { if(!confirm('Supprimer?'))return; await API.delete(`/products/${id}`); loadProducts(); };
  const handleDeleteCat = async (id) => { if(!confirm('Supprimer?'))return; await API.delete(`/categories/${id}`); loadCategories(); };
  const handleStatusChange = async (id, status) => { await API.patch(`/orders/${id}/status`, { status }); loadOrders(); };
  const handleDeleteOrder = async (id) => { if(!confirm('Supprimer?'))return; await API.delete(`/orders/${id}`); loadOrders(); };

  const startEditProduct = (p) => {
    setEditingProduct(p);
    setPForm({
      name:p.name, description:p.description||'', price:p.price, category:p.category, rating:p.rating,
      showPointure:p.showPointure||false, pointures:p.pointures||[],
      showTaille:p.showTaille||false, tailles:p.tailles||[],
    });
    setKeepImages(p.images||[]);
    setProductImages([]);
    setTab('addProduct'); window.scrollTo(0,0);
  };

  const startEditCat = (c) => { setEditingCat(c); setCatName(c.name); setTab('addCat'); window.scrollTo(0,0); };

  if (!authChecked) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#faf7f4', fontFamily:'Cormorant Garamond', fontSize:22, fontStyle:'italic', color:'#b8906a' }}>
      Chargement...
    </div>
  );

  const tabs = [
    { key:'orders', label:'📦 Commandes' },
    { key:'products', label:'👗 Produits' },
    { key:'addProduct', label:'+ Produit' },
    { key:'categories', label:'🗂 Catégories' },
    { key:'addCat', label:'+ Catégorie' },
    { key:'settings', label:'⚙️ Paramètres' },
  ];

  const chipBtn = (selected, val, onClick) => ({
    padding:'7px 14px', borderRadius:2, fontSize:12, cursor:'pointer', fontWeight:500,
    border:`1px solid ${selected ? '#b8906a' : '#e8ddd4'}`,
    background: selected ? '#b8906a' : '#fff',
    color: selected ? '#fff' : '#9a8778',
    transition:'all 0.15s'
  });

  return (
    <div style={{ maxWidth:960, margin:'0 auto', padding:'24px 16px', background:'#faf7f4', minHeight:'100vh' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:'Cormorant Garamond', fontSize:28, fontStyle:'italic', color:'#3a2e27' }}>Espace Admin</div>
          <div style={{ color:'#9a8778', fontSize:12, letterSpacing:2 }}>ND OUTFITS</div>
        </div>
        <button onClick={handleLogout} style={{ background:'transparent', color:'#9a8778', border:'1px solid #e8ddd4', padding:'8px 18px', borderRadius:2, fontSize:12, letterSpacing:1, cursor:'pointer' }}>
          Déconnexion
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
        {[
          { label:'Commandes', val:orders.length },
          { label:'En attente', val:orders.filter(o=>o.status==='pending').length },
          { label:'Produits', val:products.length },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, padding:'18px 14px', textAlign:'center' }}>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:34, color:'#b8906a', fontWeight:600 }}>{s.val}</div>
            <div style={{ color:'#9a8778', fontSize:11, letterSpacing:1, textTransform:'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:24, flexWrap:'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setMsg(''); }}
            style={{ padding:'9px 16px', borderRadius:2, fontSize:12, fontWeight:500, letterSpacing:1, cursor:'pointer',
              background: tab===t.key ? '#b8906a' : '#fff',
              color: tab===t.key ? '#fff' : '#9a8778',
              border:`1px solid ${tab===t.key ? '#b8906a' : '#e8ddd4'}` }}>
            {t.label}
          </button>
        ))}
      </div>

      {msg && (
        <div style={{ color: msg.includes('✅') ? '#6ab87a' : '#b86a6a', marginBottom:16, fontSize:14, padding:'10px 14px', background:'#fff', border:'1px solid #e8ddd4', borderRadius:2 }}>
          {msg}
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab==='orders' && (
        <div>
          {orders.length===0 && <div style={{ textAlign:'center', color:'#9a8778', padding:60, fontFamily:'Cormorant Garamond', fontSize:20, fontStyle:'italic' }}>Aucune commande</div>}
          {orders.map(o => (
            <div key={o._id} style={{ background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, padding:18, marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                <div>
                  <div style={{ fontFamily:'Cormorant Garamond', fontSize:18, color:'#3a2e27' }}>{o.name}</div>
                  <div style={{ color:'#9a8778', fontSize:13 }}>{o.phone} · {o.wilaya}, {o.commune}</div>
                </div>
                <div style={{ background:STATUS_COLORS[o.status]+'18', color:STATUS_COLORS[o.status], border:`1px solid ${STATUS_COLORS[o.status]}40`, padding:'4px 14px', fontSize:11, letterSpacing:1, textTransform:'uppercase', height:'fit-content' }}>
                  {o.status}
                </div>
              </div>
              <div style={{ color:'#3a2e27', fontSize:14, marginBottom:4 }}>
                {o.productName} × {o.quantity} = <strong style={{ color:'#b8906a' }}>{o.totalPrice?.toLocaleString()} دج</strong>
              </div>
              {o.selectedPointure && <div style={{ color:'#9a8778', fontSize:13, marginBottom:2 }}>Pointure: <strong>{o.selectedPointure}</strong></div>}
              {o.selectedTaille && <div style={{ color:'#9a8778', fontSize:13, marginBottom:4 }}>Taille: <strong>{o.selectedTaille}</strong></div>}
              {o.deliveryType && (
  <div style={{ color:'#9a8778', fontSize:13, marginBottom:2 }}>
    Livraison: <strong>{o.deliveryType === 'domicile' ? '🏠 Domicile' : '🏪 Stop desk'}</strong> — <strong style={{ color:'#b8906a' }}>{o.deliveryPrice?.toLocaleString()} دج</strong>
  </div>
)}
              {o.notes && <div style={{ color:'#9a8778', fontSize:13, marginBottom:8 }}>Note: {o.notes}</div>}
              <div style={{ color:'#ccc', fontSize:11, marginBottom:12 }}>{new Date(o.createdAt).toLocaleString()}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['pending','confirmed','delivered','cancelled'].map(s => (
                  <button key={s} onClick={() => handleStatusChange(o._id,s)}
                    style={{ padding:'6px 12px', fontSize:11, letterSpacing:1, textTransform:'uppercase', cursor:'pointer',
                      background: o.status===s ? STATUS_COLORS[s] : 'transparent',
                      color: o.status===s ? '#fff' : STATUS_COLORS[s],
                      border:`1px solid ${STATUS_COLORS[s]}`, borderRadius:2 }}>{s}</button>
                ))}
                <button onClick={() => handleDeleteOrder(o._id)}
                  style={{ marginLeft:'auto', padding:'6px 12px', fontSize:11, cursor:'pointer', background:'transparent', color:'#b86a6a', border:'1px solid #b86a6a40', borderRadius:2 }}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRODUCTS LIST ── */}
      {tab==='products' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14 }}>
          {products.map(p => (
            <div key={p._id} style={{ background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, overflow:'hidden' }}>
              <img src={p.images?.[0] || 'https://via.placeholder.com/200x240/f5ede4/b8906a?text=ND'} alt={p.name}
                style={{ width:'100%', height:180, objectFit:'cover' }} />
              <div style={{ padding:12 }}>
                <div style={{ fontFamily:'Cormorant Garamond', fontSize:15, color:'#3a2e27', marginBottom:4 }}>{p.name}</div>
                <div style={{ color:'#9a8778', fontSize:11, marginBottom:2, letterSpacing:1 }}>{p.category}</div>
                <div style={{ color:'#aaa', fontSize:11, marginBottom:6 }}>
                  {p.images?.length||0} photo(s)
                  {p.showPointure && ' · Pointure'}
                  {p.showTaille && ' · Taille'}
                </div>
                <div style={{ fontFamily:'Cormorant Garamond', fontSize:17, color:'#b8906a', marginBottom:10 }}>{p.price?.toLocaleString()} دج</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => startEditProduct(p)}
                    style={{ flex:1, background:'#f5ede4', color:'#b8906a', border:'1px solid #e8ddd4', borderRadius:2, padding:'6px 0', fontSize:12, cursor:'pointer' }}>Modifier</button>
                  <button onClick={() => handleDeleteProduct(p._id)}
                    style={{ flex:1, background:'#fff5f5', color:'#b86a6a', border:'1px solid #f0dada', borderRadius:2, padding:'6px 0', fontSize:12, cursor:'pointer' }}>Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD/EDIT PRODUCT ── */}
      {tab==='addProduct' && (
        <div style={{ maxWidth:560, background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, padding:28 }}>
          <div style={{ fontFamily:'Cormorant Garamond', fontSize:22, fontStyle:'italic', color:'#3a2e27', marginBottom:24 }}>
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
          </div>

          <label style={lStyle}>Nom *</label>
          <input style={iStyle} placeholder="ex: Robe d'été fleurie" value={pForm.name}
            onChange={e => setPForm({...pForm, name:e.target.value})} />

          <label style={lStyle}>Description</label>
          <textarea style={{...iStyle, minHeight:80, resize:'vertical'}} placeholder="Description..."
            value={pForm.description} onChange={e => setPForm({...pForm, description:e.target.value})} />

          <label style={lStyle}>Prix (DA) *</label>
          <input style={iStyle} type="number" placeholder="ex: 4500" value={pForm.price}
            onChange={e => setPForm({...pForm, price:e.target.value})} />

          <label style={lStyle}>Catégorie *</label>
          <select style={iStyle} value={pForm.category}
            onChange={e => setPForm({...pForm, category:e.target.value})}>
            <option value="">Sélectionner une catégorie</option>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>

          <label style={lStyle}>Note (1-5)</label>
          <input style={iStyle} type="number" min={1} max={5} value={pForm.rating}
            onChange={e => setPForm({...pForm, rating:Number(e.target.value)})} />

          {/* ── PHOTOS ── */}
          <label style={lStyle}>Photos (max 6)</label>

          {/* Existing images (edit mode) */}
          {keepImages.length > 0 && (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
              {keepImages.map((url, i) => (
                <div key={i} style={{ position:'relative' }}>
                  <img src={url} alt="" style={{ width:70, height:84, objectFit:'cover', borderRadius:2, border:'1px solid #e8ddd4' }} />
                  <button onClick={() => setKeepImages(keepImages.filter((_,j)=>j!==i))}
                    style={{ position:'absolute', top:-6, right:-6, background:'#b86a6a', color:'#fff', border:'none', borderRadius:'50%', width:18, height:18, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image files preview */}
          {productImages.length > 0 && (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
              {productImages.map((f, i) => (
                <div key={i} style={{ position:'relative' }}>
                  <img src={URL.createObjectURL(f)} alt="" style={{ width:70, height:84, objectFit:'cover', borderRadius:2, border:'1px solid #b8906a' }} />
                  <button onClick={() => setProductImages(productImages.filter((_,j)=>j!==i))}
                    style={{ position:'absolute', top:-6, right:-6, background:'#b86a6a', color:'#fff', border:'none', borderRadius:'50%', width:18, height:18, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input ref={productFileRef} type="file" accept="image/*" multiple style={{ display:'none' }}
            onChange={e => {
              const files = Array.from(e.target.files);
              const total = keepImages.length + productImages.length + files.length;
              if (total > 6) { setMsg('❌ Maximum 6 photos'); return; }
              setProductImages(prev => [...prev, ...files]);
            }} />
          <button onClick={() => productFileRef.current.click()}
            style={{ ...iStyle, textAlign:'left', cursor:'pointer', color:'#9a8778', marginBottom:20 }}>
            📷 Ajouter des photos ({keepImages.length + productImages.length}/6)
          </button>

          {/* ── POINTURE ── */}
          <div style={{ background:'#faf7f4', border:'1px solid #e8ddd4', borderRadius:2, padding:16, marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontFamily:'Cormorant Garamond', fontSize:16, fontStyle:'italic', color:'#3a2e27' }}>Pointure (Chaussures)</div>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <div onClick={() => setPForm({...pForm, showPointure:!pForm.showPointure})}
                  style={{ width:40, height:22, borderRadius:11, background: pForm.showPointure ? '#b8906a' : '#e8ddd4', position:'relative', transition:'background 0.2s', cursor:'pointer' }}>
                  <div style={{ position:'absolute', top:2, left: pForm.showPointure ? 20 : 2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
                </div>
                <span style={{ fontSize:12, color:'#9a8778' }}>{pForm.showPointure ? 'Activé' : 'Désactivé'}</span>
              </label>
            </div>
            {pForm.showPointure && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {DEFAULT_POINTURES.map(p => (
                  <button key={p} onClick={() => toggleItem('pointures', p)}
                    style={chipBtn(pForm.pointures.includes(p), p)}>{p}</button>
                ))}
              </div>
            )}
          </div>

          {/* ── TAILLE ── */}
          <div style={{ background:'#faf7f4', border:'1px solid #e8ddd4', borderRadius:2, padding:16, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontFamily:'Cormorant Garamond', fontSize:16, fontStyle:'italic', color:'#3a2e27' }}>Taille (Vêtements)</div>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <div onClick={() => setPForm({...pForm, showTaille:!pForm.showTaille})}
                  style={{ width:40, height:22, borderRadius:11, background: pForm.showTaille ? '#b8906a' : '#e8ddd4', position:'relative', transition:'background 0.2s', cursor:'pointer' }}>
                  <div style={{ position:'absolute', top:2, left: pForm.showTaille ? 20 : 2, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
                </div>
                <span style={{ fontSize:12, color:'#9a8778' }}>{pForm.showTaille ? 'Activé' : 'Désactivé'}</span>
              </label>
            </div>
            {pForm.showTaille && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {DEFAULT_TAILLES.map(t => (
                  <button key={t} onClick={() => toggleItem('tailles', t)}
                    style={chipBtn(pForm.tailles.includes(t), t)}>{t}</button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={handleProductSubmit}
              style={{ flex:1, background:'#b8906a', color:'#fff', padding:14, borderRadius:2, fontSize:13, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingProduct && (
              <button onClick={() => { setEditingProduct(null); setPForm({ name:'', description:'', price:'', category:'', rating:5, showPointure:false, pointures:[], showTaille:false, tailles:[] }); setKeepImages([]); setProductImages([]); }}
                style={{ background:'#f5f0eb', color:'#9a8778', padding:'14px 20px', borderRadius:2, fontSize:13, cursor:'pointer' }}>
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── CATEGORIES LIST ── */}
      {tab==='categories' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 }}>
          {categories.length===0 && <div style={{ color:'#9a8778', fontFamily:'Cormorant Garamond', fontSize:18, fontStyle:'italic', padding:40 }}>Aucune catégorie</div>}
          {categories.map(c => (
            <div key={c._id} style={{ background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, overflow:'hidden' }}>
              <div style={{ position:'relative', paddingTop:'80%', background:'#f5ede4' }}>
                {c.imageUrl
                  ? <img src={c.imageUrl} alt={c.name} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30 }}>👗</div>}
              </div>
              <div style={{ padding:12 }}>
                <div style={{ fontFamily:'Cormorant Garamond', fontSize:16, fontStyle:'italic', color:'#3a2e27', marginBottom:10 }}>{c.name}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => startEditCat(c)}
                    style={{ flex:1, background:'#f5ede4', color:'#b8906a', border:'1px solid #e8ddd4', borderRadius:2, padding:'6px 0', fontSize:12, cursor:'pointer' }}>Modifier</button>
                  <button onClick={() => handleDeleteCat(c._id)}
                    style={{ flex:1, background:'#fff5f5', color:'#b86a6a', border:'1px solid #f0dada', borderRadius:2, padding:'6px 0', fontSize:12, cursor:'pointer' }}>Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD/EDIT CATEGORY ── */}
      {tab==='addCat' && (
        <div style={{ maxWidth:400, background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, padding:28 }}>
          <div style={{ fontFamily:'Cormorant Garamond', fontSize:22, fontStyle:'italic', color:'#3a2e27', marginBottom:24 }}>
            {editingCat ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </div>
          <label style={lStyle}>Nom *</label>
          <input style={iStyle} placeholder="ex: Robes, Tops..." value={catName}
            onChange={e => setCatName(e.target.value)} />
          <label style={lStyle}>Photo</label>
          <input ref={catFileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => setCatImage(e.target.files[0])} />
          <button onClick={() => catFileRef.current.click()}
            style={{ ...iStyle, textAlign:'left', cursor:'pointer', color: catImage ? '#6ab87a' : '#9a8778', marginBottom:20 }}>
            {catImage ? `✓ ${catImage.name}` : '🖼 Choisir une photo'}
          </button>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={handleCatSubmit}
              style={{ flex:1, background:'#b8906a', color:'#fff', padding:14, borderRadius:2, fontSize:13, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>
              {editingCat ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editingCat && (
              <button onClick={() => { setEditingCat(null); setCatName(''); }}
                style={{ background:'#f5f0eb', color:'#9a8778', padding:'14px 20px', borderRadius:2, fontSize:13, cursor:'pointer' }}>
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab==='settings' && (
        <div style={{ maxWidth:480, display:'flex', flexDirection:'column', gap:20 }}>

          {/* WhatsApp */}
          <div style={{ background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, padding:24 }}>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:20, fontStyle:'italic', color:'#3a2e27', marginBottom:18 }}>
              📱 Numéro WhatsApp
            </div>
            <label style={lStyle}>Numéro (avec indicatif, sans +)</label>
            <input style={iStyle} placeholder="ex: 213773002781" value={whatsappVal}
              onChange={e => setWhatsappVal(e.target.value)} />
            <button onClick={handleSaveWhatsapp}
              style={{ background:'#b8906a', color:'#fff', padding:'12px 28px', borderRadius:2, fontSize:13, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>
              Enregistrer
            </button>
          </div>

          {/* Password */}
          <div style={{ background:'#fff', border:'1px solid #e8ddd4', borderRadius:2, padding:24 }}>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:20, fontStyle:'italic', color:'#3a2e27', marginBottom:18 }}>
              🔑 Changer le mot de passe
            </div>
            <label style={lStyle}>Nouveau mot de passe</label>
            <input style={iStyle} type="password" placeholder="Nouveau mot de passe" value={newPassword}
              onChange={e => setNewPassword(e.target.value)} />
            <label style={lStyle}>Confirmer le mot de passe</label>
            <input style={iStyle} type="password" placeholder="Confirmer" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} />
            <button onClick={handleChangePassword}
              style={{ background:'#3a2e27', color:'#fff', padding:'12px 28px', borderRadius:2, fontSize:13, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>
              Changer
            </button>
          </div>

        </div>
      )}

    </div>
  );
}