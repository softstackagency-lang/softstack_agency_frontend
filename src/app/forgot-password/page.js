import ForgotPasswordPage from '@/components/header/Fogotpass';

export const metadata = {
  title: "Forgot Password - Reset Account Password",
  description: "Reset your SoftStack Agency account password securely. Enter your email address to receive password reset instructions and regain access to your account. Safe and secure password recovery process.",
  keywords: ["forgot password", "reset password", "password recovery", "account recovery", "password reset"],
  openGraph: {
    title: "Forgot Password | SoftStack Agency",
    description: "Securely reset your account password and regain access to your SoftStack Agency account.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Password Reset'
    }]
  },
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/forgot-password'
  }
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}