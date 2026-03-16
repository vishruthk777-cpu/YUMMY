import { useState } from 'react';
import { Calendar, Clock, Users, User, CheckCircle2 } from 'lucide-react';
import './Reservation.css';

export default function Reservation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for loading state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: 'Yummy Restaurant & Udipi Hotel (Main)',
    date: '',
    time: '',
    guests: '2',
    requests: '',
  });

  const BRANCHES = [
    'Yummy Restaurant & Udipi Hotel (Main)',
    'Yummy Bakery (Shadnagar)',
    'Yummy The Cake Shop (Shadnagar)',
    'Yummy Premium Bakes (Hyderabad)',
    'Yummy Udipi Express (Hyderabad)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and save to LocalStorage
    setTimeout(() => {
      const newReservation = {
        id: `RES-${Math.floor(Math.random() * 10000)}`,
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'Confirmed'
      };

      const existingReservations = JSON.parse(localStorage.getItem('yummy_reservations_db') || '[]');
      localStorage.setItem('yummy_reservations_db', JSON.stringify([...existingReservations, newReservation]));

      setIsSubmitting(false);
      setIsSubmitted(true); // Changed from setIsSuccess to setIsSubmitted to match existing logic
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="container fade-in reservation-success">
        <CheckCircle2 size={80} color="var(--success)" className="success-icon" />
        <h1>Booking Confirmed!</h1>
        <p className="text-muted">
          Thank you, {formData.name}. Your table for {formData.guests} has been reserved on {formData.date} at {formData.time} at {formData.branch}.
        </p>
        <div className="card mt-4 p-4 text-center">
          <p>We've sent a confirmation SMS to {formData.phone}.</p>
          <button className="btn-primary mt-4" onClick={() => setIsSubmitted(false)}>
            Book Another Table
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page fade-in">
      <div className="reservation-header text-center">
        <div className="container">
          <h1>Book a Table</h1>
          <p className="text-muted">Reserve your spot and skip the waiting line.</p>
        </div>
      </div>

      <div className="container reservation-container">
        <div className="reservation-info card">
          <h3>Why Book with Us?</h3>
          <ul className="info-list text-muted mt-4">
            <li>✔ Guaranteed seating on busy weekends</li>
            <li>✔ Priority service & complimentary welcome drink</li>
            <li>✔ Custom arrangements for birthdays & anniversaries</li>
          </ul>
          
          <div className="mt-4 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.05)'}}>
            <h4>Opening Hours</h4>
            <div className="hours-grid mt-4">
              <span>Mon - Fri</span>
              <span>8:00 AM - 10:30 PM</span>
              <span>Sat - Sun</span>
              <span>7:00 AM - 11:30 PM</span>
            </div>
          </div>
        </div>

        <form className="reservation-form card" onSubmit={handleSubmit}>
          <h3>Reservation Details</h3>
          
          <div className="form-group mt-4">
            <label>Full Name</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input type="text" className="input-base" name="name" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="input-base" name="phone" required placeholder="+91 98765..." value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Number of Guests</label>
              <div className="input-icon-wrapper">
                <Users size={18} className="input-icon" />
                <select className="input-base" name="guests" value={formData.guests} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8,"9+"].map(n => <option key={n} value={n}>{n} People</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label>Select Branch</label>
              <div className="input-icon-wrapper">
                <MapPin size={18} className="input-icon" />
                <select 
                  className="input-base"
                  name="branch" // Added name attribute
                  required
                  value={formData.branch}
                  onChange={handleChange} // Used general handleChange
                >
                  {BRANCHES.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <div className="input-icon-wrapper">
                <Calendar size={18} className="input-icon" />
                <input type="date" className="input-base" name="date" required value={formData.date} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Time</label>
              <div className="input-icon-wrapper">
                <Clock size={18} className="input-icon" />
                <input type="time" className="input-base" name="time" required value={formData.time} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests (Optional)</label>
            <textarea 
              className="input-base" 
              name="requests" 
              rows="3" 
              placeholder="E.g., Window seat, Birthday celebration..."
              value={formData.requests}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
}
