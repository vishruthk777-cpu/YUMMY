import { useState, useEffect } from 'react';
import { Search, Printer, FileText, CheckCircle2 } from 'lucide-react';
import './Billing.css';

const SAMPLE_ORDERS = [
  {
    id: "ORD-8492", customer: "Rajesh Kumar", phone: "9876543210", type: "Dine-in", status: "Completed",
    subtotal: 350, gst: 17.5, total: 367.5, time: "14:30", timestamp: new Date(Date.now() - 86400000).toISOString(), billingStatus: "Paid",
    items: [
      { id: 1, name: 'Premium Masala Dosa', price: 60, quantity: 2 },
      { id: 4, name: 'South Indian Thali', price: 120, quantity: 1 },
      { id: 12, name: 'Special Irani Chai', price: 20, quantity: 3 }
    ]
  },
  {
    id: "ORD-3120", customer: "Priya Sharma", phone: "9988776655", type: "Delivery", status: "Pending",
    subtotal: 630, gst: 31.5, total: 661.5, time: "18:45", timestamp: new Date(Date.now() - 3600000).toISOString(), billingStatus: "Unpaid",
    items: [
      { id: 6, name: 'Veg Dum Biryani', price: 150, quantity: 3 },
      { id: 5, name: 'Paneer Butter Masala', price: 180, quantity: 1 }
    ]
  },
  {
    id: "ORD-9931", customer: "Anil Reddy", phone: "9123456780", type: "Takeaway", status: "Pending",
    subtotal: 140, gst: 7.0, total: 147.0, time: "09:15", timestamp: new Date(Date.now() - 7200000).toISOString(), billingStatus: "Paid",
    items: [
      { id: 2, name: 'Ghee Karam Idli', price: 50, quantity: 2 },
      { id: 3, name: 'Medu Vada (3 Pcs)', price: 45, quantity: 1 }
    ]
  },
  {
    id: "ORD-1049", customer: "Sita Verma", phone: "9566778899", type: "Delivery", status: "Completed",
    subtotal: 510, gst: 25.5, total: 535.5, time: "Yesterday", timestamp: new Date(Date.now() - 172800000).toISOString(), billingStatus: "Paid",
    items: [
      { id: 11, name: 'Pineapple Cake (1kg)', price: 450, quantity: 1 },
      { id: 10, name: 'Black Forest Pastry', price: 60, quantity: 1 }
    ]
  }
];

export default function Billing() {
  const [bills, setBills] = useState(() => {
    return JSON.parse(localStorage.getItem('yummy_orders_db') || '[]');
  });
  const [search, setSearch] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    if (bills.length === 0) {
      localStorage.setItem('yummy_orders_db', JSON.stringify(SAMPLE_ORDERS));
      setBills(SAMPLE_ORDERS);
    }
  }, [bills.length]);

  const handlePayment = (id) => {
    const updatedBills = bills.map(b => b.id === id ? { ...b, billingStatus: 'Paid' } : b);
    setBills(updatedBills);
    localStorage.setItem('yummy_orders_db', JSON.stringify(updatedBills));
    
    if (selectedBill?.id === id) {
      setSelectedBill({ ...selectedBill, billingStatus: 'Paid' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (!selectedBill) return;
    
    const subject = `Your Receipt from Yummy Franchises (Order ${selectedBill.id})`;
    
    let body = `Hello ${selectedBill.customer},\n\n`;
    body += `Thank you for dining with Yummy Franchises! Here is your receipt.\n`;
    body += `-------------------------------------------------\n`;
    body += `Invoice: ${selectedBill.id}\n`;
    body += `Date: ${new Date(selectedBill.timestamp).toLocaleDateString()} at ${selectedBill.time}\n`;
    body += `Type: ${selectedBill.type}\n`;
    body += `-------------------------------------------------\n\n`;
    
    selectedBill.items.forEach(item => {
      body += `${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}\n`;
    });
    
    body += `\nSubtotal: Rs. ${selectedBill.subtotal.toFixed(2)}\n`;
    body += `CGST (2.5%): Rs. ${(selectedBill.gst / 2).toFixed(2)}\n`;
    body += `SGST (2.5%): Rs. ${(selectedBill.gst / 2).toFixed(2)}\n`;
    body += `Total Amount: Rs. ${selectedBill.total.toFixed(2)}\n\n`;
    body += `Payment Status: ${selectedBill.billingStatus}\n\n`;
    body += `-------------------------------------------------\n`;
    body += `GSTIN: 22AAAAA0000A1Z5\n`;
    body += `123 Main Street, Shadnagar\n`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const filteredBills = bills.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) || 
    (b.customer && b.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="billing-system fade-in">
      <div className="dashboard-header">
        <h1>Smart Billing & Receipts</h1>
        <p className="text-muted">Generate GST invoices and record payments for actual orders.</p>
      </div>

      <div className="billing-grid mt-4">
        <div className="card billing-list-card">
          <div className="billing-list-header">
            <h3>Recent Invoices</h3>
            <div className="search-bar">
              <Search size={16} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search Invoice or Customer..." 
                className="input-base"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bills-table-container">
            <table className="bills-table">
              <caption>Recent customer invoices and payment status</caption>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer / Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map(bill => (
                  <tr key={bill.id}>
                    <td className="font-medium">{bill.id}</td>
                    <td>{bill.customer} <span className="text-sm text-muted">({bill.type})</span></td>
                    <td>₹{bill.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-pill ${bill.billingStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
                        {bill.billingStatus || 'Unpaid'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-secondary btn-sm"
                        onClick={() => setSelectedBill(bill)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No orders found. Place an order in the app to see it here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card receipt-preview-card">
          {selectedBill ? (
            <div className="receipt-view fade-in">
              <div className="receipt-header">
                <h2>Yummy Restaurant</h2>
                <p className="text-muted text-sm">123 Main Street, Shadnagar</p>
                <p className="text-muted text-sm">GSTIN: 22AAAAA0000A1Z5</p>
              </div>
              
              <div className="receipt-meta">
                <div><span>Invoice:</span> {selectedBill.id}</div>
                <div><span>Date:</span> {new Date(selectedBill.timestamp).toLocaleDateString()}</div>
                <div><span>Time:</span> {selectedBill.time}</div>
                <div><span>Type:</span> {selectedBill.type}</div>
              </div>

              <div className="receipt-meta" style={{ marginTop: '-1rem' }}>
                <div><span>Customer:</span> {selectedBill.customer}</div>
                <div><span>Phone:</span> {selectedBill.phone}</div>
              </div>

              <div className="receipt-items">
                <div className="receipt-item-header">
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Amount</span>
                </div>
                {selectedBill.items.map((item, idx) => (
                  <div className="receipt-item" key={idx}>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-totals">
                <div className="receipt-row">
                  <span>Subtotal</span>
                  <span>₹{selectedBill.subtotal.toFixed(2)}</span>
                </div>
                <div className="receipt-row">
                  <span>CGST (2.5%)</span>
                  <span>₹{(selectedBill.gst / 2).toFixed(2)}</span>
                </div>
                <div className="receipt-row">
                  <span>SGST (2.5%)</span>
                  <span>₹{(selectedBill.gst / 2).toFixed(2)}</span>
                </div>
                <div className="receipt-row grand-total">
                  <span>Total Amount</span>
                  <span>₹{selectedBill.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="receipt-actions">
                {selectedBill.billingStatus !== 'Paid' ? (
                  <button className="btn-success" onClick={() => handlePayment(selectedBill.id)}>
                    <CheckCircle2 size={18} /> Mark as Paid
                  </button>
                ) : (
                  <button className="btn-primary" onClick={handlePrint}>
                    <Printer size={18} /> Print Receipt
                  </button>
                )}
                <button className="btn-secondary" onClick={handleEmail}>
                  <FileText size={18} /> Email bill
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-receipt text-muted">
              <FileText size={48} opacity={0.2} />
              <p>Select an invoice to view and manage billing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
