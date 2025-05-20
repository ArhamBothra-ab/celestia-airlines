import React from 'react';

function NotFound() {
  return (
    <div className="page-container">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <a href="/" className="primary-btn">Go to Home</a>
    </div>
  );
}

export default NotFound;
