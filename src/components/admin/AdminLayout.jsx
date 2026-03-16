import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ChefHat, Receipt, Home, UtensilsCrossed } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/kds', icon: <ChefHat size={20} />, label: 'Kitchen (KDS)' },
    { path: '/admin/billing', icon: <Receipt size={20} />, label: 'Billing' },
    { path: '/admin/menu-manager', icon: <UtensilsCrossed size={20} />, label: 'Menu Manager' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-footer">
          <Link to="/" className="admin-nav-item" style={{ marginTop: 'auto' }}>
            <Home size={20} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-user">
            <div className="avatar">A</div>
            <span>Admin User</span>
          </div>
        </header>
        <div className="admin-content fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
