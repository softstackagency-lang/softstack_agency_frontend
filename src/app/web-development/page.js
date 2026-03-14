import WebPage from '@/components/Services/webDev/WebPage'
import { StructuredData, generateServiceSchema, generateBreadcrumbSchema } from "@/components/SEO/StructuredData";

export const metadata = {
  title: "Professional Web Development Services",
  description: "Expert web development services using React, Next.js, Node.js, and modern technologies. Custom websites, web applications, progressive web apps, responsive design, SaaS platforms, and enterprise web solutions. Full-stack development team delivering scalable, secure, and high-performance web applications.",
  keywords: ["web development", "website development", "web application development", "react development", "next.js development", "node.js development", "full-stack development", "responsive web design", "progressive web apps", "PWA development", "SaaS development", "enterprise web solutions", "custom website", "web portal development"],
  openGraph: {
    title: "Professional Web Development Services | SoftStack Agency",
    description: "Custom web development using React, Next.js, Node.js. Build scalable web applications, responsive websites, and enterprise solutions with expert developers.",
    images: [{
      url: '/view-3d-laptop-device-with-screen-keyboard (1).jpg',
      width: 1200,
      height: 630,
      alt: 'Professional Web Development Services'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Web Development Services | SoftStack",
    description: "Custom web applications and responsive websites using modern technologies.",
    images: ['/view-3d-laptop-device-with-screen-keyboard (1).jpg']
  },
  alternates: {
    canonical: '/web-development'
  }
};

const webDevService = {
  type: "Web Development",
  description: "Expert web development services using React, Next.js, and Node.js.",
  offerings: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web App Development' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-commerce Solutions' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'API Development' } }
  ]
};

export default function page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://softstackagency.com';
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Services', url: `${baseUrl}/#services` },
    { name: 'Web Development', url: `${baseUrl}/web-development` }
  ];

  return (
    <div>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbs)} />
      <StructuredData data={generateServiceSchema(webDevService)} />
      <WebPage />
    </div>
  )
}