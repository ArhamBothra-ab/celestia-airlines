import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.name, email: payload.email });
      setForm({ name: payload.name || '', email: payload.email || '' });
    } catch {
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-page-fx animate-fadein">
        <div className="profile-card">
          <img src="https://ui-avatars.com/api/?name=User&background=f1c40f&color=002147&size=128" alt="avatar" className="profile-avatar" />
          <h2 className="profile-title">My Profile</h2>
          <p style={{color:'#888', marginBottom:24}}>Please log in to view your profile.</p>
          <a href="/auth" className="primary-btn" style={{width:'100%',maxWidth:220}}>Login / Register</a>
        </div>
      </div>
    );
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = e => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleProfileUpdate = async e => {
    e.preventDefault();
    setMessage('');
    // TODO: Replace with real API call
    setUser({ ...user, ...form });
    setEditMode(false);
    setMessage('Profile updated (demo only).');
  };

  const handlePasswordUpdate = async e => {
    e.preventDefault();
    setMessage('');
    // TODO: Replace with real API call
    setPasswords({ current: '', new: '' });
    setMessage('Password changed (demo only).');
  };

  return (
    <div className="profile-page-fx animate-fadein">
      <h2 className="profile-title">My Profile</h2>
      <div className="profile-card">
        <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'User')}&background=f1c40f&color=002147&size=128`} alt="avatar" className="profile-avatar" />
        <div className="profile-info">
          <div><strong>Name:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
          {user.joined && <div><strong>Joined:</strong> {user.joined}</div>}
        </div>
        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <label>Name<br />
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>Email<br />
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button type="submit" className="primary-btn">Save</button>
              <button type="button" className="secondary-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="primary-btn" style={{marginTop:16, width:'100%',maxWidth:220}} onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
        <form onSubmit={handlePasswordUpdate} className="profile-form" style={{marginTop:24}}>
          <h3 style={{marginBottom:8}}>Change Password</h3>
          <label>Current Password<br />
            <input name="current" type="password" value={passwords.current} onChange={handlePasswordChange} required />
          </label>
          <label>New Password<br />
            <input name="new" type="password" value={passwords.new} onChange={handlePasswordChange} required />
          </label>
          <button type="submit" className="primary-btn" style={{marginTop:8}}>Change Password</button>
        </form>
        {message && <div style={{marginTop:12, color:'#1a237e'}}>{message}</div>}
      </div>
    </div>
  );
}

export default Profile;
