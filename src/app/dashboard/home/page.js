import HomeManagementComponent from '@/components/Dashboard/DashboadHome/HomeManagementComponent'
import React from 'react'

export const metadata = {
  title: "Home Management",
  description: "Manage homepage content, banners, and featured sections from the control panel.",
  robots: {
    index: false,
    follow: false
  }
};

export default function page() {
  return (
    <div>
      <HomeManagementComponent/>
    </div>
  )
}
