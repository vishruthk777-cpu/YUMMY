import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, PhoneCall, MessageCircle, MapPin, Map as MapIcon, ChevronRight, Zap, ShoppingBag } from 'lucide-react';
import LivePredictor from '../components/LivePredictor';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container hero-content">
          <div className="badge badge-primary hero-badge">Shadnagar’s Most Loved Culinary Destination</div>
          <h1 className="hero-title">
            Authentic Flavors, Freshly Baked <span className="text-gradient-vibrant">Bakes & Cakes</span> <br/>
            Right in the Heart of Shadnagar
          </h1>
          <p className="hero-subtitle">
            From the crispest Masala Dosas to our legendary Irani Chai and premium celebration cakes, we bring you the perfect blend of tradition and taste.
          </p>
          
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary btn-lg hero-order-btn">
              <ShoppingBag size={20} /> Order Online
            </Link>
            <a href="tel:+919876543210" className="btn-secondary btn-lg">
              <PhoneCall size={20} /> Order via Call
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
              <MessageCircle size={20} /> Chat on WhatsApp
            </a>
          </div>
          
          <div className="hero-ratings">
            <div className="stars">
              <Star fill="var(--accent)" color="var(--accent)" size={20} />
              <Star fill="var(--accent)" color="var(--accent)" size={20} />
              <Star fill="var(--accent)" color="var(--accent)" size={20} />
              <Star fill="var(--accent)" color="var(--accent)" size={20} />
              <Star fill="currentColor" color="var(--accent)" size={20} />
            </div>
            <span className="rating-text">The go-to spot for 5,000+ happy families in Shadnagar</span>
          </div>
        </div>
      </section>

      {/* Festival Offer Banner */}
      <section className="offer-banner-strip">
        <div className="container">
          <div className="offer-strip-inner">
            <div className="offer-chip"><Zap size={14} /> EXCLUSIVE DEAL</div>
            <span>🔥 Use code <strong>SHADNAGAR</strong> to get 20% OFF on all orders above ₹200!</span>
            <div className="offer-chip"><Clock size={14} /> Fast 20-35 min delivery</div>
          </div>
        </div>
      </section>

      {/* Menu Categories Section */}
      <section className="categories-section container">
        <div className="section-header text-center">
          <h2>Discover Our Signature Menu</h2>
          <p className="text-muted">Handcrafted South Indian delights, hearty meals, and artisanal bakery treats.</p>
        </div>
        
        <div className="categories-grid">
          {['South Indian Soul', 'Hearty Meals', 'Street Snacks', 'Artisanal Bakery', 'Custom Celebration Cakes', 'Classic Beverages'].map((category, idx) => (
            <Link to="/menu" key={idx} className="category-card">
              <div className={`category-img cat-img-${idx + 1}`}></div>
              <div className="category-content">
                <h3>{category}</h3>
                <span className="category-link">Explore the Menu <ChevronRight size={16} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="cakes-section">
        <div className="container">
          <div className="cakes-content">
            <div className="cakes-text">
              <h2>Masterpiece Cakes for Your Special Moments</h2>
              <p className="text-muted">
                Turn your birthdays and anniversaries into unforgettable memories. Our master bakers in Shadnagar craft every cake with love, using only the freshest, premium ingredients.
              </p>
              <ul className="cakes-features">
                <li><Star size={20} color="var(--primary)" /> Custom Hand-Crafted Designs</li>
                <li><Star size={20} color="var(--primary)" /> 100% Eggless Options Available</li>
                <li><Star size={20} color="var(--primary)" /> Lightning-Fast Delivery in Shadnagar</li>
              </ul>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                Order Your Custom Cake
              </a>
            </div>
            <div className="cakes-image-grid">
              <div className="cake-img img-featured-1"></div>
              <div className="cake-img img-featured-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Gallery */}
      <section className="gallery-section container">
        <div className="section-header">
          <h2>A Glimpse of Our Culinary Journey</h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item item-1"></div>
          <div className="gallery-item item-2"></div>
          <div className="gallery-item item-3"></div>
          <div className="gallery-item item-4"></div>
          <div className="gallery-item item-5"></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Voices of Shadnagar</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { name: "Rahul S.", text: "The Masala Dosa here is unmatched in Shadnagar. Every visit feels like a treat for my family!" },
              { name: "Priya M.", text: "The custom cake for my daughter's birthday was stunning and delicious. Truly the best bakery in town!" },
              { name: "Anil K.", text: "A perfect blend of Udipi hotel vibes and a modern restaurant. The Irani Chai is a must-try!" }
            ].map((review, i) => (
               <div className="testimonial-card card" key={i}>
                 <div className="stars" style={{ marginBottom: '1rem' }}>
                   {[...Array(5)].map((_, j) => <Star key={j} fill="var(--accent)" color="var(--accent)" size={16} />)}
                 </div>
                 <p className="testimonial-text">"{review.text}"</p>
                 <h4 className="testimonial-author">- {review.name}</h4>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section container">
        <div className="location-grid">
          <div className="location-info">
            <h2>Visit Us in Shadnagar</h2>
            <div className="info-item">
              <MapIcon className="info-icon" />
              <div>
                <h4>Address</h4>
                <p className="text-muted">123 Main Road, Near Clock Tower,<br/>Shadnagar, Telangana 509216</p>
              </div>
            </div>
            <div className="info-item">
              <Clock className="info-icon" />
              <div>
                <h4>Timings</h4>
                <p className="text-muted">Monday - Sunday<br/>7:00 AM - 11:00 PM</p>
              </div>
            </div>
            <div className="info-item">
              <PhoneCall className="info-icon" />
              <div>
                <h4>Contact</h4>
                <p className="text-muted">+91 98765 43210</p>
              </div>
            </div>
            <a href="https://maps.google.com/?q=Yummy+Restaurant+Shadnagar" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
              Open in Google Maps
            </a>
          </div>
          <div className="location-map card" style={{ padding: 0, overflow: 'hidden', minHeight: '300px' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3813.04855424598!2d78.19967261486718!3d17.07008898826588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbbb0000000001%3A0x0!2sShadnagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.2)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Yummy Restaurant Location Map"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
