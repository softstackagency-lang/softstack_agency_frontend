import CookiePolicy from '@/components/home/HomePolicies/CookiePolicy'

export const metadata = {
  title: "Cookie Policy - How We Use Cookies",
  description: "Learn about how SoftStack Agency uses cookies, tracking technologies, and similar technologies to enhance your browsing experience, improve website functionality, analytics, personalization, and user preferences. Understand cookie types, management options, and your privacy choices.",
  keywords: ["cookie policy", "cookies usage", "tracking technologies", "web cookies", "browser cookies", "cookie consent", "cookie management", "privacy preferences"],
  openGraph: {
    title: "Cookie Policy | SoftStack Agency",
    description: "Learn how we use cookies and tracking technologies to enhance your experience. Cookie management and privacy options.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Cookie Policy'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | SoftStack',
    description: 'How we use cookies to enhance your browsing experience.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/cookie-policy'
  }
};

export default function CookiePolicyPage() {
  return <CookiePolicy />
}
