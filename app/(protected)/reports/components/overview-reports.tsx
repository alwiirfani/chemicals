"use client";

import { Activity, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportData } from "@/types/reports";

interface OverviewReportsProps {
  overviewStats: {
    title: string;
    value: string | number;
    change: string;
    trend: "up" | "down";
    icon: React.ElementType;
    color: string;
    bgColor: string;
    isRealTime?: boolean;
  }[];
  realTimeData: {
    activeBorrowings: number;
    recentUsage: number;
    lowStockAlerts: number;
    expiringAlerts: number;
  };
  reportData: ReportData;
}

export function OverviewReports({
  overviewStats,
  realTimeData,
  reportData,
}: OverviewReportsProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="relative">
            {stat.isRealTime && (
              <div className="absolute -top-2 -right-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp
                  className={`mr-1 h-3 w-3 ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }>
                  {stat.change}
                </span>
                <span className="ml-1">dari bulan lalu</span>
              </div>
              {stat.isRealTime && (
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Live
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Peminjaman Aktif
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              {realTimeData.activeBorrowings}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Real-time monitoring
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Penggunaan 1 Jam
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {realTimeData.recentUsage}
            </div>
            <div className="text-xs text-green-600 mt-1">Aktivitas terkini</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Stok Rendah
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">
              {realTimeData.lowStockAlerts}
            </div>
            <div className="text-xs text-yellow-600 mt-1">Perlu perhatian</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Akan Kadaluarsa
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {realTimeData.expiringAlerts}
            </div>
            <div className="text-xs text-red-600 mt-1">Prioritas tinggi</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Perhatian Segera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-red-700">
              • {reportData.chemicalStats.expiredChemicals} bahan kimia
              kadaluwarsa
            </div>
            <div className="text-sm text-red-700">
              • {reportData.borrowingStats.overdueBorrowings} peminjaman
              terlambat
            </div>
            {realTimeData.lowStockAlerts > 0 && (
              <div className="text-sm text-red-700">
                • {realTimeData.lowStockAlerts} bahan stok rendah
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Akan Datang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-yellow-700">
              • {reportData.chemicalStats.expiringSoonChemicals} bahan akan
              kadaluwarsa
            </div>
            {realTimeData.expiringAlerts > 0 && (
              <div className="text-sm text-yellow-700">
                • {realTimeData.expiringAlerts} bahan mendekati kadaluarsa
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performa Baik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-green-700">
              • {reportData.borrowingStats.averageReturnTime} hari rata-rata
              pengembalian
            </div>
            <div className="text-sm text-green-700">
              • {realTimeData.recentUsage} penggunaan dalam 1 jam terakhir
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Aktivitas</CardTitle>
          <CardDescription>
            Aktivitas sistem dalam 30 hari terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.chemicalStats.monthlyUsage[5].usage}
              </div>
              <div className="text-sm text-gray-600">Penggunaan Bahan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reportData.borrowingStats.monthlyBorrowings[5].borrowings}
              </div>
              <div className="text-sm text-gray-600">Peminjaman Baru</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {reportData.sdsStats.monthlyDownloads[5].downloads}
              </div>
              <div className="text-sm text-gray-600">Download SDS</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
