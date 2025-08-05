import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./components/dashboard-client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard of Chemical Inventory Management System",
};

const DashboardPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return user && <DashboardClient user={user} />;
};

export default DashboardPage;
