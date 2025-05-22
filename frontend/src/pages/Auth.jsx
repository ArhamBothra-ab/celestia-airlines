import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { FaLock, FaUser, FaPlane, FaUserPlus, FaGift, FaRocket } from 'react-icons/fa';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    dob: '',
    address: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files && files[0]) {
      setFormData(prev => ({ ...prev, avatar: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/users/login' : '/users/register';
    let body, headers;
    if (isLogin) {
      body = JSON.stringify(formData);
      headers = { 'Content-Type': 'application/json' };
    } else {
      // Registration: use FormData for avatar
      body = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v) body.append(k, v);
      });
      headers = {};
    }
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers,
        body
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert(isLogin ? 'Login successful!' : 'Registration successful!');
        navigate('/flights');
      } else {
        alert(data.message || data.error || 'An error occurred');
      }
    } catch (err) {
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container modern-auth-container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form modern-auth-form">
          {!isLogin && (
            <>
              <div className="avatar-upload-section">
                <label className="avatar-upload-label">
                  <input type="file" name="avatar" accept="image/*" style={{display:'none'}} onChange={handleInputChange} />
                  <span className="avatar-upload-btn">{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                </label>
                {avatarPreview && <img src={avatarPreview} alt="avatar preview" className="register-avatar-preview" />}
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (optional)"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <input 
                type="date"
                name="dob"
                placeholder="Date of Birth (optional)"
                value={formData.dob}
                onChange={handleInputChange}
              />
              <textarea
                name="address"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="switch-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
