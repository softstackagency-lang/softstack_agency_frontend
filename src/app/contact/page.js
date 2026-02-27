import ContactPage from '@/components/home/HomeContact/ContactPage'

export const metadata = {
  title: "Contact Us - Get in Touch with Our Development Team",
  description: "Contact SoftStack Agency for custom software development, AI solutions, web and mobile app consultations. Get free project estimates, technical consultation, and discuss your development needs with our expert team. We're here to help transform your ideas into reality.",
  keywords: ["contact software development", "free consultation", "project estimate", "software development inquiry", "custom software quote", "technical consultation", "development team contact", "software agency contact", "get in touch", "business inquiry"],
  openGraph: {
    title: "Contact Us | SoftStack Agency",
    description: "Get in touch for custom software development, AI solutions, and project consultations. Free estimates and expert guidance.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Contact SoftStack Agency'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact SoftStack Agency",
    description: "Get free consultation and project estimates from our expert development team.",
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/contact'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <ContactPage />
        

    </div>
  )
}

export default page