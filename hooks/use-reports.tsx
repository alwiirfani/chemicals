"use client";

import { RealTimeData, ReportData } from "@/types/reports";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface UseReportsParams {
  period: string;
  startDate?: string | null;
  endDate?: string | null;
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
   * ===============================
   * FETCH REPORT DATA
   * ===============================
   */
  const fetchReportData = useCallback(
    async (params?: UseReportsParams) => {
      const query = params ?? { period, startDate, endDate };

      // ⛔ jangan fetch kalau custom tapi tanggal belum lengkap
      if (query.period === "custom" && (!query.startDate || !query.endDate)) {
        return;
      }

      try {
        setIsLoading(true);

        const response = await axios.get("/api/v1/reports", {
          params: {
            period: query.period,
            startDate: query.startDate,
            endDate: query.endDate,
          },
        });

        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [period, startDate, endDate]
  );

  /**
   * ===============================
   * FETCH REAL-TIME DATA
   * ===============================
   */
  const fetchRealTimeData = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/reports/realtime");
      setRealTimeData(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    }
  }, []);

  /**
   * ===============================
   * AUTO FETCH ON CHANGE
   * ===============================
   */
  useEffect(() => {
    fetchReportData();
    fetchRealTimeData();
  }, [fetchReportData, fetchRealTimeData]);

  return {
    reportData,
    realTimeData,
    isLoading,
    fetchReportData,
    fetchRealTimeData,
    lastUpdated,
  };
}
