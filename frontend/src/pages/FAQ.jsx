import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    q: 'How do I book a flight?',
    a: 'Go to the Flights page, select your route and date, then follow the booking steps.'
  },
  {
    q: 'Can I change or cancel my booking?',
    a: 'Yes, you can manage your bookings from the My Bookings page.'
  },
  {
    q: 'How do I contact support?',
    a: 'Use the Contact page to send us a message, or email support@celestia.com.'
  },
  {
    q: 'Is my payment secure?',
    a: 'All payments are processed securely with industry-standard encryption.'
  },
  {
    q: 'How do I access my tickets?',
    a: 'After booking and payment, your tickets will be available on the Tickets page.'
  }
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-page-fx animate-fadein">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((item, idx) => (
          <div className={`faq-card ${open===idx?'open':''}`} key={idx}>
            <div className="faq-card-header">
              <div className="faq-avatar" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#e0e7ff"/>
                  <path d="M16 17c2.5 0 4.5-2 4.5-4.5S18.5 8 16 8s-4.5 2-4.5 4.5S13.5 17 16 17zm0 2c-3 0-9 1.5-9 4.5V26h18v-2.5c0-3-6-4.5-9-4.5z" fill="#6366f1"/>
                </svg>
              </div>
              <button className="faq-question" onClick={()=>setOpen(open===idx?null:idx)} aria-expanded={open===idx} aria-controls={`faq-answer-${idx}`}> 
                {item.q}
                <span className="faq-toggle">{open===idx?'−':'+'}</span>
              </button>
            </div>
            <div className="faq-answer" id={`faq-answer-${idx}`} style={{maxHeight: open===idx?200:0, transition: 'max-height 0.4s cubic-bezier(.4,0,.2,1)'}} aria-hidden={open!==idx}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
