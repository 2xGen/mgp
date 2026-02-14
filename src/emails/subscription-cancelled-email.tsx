
import * as React from 'react';

interface SubscriptionCancelledEmailProps {
  userFirstname: string;
}

const SubscriptionCancelledEmail: React.FC<Readonly<SubscriptionCancelledEmailProps>> = ({ userFirstname }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h1 style={{ fontSize: '24px', color: '#f96153' }}>Your Subscription Has Ended</h1>
      <p>Hi {userFirstname},</p>
      <p>
        This email is to confirm that your MyGoProfile subscription has been cancelled, and your access to the dashboard has ended.
      </p>
      <p>
        We were sorry to see you go. If you have a moment, we'd love to hear any feedback you have about your experience. Your insights are invaluable and help us improve.
      </p>
      <p>
        If you change your mind, you can easily resubscribe and regain access to your dashboard and AI tools.
      </p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <a 
          href="https://mygoprofile.com/pricing" 
          style={{ 
            backgroundColor: '#245295', 
            color: 'white', 
            padding: '12px 25px', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          View Plans & Resubscribe
        </a>
      </div>
      <p>Thank you for being a part of the MyGoProfile community.</p>
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

export default SubscriptionCancelledEmail;
