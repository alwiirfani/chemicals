"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  BarChart3,
  Download,
  Package,
  FileText,
  Shield,
  RefreshCw,
  Calendar as CalendarIcon,
} from "lucide-react";

import { ChemicalReports } from "./chemical-reports";
import { BorrowingReports } from "./borrowing-reports";
import { SDSReports } from "./sds-reports";
import { OverviewReports } from "./overview-reports";
import { useReports } from "@/hooks/use-reports";

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

  // 👉 Date range (ShadCN)
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : null;

  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : null;

  const {
    fetchRealTimeData,
    fetchReportData,
    isLoading,
    realTimeData,
    reportData,
  } = useReports({
    period: selectedPeriod,
    startDate,
    endDate,
  });

  const handleRefresh = () => {
    if (selectedPeriod === "custom" && (!dateRange?.from || !dateRange?.to)) {
      return;
    }

    setIsRefreshing(true);
    Promise.all([
      fetchReportData({
        period: selectedPeriod,
        startDate,
        endDate,
      }),
      fetchRealTimeData(),
    ]).finally(() => setIsRefreshing(false));
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period !== "custom") {
      setDateRange(undefined);
    }
  };

  if (isLoading || !reportData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

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
      <div className="flex-1 md:ml-64 p-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Laporan</h1>
            <p className="text-gray-600">
              Dashboard laporan sistem manajemen bahan kimia
            </p>

            {selectedPeriod === "custom" &&
              dateRange?.from &&
              dateRange?.to && (
                <p className="text-sm text-gray-500 mt-1">
                  Periode: {format(dateRange.from, "dd MMM yyyy")} –{" "}
                  {format(dateRange.to, "dd MMM yyyy")}
                </p>
              )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* SELECT PERIOD */}
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

            {/* RANGE CALENDAR */}
            {selectedPeriod === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[260px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Pilih rentang tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={
                isRefreshing ||
                (selectedPeriod === "custom" &&
                  (!dateRange?.from || !dateRange?.to))
              }>
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button className="bg-green-700 hover:bg-green-600 text-white">
              <Download className="mr-2 h-4 w-4" />
              Export Semua
            </Button>
          </div>
        </div>

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chemicals">
              <Package className="h-4 w-4 mr-2" />
              Inventaris
            </TabsTrigger>
            <TabsTrigger value="borrowings">
              <FileText className="h-4 w-4 mr-2" />
              Permintaan
            </TabsTrigger>
            <TabsTrigger value="sds">
              <Shield className="h-4 w-4 mr-2" />
              SDS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewReports
              overviewStats={overviewStats}
              realTimeData={realTimeData}
              reportData={reportData}
            />
          </TabsContent>

          <TabsContent value="chemicals">
            <ChemicalReports
              data={reportData.chemicalStats}
              period={selectedPeriod}
              onExport={() => {}}
            />
          </TabsContent>

          <TabsContent value="borrowings">
            <BorrowingReports
              data={reportData.borrowingStats}
              period={selectedPeriod}
              onExport={() => {}}
            />
          </TabsContent>

          <TabsContent value="sds">
            <SDSReports
              data={reportData.sdsStats}
              period={selectedPeriod}
              onExport={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
