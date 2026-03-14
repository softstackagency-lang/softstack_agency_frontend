import TeamCategoryComponent from "@/components/Dashboard/DshboardTeam/TeamCategoryComponent";

export const metadata = {
  title: "Team Category Management",
  description: "Manage team departments and category tags.",
  robots: { index: false, follow: false }
};

export default function TeamCategoryPage() {
  return <TeamCategoryComponent />;
}
