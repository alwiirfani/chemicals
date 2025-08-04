"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/lib/services/dashboard/dashboard-data";
import { User } from "@/types/auth";
import { MappedActivity } from "@/types/dashboard";
import { Package, FileText, AlertTriangle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCard } from "./dashboard-card";
import { Badge } from "@/components/ui/badge";

interface DashboardClientProps {
  user: User;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [stats, setStats] = useState({
    totalChemicals: 0,
    activeBorrowings: 0,
    lowStockChemicals: 0,
    expiringChemicals: 0,
  });
  const [activities, setActivities] = useState<MappedActivity[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData();

        setStats({
          totalChemicals: data.totalChemicals,
          activeBorrowings: data.activeBorrowings,
          lowStockChemicals: data.lowStockChemicals,
          expiringChemicals: data.expiringChemicals,
        });

        const mappedActivities: MappedActivity[] = data.recentActivities.map(
          (act) => ({
            id: act.id,
            type: act.status,
            message: `${act.borrower.username} meminjam ${
              act.items[0]?.chemical?.name ?? "bahan"
            } (${act.items[0]?.chemical?.unit})`,
            time: new Date(act.requestDate).toLocaleString("id-ID"),
            color:
              act.status === "RETURNED"
                ? "bg-blue-500"
                : act.status === "OVERDUE"
                ? "bg-red-500"
                : "bg-green-500",
          })
        );

        setActivities(mappedActivities);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50 mt-16 sm:mt-0">
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang, <span className="font-medium">{user.name}</span>!
              Berikut ringkasan sistem inventaris bahan kimia.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Bahan Kimia"
              icon={<Package className="h-4 w-4 text-muted-foreground" />}>
              <div className="text-2xl font-bold">{stats.totalChemicals}</div>
              <p className="text-xs text-muted-foreground">
                bahan padat, cair dan gas
              </p>
            </DashboardCard>

            <DashboardCard
              title="Peminajaman Aktif"
              badge={
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Anda
                </Badge>
              }
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}>
              <div className="text-2xl font-bold">{stats.activeBorrowings}</div>
              <p className="text-xs text-muted-foreground">transaksi</p>
            </DashboardCard>

            {user.role === "ADMIN" && (
              <DashboardCard
                title="Peminjaman aktif"
                badge={
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Semua
                  </Badge>
                }
                icon={<FileText className="h-4 w-4 text-muted-foreground" />}>
                <div className="text-2xl font-bold">
                  {stats.totalChemicals - stats.activeBorrowings}
                </div>
                <p className="text-xs text-muted-foreground">transaksi</p>
              </DashboardCard>
            )}

            <DashboardCard
              title="Stok Hampir Habis"
              icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.lowStockChemicals}
              </div>
              <p className="text-xs text-muted-foreground">item</p>
            </DashboardCard>

            <DashboardCard
              title="Kadaluarsa Bulan Ini"
              icon={<Calendar className="h-4 w-4 text-red-600" />}>
              <div className="text-2xl font-bold text-red-600">
                {stats.expiringChemicals}
              </div>
              <p className="text-xs text-muted-foreground">item</p>
            </DashboardCard>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>
                  Peminjaman dan pengembalian terbaru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peringatan</CardTitle>
                <CardDescription>
                  Item yang memerlukan perhatian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {stats.expiringChemicals} bahan akan kadaluwarsa bulan
                        ini
                      </p>
                      <p className="text-xs text-gray-500">
                        Periksa tanggal kadaluwarsa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {stats.lowStockChemicals} bahan stok rendah
                      </p>
                      <p className="text-xs text-gray-500">
                        Pertimbangkan untuk restok
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role-specific content */}
          {user.role === "ADMIN" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Panel Administrator</CardTitle>
                <CardDescription>
                  Akses khusus untuk administrator sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sebagai administrator, Anda memiliki akses penuh ke semua
                  fitur sistem termasuk manajemen pengguna dan pengaturan
                  sistem.
                </p>
              </CardContent>
            </Card>
          )}

          {user.role === "LABORAN" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Panel Laboran</CardTitle>
                <CardDescription>
                  Akses untuk mengelola inventaris dan peminjaman
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sebagai laboran, Anda dapat mengelola inventaris bahan kimia,
                  menyetujui peminjaman, dan mengakses laporan.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
