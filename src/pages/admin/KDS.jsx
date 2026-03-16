import { useState, useEffect } from 'react';
import { GripVertical, Clock, MoreVertical, Search } from 'lucide-react';
import './KDS.css';

export default function KDS() {
  const [orders, setOrders] = useState([]);

  // Load orders from LocalStorage when component mounts
  useEffect(() => {
    const fetchOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
      setOrders(storedOrders);
    };

    fetchOrders();
    // Poll for new orders every 5 seconds (simulating realtime backend)
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('yummy_orders_db', JSON.stringify(updatedOrders));
  };

  const pending = orders.filter(o => o.status === 'Pending');
  const cooking = orders.filter(o => o.status === 'Cooking');
  const ready = orders.filter(o => o.status === 'Ready');

  return (
    <div className="kds-system fade-in">
      <div className="dashboard-header mb-4">
        <div>
          <h1>Kitchen Display System</h1>
          <p className="text-muted">Manage active orders and dispatch.</p>
        </div>
      </div>

      <div className="kds-board">
        {/* PENDING COLUMN */}
        <div className="kds-column">
          <div className="column-header border-danger">
            <h3>New / Pending</h3>
            <span className="count-badge text-danger">{pending.length}</span>
          </div>
          <div className="column-body">
            {pending.length === 0 && <div className="empty-text">No pending orders</div>}
            
            {pending.map(order => (
              <div key={order.id} className="card kds-order-card">
                <div className="order-header">
                  <div className="order-id-group">
                    <h3>{order.id}</h3>
                    <span className="badge badge-primary">{order.type}</span>
                  </div>
                  <button className="btn-icon"><MoreVertical size={18}/></button>
                </div>
                <div className="text-sm text-muted">Customer: {order.customer} ({order.phone})</div>
                <div className="order-time text-muted mt-2">
                  <Clock size={14} /> <span>{order.time}</span>
                </div>
                <ul className="order-items mt-3">
                  {order.items.map((item, idx) => (
                    <li key={idx}><span className="font-bold">{item.quantity}x</span> {item.name}</li>
                  ))}
                </ul>
                <div className="order-actions mt-4">
                  <button 
                    className="btn-secondary w-full"
                    onClick={() => updateOrderStatus(order.id, 'Cooking')}
                  >
                    Start Cooking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COOKING COLUMN */}
        <div className="kds-column">
          <div className="column-header border-warning">
            <h3>Cooking</h3>
            <span className="count-badge text-accent">{cooking.length}</span>
          </div>
          <div className="column-body">
            {cooking.length === 0 && <div className="empty-text">No active cooking</div>}
            
            {cooking.map(order => (
              <div key={order.id} className="card kds-order-card">
                <div className="order-header">
                  <div className="order-id-group">
                    <h3 className="text-accent">{order.id}</h3>
                    <span className="badge badge-primary">{order.type}</span>
                  </div>
                </div>
                <div className="text-sm text-muted">Customer: {order.customer}</div>
                <ul className="order-items mt-3">
                  {order.items.map((item, idx) => (
                    <li key={idx}><span className="font-bold">{item.quantity}x</span> {item.name}</li>
                  ))}
                </ul>
                <div className="order-actions mt-4">
                  <button 
                    className="btn-success w-full"
                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                  >
                    Mark Ready
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* READY COLUMN */}
        <div className="kds-column">
          <div className="column-header border-success">
            <h3>Ready for Dispatch</h3>
            <span className="count-badge text-success">{ready.length}</span>
          </div>
          <div className="column-body">
            {ready.length === 0 && <div className="empty-text">No orders ready</div>}
            
            {ready.map(order => (
              <div key={order.id} className="card kds-order-card" style={{ opacity: 0.8 }}>
                <div className="order-header">
                  <div className="order-id-group">
                    <h3 className="text-success">{order.id}</h3>
                    <span className="badge badge-primary">{order.type}</span>
                  </div>
                </div>
                <div className="text-sm text-muted">Customer: {order.customer}</div>
                <div className="order-actions mt-4">
                  <button 
                    className="btn-secondary w-full"
                    onClick={() => updateOrderStatus(order.id, 'Dispatched')}
                  >
                    Clear / Dispatched
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
