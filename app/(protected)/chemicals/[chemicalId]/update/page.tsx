import UpdateChemicalClient from "../components/update/update-client";

export default async function UpdateChemicalPage() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return <UpdateChemicalClient />;
}
