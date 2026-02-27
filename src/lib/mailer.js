import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification email function
export const sendVerificationEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: {
        name: 'SoftStack Agency',
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
