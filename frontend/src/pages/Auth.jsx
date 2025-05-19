import { useState } from 'react';
import { FaLock, FaUser, FaPlane, FaUserPlus, FaGift, FaRocket } from 'react-icons/fa';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="page-container">
      {isLogin ? (
        <>
          <h2><FaLock /> Login</h2>
          <p>Access your personalized dashboard easily.</p>
          <ul className="features-list">
            <li><FaLock /> Secure login with encryption</li>
            <li><FaUser /> Manage your profile and preferences</li>
            <li><FaPlane /> Access special member deals</li>
          </ul>
          <button className="primary-btn">Sign In</button>
          <p style={{ marginTop: '20px' }}>
            Don't have an account?{' '}
            <span
              style={{ color: '#003366', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => setIsLogin(false)}
            >
              Register here
            </span>
          </p>
        </>
      ) : (
        <>
          <h2><FaUserPlus /> Register</h2>
          <p>Join Celestia Airlines and explore new horizons!</p>
          <ul className="features-list">
            <li><FaUserPlus /> Quick and easy sign-up</li>
            <li><FaGift /> Earn loyalty points on first booking</li>
            <li><FaRocket /> Get access to premium services</li>
          </ul>
          <button className="primary-btn">Create Account</button>
          <p style={{ marginTop: '20px' }}>
            Already have an account?{' '}
            <span
              style={{ color: '#003366', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => setIsLogin(true)}
            >
              Login here
            </span>
          </p>
        </>
      )}
    </div>
  );
}

export default Auth;
