import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, CreditCard, Smartphone, Banknote, ChevronRight, 
  CheckCircle, Truck, Clock, Star, Shield, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / Google Pay', desc: 'Pay via any UPI app' },
  { id: 'phonePe', label: 'PhonePe', desc: 'PhonePe Wallet / UPI' },
  { id: 'razorpay', label: 'Razorpay (Card)', desc: 'Credit / Debit Card' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' },
];

// Shadnagar area neighborhoods (for address suggestions)
const SHADNAGAR_AREAS = [
  'Main Road, Shadnagar', 'Jubilee Colony', 'Jai Hind Colony', 'Railway Colony',
  'Industrial Area', 'Sriram Nagar', 'Ashok Nagar', 'Vitthal Nagar',
  'LB Nagar Colony', 'Srinivasa Nagar', 'Circle Road', 'Old Shadnagar'
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState(null);
  const [step, setStep] = useState(1); // 1=Address, 2=Payment

  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: '',
    landmark: '',
    orderType: 'delivery',
    paymentMethod: 'cod',
    upiId: '',
    instructions: ''
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    fee: 30,
    eta: '25-35',
    valid: true
  });

  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('yummy_checkout');
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else if (cart.length === 0) {
      navigate('/menu');
    }
  }, []);

  const data = checkoutData || {
    subtotal: 0, gst: 0, deliveryFee: 30, discount: 0, total: 0, cart: cart
  };

  const totalToPay = data.subtotal + data.gst + 
    (form.orderType === 'delivery' ? deliveryInfo.fee : 0) - 
    (data.discount || 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    if (form.orderType === 'delivery' && !form.area.trim()) e.area = 'Area is required';
    if (form.step2 && form.paymentMethod === 'upi' && !form.upiId.trim()) e.upiId = 'UPI ID required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);

    const orderId = `YUM-${Date.now()}-${Math.random().toString(36).substr(2,4).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      customer: form.name,
      phone: form.phone,
      address: form.orderType === 'delivery' ? `${form.area}${form.landmark ? ', ' + form.landmark : ''}` : 'Pickup',
      type: form.orderType === 'delivery' ? 'Delivery' : form.orderType === 'pickup' ? 'Takeaway' : 'Dine-in',
      paymentMethod: form.paymentMethod,
      instructions: form.instructions,
      items: data.cart || cart,
      subtotal: data.subtotal,
      gst: data.gst,
      deliveryFee: form.orderType === 'delivery' ? deliveryInfo.fee : 0,
      discount: data.discount || 0,
      total: totalToPay,
      status: 'Order Received',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      timeline: [{ status: 'Order Received', time: new Date().toISOString() }]
    };

    // Save to localStorage (backend + admin)
    const existing = JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
    localStorage.setItem('yummy_orders_db', JSON.stringify([newOrder, ...existing]));
    localStorage.setItem('yummy_current_order', JSON.stringify(newOrder));
    localStorage.removeItem('yummy_checkout');

    // Also POST to backend
    try {
      await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (_) { /* offline fallback, already saved to localstorage */ }

    clearCart();
    setPlacing(false);
    navigate(`/order-tracking/${orderId}`);
  };

  return (
    <div className="checkout-page fade-in">
      <div className="container checkout-container">
        
        {/* Step indicator */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-num">{step > 1 ? <CheckCircle size={18} /> : '1'}</div>
            <span className="step-label">Delivery</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-num">2</div>
            <span className="step-label">Payment</span>
          </div>
        </div>

        <div className="checkout-grid">

          {/* ── Left: Form ──────────────────────────────────── */}
          <div className="checkout-left">
            
            {/* STEP 1: Address */}
            {step === 1 && (
              <div className="checkout-card fade-in">
                <h2><MapPin size={22} /> Delivery Details</h2>

                {/* Order type tabs */}
                <div className="order-type-tabs">
                  {[
                    { id: 'delivery', label: 'Delivery' },
                    { id: 'pickup', label: 'Pickup' },
                    { id: 'dinein', label: 'Dine-in' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`order-type-tab ${form.orderType === tab.id ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, orderType: tab.id })}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input className="form-input"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input className="form-input"
                      placeholder="10 digit mobile number"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  {form.orderType === 'delivery' && (
                    <>
                      <div className="form-group full-width">
                        <label>Area in Shadnagar *</label>
                        <select
                          className="form-input"
                          value={form.area}
                          onChange={e => setForm({ ...form, area: e.target.value })}
                        >
                          <option value="">Select your colony</option>
                          {SHADNAGAR_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                          <option value="Other">Other (specify in landmark)</option>
                        </select>
                        {errors.area && <span className="field-error">{errors.area}</span>}
                      </div>
                      <div className="form-group full-width">
                        <label>House No. / Landmark</label>
                        <input className="form-input"
                          placeholder="e.g. Near Water Tank, House #123"
                          value={form.landmark}
                          onChange={e => setForm({ ...form, landmark: e.target.value })} />
                      </div>
                    </>
                  )}

                  <div className="form-group full-width">
                    <label>Special Instructions</label>
                    <textarea className="form-input" rows={2}
                      placeholder="e.g. No onion, Ring bell twice..."
                      value={form.instructions}
                      onChange={e => setForm({ ...form, instructions: e.target.value })} />
                  </div>
                </div>

                <button className="btn-primary checkout-btn" style={{ marginTop: '2rem' }} onClick={() => { if (validate()) setStep(2); }}>
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="checkout-card fade-in">
                <h2><CreditCard size={22} /> Payment Method</h2>

                <div className="payment-methods">
                  {PAYMENT_METHODS.map(method => (
                    <div
                      key={method.id}
                      className={`payment-method ${form.paymentMethod === method.id ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, paymentMethod: method.id })}
                    >
                      <div className="radio-circle">
                        <div className="radio-inner" />
                      </div>
                      <div className="method-info">
                        <span className="method-name">{method.label}</span>
                        <span className="method-desc">{method.desc}</span>
                      </div>
                      {method.id === 'upi' && <Smartphone size={20} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                      {method.id === 'cod' && <Banknote size={20} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                    </div>
                  ))}
                </div>

                {form.paymentMethod === 'upi' && (
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Your UPI ID</label>
                    <input className="form-input"
                      placeholder="username@upi"
                      value={form.upiId}
                      onChange={e => setForm({ ...form, upiId: e.target.value })} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                  <button
                    className="btn-primary checkout-btn"
                    style={{ flex: 2, margin: 0 }}
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing ? 'Placing Order...' : `Pay ₹${totalToPay.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Summary ──────────────────────────────── */}
          <div className="checkout-right">
            <div className="checkout-card checkout-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {(data.cart || cart).map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <div className="item-qty-name">
                      <span className="qty-pill">{item.quantity}×</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="item-total">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="summary-billing">
                <div className="billing-row">
                  <span>Subtotal</span>
                  <span>₹{data.subtotal.toLocaleString()}</span>
                </div>
                {data.discount > 0 && (
                  <div className="billing-row" style={{ color: '#16a34a' }}>
                    <span>Discount</span>
                    <span>-₹{data.discount.toLocaleString()}</span>
                  </div>
                )}
                {form.orderType === 'delivery' && (
                  <div className="billing-row">
                    <span>Delivery Fee</span>
                    <span>{deliveryInfo.fee === 0 ? 'FREE' : `₹${deliveryInfo.fee}`}</span>
                  </div>
                )}
                <div className="billing-row">
                  <span>Taxes (GST 5%)</span>
                  <span>₹{data.gst.toLocaleString()}</span>
                </div>
                <div className="billing-row total">
                  <span>Total Amount</span>
                  <span>₹{totalToPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="checkout-info-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Shield size={14} color="#16a34a" /> <span>Secure SSL Encrypted Payment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={14} color="#3b82f6" /> <span>Real-time delivery tracking</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
