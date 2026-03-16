import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, authenticate user here.
    // For now, let's redirect to the admin dashboard if it's the owner, else home.
    if (formData.email.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="container flex-center" style={{ minHeight: '70vh' }}>
        <div className="card auth-card">
          <div className="text-center mb-4">
            <h2>Welcome Back</h2>
            <p className="text-muted mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              <LogIn size={18} /> Sign In
            </button>
          </form>

          <div className="auth-footer text-center mt-4 pt-4 border-top">
            <p className="text-muted">
              Don't have an account? <Link to="/signup" className="text-primary font-bold">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
