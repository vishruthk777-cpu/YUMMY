import { Routes, Route } from 'react-router-dom'

// Layouts
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'

// Pages
import Home from './pages/Home'
import Menu from './pages/Menu'
import Reservation from './pages/Reservation'
import LoyaltyReviews from './pages/LoyaltyReviews'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Franchises from './pages/Franchises'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import UserAccount from './pages/UserAccount'

// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import KDS from './pages/admin/KDS'
import Billing from './pages/admin/Billing'
import AdminMenuManager from './pages/admin/AdminMenuManager'

function App() {
  return (
    <Routes>
      {/* Customer Facing Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="loyalty" element={<LoyaltyReviews />} />
        <Route path="franchises" element={<Franchises />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-tracking/:id" element={<OrderTracking />} />
        <Route path="account" element={<UserAccount />} />
      </Route>

      {/* Admin/Staff Facing Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="kds" element={<KDS />} />
        <Route path="billing" element={<Billing />} />
        <Route path="menu-manager" element={<AdminMenuManager />} />
      </Route>
    </Routes>
  )
}

export default App
