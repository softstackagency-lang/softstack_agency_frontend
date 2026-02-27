import CustomersPage from '@/components/home/HomeCustomer/CustomerPage'

export const metadata = {
  title: "Our Clients & Success Stories - Case Studies",
  description: "Discover how SoftStack Agency has helped businesses, startups, and enterprises transform digitally with custom software, AI solutions, web development, and mobile apps. Read success stories, case studies, client testimonials, and reviews from our satisfied clients worldwide. See real results and business impact.",
  keywords: ["client success stories", "case studies", "client testimonials", "customer reviews", "portfolio", "success cases", "client projects", "business transformation", "digital transformation stories"],
  openGraph: {
    title: "Our Clients & Success Stories | SoftStack Agency",
    description: "Real success stories and testimonials from businesses we've helped transform digitally. See case studies and client projects.",
    images: [{
      url: '/image-1.jpg',
      width: 1200,
      height: 630,
      alt: 'Client Success Stories'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Client Success Stories | SoftStack',
    description: 'Real results from businesses we helped transform with technology.',
    images: ['/image-1.jpg']
  },
  alternates: {
    canonical: '/customer'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <CustomersPage />
        

    </div>
  )
}

export default page