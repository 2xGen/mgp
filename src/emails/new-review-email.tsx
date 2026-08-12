import * as React from "react";

interface NewReviewEmailProps {
  userFirstname: string;
  businessName: string;
  starRating: string;
  reviewerName: string;
  comment: string;
  appUrl?: string;
}

const NewReviewEmail: React.FC<Readonly<NewReviewEmailProps>> = ({
  userFirstname,
  businessName,
  starRating,
  reviewerName,
  comment,
  appUrl = "https://mygoprofile.com",
}) => (
  <div
    style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      lineHeight: "1.6",
      color: "#1f2937",
      backgroundColor: "#f8fafc",
      padding: "24px 12px",
    }}
  >
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ backgroundColor: "#09294c", padding: "28px 32px" }}>
        <p
          style={{
            margin: 0,
            color: "#93c5fd",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
          }}
        >
          MyGoProfile
        </p>
        <h1
          style={{
            margin: "8px 0 0",
            fontSize: "24px",
            lineHeight: "1.25",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          New Google review
        </h1>
      </div>

      <div style={{ padding: "28px 32px" }}>
        <p style={{ margin: "0 0 16px", fontSize: "16px" }}>Hi {userFirstname},</p>
        <p style={{ margin: "0 0 16px", fontSize: "16px", color: "#374151" }}>
          <strong>{businessName}</strong> just received a new review on Google.
        </p>

        <div
          style={{
            margin: "0 0 20px",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 700, color: "#09294c" }}>
            {starRating} · {reviewerName}
          </p>
          <p style={{ margin: 0, fontSize: "15px", color: "#374151", whiteSpace: "pre-wrap" as const }}>
            {comment || "(No written comment)"}
          </p>
        </div>

        <div style={{ textAlign: "center", margin: "8px 0 8px" }}>
          <a
            href={`${appUrl}/dashboard`}
            style={{
              display: "inline-block",
              backgroundColor: "#245295",
              color: "#ffffff",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Reply in MyGoProfile
          </a>
        </div>
      </div>

      <div
        style={{
          padding: "16px 32px 24px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#9ca3af",
            textAlign: "center" as const,
          }}
        >
          You receive this because review alerts are enabled for your connected Google Business Profile.
        </p>
      </div>
    </div>
  </div>
);

export default NewReviewEmail;
