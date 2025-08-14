import { getCurrentUser } from "@/lib/auth";
import { BorrowingsClient } from "./components/borrowings-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borrow",
  description: "",
};

export default async function BorrowingsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return <BorrowingsClient user={user} />;
}
