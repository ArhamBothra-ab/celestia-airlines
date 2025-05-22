import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    q: 'What\'s included in my ticket price?',
    a: 'Our standard ticket includes: carry-on baggage (8kg), seat selection, in-flight entertainment, and complimentary snacks and beverages. Business Class tickets include additional baggage allowance (2x23kg), premium meals, lounge access, and priority boarding.'
  },
  {
    q: 'How can I check in for my flight?',
    a: 'You can check in online through our website or mobile app starting 48 hours before departure. Airport check-in opens 3 hours before departure and closes 1 hour before departure. We recommend online check-in for a smoother experience.'
  },
  {
    q: 'What is your baggage policy?',
    a: 'Economy Class: 1x8kg carry-on + 1x23kg checked bag. Business Class: 1x8kg carry-on + 2x23kg checked bags. Additional baggage can be purchased online before your flight at discounted rates compared to airport rates.'
  },
  {
    q: 'How do I handle flight changes or cancellations?',
    a: 'Visit "My Bookings" to manage your reservation. Changes can be made up to 24 hours before departure. Cancellations within 24 hours of booking are free. After that, fees may apply based on your ticket type and timing.'
  },
  {
    q: 'Do you offer special assistance for passengers with disabilities?',
    a: 'Yes, we provide various assistance services including wheelchair support, priority boarding, and special meal options. Please request assistance at least 48 hours before your flight through our Contact page or customer service.'
  },
  {
    q: 'What are your COVID-19 safety measures?',
    a: 'We maintain high sanitation standards with regular aircraft cleaning, HEPA air filtration, and follow all local health guidelines. Check our latest travel requirements and safety measures on our website before your flight.'
  },
  {
    q: 'How does your loyalty program work?',
    a: 'Earn Celestia Miles on every flight and partner services. Miles can be redeemed for free flights, upgrades, and other rewards. Status levels include Silver, Gold, and Platinum, each offering exclusive benefits.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, PayPal, and bank transfers. For certain routes, we also offer installment payment plans. All payments are processed securely with industry-standard encryption.'
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
              <button 
                className="faq-question" 
                onClick={()=>setOpen(open===idx?null:idx)} 
                aria-expanded={open===idx} 
                aria-controls={`faq-answer-${idx}`}
              > 
                {item.q}
                <span className="faq-toggle">{open===idx?'−':'+'}</span>
              </button>
            </div>
            <div 
              className="faq-answer" 
              id={`faq-answer-${idx}`} 
              style={{maxHeight: open===idx?500:0}} 
              aria-hidden={open!==idx}
            >
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
