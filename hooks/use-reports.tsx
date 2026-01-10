"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RealTimeData, ReportData } from "@/types/reports";

interface UseReportsParams {
  period: string;
  startDate?: string;
  endDate?: string;
}

export function useReports({ period, startDate, endDate }: UseReportsParams) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    activeBorrowings: 0,
    recentUsage: 0,
    lowStockAlerts: 0,
    expiringAlerts: 0,
    recentBorrowingActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  /**
   * FETCH REPORT DATA
   */
  const fetchReportData = useCallback(async () => {
    if (period === "custom" && (!startDate || !endDate)) return;

    const params: Record<string, string> = { period };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await axios.get("/api/v1/reports", { params });
    setReportData(res.data);
  }, [period, startDate, endDate]);

  /**
   * FETCH REALTIME DATA
   */
  const fetchRealTimeData = useCallback(async () => {
    const res = await axios.get("/api/v1/reports/realtime");
    setRealTimeData(res.data);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  /**
   * REFETCH (PUBLIC API)
   */
  const refetch = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchReportData(), fetchRealTimeData()]);
    setIsLoading(false);
  }, [fetchReportData, fetchRealTimeData]);

  /**
   * AUTO FETCH
   */
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    reportData,
    realTimeData,
    isLoading,
    lastUpdated,
    refetch, // ✅ cukup ini
  };
}
