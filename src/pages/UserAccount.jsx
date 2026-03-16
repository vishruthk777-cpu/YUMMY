import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, ShoppingBag, Heart, Clock, Star, RefreshCcw, Package, LogOut, ChevronRight, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './UserAccount.css';

export default function UserAccount() {
  const { addToCart, favorites, toggleFavorite, isFavorite } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({ name: 'Guest User', phone: '', points: 0 });

  useEffect(() => {
    // Load orders from localStorage
    try {
      const allOrders = JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
      setOrders(allOrders);
      // Calculate loyalty points
      const totalSpent = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const savedUser = JSON.parse(localStorage.getItem('yummy_user') || 'null');
      setUser({
        name: savedUser?.name || (allOrders[0]?.customer) || 'Guest User',
        phone: savedUser?.phone || (allOrders[0]?.phone) || '',
        points: Math.floor(totalSpent / 10),
        totalOrders: allOrders.length,
        totalSpent,
      });
    } catch (_) {}
  }, []);

  const handleReorder = (order) => {
    if (!order?.items) return;
    order.items.forEach(item => addToCart(item));
    navigate('/menu');
  };

  const getStatusColor = (status) => {
    const map = {
      'Order Received': '#f97316',
      'Preparing': '#eab308',
      'Out for Delivery': '#3b82f6',
      'Delivered': '#22c55e',
    };
    return map[status] || '#6b7280';
  };

  const SAVED_ADDRESSES = [
    { label: 'Home', address: 'Main Road, Near Clock Tower, Shadnagar', icon: '🏠' },
    { label: 'Office', address: 'Industrial Area, Shadnagar', icon: '🏢' },
  ];

  return (
    <div className="account-page fade-in">
      <div className="container">

        {/* Profile Header */}
        <div className="account-header">
          <div className="account-avatar">
            <User size={32} />
          </div>
          <div className="account-info">
            <h1>{user.name}</h1>
            {user.phone && <p className="text-muted"><Phone size={14} /> {user.phone}</p>}
            <div className="account-stats">
              <div className="acc-stat">
                <span className="acc-stat-val">{orders.length}</span>
                <span className="acc-stat-label">Orders</span>
              </div>
              <div className="acc-stat">
                <span className="acc-stat-val">₹{user.totalSpent || 0}</span>
                <span className="acc-stat-label">Spent</span>
              </div>
              <div className="acc-stat">
                <span className="acc-stat-val">{user.points || 0}</span>
                <span className="acc-stat-label">Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Banner */}
        <div className="loyalty-banner">
          <div className="loyalty-left">
            <Award size={24} />
            <div>
              <div className="loyalty-title">Yummy Loyalty Points</div>
              <div className="loyalty-sub">Earn 1 point for every ₹10 spent</div>
            </div>
          </div>
          <div className="loyalty-points-badge">
            <Star size={14} fill="gold" color="gold" />
            <span>{user.points || 0} pts</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="account-tabs">
          {['orders', 'favorites', 'addresses'].map(tab => (
            <button
              key={tab}
              className={`account-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'orders' && <><ShoppingBag size={16} /> Orders</>}
              {tab === 'favorites' && <><Heart size={16} /> Favorites</>}
              {tab === 'addresses' && <><MapPin size={16} /> Addresses</>}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="account-content fade-in">
            {orders.length === 0 ? (
              <div className="empty-state">
                <Package size={52} strokeWidth={1.2} />
                <h3>No orders yet</h3>
                <p className="text-muted">Start your first order today!</p>
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <div className="order-id">#{order.id?.split('-').slice(-1)[0] || order.id}</div>
                        <div className="order-date text-muted">
                          <Clock size={13} />
                          {order.time || new Date(order.timestamp || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div
                        className="order-status-badge"
                        style={{ background: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                      >
                        {order.status || 'Processing'}
                      </div>
                    </div>
                    <div className="order-items-preview">
                      {(order.items || []).slice(0, 3).map((item, i) => (
                        <span key={i} className="order-item-chip">{item.quantity}× {item.name}</span>
                      ))}
                      {(order.items || []).length > 3 && (
                        <span className="order-item-chip more">+{(order.items || []).length - 3} more</span>
                      )}
                    </div>
                    <div className="order-card-footer">
                      <span className="order-total">₹{order.total || 0}</span>
                      <div className="order-actions">
                        {order.status !== 'Delivered' && (
                          <Link to={`/order-tracking/${order.id}`} className="btn-track">
                            Track <ChevronRight size={14} />
                          </Link>
                        )}
                        <button className="btn-reorder" onClick={() => handleReorder(order)}>
                          <RefreshCcw size={14} /> Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="account-content fade-in">
            {(!favorites || favorites.length === 0) ? (
              <div className="empty-state">
                <Heart size={52} strokeWidth={1.2} />
                <h3>No favorites yet</h3>
                <p className="text-muted">Heart items on the menu to save them here</p>
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map((item) => (
                  <div key={item.id} className="fav-card">
                    <div className="fav-img" style={{ backgroundImage: `url(${item.image})` }}>
                      <button
                        className="fav-heart active"
                        onClick={() => toggleFavorite && toggleFavorite(item)}
                      >
                        <Heart size={16} fill="red" color="red" />
                      </button>
                    </div>
                    <div className="fav-body">
                      <h4>{item.name}</h4>
                      <div className="fav-footer">
                        <span className="fav-price">₹{item.price}</span>
                        <button className="add-btn-sm" onClick={() => addToCart(item)}>+ Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="account-content fade-in">
            <div className="addresses-list">
              {SAVED_ADDRESSES.map((addr, i) => (
                <div key={i} className="address-card">
                  <div className="addr-icon">{addr.icon}</div>
                  <div className="addr-content">
                    <div className="addr-label">{addr.label}</div>
                    <div className="addr-text text-muted"><MapPin size={13} /> {addr.address}</div>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              ))}
              <button className="add-address-btn">
                + Add New Address
              </button>
            </div>
          </div>
        )}

        {/* Logout / Login link */}
        <div className="account-logout">
          <Link to="/login" className="logout-link">
            <LogOut size={16} /> Login / Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
