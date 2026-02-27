import OurProjects from '@/components/product/OurProjects'

export const metadata = {
  title: "Demo Projects & Portfolio - Live Examples",
  description: "Explore our demo projects, live examples, and portfolio showcasing innovative software solutions in web development, mobile applications, AI agents, e-commerce platforms, and custom software by SoftStack Agency. See working demonstrations, interactive prototypes, and real-world implementations.",
  keywords: ["demo projects", "portfolio", "project showcase", "live demos", "examples", "case studies", "web demos", "mobile app demos", "AI demos", "project gallery", "our work"],
  openGraph: {
    title: "Demo Projects & Portfolio | SoftStack Agency",
    description: "Explore live demos and portfolio of innovative web, mobile, AI, and e-commerce solutions. See our work in action.",
    images: [{
      url: '/app.jpg',
      width: 1200,
      height: 630,
      alt: 'Demo Projects Portfolio'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio & Demos | SoftStack',
    description: 'Live demos and examples of our innovative software solutions.',
    images: ['/app.jpg']
  },
  alternates: {
    canonical: '/demo'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <OurProjects />
        

    </div>
  )
}

export default page