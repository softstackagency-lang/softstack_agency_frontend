import PricingSection from "@/components/home/HomePricing/PricingSection"
import { StructuredData, generateBreadcrumbSchema } from "@/components/SEO/StructuredData";

export const metadata = {
  title: "Affordable Pricing Plans for Software Development",
  description: "Explore transparent and affordable pricing plans for custom software development, AI solutions, web development, mobile apps, and e-commerce services. Flexible packages for startups, SMBs, and enterprises. Get custom quotes and find the perfect plan for your business needs at SoftStack Agency.",
  keywords: ["software development pricing", "web development cost", "mobile app pricing", "AI development cost", "custom software pricing", "development packages", "affordable web development", "startup packages", "enterprise solutions pricing", "monthly retainer", "project-based pricing"],
  openGraph: {
    title: "Affordable Pricing Plans | SoftStack Agency",
    description: "Transparent pricing for software development, AI solutions, web and mobile apps. Flexible plans for startups and enterprises.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Software Development Pricing Plans'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pricing Plans | SoftStack",
    description: "Affordable and transparent pricing for software development services.",
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/pricing'
  }
};

export default function page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://softstackagency.com';
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Pricing', url: `${baseUrl}/pricing` }
  ];

  return (
    <div>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
      <PricingSection />
    </div>
  )
}