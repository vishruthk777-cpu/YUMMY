import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Cart from './Cart';
import AIAssistant from './AIAssistant';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content" style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      <Footer />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AIAssistant />
    </div>
  );
}
