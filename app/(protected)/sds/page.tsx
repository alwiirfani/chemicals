import { getCurrentUser } from "@/lib/auth";
import { SDSClient } from "./components/sds-client";

export default async function SDSPage() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = await getCurrentUser();

  if (!user) return null;

  return <SDSClient user={user} />;
}
