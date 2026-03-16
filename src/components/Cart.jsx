import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Tag, Truck, CreditCard, Smartphone, Banknote, ChevronRight, Gift, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const COUPONS = [
  { code: 'YUMMY10', discount: 10, type: 'percent', minOrder: 100 },
  { code: 'FIRST50', discount: 50, type: 'flat', minOrder: 150 },
  { code: 'SHADNAGAR', discount: 20, type: 'percent', minOrder: 200 },
  { code: 'FAMILY', discount: 80, type: 'flat', minOrder: 350 },
];

export default function Cart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartTotal;
  const gst = Math.round(subtotal * 0.05);
  const deliveryFee = subtotal > 300 ? 0 : 30;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(subtotal * appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const total = subtotal + gst + deliveryFee - discount;

  const applyCoupon = () => {
    const c = COUPONS.find(c => c.code === couponCode.toUpperCase().trim());
    if (!c) { setCouponError('Invalid coupon code'); return; }
    if (subtotal < c.minOrder) { setCouponError(`Min order ₹${c.minOrder} required`); return; }
    setAppliedCoupon(c);
    setCouponError('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const checkoutData = { cart, subtotal, gst, deliveryFee, discount, total, coupon: appliedCoupon };
    localStorage.setItem('yummy_checkout', JSON.stringify(checkoutData));
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} />
      <div className="cart-drawer fade-in">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <div className="cart-title"><ShoppingBag size={20} /><h2>Your Cart</h2></div>
            {cart.length > 0 && (
              <button className="clear-cart-btn" onClick={clearCart}>Clear all</button>
            )}
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={56} className="empty-bag-icon" />
              <h3>Your cart is empty</h3>
              <p className="text-muted">Add some delicious items from our menu!</p>
              <button className="btn-primary" onClick={onClose}>Browse Menu</button>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item-row">
                    <div 
                      className="cart-item-img"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <span className="cart-item-unit-price">₹{item.price} each</span>
                    </div>
                    <div className="cart-item-right">
                      <div className="cart-qty-stepper">
                        <button onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}>
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="cart-item-total">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Savings suggestion */}
              {deliveryFee > 0 && (
                <div className="savings-banner">
                  <Gift size={16} />
                  Add ₹{300 - subtotal} more for <strong>FREE delivery</strong>
                </div>
              )}

              {/* Coupon */}
              <div className="coupon-section">
                <div className="coupon-label"><Tag size={15} /> Apply Coupon</div>
                {appliedCoupon ? (
                  <div className="coupon-applied">
                    <Star size={14} fill="gold" color="gold" />
                    <span><strong>{appliedCoupon.code}</strong> applied — saving ₹{discount}</span>
                    <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="coupon-input-row">
                    <input
                      className="coupon-input"
                      placeholder="YUMMY10, FIRST50..."
                      value={couponCode}
                      onChange={e => { setCouponCode(e.target.value); setCouponError(''); }}
                    />
                    <button className="coupon-apply-btn" onClick={applyCoupon}>Apply</button>
                  </div>
                )}
                {couponError && <p className="coupon-error">{couponError}</p>}
                <div className="coupon-hints">
                  {['YUMMY10','FIRST50','SHADNAGAR'].map(code => (
                    <button key={code} className="coupon-hint-tag" onClick={() => setCouponCode(code)}>
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="delivery-info-strip">
                <Truck size={16} />
                <span>{deliveryFee === 0 ? 'Free delivery on this order 🎉' : `₹${deliveryFee} delivery fee`}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Bill Summary */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="bill-summary">
              <div className="bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {discount > 0 && <div className="bill-row discount"><span>Coupon Discount</span><span>-₹{discount}</span></div>}
              <div className="bill-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryFee}`}</span></div>
              <div className="bill-row"><span>GST (5%)</span><span>₹{gst}</span></div>
              <div className="bill-row total-row">
                <span>To Pay</span>
                <span className="total-amount">₹{total}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
