import PrivacyPolicy from '@/components/home/HomePolicies/PrivacyPolicy'

export const metadata = {
  title: "Privacy Policy - Data Protection & Security",
  description: "Read SoftStack Agency comprehensive privacy policy. Learn how we collect, use, store, and protect your personal information, data security practices, GDPR compliance, user rights, data processing, and our commitment to privacy protection. Transparent information about cookies, analytics, and third-party services.",
  keywords: ["privacy policy", "data protection", "GDPR compliance", "data security", "personal information", "privacy rights", "data processing", "user privacy", "information security"],
  openGraph: {
    title: "Privacy Policy | SoftStack Agency",
    description: "Learn how we protect your personal information and ensure data security. Comprehensive privacy policy and GDPR compliance.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Privacy Policy'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | SoftStack',
    description: 'Data protection and privacy practices at SoftStack Agency.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/privacy-policy'
  }
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />
}
