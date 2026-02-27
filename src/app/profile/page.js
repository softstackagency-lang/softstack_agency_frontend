import Profile from '@/components/profile/Profile'

export default function ProfilePage() {
  return <Profile />
}

export const metadata = {
  title: 'User Profile - Manage Your Account',
  description: 'Manage your SoftStack Agency account profile, update personal information, view project history, track orders, and configure account settings. Secure user dashboard for clients and partners.',
  keywords: ["user profile", "account management", "profile settings", "user dashboard", "account settings"],
  openGraph: {
    title: 'User Profile | SoftStack Agency',
    description: 'Manage your account, projects, and settings on SoftStack Agency platform.',
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'User Profile Dashboard'
    }]
  },
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/profile'
  }
}