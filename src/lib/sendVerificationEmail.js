import { transporter } from "./mailer";

export async function sendVerificationEmail({ email, url }) {
  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the button below to verify your email:</p>
      <a 
        href="${url}" 
        style="
          display:inline-block;
          padding:10px 16px;
          background:#2563eb;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify Email
      </a>
      <p>If you did not create this account, ignore this email.</p>
    `,
  });
}
