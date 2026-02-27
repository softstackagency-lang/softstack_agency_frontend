import WebPage from '@/components/Services/webDev/WebPage'

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

import React from 'react'

function page() {
  return (
    <div>
        
        <WebPage />

    </div>
  )
}

export default page