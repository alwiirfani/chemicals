import { Metadata } from "next";
import UpdateChemicalClient from "../components/update/update-client";

export const metadata: Metadata = {
  title: "Update Chemical",
  description: "Update Chemical of Chemical Inventory Management System",
};

export default async function UpdateChemicalPage() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return <UpdateChemicalClient />;
}
