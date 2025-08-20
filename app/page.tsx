import HomeClient from "@/components/home/home-client";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen">
      <main
        className={cn(
          "flex-1 px-2 overflow-auto mb-4 sm:mb-8",
          user ? "md:ml-64" : "ml-0"
        )}>
        <HomeClient user={user} />
      </main>
    </div>
  );
}
