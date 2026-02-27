import DocumentationPage from '@/components/home/HomeDocs/DocumentationPage'

export const metadata = {
  title: "Documentation - API Docs & Integration Guides",
  description: "Comprehensive technical documentation, API references, integration guides, code examples, SDK documentation, and developer resources for SoftStack Agency products and services. Learn how to integrate our solutions, use APIs, implement features, and build with our platform effectively.",
  keywords: ["documentation", "API documentation", "developer docs", "integration guides", "technical documentation", "API reference", "SDK documentation", "code examples", "developer resources", "implementation guides"],
  openGraph: {
    title: "Documentation & API Guides | SoftStack Agency",
    description: "Complete technical documentation, API references, and integration guides for developers. Build with our platform.",
    images: [{
      url: '/banner1.jpg',
      width: 1200,
      height: 630,
      alt: 'Technical Documentation'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation | SoftStack',
    description: 'Technical docs, API references, and integration guides for developers.',
    images: ['/banner1.jpg']
  },
  alternates: {
    canonical: '/docs'
  }
};

import React from 'react'

function page() {
  return (
    <div>
        <DocumentationPage />
        

    </div>
  )
}

export default page