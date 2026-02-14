
import * as React from 'react';

interface SubscriptionActiveEmailProps {
  userFirstname: string;
  planName: string;
}

const SubscriptionActiveEmail: React.FC<Readonly<SubscriptionActiveEmailProps>> = ({ userFirstname, planName }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h1 style={{ fontSize: '24px', color: '#09294c' }}>Subscription Activated!</h1>
      <p>Hi {userFirstname},</p>
      <p>
        Thank you for subscribing! Your <strong>MyGoProfile {planName} plan</strong> is now active. You have full access to all the features included in your plan.
      </p>
      <p>
        We're excited to help you dominate local search and grow your business.
      </p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <a 
          href="https://mygoprofile.com/dashboard" 
          style={{ 
            backgroundColor: '#245295', 
            color: 'white', 
            padding: '12px 25px', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          Go to Your Dashboard
        </a>
      </div>
      <p>You can manage your subscription, view invoices, and update your payment method at any time from your account settings.</p>
      <p>
        Best,
        <br />
        The MyGoProfile Team
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
      <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
        MyGoProfile | Dominate Local Search
      </p>
    </div>
  </div>
);

export default SubscriptionActiveEmail;
