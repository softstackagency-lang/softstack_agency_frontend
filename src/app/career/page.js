import CareerPage from '@/components/home/HomeCareer/CareerPage'

export const metadata = {
  title: "Careers & Job Opportunities - Join Our Team",
  description: "Join the SoftStack Agency team and build your career in technology! Explore exciting job opportunities in software development, AI engineering, web development, mobile app development, UI/UX design, DevOps, data science, and more. Work with cutting-edge technologies, remote positions available, competitive salary, and great benefits.",
  keywords: ["careers", "job opportunities", "software developer jobs", "AI engineer jobs", "web developer jobs", "mobile developer jobs", "UI/UX designer jobs", "tech careers", "remote jobs", "developer positions", "engineering jobs", "technology careers"],
  openGraph: {
    title: "Careers & Jobs | SoftStack Agency",
    description: "Join our team of talented developers, designers, and engineers. Exciting career opportunities in software development and technology.",
    images: [{
      url: '/image-1.jpg',
      width: 1200,
      height: 630,
      alt: 'Career Opportunities at SoftStack Agency'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at SoftStack',
    description: 'Join our team and build the future of technology.',
    images: ['/image-1.jpg']
  },
  alternates: {
    canonical: '/career'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <CareerPage />
        

    </div>
  )
}

export default page