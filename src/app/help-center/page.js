import HelpCenterPage from '@/components/home/HomeHelpCenter/HelpCenterPage'

export const metadata = {
  title: "Help Center & Support - FAQs & Resources",
  description: "Find comprehensive answers to questions about our software development services, AI solutions, web development, mobile apps, e-commerce, pricing, project process, technical support, and more. Access FAQs, tutorials, guides, documentation, and support resources at SoftStack Agency Help Center.",
  keywords: ["help center", "support", "FAQ", "frequently asked questions", "customer support", "technical support", "help documentation", "user guides", "tutorials", "support resources"],
  openGraph: {
    title: "Help Center & Support | SoftStack Agency",
    description: "Find answers, guides, and support resources for all our services. Comprehensive FAQ and documentation.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Help Center & Support'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center | SoftStack',
    description: 'Get support and find answers to your questions.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/help-center'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <HelpCenterPage/>
        

    </div>
  )
}

export default page