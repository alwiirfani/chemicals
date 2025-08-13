import { getCurrentUser } from "@/lib/auth";
import { SDSClient } from "./components/sds-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SDS",
  description: "Safety Data Sheets of Chemical Inventory Management System",
};

export default async function SDSPage() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 px-2 md:ml-64 overflow-auto">
        <SDSClient user={user} />
      </main>
    </div>
  );
}
