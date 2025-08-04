import { Button } from "@/components/ui/button";
import { UsersClient } from "./components/users-client";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!["ADMIN", "LABORAN"].includes(user.role)) {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 p-4 md:p-8 md:ml-64">
          {" "}
          {/* Padding lebih responsif */}
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
      <main className="flex-1 p-2 md:p-8 md:ml-64 overflow-auto">
        <UsersClient />
      </main>
    </div>
  );
}
