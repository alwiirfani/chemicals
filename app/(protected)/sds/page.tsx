import { getCurrentUser } from "@/lib/auth";
import { SDSClient } from "./components/sds-client";

export default async function SDSPage() {
  await new Promise((resolve) => setTimeout(resolve, 500));
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
