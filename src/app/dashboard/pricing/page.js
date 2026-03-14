import PricingComponent from "@/components/Dashboard/DashboardPricing/PricingComponent";

export const metadata = {
  title: "Pricing Management",
  description: "Manage service plans and pricing structures from the control panel.",
  robots: {
    index: false,
    follow: false
  }
};

export default function PricingPage() {
  return <PricingComponent />;
}