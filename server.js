import express from 'express';
import cors from 'cors';
import { MENU_ITEMS, CATEGORIES, COUPONS } from './server/menuData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Yummy backend is running!' });
});

// ─── Menu ──────────────────────────────────────────────────────────────────
app.get('/api/menu', (req, res) => {
  const { category, search } = req.query;
  let items = [...MENU_ITEMS];
  if (category && category !== 'all') {
    items = items.filter(i => i.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
  }
  res.json({ items, categories: CATEGORIES });
});

app.get('/api/menu/popular', (req, res) => {
  res.json(MENU_ITEMS.filter(i => i.popular));
});

// ─── Coupons ───────────────────────────────────────────────────────────────
app.post('/api/coupon/validate', (req, res) => {
  const { code, total } = req.body;
  const coupon = COUPONS.find(c => c.code === code.toUpperCase());
  if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid coupon code.' });
  if (total < coupon.minOrder) {
    return res.status(400).json({ valid: false, message: `Minimum order of ₹${coupon.minOrder} required.` });
  }
  const discount = coupon.type === 'percent'
    ? Math.round(total * coupon.discount / 100)
    : coupon.discount;
  res.json({ valid: true, discount, desc: coupon.desc });
});

// ─── Orders ────────────────────────────────────────────────────────────────
const orders = {}; // In-memory order store (replace with DB in production)

app.post('/api/orders', (req, res) => {
  const order = req.body;
  const orderId = `YUM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const newOrder = {
    ...order,
    id: orderId,
    status: 'Order Received',
    placedAt: new Date().toISOString(),
    timeline: [{ status: 'Order Received', time: new Date().toISOString() }]
  };
  orders[orderId] = newOrder;

  // Simulate status progression (for demo)
  setTimeout(() => {
    if (orders[orderId]) {
      orders[orderId].status = 'Preparing';
      orders[orderId].timeline.push({ status: 'Preparing', time: new Date().toISOString() });
    }
  }, 30000); // 30 seconds
  setTimeout(() => {
    if (orders[orderId]) {
      orders[orderId].status = 'Out for Delivery';
      orders[orderId].timeline.push({ status: 'Out for Delivery', time: new Date().toISOString() });
    }
  }, 90000); // 90 seconds

  res.json(newOrder);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  order.timeline.push({ status, time: new Date().toISOString() });
  res.json(order);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(Object.values(orders));
});

// ─── Delivery Zone Check ───────────────────────────────────────────────────
// Shadnagar center coordinates: 17.0688° N, 78.0478° E
const SHADNAGAR_CENTER = { lat: 17.0688, lng: 78.0478 };
const MAX_DELIVERY_RADIUS_KM = 8;

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

app.post('/api/delivery/check', (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ deliverable: false, message: 'Location required' });
  
  const dist = getDistanceKm(SHADNAGAR_CENTER.lat, SHADNAGAR_CENTER.lng, lat, lng);
  const deliverable = dist <= MAX_DELIVERY_RADIUS_KM;
  const fee = dist <= 2 ? 0 : Math.min(Math.round((dist - 2) * 10), 50);
  const eta = Math.round(20 + dist * 5);
  
  res.json({
    deliverable,
    distanceKm: Math.round(dist * 10) / 10,
    deliveryFee: deliverable ? fee : null,
    eta: deliverable ? eta : null,
    message: deliverable
      ? `Delivery available! ${dist <= 2 ? 'Free delivery' : `₹${fee} delivery fee`}. ~${eta} mins ETA.`
      : `Sorry, we currently deliver only within ${MAX_DELIVERY_RADIUS_KM}km of Shadnagar.`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Yummy Server running on http://localhost:${PORT}`);
  console.log(`🔗 API Base Path: /api`);
});
