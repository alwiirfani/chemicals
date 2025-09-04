"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  FileText,
  Shield,
  Calendar,
  AlertTriangle,
  Activity,
  RefreshCw,
} from "lucide-react";
import { ChemicalReports } from "./chemical-reports";
import { BorrowingReports } from "./borrowing-reports";
import { SDSReports } from "./sds-reports";
import { RealTimeData, ReportData } from "@/types/reports";

interface OverviewStat {
  title: string;
  value: number;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  isRealTime?: boolean;
}

export function ReportsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    activeBorrowings: 0,
    recentUsage: 0,
    lowStockAlerts: 0,
    expiringAlerts: 0,
    recentBorrowingActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  // Fetch report data
  const fetchReportData = async (period: string = "6months") => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/reports?period=${period}`);
      const data = await response.json();

      console.log("data reports: ", data);

      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch real-time data
  const fetchRealTimeData = async () => {
    try {
      const response = await fetch("/api/v1/reports/realtime");
      const data = await response.json();

      console.log("real time data reports: ", data);

      setRealTimeData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchReportData(selectedPeriod);
    fetchRealTimeData();
  }, [selectedPeriod]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([fetchReportData(selectedPeriod), fetchRealTimeData()]).finally(
      () => setIsRefreshing(false)
    );
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleExportReport = (reportType: string) => {
    console.log(`Exporting ${reportType} report for period: ${selectedPeriod}`);
  };

  if (isLoading || !reportData) {
    return (
      <div className="flex min-h-screen bg-gray-50 mt-16 sm:mt-0">
        <div className="flex-1 md:ml-64 p-6 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Memuat data laporan...</p>
          </div>
        </div>
      </div>
    );
  }

  // Overview statistics dengan data real-time
  const overviewStats: OverviewStat[] = [
    {
      title: "Total Bahan Kimia",
      value: reportData.chemicalStats.totalChemicals,
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Peminjaman Aktif",
      value: reportData.borrowingStats.totalBorrowings,
      change: "-5%",
      trend: "down",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      isRealTime: true,
    },
    {
      title: "Safety Data Sheets",
      value: reportData.sdsStats.totalSDS,
      change: "+3%",
      trend: "up",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16 sm:mt-0">
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
              <p className="text-gray-600">
                Dashboard laporan sistem inventaris bahan kimia
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Bulan Terakhir</SelectItem>
                  <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
                  <SelectItem value="1year">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}>
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Semua
              </Button>
            </div>
          </div>

          {/* Real-time Status Bar */}
          <div className="flex items-center justify-between mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                Monitoring Real-time
              </span>
              <span className="text-xs text-blue-600">
                Terakhir update: {lastUpdated}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-700">
              <span>📊 {realTimeData.activeBorrowings} peminjaman aktif</span>
              <span>⚡ {realTimeData.recentUsage} penggunaan 1 jam</span>
              <span>⚠️ {realTimeData.lowStockAlerts} stok rendah</span>
              <span>🚨 {realTimeData.expiringAlerts} akan kadaluarsa</span>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="chemicals"
                className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventaris
              </TabsTrigger>
              <TabsTrigger
                value="borrowings"
                className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Peminjaman
              </TabsTrigger>
              <TabsTrigger value="sds" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                SDS
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
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
                            stat.trend === "up"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                        <span
                          className={
                            stat.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
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
                    <div className="text-xs text-green-600 mt-1">
                      Aktivitas terkini
                    </div>
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
                    <div className="text-xs text-yellow-600 mt-1">
                      Perlu perhatian
                    </div>
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
                    <div className="text-xs text-red-600 mt-1">
                      Prioritas tinggi
                    </div>
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
                      • {reportData.chemicalStats.expiringSoonChemicals} bahan
                      akan kadaluwarsa
                    </div>
                    {realTimeData.expiringAlerts > 0 && (
                      <div className="text-sm text-yellow-700">
                        • {realTimeData.expiringAlerts} bahan mendekati
                        kadaluarsa
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
                      • {reportData.borrowingStats.averageReturnTime} hari
                      rata-rata pengembalian
                    </div>
                    <div className="text-sm text-green-700">
                      • {realTimeData.recentUsage} penggunaan dalam 1 jam
                      terakhir
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
                      <div className="text-sm text-gray-600">
                        Penggunaan Bahan
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          reportData.borrowingStats.monthlyBorrowings[5]
                            .borrowings
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Peminjaman Baru
                      </div>
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
            </TabsContent>

            {/* Chemical Reports Tab */}
            <TabsContent value="chemicals">
              <ChemicalReports
                data={reportData.chemicalStats}
                period={selectedPeriod}
                onExport={() => handleExportReport("chemicals")}
              />
            </TabsContent>

            {/* Borrowing Reports Tab */}
            <TabsContent value="borrowings">
              <BorrowingReports
                data={reportData.borrowingStats}
                period={selectedPeriod}
                onExport={() => handleExportReport("borrowings")}
              />
            </TabsContent>

            {/* SDS Reports Tab */}
            <TabsContent value="sds">
              <SDSReports
                data={reportData.sdsStats}
                period={selectedPeriod}
                onExport={() => handleExportReport("sds")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
