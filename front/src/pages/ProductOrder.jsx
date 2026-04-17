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

  if (!product) return <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>⏳ Loading...</div>;

  if (success) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#00e676', letterSpacing: 2 }}>طلبك تم بنجاح!</div>
      <div style={{ color: '#888', marginTop: 8 }}>سنتصل بك قريبا</div>
      <Link to="/">
        <button style={{
          marginTop: 24, background: '#00b4f0', color: '#fff',
          padding: '12px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16
        }}>← العودة للرئيسية</button>
      </Link>
    </div>
  );

  const inputStyle = {
    width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: 10, padding: '12px 14px', color: '#f0f0f0',
    fontSize: 14, outline: 'none', direction: 'rtl'
  };
  const labelStyle = { display: 'block', marginBottom: 6, color: '#888', fontSize: 13, textAlign: 'right' };

  return (
    <div className="page" style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Product Image */}
      <div style={{ position: 'relative' }}>
        <img src={product.imageUrl} alt={product.name}
          style={{ width: '100%', maxHeight: 380, objectFit: 'cover' }} />
        <Link to={`/category/${encodeURIComponent(product.category)}`}
          style={{
            position: 'absolute', top: 16, left: 16,
            background: 'rgba(0,0,0,0.7)', color: '#fff',
            padding: '8px 14px', borderRadius: 20, fontSize: 13, backdropFilter: 'blur(4px)'
          }}>← رجوع</Link>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Product Info */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{product.name}</h2>
          {product.description && <p style={{ color: '#888', fontSize: 14 }}>{product.description}</p>}
          <div style={{ display: 'flex', gap: 2, margin: '8px 0' }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= product.rating ? '#ffc400' : '#333', fontSize: 16 }}>★</span>)}
          </div>
        </div>

        {/* Invoice */}
        <div style={{
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          borderRadius: 14, padding: 16, marginBottom: 24
        }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 2, textAlign: 'right', marginBottom: 12, color: '#00b4f0' }}>
            فاتورة الطلبية
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, direction: 'rtl' }}>
            <span style={{ color: '#888' }}>سعر المنتج</span>
            <span>{product.price.toLocaleString()} x {qty} دج</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', direction: 'rtl', paddingTop: 10, borderTop: '1px solid #2a2a2a' }}>
            <span style={{ fontWeight: 700 }}>المجموع</span>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#00b4f0' }}>{total.toLocaleString()} دج</span>
          </div>
        </div>

        {/* Quantity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, justifyContent: 'flex-end' }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            style={{ background: '#2a2a2a', color: '#fff', width: 36, height: 36, borderRadius: 8, fontSize: 18 }}>−</button>
          <span style={{ fontSize: 20, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            style={{ background: '#2a2a2a', color: '#fff', width: 36, height: 36, borderRadius: 8, fontSize: 18 }}>+</button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>الإسم *</label>
            <input style={inputStyle} placeholder="الإسم" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>رقم الهاتف *</label>
            <input style={inputStyle} placeholder="رقم الهاتف" type="tel" value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})} />
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
            <input style={inputStyle} placeholder="إختر بلديتك" value={form.commune}
              onChange={e => setForm({...form, commune: e.target.value})} />
          </div>
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea style={{...inputStyle, minHeight: 80, resize: 'vertical'}} placeholder="ملاحظات"
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
        </div>

        {error && <div style={{ color: '#ff3c00', textAlign: 'center', marginTop: 12, fontSize: 14 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', marginTop: 20,
            background: loading ? '#333' : 'linear-gradient(135deg, #00b4f0, #0080c0)',
            color: '#fff', padding: '16px', borderRadius: 14,
            fontSize: 18, fontFamily: 'Bebas Neue', letterSpacing: 3
          }}>
          {loading ? '⏳ جاري الإرسال...' : '← أطلب الآن'}
        </button>
      </div>
    </div>
  );
}