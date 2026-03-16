import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h3>Yummy Franchises</h3>
          <p className="text-muted">Serving authentic flavors with a modern twist. The best Dosa and Irani Tea in town.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/menu">Digital Menu</a></li>
              <li><a href="/reservation">Book a Table</a></li>
              <li><a href="/loyalty">Loyalty Program</a></li>
              <li><a href="/admin/billing" className="text-primary mt-2 flex items-center gap-1" style={{color: 'var(--primary)'}}>Owner Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="text-muted">
              <li>123 Main Road, Near Clock Tower</li>
              <li>Shadnagar, Telangana 509216</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Yummy Franchises. All rights reserved.</p>
      </div>
    </footer>
  );
}
