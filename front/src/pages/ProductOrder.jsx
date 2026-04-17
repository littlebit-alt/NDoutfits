import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira',
  'Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda',
  'Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem','MSila','Mascara',
  'Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf',
  'Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah',
  'In Guezzam','Touggourt','Djanet','El MGhair','El Menia'
];

export default function ProductOrder() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', wilaya: '', commune: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  const total = product ? product.price * qty : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.wilaya || !form.commune) {
      setError('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true); setError('');
    try {
      await API.post('/orders', { productId: id, quantity: qty, ...form });
      setSuccess(true);
    } catch {
      setError('حدث خطأ، حاول مرة أخرى');
    }
    setLoading(false);
  };

  if (!product) return (
    <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Cormorant Garamond', fontSize: 20, fontStyle: 'italic', color: '#9a8778' }}>
      Chargement...
    </div>
  );

  if (success) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>✨</div>
      <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 32, color: '#b8906a', fontStyle: 'italic', marginBottom: 10 }}>
        Commande confirmée
      </div>
      <div style={{ color: '#9a8778', fontSize: 14, marginBottom: 32 }}>Nous vous contacterons très bientôt</div>
      <Link to="/">
        <button style={{
          background: '#b8906a', color: '#fff',
          padding: '13px 36px', borderRadius: 2,
          fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500
        }}>← Retour</button>
      </Link>
    </div>
  );

  const inputStyle = {
    width: '100%', background: '#fff', border: '1px solid #e8ddd4',
    borderRadius: 2, padding: '12px 14px', color: '#3a2e27',
    fontSize: 14, outline: 'none', direction: 'rtl',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block', marginBottom: 6, color: '#9a8778',
    fontSize: 12, textAlign: 'right', letterSpacing: 1, textTransform: 'uppercase'
  };

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img src={product.imageUrl} alt={product.name}
          style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(58,46,39,0.4) 0%, transparent 50%)'
        }} />
        <Link to={`/category/${encodeURIComponent(product.category)}`}
          style={{
            position: 'absolute', top: 16, left: 16,
            background: 'rgba(250,247,244,0.9)', color: '#3a2e27',
            padding: '8px 16px', fontSize: 12, letterSpacing: 1,
            backdropFilter: 'blur(4px)', borderRadius: 2
          }}>← Retour</Link>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Product info */}
        <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #e8ddd4' }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 26, color: '#3a2e27', fontWeight: 400, fontStyle: 'italic', marginBottom: 8 }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= product.rating ? '#b8906a' : '#ddd', fontSize: 14 }}>★</span>)}
          </div>
          {product.description && <p style={{ color: '#9a8778', fontSize: 14, lineHeight: 1.6 }}>{product.description}</p>}
        </div>

        {/* Invoice */}
        <div style={{
          background: '#faf7f4', border: '1px solid #e8ddd4',
          borderRadius: 2, padding: 18, marginBottom: 24
        }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 16, letterSpacing: 2, textAlign: 'right', marginBottom: 14, color: '#9a8778', textTransform: 'uppercase', fontSize: 13 }}>
            فاتورة الطلبية
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, direction: 'rtl' }}>
            <span style={{ color: '#9a8778', fontSize: 13 }}>سعر المنتج</span>
            <span style={{ fontSize: 13 }}>{product.price.toLocaleString()} × {qty} دج</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', direction: 'rtl', paddingTop: 12, borderTop: '1px solid #e8ddd4' }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>المجموع</span>
            <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, color: '#b8906a', fontWeight: 600 }}>{total.toLocaleString()} دج</span>
          </div>
        </div>

        {/* Quantity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, justifyContent: 'flex-end' }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            style={{ background: '#f5ede4', color: '#3a2e27', width: 36, height: 36, borderRadius: 2, fontSize: 18, border: '1px solid #e8ddd4' }}>−</button>
          <span style={{ fontSize: 18, fontFamily: 'Cormorant Garamond', minWidth: 24, textAlign: 'center' }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            style={{ background: '#f5ede4', color: '#3a2e27', width: 36, height: 36, borderRadius: 2, fontSize: 18, border: '1px solid #e8ddd4' }}>+</button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>الإسم *</label>
            <input style={inputStyle} placeholder="الإسم الكامل" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              onFocus={e => e.target.style.borderColor = '#b8906a'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
          </div>
          <div>
            <label style={labelStyle}>رقم الهاتف *</label>
            <input style={inputStyle} placeholder="رقم الهاتف" type="tel" value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              onFocus={e => e.target.style.borderColor = '#b8906a'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
          </div>
          <div>
            <label style={labelStyle}>الولاية *</label>
            <select style={inputStyle} value={form.wilaya}
              onChange={e => setForm({...form, wilaya: e.target.value})}>
              <option value="">إختر ولايتك</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>البلدية *</label>
            <input style={inputStyle} placeholder="البلدية" value={form.commune}
              onChange={e => setForm({...form, commune: e.target.value})}
              onFocus={e => e.target.style.borderColor = '#b8906a'}
              onBlur={e => e.target.style.borderColor = '#e8ddd4'} />
          </div>
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="ملاحظات إضافية..."
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
        </div>

        {error && <div style={{ color: '#c0392b', textAlign: 'center', marginTop: 14, fontSize: 13 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', marginTop: 24,
            background: loading ? '#d4b896' : '#b8906a',
            color: '#fff', padding: '16px',
            borderRadius: 2, fontSize: 14,
            letterSpacing: 3, textTransform: 'uppercase',
            fontFamily: 'Jost', fontWeight: 500,
            transition: 'background 0.2s'
          }}>
          {loading ? 'Envoi en cours...' : 'Commander maintenant →'}
        </button>
      </div>
    </div>
  );
}