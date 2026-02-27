import MessagesComponent from "@/components/Dashboard/DashboadMessage/MessagesComponent";

export const metadata = {
  title: "Messages - Dashboard",
  description: "Manage and respond to contact messages, client inquiries, and communications from your dashboard.",
  robots: {
    index: false,
    follow: false
  }
};

export default function MessagesPage() {
  return <MessagesComponent />;
}
