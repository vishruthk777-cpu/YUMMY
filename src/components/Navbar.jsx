import { Link, useLocation } from 'react-router-dom';
import { Utensils, Menu as MenuIcon, User, ShoppingBag, X, Phone, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const closeMobile = () => setIsMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <Utensils className="logo-icon" />
          <span>Yummy <span className="text-gradient">Restaurant</span></span>
        </Link>
        
        <div className="navbar-links desktop-only">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu')}`}>Menu</Link>
          <Link to="/franchises" className={`nav-link ${isActive('/franchises')}`}>Locations</Link>
          <Link to="/reservation" className={`nav-link ${isActive('/reservation')}`}>Reserve</Link>
          <Link to="/loyalty" className={`nav-link ${isActive('/loyalty')}`}>Loyalty</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/account" className="btn-icon" title="My Account">
            <User size={20} />
          </Link>
          <button className="btn-icon cart-btn" onClick={() => setIsCartOpen(true)} id="cart-btn">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
          </button>
          <Link to="/login" className="btn-primary mobile-hidden" style={{ padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}>
            Login
          </Link>
          <button 
            className="btn-icon mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="mobile-menu fade-in">
          <Link to="/" className={`mobile-link ${isActive('/')}`} onClick={closeMobile}>🏠 Home</Link>
          <Link to="/menu" className={`mobile-link ${isActive('/menu')}`} onClick={closeMobile}>🍽️ Menu & Order</Link>
          <Link to="/franchises" className={`mobile-link`} onClick={closeMobile}>📍 Our Locations</Link>
          <Link to="/reservation" className={`mobile-link`} onClick={closeMobile}>📅 Reserve a Table</Link>
          <Link to="/loyalty" className={`mobile-link`} onClick={closeMobile}>⭐ Loyalty & Rewards</Link>
          <Link to="/account" className={`mobile-link`} onClick={closeMobile}>👤 My Account</Link>
          <div className="mobile-menu-footer">
            <a href="tel:+919876543210" className="btn-secondary" style={{ flex: 1 }}><Phone size={16} /> Call Us</a>
            <Link to="/login" className="btn-primary" style={{ flex: 1 }} onClick={closeMobile}>Login / Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
