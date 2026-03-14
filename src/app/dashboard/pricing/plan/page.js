import PricingPlanComponent from '@/components/Dashboard/DashboardPricing/PricingPlanComponent'
import React from 'react'

export const metadata = {
  title: "Pricing Plan Management",
  description: "Manage specific pricing plans, features, and tiers.",
  robots: { index: false, follow: false }
};

export default function page() {
  return (
    <div>
      <PricingPlanComponent/>
    </div>
  )
}
