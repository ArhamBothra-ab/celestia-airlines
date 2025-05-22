import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { notify } from '../services/toast';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', dob: '', address: '', avatar: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [message, setMessage] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '',
        dob: payload.dob || '',
        address: payload.address || '',
        avatar: payload.avatar || '',
        joined: payload.joined || '',
      });
      setForm({
        name: payload.name || '',
        email: payload.email || '',
        phone: payload.phone || '',
        dob: payload.dob || '',
        address: payload.address || '',
        avatar: payload.avatar || ''
      });
    } catch {
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-page-fx animate-fadein">
        <div className="profile-card modern-profile-card">
          <img src="https://ui-avatars.com/api/?name=User&background=f1c40f&color=002147&size=128" alt="avatar" className="profile-avatar" />
          <h2 className="profile-title">My Profile</h2>
          <p style={{color:'#888', marginBottom:24}}>Please log in to view your profile.</p>
          <a href="/auth" className="primary-btn" style={{width:'100%',maxWidth:220}}>Login / Register</a>
        </div>
      </div>
    );
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Avatar upload handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const data = await api.uploadAvatar(formData);
      setAvatarUploading(false);
      if (data.avatarUrl) {
        setUser(u => ({ ...u, avatar: data.avatarUrl }));
        setForm(f => ({ ...f, avatar: data.avatarUrl }));
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.dispatchEvent(new CustomEvent('tokenUpdate', { detail: data.token }));
        }
        notify.success('Profile picture updated successfully!');
      }
    } catch (err) {
      setAvatarUploading(false);
      notify.error(err.message || 'Failed to update profile picture');
    }
  };
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!form.name || !form.email) {
        notify.error('Name and email are required');
        return;
      }

      // Format the date to YYYY-MM-DD before sending
      const formData = {
        ...form,
        phone: form.phone || null,
        dob: form.dob ? form.dob.split('T')[0] : null,
        address: form.address || null
      };

      const data = await api.updateProfile(formData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new CustomEvent('tokenUpdate', { detail: data.token }));
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUser({
          name: payload.name,
          email: payload.email,
          phone: payload.phone || '',
          dob: payload.dob ? payload.dob.split('T')[0] : '',
          address: payload.address || '',
          avatar: payload.avatar || '',
          joined: payload.joined || ''
        });
        setEditMode(false);
        notify.success('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      notify.error(err.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.changePassword(passwords);
      setPasswords({ current: '', new: '' });
      notify.success('Password changed successfully!');
    } catch (err) {
      notify.error(err.message || 'Failed to change password');
    }
  };

  return (
    <div className="profile-page-fx animate-fadein">
      <div className="profile-card modern-profile-card">
        <div className="profile-avatar-section">
          <img
            src={user.avatar ? 
              `http://localhost:5000${user.avatar}` : 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'User')}&background=f1c40f&color=002147&size=128`
            }
            alt="User avatar"
            className="profile-avatar large-avatar"
          />
          <div className="avatar-upload-wrap">
            <label className="avatar-upload-label">
              <input name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} style={{display:'none'}} />
              <span className="avatar-upload-btn">{avatarUploading ? 'Uploading...' : 'Change Photo'}</span>
            </label>
          </div>
        </div>
        <div className="profile-info-list">
          <div className="profile-info-row"><span className="profile-info-label">Name:</span> <span>{user.name || 'Not provided'}</span></div>
          <div className="profile-info-row"><span className="profile-info-label">Email:</span> <span>{user.email || 'Not provided'}</span></div>
          <div className="profile-info-row"><span className="profile-info-label">Phone:</span> <span>{user.phone || 'Not provided'}</span></div>
          <div className="profile-info-row">
            <span className="profile-info-label">Date of Birth:</span>
            <span>{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</span>
          </div>
          <div className="profile-info-row"><span className="profile-info-label">Address:</span> <span>{user.address || 'Not provided'}</span></div>
        </div>
        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="profile-form modern-profile-form">
            <label>Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>Phone
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} />
            </label>
            <label>Date of Birth
              <input 
                name="dob" 
                type="date" 
                value={form.dob ? form.dob.split('T')[0] : ''} 
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
            </label>
            <label>Address
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} />
            </label>
            <div className="profile-form-btns">
              <button type="submit" className="primary-btn">Save</button>
              <button type="button" className="secondary-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="primary-btn" style={{marginTop:16, width:'100%',maxWidth:220}} onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
        <form onSubmit={handlePasswordUpdate} className="profile-form modern-profile-form" style={{marginTop:32}}>
          <h3 style={{marginBottom:8, color:'#1a237e'}}>Change Password</h3>
          <label>Current Password
            <input name="current" type="password" value={passwords.current} onChange={handlePasswordChange} required />
          </label>
          <label>New Password
            <input name="new" type="password" value={passwords.new} onChange={handlePasswordChange} required />
          </label>
          <button type="submit" className="primary-btn" style={{marginTop:8}}>Change Password</button>
        </form>
        {message && <div style={{marginTop:16, color:'#1a237e', textAlign:'center'}}>{message}</div>}
      </div>
    </div>
  );
}

export default Profile;
