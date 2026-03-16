import { useState } from 'react';
import { Award, Star, Gift, Phone, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import './LoyaltyReviews.css';

export default function LoyaltyReviews() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  // Mock loyalty data
  const loyaltyData = {
    visits: 6,
    nextReward: '10 visits → 10% Discount',
    history: ['Jan 12', 'Feb 05', 'Feb 28', 'Mar 10', 'Mar 15', 'Today']
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setIsLogged(true);
      // Simulate showing review prompt after logging in / paying bill
      setTimeout(() => setShowReviewPrompt(true), 2000);
    }
  };

  const handleGoogleReview = () => {
    // In real app, this redirects to the Google Maps Review link
    window.open('https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4', '_blank');
    setShowReviewPrompt(false);
  };

  return (
    <div className="loyalty-page fade-in">
      <div className="loyalty-header text-center">
        <div className="container">
          <h1>Yummy Privilege Rewards</h1>
          <p className="text-muted">Our way of saying thank you for being a part of our family. Earn points, unlock exclusive treats, and enjoy a premium dining experience.</p>
        </div>
      </div>

      <div className="container loyalty-container">
        {/* Loyalty Section */}
        <div className="card loyalty-card">
          {!isLogged ? (
            <div className="login-section text-center">
              <Award size={48} color="var(--primary)" className="mb-4" />
              <h2>Unlock Your Rewards</h2>
              <p className="text-muted mt-2 mb-4">
                Join thousands of food lovers in Shadnagar. Simply enter your phone number to track your visits and start earning delicious rewards!
                <strong> Get a free Irani Tea on your 5th visit and an exclusive 10% discount on your 10th!</strong>
              </p>
              <form onSubmit={handleLogin} className="loyalty-form">
                <div className="input-icon-wrapper" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                  <Phone size={18} className="input-icon" />
                  <input 
                    type="tel" 
                    className="input-base" 
                    placeholder="Enter Your Phone Number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary mt-4">Check My Rewards Status</button>
              </form>
            </div>
          ) : (
            <div className="rewards-dashboard fade-in">
              <div className="rewards-profile">
                <div className="avatar profile-avatar"><User size={24} /></div>
                <div>
                  <h3>Glad to have you back!</h3>
                  <p className="text-muted">{phoneNumber}</p>
                </div>
              </div>

              <div className="rewards-progress mt-4 pt-4 border-top">
                <div className="progress-header">
                  <h4>Your Journey to the Next Reward</h4>
                  <span className="text-gradient font-bold">{loyaltyData.visits} / 10 Visits</span>
                </div>
                
                <div className="progress-bar-bg mt-2">
                  <div className="progress-bar-fill" style={{ width: `${(loyaltyData.visits / 10) * 100}%` }}></div>
                </div>
                
                <p className="text-sm mt-3 text-muted flex-center gap-2">
                  <Gift size={16} color="var(--accent)" /> 
                  Upcoming Milestone: {loyaltyData.nextReward}
                </p>
              </div>

              <div className="rewards-history mt-4 pt-4 border-top">
                <h4>Recent Visit Logs</h4>
                <ul className="history-list mt-3">
                  {loyaltyData.history.map((date, i) => (
                    <li key={i}><CheckCircle2 size={16} color="var(--success)" /> Visited on {date}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Review Booster Section */}
        <div className="card review-card text-center">
          <MessageSquareHeart size={48} color="var(--danger)" className="mb-4" />
          <h2>Share Your Yummy Story</h2>
          <p className="text-muted mt-2 mb-4">
            Loved our food? Your feedback is our greatest reward. A 5-star review on Google helps other foodies in Shadnagar find us and allows our family business to grow.
          </p>
          
          <div className="stars-large flex-center mt-2 mb-4">
            {[1,2,3,4,5].map(star => <Star key={star} fill="var(--accent)" color="var(--accent)" size={32} />)}
          </div>

          <button className="btn-secondary google-btn w-full" onClick={handleGoogleReview}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="google-icon" />
            Review us on Google
          </button>
        </div>
      </div>

      {/* Pop-up Review Modal Triggered after Log in (simulating point of sale) */}
      {showReviewPrompt && (
        <div className="modal-backdrop">
          <div className="modal-content fade-in text-center card">
            <h2>How was your meal today? 🤔</h2>
            <p className="text-muted mt-2 mb-4">Please take 10 seconds to share your experience!</p>
            <div className="modal-actions">
              <button className="btn-primary w-full" onClick={handleGoogleReview}>
                <Star fill="currentColor" size={18} /> Rate 5 Stars on Google
              </button>
              <button className="btn-secondary w-full mt-2" onClick={() => setShowReviewPrompt(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const User = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
