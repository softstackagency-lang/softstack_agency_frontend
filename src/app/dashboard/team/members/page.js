import TeamMembersComponent from "@/components/Dashboard/DshboardTeam/TeamMembersComponent";

export const metadata = {
  title: "Team Members Management",
  description: "Manage team member profiles and roles from the Dashboard.",
  robots: {
    index: false,
    follow: false
  }
};

export default function TeamMembersPage() {
  return <TeamMembersComponent />;
}
