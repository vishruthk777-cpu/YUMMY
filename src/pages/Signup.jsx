import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import './Auth.css';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate user registration
    alert(`Account created for ${formData.name}!`);
    navigate('/login');
  };

  return (
    <div className="auth-page fade-in">
      <div className="container flex-center" style={{ minHeight: '70vh' }}>
        <div className="card auth-card">
          <div className="text-center mb-4">
            <h2>Create Account</h2>
            <p className="text-muted mt-2">Join Yummy Rewards today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="input-base" 
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  className="input-base" 
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              <UserPlus size={18} /> Sign Up
            </button>
          </form>

          <div className="auth-footer text-center mt-4 pt-4 border-top">
            <p className="text-muted">
              Already have an account? <Link to="/login" className="text-primary font-bold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
