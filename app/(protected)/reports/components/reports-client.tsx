"use client";

import { useState } from "react";
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
  Package,
  FileText,
  Shield,
  Activity,
  RefreshCw,
} from "lucide-react";
import { ChemicalReports } from "./chemical-reports";
import { BorrowingReports } from "./borrowing-reports";
import { SDSReports } from "./sds-reports";
import { useReports } from "@/hooks/use-reports";
import { OverviewReports } from "./overview-reports";

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
  const [selectedPeriod, setSelectedPeriod] = useState("1 month");
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    lastUpdated,
    fetchRealTimeData,
    fetchReportData,
    isLoading,
    realTimeData,
    reportData,
  } = useReports(selectedPeriod);

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
                Dashboard laporan sistem manajemen bahan kimia
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 month">1 Bulan Terakhir</SelectItem>
                  <SelectItem value="6 months">6 Bulan Terakhir</SelectItem>
                  <SelectItem value="1 year">1 Tahun Terakhir</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
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
              <Button className="shrink-0 bg-green-700 hover:bg-green-400 text-white">
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
                Permintaan
              </TabsTrigger>
              <TabsTrigger value="sds" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                SDS
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <OverviewReports
                overviewStats={overviewStats}
                realTimeData={realTimeData}
                reportData={reportData}
              />
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
