import TutorialsPage from '@/components/home/HomeTutorial/TutorialsPage'

export const metadata = {
  title: "Tutorials & Learning Guides - Step-by-Step Resources",
  description: "Learn with expert step-by-step tutorials, video guides, and learning resources covering web development, React, Next.js, AI implementation, machine learning, mobile app development, Python, JavaScript, Node.js, and more from SoftStack Agency technology experts. Free educational content for developers and learners.",
  keywords: ["tutorials", "programming tutorials", "web development tutorials", "AI tutorials", "mobile app tutorials", "coding guides", "learning resources", "developer tutorials", "step-by-step guides", "video tutorials", "programming courses"],
  openGraph: {
    title: "Tutorials & Learning Guides | SoftStack Agency",
    description: "Free tutorials and guides for web development, AI, mobile apps, and programming. Learn from expert developers.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Programming Tutorials'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutorials | SoftStack',
    description: 'Step-by-step tutorials for developers and tech enthusiasts.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/tutorial'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <TutorialsPage />
        

    </div>
  )
}

export default page