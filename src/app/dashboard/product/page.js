import ProductComponent from "@/components/Dashboard/DashboardProduct/ProductComponent";

export const metadata = {
  title: "Product Showcase Management",
  description: "Manage your product portfolio and project showcase from the control panel.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ProductPage() {
  return <ProductComponent />;
}