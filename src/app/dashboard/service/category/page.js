import ServiceCategoryComponent from "@/components/Dashboard/ServiceCategoryComponent";

export const metadata = {
  title: "Service Category Management",
  description: "Manage categories for agency services and offerings.",
  robots: { index: false, follow: false }
};

export default function ServiceCategoryPage() {
  return <ServiceCategoryComponent />;
}
