import PricingCategoryComponent from '@/components/Dashboard/DashboardPricing/PricingCategoryComponent'
import React from 'react'

export const metadata = {
  title: "Pricing Category Management",
  description: "Manage categories and groups for pricing plans.",
  robots: { index: false, follow: false }
};

export default function page() {
  return (
    <div>
      <PricingCategoryComponent/>
    </div>
  )
}
