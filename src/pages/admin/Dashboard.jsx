import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, IndianRupee, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [live, setLive] = useState({
    revenue: 0, orderCount: 0, delivered: 0, pending: 0
  });
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
      setOrders(allOrders);
      // Calc live stats
      const today = new Date().toDateString();
      allOrders.filter(o => new Date(o.timestamp || Date.now()).toDateString() === today);
      const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const delivered = allOrders.filter(o => o.status === 'Delivered').length;
      const pending = allOrders.filter(o => o.status !== 'Delivered').length;

      // Top items
      const itemCounts = {};
      allOrders.forEach(o => {
        (o.items || []).forEach(item => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      });
      const sorted = Object.entries(itemCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, qty]) => ({ name, sales: qty, revenue: `₹${qty * 60}` }));

      setLive({ revenue, orderCount: allOrders.length, delivered, pending });
      setTopItems(sorted.length > 0 ? sorted : [
        { name: 'Masala Dosa', sales: 124, revenue: '₹7,440' },
        { name: 'Paneer Butter Masala', sales: 86, revenue: '₹15,480' },
        { name: 'Irani Tea', sales: 312, revenue: '₹6,240' },
        { name: 'Garlic Naan', sales: 180, revenue: '₹7,200' },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, []);

  const stats = [
    { title: "Total Revenue", value: `₹${live.revenue.toLocaleString('en-IN')}`, trend: "+12%", icon: <IndianRupee size={24} />, color: "var(--primary)" },
    { title: 'Total Orders', value: live.orderCount.toString(), trend: "+8%", icon: <ShoppingBag size={24} />, color: "var(--accent, #eab308)" },
    { title: 'Delivered', value: live.delivered.toString(), trend: "+15%", icon: <CheckCircle size={24} />, color: "#22c55e" },
    { title: 'In Progress', value: live.pending.toString(), trend: "", icon: <Clock size={24} />, color: "#3b82f6" },
  ];

  const chartData = [
    { day: 'Mon', height: '45%' }, { day: 'Tue', height: '51%' },
    { day: 'Wed', height: '38%' }, { day: 'Thu', height: '62%' },
    { day: 'Fri', height: '68%' }, { day: 'Sat', height: '85%' },
    { day: 'Sun', height: '92%' },
  ];

  const getStatusColor = (status) => ({
    'Order Received': '#f97316', 'Preparing': '#eab308',
    'Out for Delivery': '#3b82f6', 'Delivered': '#22c55e',
  }[status] || '#6b7280');

  return (
    <div className="admin-dashboard fade-in">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <p className="text-muted">Welcome back, Owner. Here is what's happening.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-icon-wrapper" style={{ color: stat.color, background: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-details">
              <p className="stat-title text-muted">{stat.title}</p>
              <div className="stat-row">
                <h3>{stat.value}</h3>
                {stat.trend && <span className="stat-trend">{stat.trend}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid mt-4">
        {/* Chart */}
        <div className="card chart-card">
          <h3>Weekly Revenue Trend</h3>
          <div className="bar-chart-container mt-4">
            {chartData.map((data, i) => (
              <div key={i} className="chart-bar-col">
                <div className="chart-bar" style={{ height: data.height }}></div>
                <span className="chart-label">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Items */}
        <div className="card top-items-card">
          <h3>Top Selling Items</h3>
          <div className="items-list mt-4">
            {topItems.map((item, i) => (
              <div key={i} className="list-item">
                <div className="item-rank">#{i + 1}</div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <span className="text-muted">{item.sales} orders</span>
                </div>
                <div className="item-revenue">{item.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="card mt-4">
          <h3>Recent Orders</h3>
          <div className="recent-orders mt-4">
            {orders.slice(0, 5).map((order, i) => (
              <div key={i} className="recent-order-row">
                <div className="ro-id">#{order.id?.split('-').slice(-1)[0]}</div>
                <div className="ro-customer">{order.customer || 'Customer'}</div>
                <div className="ro-items">{(order.items || []).length} items</div>
                <div className="ro-total">₹{order.total || 0}</div>
                <div className="ro-status" style={{ color: getStatusColor(order.status) }}>
                  {order.status || 'Processing'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
