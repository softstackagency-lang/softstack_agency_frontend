import TermsOfService from '@/components/home/HomePolicies/TermsOfService'

export const metadata = {
  title: "Terms of Service - User Agreement & Guidelines",
  description: "Read SoftStack Agency terms of service and user agreement. Understand the rules, guidelines, rights, responsibilities, service usage policies, intellectual property rights, and legal terms for using our software development services, platform, and digital solutions.",
  keywords: ["terms of service", "user agreement", "terms and conditions", "service agreement", "legal terms", "usage policy", "user guidelines", "service terms"],
  openGraph: {
    title: "Terms of Service | SoftStack Agency",
    description: "User agreement and guidelines for using SoftStack Agency services and platform. Legal terms and conditions.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Terms of Service'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | SoftStack',
    description: 'User agreement and service guidelines for SoftStack Agency.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/terms-of-service'
  }
};

export default function TermsOfServicePage() {
  return <TermsOfService />
}
