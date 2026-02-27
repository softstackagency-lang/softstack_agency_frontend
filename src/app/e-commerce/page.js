import Ecommerce from '@/components/home/HomeEcommerce/Ecommerce'

export const metadata = {
  title: "E-commerce Development Solutions",
  description: "Build powerful online stores and e-commerce platforms with custom shopping cart, payment gateway integration, inventory management, and multi-vendor marketplace solutions. Shopify, WooCommerce, Magento, and custom e-commerce development services for B2B and B2C businesses. Secure, scalable, and conversion-optimized online stores.",
  keywords: ["e-commerce development", "online store development", "shopping cart development", "shopify development", "woocommerce development", "magento development", "payment gateway integration", "marketplace development", "multi-vendor platform", "B2B e-commerce", "B2C e-commerce", "mobile commerce", "inventory management system", "order management"],
  openGraph: {
    title: "E-commerce Development Solutions | SoftStack Agency",
    description: "Custom e-commerce platforms, online stores, marketplace development with payment integration. Shopify, WooCommerce, and custom solutions for online businesses.",
    images: [{
      url: '/e-commerce.jpg',
      width: 1200,
      height: 630,
      alt: 'E-commerce Development Solutions'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "E-commerce Solutions | SoftStack",
    description: "Custom online stores and e-commerce platforms with secure payment integration.",
    images: ['/e-commerce.jpg']
  },
  alternates: {
    canonical: '/e-commerce'
  }
};

import React from 'react'

function page() {
  return (
    <div>
      <Ecommerce />
    </div>
  )
}

export default page