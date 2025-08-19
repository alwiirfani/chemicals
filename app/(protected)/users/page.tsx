import { Button } from "@/components/ui/button";
import { UserClient } from "./components/user-client";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Users of Chemical Inventory Management System",
};

export default async function UsersPage() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const user = await getCurrentUser();

  if (!user) return null;

  if (!["ADMIN", "LABORAN"].includes(user.role)) {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 p-4 md:p-8 md:ml-64">
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-6 rounded-lg border shadow-sm">
              <h1 className="text-xl md:text-2xl font-bold text-red-600 mb-3">
                Akses Ditolak
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Anda tidak memiliki izin untuk mengakses halaman ini.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => redirect("/dashboard")}>
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 px-2 md:ml-64 overflow-auto">
        <UserClient />
      </main>
    </div>
  );
}
