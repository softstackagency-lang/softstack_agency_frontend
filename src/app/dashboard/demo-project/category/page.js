import DemoCategoryComponent from "@/components/Dashboard/DemoProjects/DemoCategoryComponent";

export const metadata = {
  title: "Demo Category Management",
  description: "Manage categories for demo projects and showcases.",
  robots: { index: false, follow: false }
};

export default function DemoCategoryPage() {
  return <DemoCategoryComponent />;
}
