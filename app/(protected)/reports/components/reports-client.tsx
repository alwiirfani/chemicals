"use client";

import { useState } from "react";
import { useReports } from "@/hooks/use-reports";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { DateRange } from "react-day-picker";

export default function ReportsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6months");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const startDate = dateRange?.from
    ? dateRange.from.toISOString().split("T")[0]
    : undefined;

  const endDate = dateRange?.to
    ? dateRange.to.toISOString().split("T")[0]
    : undefined;

  const { reportData, realTimeData, isLoading, isFetching, lastUpdated } =
    useReports({
      period: selectedPeriod,
      startDate,
      endDate,
    });

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Reports Dashboard</h2>

        <div className="flex items-center gap-4">
          {/* PERIOD SELECT */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Hari</SelectItem>
              <SelectItem value="30days">30 Hari</SelectItem>
              <SelectItem value="6months">6 Bulan</SelectItem>
              <SelectItem value="1year">1 Tahun</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* BACKGROUND FETCH INDICATOR */}
          {isFetching && (
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {/* ================= CUSTOM RANGE ================= */}
      {selectedPeriod === "custom" && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Rentang Tanggal</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      {/* ================= LOADING FIRST LOAD ================= */}
      {isLoading && (
        <div className="text-center py-10 text-muted-foreground">
          Memuat data laporan...
        </div>
      )}

      {/* ================= REPORT CONTENT ================= */}
      {!isLoading && reportData && (
        <>
          {/* STATS */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Peminjaman Aktif"
              value={realTimeData.activeBorrowings}
            />
            <StatCard
              title="Penggunaan Terbaru"
              value={realTimeData.recentUsage}
            />
            <StatCard
              title="Stok Menipis"
              value={realTimeData.lowStockAlerts}
            />
            <StatCard
              title="Akan Kadaluarsa"
              value={realTimeData.expiringAlerts}
            />
          </div>

          {/* LAST UPDATED */}
          <p className="text-xs text-muted-foreground">
            Terakhir diperbarui: {lastUpdated}
          </p>

          {/* MAIN REPORT */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Aktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 🔥 isi chart / table kamu di sini */}
              <pre className="text-xs bg-muted p-4 rounded">
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}</CardContent>
    </Card>
  );
}
