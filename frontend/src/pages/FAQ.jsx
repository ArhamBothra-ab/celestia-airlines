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
            <button className="faq-question" onClick={()=>setOpen(open===idx?null:idx)}>
              {item.q}
              <span className="faq-toggle">{open===idx?'−':'+'}</span>
            </button>
            <div className="faq-answer" style={{maxHeight: open===idx?120:0}}>
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
