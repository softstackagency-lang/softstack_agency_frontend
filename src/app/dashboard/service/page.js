import ServiceComponent from "@/components/Dashboard/ServiceComponent";

export const metadata = {
  title: "Service Management",
  description: "Manage agency services and offerings from the control panel.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ServicePage() {
  return <ServiceComponent />;
}