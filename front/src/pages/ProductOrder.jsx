import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

// All 58 wilayas with delivery prices from your CSV
const WILAYAS = [
  { name:'Adrar', domicile:1400, desk:700 },
  { name:'Chlef', domicile:800, desk:450 },
  { name:'Laghouat', domicile:950, desk:550 },
  { name:'Oum el Bouaghi', domicile:750, desk:450 },
  { name:'Batna', domicile:800, desk:450 },
  { name:'Bejaia', domicile:750, desk:450 },
  { name:'Biskra', domicile:900, desk:500 },
  { name:'Bechar', domicile:1100, desk:650 },
  { name:'Blida', domicile:750, desk:450 },
  { name:'Bouira', domicile:750, desk:450 },
  { name:'Tamanrasset', domicile:1600, desk:650 },
  { name:'Tebessa', domicile:800, desk:450 },
  { name:'Tlemcen', domicile:900, desk:450 },
  { name:'Tiaret', domicile:800, desk:450 },
  { name:'Tizi Ouzou', domicile:800, desk:450 },
  { name:'Alger', domicile:600, desk:400 },
  { name:'Djelfa', domicile:950, desk:550 },
  { name:'Jijel', domicile:450, desk:300 },
  { name:'Setif', domicile:700, desk:450 },
  { name:'Saida', domicile:800, desk:450 },
  { name:'Skikda', domicile:750, desk:450 },
  { name:'Sidi Bel Abbes', domicile:800, desk:450 },
  { name:'Annaba', domicile:750, desk:450 },
  { name:'Guelma', domicile:750, desk:450 },
  { name:'Constantine', domicile:750, desk:450 },
  { name:'Medea', domicile:800, desk:450 },
  { name:'Mostaganem', domicile:800, desk:450 },
  { name:"M'sila", domicile:850, desk:450 },
  { name:'Mascara', domicile:800, desk:450 },
  { name:'Ouargla', domicile:950, desk:500 },
  { name:'Oran', domicile:750, desk:450 },
  { name:'El Bayadh', domicile:1100, desk:550 },
  { name:'Ilizi', domicile:1600, desk:800 },
  { name:'Bordj Bou Arreridj', domicile:600, desk:450 },
  { name:'Boumerdes', domicile:750, desk:450 },
  { name:'El Tarf', domicile:800, desk:450 },
  { name:'Tindouf', domicile:1600, desk:0 },
  { name:'Tissemsilt', domicile:800, desk:450 },
  { name:'El Oued', domicile:950, desk:550 },
  { name:'Khenchela', domicile:800, desk:450 },
  { name:'Souk Ahras', domicile:750, desk:450 },
  { name:'Tipaza', domicile:750, desk:450 },
  { name:'Mila', domicile:750, desk:450 },
  { name:'Ain Defla', domicile:850, desk:450 },
  { name:'Naama', domicile:1100, desk:550 },
  { name:'Ain Temouchent', domicile:950, desk:500 },
  { name:'Ghardaia', domicile:950, desk:600 },
  { name:'Relizane', domicile:800, desk:450 },
  { name:'Timimoun', domicile:1400, desk:0 },
  { name:'Borj Badji Mokhtar', domicile:2000, desk:0 },
  { name:'Ouled Djellal', domicile:900, desk:500 },
  { name:'Beni Abbes', domicile:1000, desk:0 },
  { name:'In Salah', domicile:1600, desk:800 },
  { name:'In Guezzam', domicile:2000, desk:0 },
  { name:'Touggourt', domicile:950, desk:550 },
  { name:'Djanet', domicile:1600, desk:1200 },
  { name:"El M'ghair", domicile:950, desk:0 },
  { name:'El Meniaa', domicile:1000, desk:0 },
];

export default function ProductOrder() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedPointure, setSelectedPointure] = useState('');
  const [selectedTaille, setSelectedTaille] = useState('');
  const [deliveryType, setDeliveryType] = useState('domicile'); // 'domicile' | 'desk'
  const [form, setForm] = useState({ name:'', phone:'', wilaya:'', commune:'', notes:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsapp, setWhatsapp] = useState('213773002781');

  useEffect(() => {
    API.get(`/products/${id}`).then(res => setProduct(res.data));
    API.get('/settings/whatsapp').then(res => { if (res.data.value) setWhatsapp(res.data.value); });
  }, [id]);

  // Find selected wilaya object
  const wilayaData = WILAYAS.find(w => w.name === form.wilaya);
  const deliveryPrice = wilayaData
    ? (deliveryType === 'domicile' ? wilayaData.domicile : wilayaData.desk)
    : 0;
  const deskAvailable = wilayaData ? wilayaData.desk > 0 : true;
  const productTotal = product ? product.price * qty : 0;
  const grandTotal = productTotal + (form.wilaya ? deliveryPrice : 0);

  // If desk not available and user selected desk, switch back
  useEffect(() => {
    if (wilayaData && !deskAvailable && deliveryType === 'desk') {
      setDeliveryType('domicile');
    }
  }, [form.wilaya]);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.wilaya || !form.commune) {
      setError('الرجاء ملء جميع الحقول المطلوبة'); return;
    }
    if (product.showPointure && !selectedPointure) {
      setError('الرجاء اختيار المقاس (Pointure)'); return;
    }
    if (product.showTaille && !selectedTaille) {
      setError('الرجاء اختيار الحجم (Taille)'); return;
    }
    setLoading(true); setError('');
    try {
      await API.post('/orders', {
        productId: id, quantity: qty,
        selectedPointure, selectedTaille,
        deliveryType, deliveryPrice,
        totalPrice: grandTotal,
        ...form
      });
      setSuccess(true);
    } catch { setError('حدث خطأ، حاول مرة أخرى'); }
    setLoading(false);
  };

  if (!product) return (
    <div style={{ textAlign:'center', padding:80, fontFamily:'Cormorant Garamond', fontSize:20, fontStyle:'italic', color:'#9a8778' }}>
      Chargement...
    </div>
  );

  if (success) return (
    <div style={{ maxWidth:480, margin:'0 auto', padding:'80px 40px', textAlign:'center' }}>
      <div style={{ fontSize:56, marginBottom:20 }}>✨</div>
      <div style={{ fontFamily:'Cormorant Garamond', fontSize:32, color:'#b8906a', fontStyle:'italic', marginBottom:10 }}>Commande confirmée</div>
      <div style={{ color:'#9a8778', fontSize:14, marginBottom:32 }}>Nous vous contacterons très bientôt</div>
      <Link to="/"><button style={{ background:'#b8906a', color:'#fff', padding:'13px 36px', borderRadius:2, fontSize:13, letterSpacing:2, textTransform:'uppercase', cursor:'pointer' }}>← Retour</button></Link>
    </div>
  );

  const images = product.images?.length ? product.images : ['https://via.placeholder.com/400x480/f5ede4/b8906a?text=ND'];

  const inputStyle = {
    width:'100%', background:'#fff', border:'1px solid #e8ddd4',
    borderRadius:2, padding:'12px 14px', color:'#3a2e27',
    fontSize:14, outline:'none', direction:'rtl'
  };
  const labelStyle = { display:'block', marginBottom:6, color:'#9a8778', fontSize:12, textAlign:'right', letterSpacing:1, textTransform:'uppercase' };
  const sizeBtnStyle = (selected, val) => ({
    padding:'8px 14px', borderRadius:2, fontSize:13, fontWeight:500, cursor:'pointer',
    border:`1px solid ${selected===val ? '#b8906a' : '#e8ddd4'}`,
    background: selected===val ? '#b8906a' : '#fff',
    color: selected===val ? '#fff' : '#3a2e27',
    transition:'all 0.2s'
  });

  return (
    <div className="page" style={{ maxWidth:480, margin:'0 auto' }}>

      {/* Image Gallery */}
      <div style={{ position:'relative', background:'#f5ede4' }}>
        <Link to={`/category/${encodeURIComponent(product.category)}`}
          style={{ position:'absolute', top:16, left:16, zIndex:10, background:'rgba(250,247,244,0.9)', color:'#3a2e27', padding:'8px 16px', fontSize:12, letterSpacing:1, backdropFilter:'blur(4px)', borderRadius:2 }}>
          ← Retour
        </Link>
        <img src={images[activeImg]} alt={product.name}
          style={{ width:'100%', maxHeight:460, objectFit:'cover', display:'block' }} />
        {images.length > 1 && (
          <div style={{ display:'flex', gap:8, padding:'10px 12px', background:'#fff', borderBottom:'1px solid #e8ddd4', overflowX:'auto' }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                style={{ width:60, height:72, objectFit:'cover', borderRadius:2, cursor:'pointer', flexShrink:0, border:`2px solid ${activeImg===i ? '#b8906a' : '#e8ddd4'}`, opacity: activeImg===i ? 1 : 0.7, transition:'all 0.2s' }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ padding:'24px 20px' }}>

        {/* Product info */}
        <div style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid #e8ddd4' }}>
          <div style={{ fontFamily:'Cormorant Garamond', fontSize:26, color:'#3a2e27', fontStyle:'italic', marginBottom:8 }}>{product.name}</div>
          <div style={{ display:'flex', gap:2, marginBottom:10 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: i<=product.rating ? '#b8906a' : '#ddd', fontSize:14 }}>★</span>)}
          </div>
          {product.description && <p style={{ color:'#9a8778', fontSize:14, lineHeight:1.7 }}>{product.description}</p>}
        </div>

        {/* POINTURE */}
        {product.showPointure && product.pointures?.length > 0 && (
          <div style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid #e8ddd4' }}>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:16, color:'#3a2e27', marginBottom:12, fontStyle:'italic' }}>
              Pointure <span style={{ color:'#b86a6a', fontSize:12 }}>*</span>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {product.pointures.map(p => (
                <button key={p} onClick={() => setSelectedPointure(p)} style={sizeBtnStyle(selectedPointure, p)}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {/* TAILLE */}
        {product.showTaille && product.tailles?.length > 0 && (
          <div style={{ marginBottom:20, paddingBottom:20, borderBottom:'1px solid #e8ddd4' }}>
            <div style={{ fontFamily:'Cormorant Garamond', fontSize:16, color:'#3a2e27', marginBottom:12, fontStyle:'italic' }}>
              Taille <span style={{ color:'#b86a6a', fontSize:12 }}>*</span>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {product.tailles.map(t => (
                <button key={t} onClick={() => setSelectedTaille(t)} style={sizeBtnStyle(selectedTaille, t)}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* ORDER FORM */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
          <div>
            <label style={labelStyle}>الإسم *</label>
            <input style={inputStyle} placeholder="الإسم الكامل" value={form.name}
              onChange={e => setForm({...form, name:e.target.value})}
              onFocus={e => e.target.style.borderColor='#b8906a'}
              onBlur={e => e.target.style.borderColor='#e8ddd4'} />
          </div>
          <div>
            <label style={labelStyle}>رقم الهاتف *</label>
            <input style={inputStyle} placeholder="رقم الهاتف" type="tel" value={form.phone}
              onChange={e => setForm({...form, phone:e.target.value})}
              onFocus={e => e.target.style.borderColor='#b8906a'}
              onBlur={e => e.target.style.borderColor='#e8ddd4'} />
          </div>
          <div>
            <label style={labelStyle}>الولاية *</label>
            <select style={inputStyle} value={form.wilaya}
              onChange={e => { setForm({...form, wilaya:e.target.value, commune:''}); }}>
              <option value="">إختر ولايتك</option>
              {WILAYAS.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>البلدية *</label>
            <input style={inputStyle} placeholder="البلدية" value={form.commune}
              onChange={e => setForm({...form, commune:e.target.value})}
              onFocus={e => e.target.style.borderColor='#b8906a'}
              onBlur={e => e.target.style.borderColor='#e8ddd4'} />
          </div>

          {/* DELIVERY TYPE — only shown after wilaya selected */}
          {form.wilaya && (
            <div>
              <label style={labelStyle}>نوع التوصيل *</label>
              <div style={{ display:'flex', gap:10 }}>
                {/* Domicile */}
                <button onClick={() => setDeliveryType('domicile')}
                  style={{
                    flex:1, padding:'14px 10px', borderRadius:2, cursor:'pointer', transition:'all 0.2s',
                    border:`2px solid ${deliveryType==='domicile' ? '#b8906a' : '#e8ddd4'}`,
                    background: deliveryType==='domicile' ? '#fdf8f4' : '#fff',
                    textAlign:'center'
                  }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>🏠</div>
                  <div style={{ fontFamily:'Cormorant Garamond', fontSize:14, color:'#3a2e27', fontWeight:600 }}>À domicile</div>
                  <div style={{ fontSize:13, color:'#b8906a', fontWeight:700, marginTop:4 }}>
                    {wilayaData?.domicile.toLocaleString()} دج
                  </div>
                </button>

                {/* Stop desk — disabled if not available */}
                <button onClick={() => deskAvailable && setDeliveryType('desk')}
                  style={{
                    flex:1, padding:'14px 10px', borderRadius:2, transition:'all 0.2s',
                    cursor: deskAvailable ? 'pointer' : 'not-allowed',
                    border:`2px solid ${deliveryType==='desk' ? '#b8906a' : '#e8ddd4'}`,
                    background: !deskAvailable ? '#f9f9f9' : deliveryType==='desk' ? '#fdf8f4' : '#fff',
                    textAlign:'center',
                    opacity: deskAvailable ? 1 : 0.45
                  }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>🏪</div>
                  <div style={{ fontFamily:'Cormorant Garamond', fontSize:14, color:'#3a2e27', fontWeight:600 }}>Stop desk</div>
                  <div style={{ fontSize:13, color: deskAvailable ? '#b8906a' : '#aaa', fontWeight:700, marginTop:4 }}>
                    {deskAvailable ? `${wilayaData?.desk.toLocaleString()} دج` : 'غير متاح'}
                  </div>
                </button>
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea style={{...inputStyle, minHeight:80, resize:'vertical'}} placeholder="ملاحظات إضافية..."
              value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} />
          </div>
        </div>

        {/* Quantity */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, justifyContent:'flex-end' }}>
          <button onClick={() => setQty(Math.max(1, qty-1))}
            style={{ background:'#f5ede4', color:'#3a2e27', width:36, height:36, borderRadius:2, fontSize:18, border:'1px solid #e8ddd4', cursor:'pointer' }}>−</button>
          <span style={{ fontSize:18, fontFamily:'Cormorant Garamond', minWidth:24, textAlign:'center' }}>{qty}</span>
          <button onClick={() => setQty(qty+1)}
            style={{ background:'#f5ede4', color:'#3a2e27', width:36, height:36, borderRadius:2, fontSize:18, border:'1px solid #e8ddd4', cursor:'pointer' }}>+</button>
        </div>

        {/* INVOICE */}
        <div style={{ background:'#faf7f4', border:'1px solid #e8ddd4', borderRadius:2, padding:18, marginBottom:20 }}>
          <div style={{ fontSize:12, letterSpacing:2, textAlign:'right', marginBottom:14, color:'#9a8778', textTransform:'uppercase' }}>
            فاتورة الطلبية
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, direction:'rtl' }}>
            <span style={{ color:'#9a8778', fontSize:13 }}>سعر المنتج</span>
            <span style={{ fontSize:13 }}>{product.price.toLocaleString()} × {qty} دج</span>
          </div>

          {selectedPointure && (
            <div style={{ display:'flex', justifyContent:'space-between', direction:'rtl', marginBottom:6 }}>
              <span style={{ color:'#9a8778', fontSize:13 }}>Pointure</span>
              <span style={{ fontSize:13 }}>{selectedPointure}</span>
            </div>
          )}
          {selectedTaille && (
            <div style={{ display:'flex', justifyContent:'space-between', direction:'rtl', marginBottom:6 }}>
              <span style={{ color:'#9a8778', fontSize:13 }}>Taille</span>
              <span style={{ fontSize:13 }}>{selectedTaille}</span>
            </div>
          )}

          {form.wilaya && (
            <div style={{ display:'flex', justifyContent:'space-between', direction:'rtl', marginBottom:6 }}>
              <span style={{ color:'#9a8778', fontSize:13 }}>
                {deliveryType === 'domicile' ? '🏠 توصيل للمنزل' : '🏪 Stop desk'}
              </span>
              <span style={{ fontSize:13, color:'#b8906a' }}>+ {deliveryPrice.toLocaleString()} دج</span>
            </div>
          )}

          <div style={{ display:'flex', justifyContent:'space-between', direction:'rtl', paddingTop:12, borderTop:'1px solid #e8ddd4', marginTop:8 }}>
            <span style={{ fontWeight:500, fontSize:14 }}>المجموع الكلي</span>
            <span style={{ fontFamily:'Cormorant Garamond', fontSize:24, color:'#b8906a', fontWeight:600 }}>
              {(form.wilaya ? grandTotal : productTotal).toLocaleString()} دج
            </span>
          </div>

          {!form.wilaya && (
            <div style={{ textAlign:'right', marginTop:8, color:'#9a8778', fontSize:11, direction:'rtl' }}>
              * اختر ولايتك لإضافة تكلفة التوصيل
            </div>
          )}
        </div>

        {error && <div style={{ color:'#b86a6a', textAlign:'center', marginBottom:14, fontSize:13 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width:'100%', background: loading ? '#d4b896' : '#b8906a', color:'#fff', padding:'16px', borderRadius:2, fontSize:14, letterSpacing:3, textTransform:'uppercase', fontFamily:'Jost', fontWeight:500, cursor: loading ? 'default' : 'pointer' }}>
          {loading ? 'Envoi en cours...' : 'Commander maintenant →'}
        </button>

        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:14, background:'#f5ede4', border:'1px solid #e8ddd4', color:'#3a2e27', padding:'13px', borderRadius:2, fontSize:13, letterSpacing:1, textDecoration:'none' }}>
          📱 Commander via WhatsApp
        </a>
      </div>
    </div>
  );
}