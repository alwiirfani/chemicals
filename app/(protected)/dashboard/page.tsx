import { DashboardClient } from "./components/dashboard-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard of Chemical Inventory Management System",
};

const DashboardPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return <DashboardClient />;
};

export default DashboardPage;
