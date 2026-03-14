import DashboardUsers from "@/components/Dashboard/DashboadUsers/DashboardUsers";

export const metadata = {
  title: "User Management",
  description: "Manage platform users, roles, and account statuses from the Dashboard.",
  robots: {
    index: false,
    follow: false
  }
};

export default function UsersPage() {
  return <DashboardUsers />;
}