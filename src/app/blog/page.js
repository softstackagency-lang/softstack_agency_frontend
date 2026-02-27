import BlogPage from '@/components/home/HomeBlog/BlogPage'

export const metadata = {
  title: "Tech Blog - Software Development Insights & Tutorials",
  description: "Stay updated with latest trends, best practices, and expert insights in software development, artificial intelligence, web development, mobile apps, and technology. Read tutorials, guides, case studies, and industry news from SoftStack Agency developers and tech experts.",
  keywords: ["software development blog", "tech blog", "programming tutorials", "AI insights", "web development tips", "mobile app development", "technology trends", "coding tutorials", "developer blog", "software engineering", "tech articles", "industry insights"],
  openGraph: {
    title: "Tech Blog & Insights | SoftStack Agency",
    description: "Expert insights, tutorials, and trends in software development, AI, web development, and technology.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'SoftStack Agency Tech Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Blog | SoftStack',
    description: 'Latest insights and tutorials in software development and technology.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/blog'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <BlogPage />
        

    </div>
  )
}

export default page