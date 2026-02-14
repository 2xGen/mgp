
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstname: string;
}

const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({ userFirstname }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h1 style={{ fontSize: '24px', color: '#09294c' }}>Welcome to MyGoProfile!</h1>
      <p>Hi {userFirstname},</p>
      <p>
        Thank you for signing up for MyGoProfile. We're thrilled to have you on board and can't wait to help you
        transform your Google Business Profile into a powerful tool for growth.
      </p>
      <p>With MyGoProfile, you can:</p>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Save time with AI-powered review replies.</li>
        <li>Gain valuable insights with our analytics dashboard.</li>
        <li>Manage multiple business locations with ease.</li>
        <li>Reply to reviews in minutes with AI and keep your GBP updated from one dashboard.</li>
      </ul>
      <p>To get started, simply log in to your dashboard and connect your Google Business Profile.</p>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <a 
          href="https://mygoprofile.com/login" 
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
      <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
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

export default WelcomeEmail;
