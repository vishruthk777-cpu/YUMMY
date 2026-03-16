import { useState, useEffect, useRef } from 'react';
import { Search, Star, Clock, Leaf, Zap, ShoppingBag, Plus, Minus, ChevronRight, X, Filter, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { MENU_ITEMS, CATEGORIES } from '../../server/menuData.js';
import './Menu.css';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeg, setFilterVeg] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [showSearch, setShowSearch] = useState(false);
  const categoryRef = useRef(null);
  const { addToCart, cart, updateQuantity, cartTotal, cartCount, setIsCartOpen, toggleFavorite, isFavorite } = useCart();

  const getCartQty = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  const handleAdd = (item) => {
    addToCart(item);
  };

  const filtered = MENU_ITEMS.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (filterVeg && !item.isVeg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.desc.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const scrollCategory = (dir) => {
    if (categoryRef.current) {
      categoryRef.current.scrollLeft += dir * 150;
    }
  };

  return (
    <div className="menu-page">
      {/* ── Top Banner ─────────────────────────────────────── */}
      <div className="menu-hero">
        <div className="container">
          <div className="menu-hero-inner">
            <div>
              <p className="menu-tag">🏪 Yummy Restaurant & Udipi Hotel · Shadnagar</p>
              <h1>Order Fresh Food <span className="text-gradient-vibrant">Delivered Fast</span></h1>
              <p className="text-muted">30+ dishes · Always Fresh · Delivered in Shadnagar</p>
            </div>
            <div className="menu-hero-stats">
              <div className="stat-pill"><Star size={14} fill="gold" color="gold" /> 4.8</div>
              <div className="stat-pill"><Clock size={14} /> 20-35 min</div>
              <div className="stat-pill"><Zap size={14} /> Free delivery &lt;2km</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Controls ────────────────────────────────── */}
      <div className="menu-controls-sticky">
        <div className="container">
          <div className="menu-controls-row">
            {/* Search */}
            <div className={`search-wrapper ${showSearch ? 'expanded' : ''}`}>
              <button className="search-icon-btn" onClick={() => setShowSearch(!showSearch)}>
                {showSearch ? <X size={18} /> : <Search size={18} />}
              </button>
              {showSearch && (
                <input
                  autoFocus
                  type="text"
                  className="search-input"
                  placeholder="Search masala dosa, biryani..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              )}
            </div>

            {/* Veg Toggle */}
            <button
              className={`veg-toggle ${filterVeg ? 'active' : ''}`}
              onClick={() => setFilterVeg(!filterVeg)}
            >
              <span className="veg-dot"></span> Veg
            </button>

            {/* Sort */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low</option>
              <option value="price_desc">Price: High</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ──────────────────────────────────── */}
      <div className="category-bar-wrapper">
        <div className="category-bar" ref={categoryRef}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`cat-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu Grid ──────────────────────────────────────── */}
      <div className="container">
        <div className="menu-results-header">
          <span className="results-count">{filtered.length} items</span>
          {searchQuery && <span className="results-query">for "{searchQuery}"</span>}
        </div>

        {/* Popular Section Header */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="section-header">
            <h2>⭐ Most Ordered</h2>
            <p className="text-muted">Shadnagar's favourites</p>
          </div>
        )}

        <div className="menu-grid-new">
          {filtered.map(item => {
            const qty = getCartQty(item.id);
            return (
              <div key={item.id} className={`menu-card-new ${qty > 0 ? 'in-cart' : ''}`}>
                {/* Image */}
                <div className="menu-card-img-wrap">
                  <div
                    className="menu-card-img-new"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {item.combo && <span className="combo-tag">{item.combo}</span>}
                  <div className="veg-indicator">
                    <div className={`veg-box ${item.isVeg ? 'veg' : 'nonveg'}`}>
                      <div className="veg-circle"></div>
                    </div>
                  </div>
                  <button
                    className={`fav-btn ${isFavorite && isFavorite(item.id) ? 'favorited' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite && toggleFavorite(item); }}
                    title="Add to favorites"
                  >
                    <Heart size={14} fill={isFavorite && isFavorite(item.id) ? 'red' : 'none'} color={isFavorite && isFavorite(item.id) ? 'red' : 'white'} />
                  </button>
                </div>

                {/* Content */}
                <div className="menu-card-body">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-desc">{item.desc}</p>
                  <div className="menu-item-meta">
                    <span className="item-rating"><Star size={12} fill="gold" color="gold" /> {item.rating}</span>
                    {item.prepTime > 0 && (
                      <span className="item-prep"><Clock size={12} /> {item.prepTime} min</span>
                    )}
                    {item.popular && <span className="popular-badge">🔥 Popular</span>}
                  </div>
                  <div className="menu-card-footer">
                    <span className="item-price">₹{item.price}</span>
                    <div className="cart-control">
                      {qty === 0 ? (
                        <button className="add-btn" onClick={() => handleAdd(item)}>
                          <Plus size={16} /> Add
                        </button>
                      ) : (
                        <div className="qty-stepper">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                          <span>{qty}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-menu">
            <div className="empty-emoji">🍽️</div>
            <h3>No items found</h3>
            <p className="text-muted">Try a different search or category</p>
            <button className="btn-primary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              Show All Items
            </button>
          </div>
        )}
      </div>

      {/* ── Floating Cart Strip ──────────────────────────── */}
      {cartCount > 0 && (
        <div className="floating-cart-strip" onClick={() => setIsCartOpen(true)}>
          <div className="cart-strip-left">
            <ShoppingBag size={18} />
            <span className="cart-strip-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="cart-strip-center">View Cart</div>
          <div className="cart-strip-right">
            <span>₹{cartTotal}</span>
            <ChevronRight size={18} />
          </div>
        </div>
      )}
    </div>
  );
}
