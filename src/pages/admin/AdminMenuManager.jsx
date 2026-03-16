import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from '../../../server/menuData.js';
import './AdminMenuManager.css';

const EMPTY_ITEM = {
  id: null, name: '', category: 'Breakfast', price: '', rating: 4.5,
  prepTime: 10, isVeg: true, desc: '', image: '', popular: false, combo: null
};

export default function AdminMenuManager() {
  const [items, setItems] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Merge base menu with any overrides from localStorage
    try {
      const overrides = JSON.parse(localStorage.getItem('yummy_menu_overrides') || '[]');
      const hidden = JSON.parse(localStorage.getItem('yummy_hidden_items') || '[]');
      setHiddenIds(hidden);
      // Merge: overrides take precedence over base items
      const overrideMap = {};
      overrides.forEach(o => { overrideMap[o.id] = o; });
      const merged = MENU_ITEMS.map(item => overrideMap[item.id] ? { ...item, ...overrideMap[item.id] } : item);
      // Add new items (those in overrides not in base)
      const baseIds = new Set(MENU_ITEMS.map(i => i.id));
      overrides.forEach(o => { if (!baseIds.has(o.id)) merged.push(o); });
      setItems(merged);
    } catch (error) {
      console.error("Error loading menu overrides:", error);
      setItems([...MENU_ITEMS]);
    }
  }, []);

  const saveToStorage = (updatedItems, updatedHidden) => {
    // Save only changed / new items vs base
    const baseMap = {};
    MENU_ITEMS.forEach(i => { baseMap[i.id] = i; });
    const overrides = updatedItems.filter(item => {
      const base = baseMap[item.id];
      return !base || JSON.stringify(base) !== JSON.stringify(item);
    });
    localStorage.setItem('yummy_menu_overrides', JSON.stringify(overrides));
    localStorage.setItem('yummy_hidden_items', JSON.stringify(updatedHidden));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveEdit = () => {
    if (!editItem.name || !editItem.price) return;
    let updatedItems;
    if (editItem.id === null) {
      // New item
      const newItem = { ...editItem, id: Date.now() };
      updatedItems = [...items, newItem];
    } else {
      updatedItems = items.map(i => i.id === editItem.id ? editItem : i);
    }
    setItems(updatedItems);
    saveToStorage(updatedItems, hiddenIds);
    setEditItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this item?')) return;
    const updatedItems = items.filter(i => i.id !== id);
    setItems(updatedItems);
    saveToStorage(updatedItems, hiddenIds.filter(h => h !== id));
  };

  const toggleVisibility = (id) => {
    const updatedHidden = hiddenIds.includes(id)
      ? hiddenIds.filter(h => h !== id)
      : [...hiddenIds, id];
    setHiddenIds(updatedHidden);
    saveToStorage(items, updatedHidden);
  };

  const filtered = items.filter(item => {
    if (filterCat !== 'all' && item.category !== filterCat) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const catSet = ['all', ...new Set(items.map(i => i.category))];

  return (
    <div className="admin-menu-manager fade-in">
      <div className="amm-header">
        <div>
          <h1>Menu Manager</h1>
          <p className="text-muted">{items.length} items · {hiddenIds.length} hidden</p>
        </div>
        <div className="amm-header-actions">
          {saved && <span className="save-badge">✅ Saved!</span>}
          <button className="btn-primary" onClick={() => { setEditItem({ ...EMPTY_ITEM }); setIsAdding(true); }}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="amm-filters">
        <div className="amm-search">
          <Search size={16} />
          <input
            placeholder="Search items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="amm-cats">
          {catSet.map(c => (
            <button
              key={c}
              className={`cat-chip-sm ${filterCat === c ? 'active' : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="amm-table-wrap">
        <table className="amm-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const isHidden = hiddenIds.includes(item.id);
              return (
                <tr key={item.id} className={isHidden ? 'hidden-row' : ''}>
                  <td>
                    <div className="amm-item-cell">
                      <div className="amm-img" style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }} />
                      <div>
                        <div className="amm-item-name">{item.name}</div>
                        <div className="amm-item-desc">{item.desc?.slice(0, 50)}{item.desc?.length > 50 ? '...' : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="cat-tag">{item.category}</span></td>
                  <td><span className="price-cell">₹{item.price}</span></td>
                  <td>⭐ {item.rating}</td>
                  <td>
                    <button
                      className={`visibility-btn ${isHidden ? 'hidden' : 'visible'}`}
                      onClick={() => toggleVisibility(item.id)}
                      title={isHidden ? 'Show item' : 'Hide item'}
                    >
                      {isHidden ? <><EyeOff size={14} /> Hidden</> : <><Eye size={14} /> Visible</>}
                    </button>
                  </td>
                  <td>
                    <div className="amm-actions">
                      <button className="amm-btn edit" onClick={() => setEditItem({ ...item })} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button className="amm-btn delete" onClick={() => handleDelete(item.id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {editItem && (
        <div className="amm-modal-backdrop" onClick={() => { setEditItem(null); setIsAdding(false); }}>
          <div className="amm-modal fade-in" onClick={e => e.stopPropagation()}>
            <div className="amm-modal-header">
              <h2>{isAdding ? 'Add New Item' : 'Edit Item'}</h2>
              <button className="btn-icon" onClick={() => { setEditItem(null); setIsAdding(false); }}><X size={20} /></button>
            </div>
            <div className="amm-modal-body">
              <div className="amm-form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input className="input-base" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} placeholder="e.g. Special Masala Dosa" />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input className="input-base" type="number" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: Number(e.target.value) })} placeholder="60" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="input-base" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })}>
                    {['Breakfast', 'South Indian', 'Meals', 'Snacks', 'Bakery', 'Cakes', 'Beverages', 'Combos'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prep Time (min)</label>
                  <input className="input-base" type="number" value={editItem.prepTime} onChange={e => setEditItem({ ...editItem, prepTime: Number(e.target.value) })} />
                </div>
                <div className="form-group amm-full">
                  <label>Description</label>
                  <textarea className="input-base" rows={2} value={editItem.desc} onChange={e => setEditItem({ ...editItem, desc: e.target.value })} placeholder="Short description of the dish" />
                </div>
                <div className="form-group amm-full">
                  <label>Image URL</label>
                  <input className="input-base" value={editItem.image} onChange={e => setEditItem({ ...editItem, image: e.target.value })} placeholder="/images/your_image.png" />
                </div>
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input className="input-base" type="number" step="0.1" min="0" max="5" value={editItem.rating} onChange={e => setEditItem({ ...editItem, rating: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Combo Label</label>
                  <input className="input-base" value={editItem.combo || ''} onChange={e => setEditItem({ ...editItem, combo: e.target.value || null })} placeholder="e.g. BEST VALUE" />
                </div>
                <div className="form-group">
                  <label>Veg Item?</label>
                  <div className="toggle-row">
                    <button className={`toggle-btn ${editItem.isVeg ? 'on' : ''}`} onClick={() => setEditItem({ ...editItem, isVeg: !editItem.isVeg })}>
                      {editItem.isVeg ? <><ToggleRight size={20} /> Yes, Veg</> : <><ToggleLeft size={20} /> Non-Veg</>}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Popular?</label>
                  <div className="toggle-row">
                    <button className={`toggle-btn ${editItem.popular ? 'on' : ''}`} onClick={() => setEditItem({ ...editItem, popular: !editItem.popular })}>
                      {editItem.popular ? <><ToggleRight size={20} /> Yes 🔥</> : <><ToggleLeft size={20} /> No</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="amm-modal-footer">
              <button className="btn-secondary" onClick={() => { setEditItem(null); setIsAdding(false); }}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveEdit}>
                <Save size={16} /> Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
