import OverviewComponent from '@/components/Dashboard/DashboardOverview/OverviewComponent'
import React from 'react'

export const metadata = {
  title: "Dashboard Overview",
  description: "SoftStack Agency dashboard - Manage your projects, orders, team, and services from your control panel.",
  robots: {
    index: false,
    follow: false
  }
};

export default function page() {
  return (
    <div>
      <OverviewComponent/>
    </div>
  )
}
