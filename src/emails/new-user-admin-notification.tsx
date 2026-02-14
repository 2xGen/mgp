
import * as React from 'react';

interface NewUserAdminNotificationEmailProps {
  newUserEmail: string | null;
  newUserName: string | null;
}

const NewUserAdminNotificationEmail: React.FC<Readonly<NewUserAdminNotificationEmailProps>> = ({ newUserEmail, newUserName }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h1 style={{ fontSize: '24px', color: '#09294c' }}>🎉 New User Sign-Up!</h1>
      <p>A new user has just created an account on MyGoProfile.</p>
      
      <div style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #eee' }}>
        <p><strong>Name:</strong> {newUserName || 'Not provided'}</p>
        <p><strong>Email:</strong> {newUserEmail || 'Not provided'}</p>
      </div>

      <p>You can view all user data in your admin dashboard.</p>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <a 
          href="https://mygoprofile.com/matthijs-data" 
          style={{ 
            backgroundColor: '#245295', 
            color: 'white', 
            padding: '12px 25px', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          Go to Admin Dashboard
        </a>
      </div>
      
      <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
        MyGoProfile | Dominate Local Search
      </p>
    </div>
  </div>
);

export default NewUserAdminNotificationEmail;
