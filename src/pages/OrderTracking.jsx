import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Truck, Package, Home, RefreshCcw, ShoppingBag, Phone, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import './OrderTracking.css';

const STATUS_STEPS = [
  { key: 'Order Received', label: 'Order Received', icon: Package, desc: 'We got your order!', color: '#f97316' },
  { key: 'Preparing', label: 'Preparing', icon: Clock, desc: 'Chef is cooking...', color: '#eab308' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, desc: 'On the way to you!', color: '#3b82f6' },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle, desc: 'Enjoy your meal!', color: '#22c55e' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [eta, setEta] = useState(null);

  const loadOrder = () => {
    // Try localStorage first (most up-to-date)
    try {
      const allOrders = JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
      const found = allOrders.find(o => o.id === id);
      if (found) {
        setOrder(found);
        const idx = STATUS_STEPS.findIndex(s => s.key === found.status);
        setCurrentStepIdx(idx >= 0 ? idx : 0);
        setIsLoading(false);
        return;
      }
      // fallback to current order
      const currentOrder = JSON.parse(localStorage.getItem('yummy_current_order') || 'null');
      if (currentOrder && currentOrder.id === id) {
        setOrder(currentOrder);
        const idx = STATUS_STEPS.findIndex(s => s.key === currentOrder.status);
        setCurrentStepIdx(idx >= 0 ? idx : 0);
        setIsLoading(false);
        return;
      }
    } catch (_) {}

    // Fallback: poll backend
    fetch(`${API_URL}/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setOrder(data);
          const idx = STATUS_STEPS.findIndex(s => s.key === data.status);
          setCurrentStepIdx(idx >= 0 ? idx : 0);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // Simulate order progression for demo
    const timers = [
      setTimeout(() => {
        updateOrderStatus('Preparing');
      }, 8000),
      setTimeout(() => {
        updateOrderStatus('Out for Delivery');
      }, 25000),
      setTimeout(() => {
        updateOrderStatus('Delivered');
      }, 45000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [id]);

  const updateOrderStatus = (newStatus) => {
    setCurrentStepIdx(STATUS_STEPS.findIndex(s => s.key === newStatus));
    setOrder(prev => prev ? { ...prev, status: newStatus } : prev);
    // Update in localStorage too
    try {
      const allOrders = JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
      const updated = allOrders.map(o =>
        o.id === id ? { ...o, status: newStatus, timeline: [...(o.timeline || []), { status: newStatus, time: new Date().toISOString() }] } : o
      );
      localStorage.setItem('yummy_orders_db', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleReorder = () => {
    if (!order?.items) return;
    order.items.forEach(item => addToCart(item));
    window.location.href = '/menu';
  };

  if (isLoading) {
    return (
      <div className="tracking-page fade-in">
        <div className="tracking-loading">
          <div className="spinner"></div>
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-page fade-in">
        <div className="tracking-not-found">
          <div className="not-found-emoji">🔍</div>
          <h2>Order Not Found</h2>
          <p className="text-muted">Order ID: {id}</p>
          <Link to="/menu" className="btn-primary">Go to Menu</Link>
        </div>
      </div>
    );
  }

  const activeStep = STATUS_STEPS[currentStepIdx];
  const isDelivered = currentStepIdx === STATUS_STEPS.length - 1;

  return (
    <div className="tracking-page fade-in">
      <div className="container tracking-container">

        {/* Order ID Header */}
        <div className="tracking-header">
          <div className="tracking-header-left">
            <div className="order-id-badge">Order #{order.id?.split('-').slice(-1)[0]}</div>
            <h1>
              {isDelivered ? '🎉 Delivered!' : ''}
              {!isDelivered && activeStep?.label}
            </h1>
            <p className="text-muted">{activeStep?.desc}</p>
          </div>
          <div className="tracking-time-pill">
            <Clock size={16} />
            <span>{order.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="tracking-grid">
          {/* Left: Timeline + Map */}
          <div className="tracking-left">
            {/* Animated Timeline */}
            <div className="timeline-card">
              <h3>Order Status</h3>
              <div className="timeline">
                {STATUS_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={step.key} className={`timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="timeline-icon-wrap">
                        <div className="timeline-icon" style={isCurrent ? { background: step.color, color: '#fff' } : {}}>
                          {isDone ? <CheckCircle size={18} /> : <Icon size={18} />}
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div className={`timeline-line ${isDone ? 'done' : ''}`} />
                        )}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-label">{step.label}</div>
                        <div className="timeline-desc">{step.desc}</div>
                        {isCurrent && (
                          <div className="timeline-pulse">
                            <span className="pulse-dot" style={{ background: step.color }}></span>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>In progress...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Map placeholder */}
            {!isDelivered && (
              <div className="map-card">
                <div className="map-header">
                  <Truck size={18} />
                  <span>Live Delivery Map — Shadnagar</span>
                </div>
                <div className="map-embed">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15262.078!2d78.04!3d17.068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sShadnagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%" height="200" style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen loading="lazy" title="Delivery Map"
                  />
                </div>
                <div className="map-eta">
                  <span>🛵 ETA: <strong>25-35 min</strong> · Delivering to {order.address || 'Shadnagar'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="tracking-right">
            <div className="order-summary-track">
              <h3>Order Summary</h3>
              <div className="track-items">
                {(order.items || order.cart || []).map((item, i) => (
                  <div key={i} className="track-item-row">
                    <div
                      className="track-item-img"
                      style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }}
                    />
                    <div className="track-item-info">
                      <span className="track-item-name">{item.name}</span>
                      <span className="track-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="track-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="track-bill">
                <div className="track-bill-row"><span>Subtotal</span><span>₹{order.subtotal || 0}</span></div>
                {order.discount > 0 && <div className="track-bill-row green"><span>Discount</span><span>-₹{order.discount}</span></div>}
                <div className="track-bill-row"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee || 0}`}</span></div>
                <div className="track-bill-row"><span>GST</span><span>₹{order.gst || 0}</span></div>
                <div className="track-bill-row total"><span>Total Paid</span><span>₹{order.total || 0}</span></div>
              </div>

              {/* Customer Info */}
              <div className="track-customer">
                <div className="track-cust-row"><span>👤</span><span>{order.customer || 'Customer'}</span></div>
                <div className="track-cust-row"><span>📍</span><span>{order.address || 'Shadnagar'}</span></div>
                <div className="track-cust-row"><span>💳</span><span>{order.paymentMethod?.toUpperCase() || 'COD'}</span></div>
              </div>

              {/* Action Buttons */}
              <div className="track-actions">
                {isDelivered ? (
                  <>
                    <div className="rating-prompt">
                      <Star size={16} fill="gold" color="gold" />
                      <span>Rate your order</span>
                    </div>
                    <div className="star-row">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} className="star-btn"><Star size={22} /></button>
                      ))}
                    </div>
                    <button className="btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} onClick={handleReorder}>
                      <RefreshCcw size={16} /> Reorder
                    </button>
                  </>
                ) : (
                  <a href="tel:+919876543210" className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Phone size={16} /> Call Restaurant
                  </a>
                )}
                <Link to="/menu" className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <ShoppingBag size={16} /> Order More
                </Link>
                <Link to="/account" className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Home size={16} /> My Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
