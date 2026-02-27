export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SoftStack Agency',
    url: 'https://softstackagency.com',
    logo: 'https://softstackagency.com/logo.png',
    description: 'Leading software development agency specializing in AI agents, web development, mobile apps, and e-commerce solutions.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@softstackagency.com',
      availableLanguage: ['English']
    },
    sameAs: [
      'https://www.linkedin.com/company/softstackagency',
      'https://twitter.com/softstackagency',
      'https://github.com/softstackagency',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    }
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SoftStack Agency',
    url: 'https://softstackagency.com',
    description: 'Premier software development company specializing in AI agents, machine learning, mobile app development, web development, and e-commerce solutions.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://softstackagency.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateServiceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.type,
    provider: {
      '@type': 'Organization',
      name: 'SoftStack Agency'
    },
    description: service.description,
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.type,
      itemListElement: service.offerings
    }
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: 'SoftStack Agency'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SoftStack Agency',
      logo: {
        '@type': 'ImageObject',
        url: 'https://softstackagency.com/logo.png'
      }
    }
  };
}

export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
