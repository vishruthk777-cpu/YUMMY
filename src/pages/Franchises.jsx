import { useState } from 'react';
import { MapPin, Phone, Star, Clock, Navigation } from 'lucide-react';
import './Franchises.css';

const LOCATIONS = [
  {
    id: 1,
    name: 'Yummy Bakery',
    type: 'Bakery and Cake Shop',
    city: 'Shadnagar',
    address: 'College Rd, Shadnagar, Telangana 509216',
    rating: 3.9,
    reviews: 1279,
    phone: '086396 17363',
    hours: 'Opens 6:00 AM - Closes 9:45 PM',
    price: '₹1–200 per person',
    highlights: ['Cakes', 'Puffs', 'Lassi', 'Veg Manchuria'],
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600&auto=format&fit=crop',
    googleMapsLink: 'https://maps.google.com/?q=College+Rd,+Shadnagar,+Telangana+509216'
  },
  {
    id: 102,
    name: 'Yummy The Cake Shop',
    type: 'Bakery and Cake Shop',
    city: 'Shadnagar',
    address: 'Main, Shadnagar, Telangana 509216',
    rating: 4.1,
    reviews: 495,
    phone: '099630 22022',
    hours: 'Open - Closes 10:00 PM',
    price: '₹1–200 per person',
    highlights: ['Pizza', 'Birthday Cakes', 'Icecreams', 'Milkshake', 'Black Forest Cake'],
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600&auto=format&fit=crop',
    googleMapsLink: 'https://maps.google.com/?q=Main,+Shadnagar,+Telangana+509216'
  },
  {
    id: 2,
    name: 'Yummy Restaurant & Udipi Hotel (Main)',
    type: 'Restaurant',
    city: 'Shadnagar',
    address: 'Main Market Road, Shadnagar, Telangana 509216',
    rating: 4.5,
    reviews: 2450,
    phone: '+91 98765 43210',
    hours: 'Opens 7:00 AM - Closes 11:30 PM',
    price: '₹200–500 per person',
    highlights: ['Masala Dosa', 'Irani Tea', 'Paneer Butter Masala'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop',
    googleMapsLink: 'https://maps.google.com/?q=Yummy+Restaurant+Shadnagar'
  },
  {
    id: 3,
    name: 'Yummy Premium Bakes',
    type: 'Cake Shop',
    city: 'Hyderabad',
    address: 'Jubilee Hills, Road No 36, Hyderabad, Telangana 500033',
    rating: 4.8,
    reviews: 890,
    phone: '+91 91234 56789',
    hours: 'Opens 10:00 AM - Closes 10:00 PM',
    price: '₹500+ per person',
    highlights: ['Custom Cakes', 'Pastries', 'Gourmet Desserts'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
    googleMapsLink: 'https://maps.google.com/?q=Jubilee+Hills,+Hyderabad'
  },
  {
    id: 4,
    name: 'Yummy Udipi Express',
    type: 'Restaurant',
    city: 'Hyderabad',
    address: 'Madhapur Main Road, Hitech City, Hyderabad, Telangana 500081',
    rating: 4.2,
    reviews: 3120,
    phone: '+91 99887 76655',
    hours: 'Opens 6:00 AM - Closes 12:00 AM',
    price: '₹100–300 per person',
    highlights: ['Idli Sambhar', 'Filter Coffee', 'Meals'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80&w=600&auto=format&fit=crop',
    googleMapsLink: 'https://maps.google.com/?q=Madhapur,+Hyderabad'
  }
];

const CITIES = ['All', 'Shadnagar', 'Hyderabad'];
const TYPES = ['All', 'Restaurant', 'Bakery and Cake Shop', 'Cake Shop'];

export default function Franchises() {
  const [activeCity, setActiveCity] = useState('All');
  const [activeType, setActiveType] = useState('All');

  const filteredLocations = LOCATIONS.filter(loc => {
    if (activeCity !== 'All' && loc.city !== activeCity) return false;
    if (activeType !== 'All' && loc.type !== activeType) return false;
    return true;
  });

  return (
    <div className="franchises-page fade-in">
      <div className="franchises-header text-center">
        <div className="container">
          <h1>Visit Our Locations</h1>
          <p className="text-muted">Experience the Yummy magic at any of our outlets. Whether you're looking for a hearty meal, a quick snack, or a celebration cake, we're here for you.</p>
        </div>
      </div>

      <div className="container">
        <div className="filters-section">
          <div className="filter-group">
            <h3>City</h3>
            <div className="filter-chips scroll-x">
              {CITIES.map(city => (
                <button 
                  key={city}
                  className={`chip ${activeCity === city ? 'active' : ''}`}
                  onClick={() => setActiveCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Venue Type</h3>
            <div className="filter-chips scroll-x">
              {TYPES.map(type => (
                <button 
                  key={type}
                  className={`chip ${activeType === type ? 'active' : ''}`}
                  onClick={() => setActiveType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="locations-grid mt-4 pt-4">
          {filteredLocations.map(loc => (
            <div key={loc.id} className="card location-card">
              <div className="location-img" style={{ backgroundImage: `url(${loc.image})` }}>
                <span className="badge badge-primary absolute-badge">{loc.type}</span>
              </div>
              <div className="location-content">
                <div className="location-header">
                  <h2>{loc.name}</h2>
                  <div className="location-rating">
                    <span className="rating-score">{loc.rating}</span>
                    <Star fill="currentColor" size={14} className="star-icon" />
                    <span className="text-muted rating-count">({loc.reviews})</span>
                  </div>
                </div>
                
                <div className="location-details mt-4">
                  <div className="detail-row">
                    <MapPin size={16} className="text-primary" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="detail-row">
                    <Clock size={16} className="text-accent" />
                    <span>{loc.hours}</span>
                  </div>
                  <div className="detail-row">
                    <Phone size={16} className="text-success" />
                    <span>{loc.phone}</span>
                  </div>
                </div>

                <div className="location-highlights mt-4 border-top pt-4">
                  <p className="text-sm font-bold mb-2">Highlights:</p>
                  <div className="highlights-tags">
                    {loc.highlights.map((tag, i) => (
                      <span key={i} className="highlight-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="location-actions mt-4" style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href={loc.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Navigation size={16} /> Map
                  </a>
                  <a href={`tel:${loc.phone}`} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Phone size={16} /> Call Now
                  </a>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLocations.length === 0 && (
            <div className="empty-state">
              <p className="text-muted">No locations found matching your filters.</p>
              <button className="btn-secondary mt-4" onClick={() => {setActiveCity('All'); setActiveType('All');}}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
