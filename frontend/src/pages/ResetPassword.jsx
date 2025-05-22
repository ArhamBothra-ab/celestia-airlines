import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { notify } from '../services/toast';
import './ResetPassword.css';
import { FaLock } from 'react-icons/fa';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.requestPasswordReset({ email });
      notify.success('Password reset instructions have been sent to your email');
    } catch (err) {
      notify.error(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword({ token, newPassword });
      notify.success('Password has been reset successfully');
      navigate('/auth');
    } catch (err) {
      notify.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <h2>Reset Password</h2>
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <div className="input-group">
              <FaLock />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword} className="reset-password-form">
          <div className="input-group">
            <FaLock />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
