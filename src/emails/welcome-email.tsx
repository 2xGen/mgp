import * as React from 'react';

interface WelcomeEmailProps {
  userFirstname: string;
  appUrl?: string;
}

const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  userFirstname,
  appUrl = 'https://mygoprofile.com',
}) => (
  <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: '1.6', color: '#1f2937', backgroundColor: '#f8fafc', padding: '24px 12px' }}>
    <div style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <div style={{ backgroundColor: '#09294c', padding: '28px 32px' }}>
        <p style={{ margin: 0, color: '#93c5fd', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
          MyGoProfile
        </p>
        <h1 style={{ margin: '8px 0 0', fontSize: '26px', lineHeight: '1.25', color: '#ffffff', fontWeight: 700 }}>
          Your Google Business Profile, on autopilot
        </h1>
      </div>

      <div style={{ padding: '28px 32px' }}>
        <p style={{ margin: '0 0 16px', fontSize: '16px' }}>Hi {userFirstname},</p>
        <p style={{ margin: '0 0 16px', fontSize: '16px', color: '#374151' }}>
          Welcome aboard. MyGoProfile finds what&apos;s holding your Google Business Profile back,
          tells you what to fix next, and uses AI to help you fix it — from one dashboard.
        </p>

        <p style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: '#09294c' }}>
          Get set up in three steps:
        </p>
        <ol style={{ margin: '0 0 20px', paddingLeft: '20px', color: '#374151', fontSize: '15px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Start your free trial</strong> (14 days, no credit card) if you haven&apos;t yet.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Connect Google Business Profile</strong> securely with Google OAuth.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Check Profile Health</strong> and work through your prioritized action list.
          </li>
        </ol>

        <p style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: '#09294c' }}>
          What you get on every plan:
        </p>
        <ul style={{ margin: '0 0 24px', paddingLeft: '20px', color: '#374151', fontSize: '15px' }}>
          <li style={{ marginBottom: '6px' }}>Profile Health score &amp; diagnosis</li>
          <li style={{ marginBottom: '6px' }}>Prioritized “what to do next” actions</li>
          <li style={{ marginBottom: '6px' }}>AI review reply drafts &amp; AI Google posts</li>
          <li style={{ marginBottom: '6px' }}>Review request kit &amp; performance insights</li>
        </ul>

        <div style={{ textAlign: 'center', margin: '8px 0 24px' }}>
          <a
            href={`${appUrl}/welcome`}
            style={{
              display: 'inline-block',
              backgroundColor: '#245295',
              color: '#ffffff',
              padding: '14px 28px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            Continue setup
          </a>
        </div>

        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
          Prefer to jump in?{' '}
          <a href={`${appUrl}/login`} style={{ color: '#245295' }}>
            Log in to your dashboard
          </a>
          .
        </p>

        <p style={{ margin: 0, fontSize: '15px', color: '#374151' }}>
          Questions? Just reply to this email — we read every message.
        </p>
        <p style={{ margin: '16px 0 0', fontSize: '15px', color: '#374151' }}>
          Best,
          <br />
          The MyGoProfile Team
        </p>
      </div>

      <div style={{ padding: '16px 32px 24px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const }}>
          MyGoProfile · GBP management software ·{' '}
          <a href={`${appUrl}/pricing`} style={{ color: '#6b7280' }}>
            Pricing
          </a>
          {' · '}
          <a href={`${appUrl}/resources`} style={{ color: '#6b7280' }}>
            Guides
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default WelcomeEmail;
