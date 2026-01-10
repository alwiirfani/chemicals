import { getCurrentUser } from "@/lib/auth";
import ReportsClient from "./components/reports-client";

export default async function ReportsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return <ReportsClient />;
}
