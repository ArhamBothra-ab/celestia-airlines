import React from 'react';

function NotFound() {
  return (
    <div className="page-container notfound-page" role="alert" aria-label="404 Page Not Found">
      <h2 style={{color:'#b71c1c',fontWeight:700}}>404 - Page Not Found</h2>
      <p style={{color:'#444',marginBottom:24}}>The page you are looking for does not exist or has been moved.</p>
      <a href="/" className="primary-btn" style={{maxWidth:220}}>Go to Home</a>
    </div>
  );
}

export default NotFound;
