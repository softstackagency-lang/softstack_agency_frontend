import { Suspense } from 'react';
// import ResetPasswordPage from '@/components/auth/ResetPassword';

export const metadata = {
  title: "Reset Password - Create New Password",
  description: "Create a new secure password for your SoftStack Agency account. Complete the password reset process safely and regain full access to your account dashboard, projects, and services.",
  keywords: ["reset password", "new password", "change password", "password update", "secure password"],
  openGraph: {
    title: "Reset Password | SoftStack Agency",
    description: "Create a new secure password for your SoftStack Agency account.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Reset Password'
    }]
  },
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/reset-password'
  }
};

function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      {/* <ResetPasswordPage /> */}
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>Reset Password page - Under construction</p>
      </div>
    </Suspense>
  );
}