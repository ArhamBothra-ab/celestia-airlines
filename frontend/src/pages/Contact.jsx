import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200); // Simulate async
  };

  return (
    <div className="contact-page-fx">
      <h2 className="contact-title">Contact Us</h2>
      <div className="contact-card animate-fadein">
        {submitted ? (
          <div className="contact-success">
            <span className="contact-success-icon">✅</span>
            <p>Thank you for reaching out! We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required />
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <span className="contact-spinner"></span> : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
