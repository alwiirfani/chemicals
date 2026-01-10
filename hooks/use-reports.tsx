"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  const [isLoading, setIsLoading] = useState(true); // first load
  const [isFetching, setIsFetching] = useState(false); // background fetch
  const [lastUpdated, setLastUpdated] = useState("");

  const isFirstLoad = useRef(true);

  const fetchData = useCallback(async () => {
    if (period === "custom" && (!startDate || !endDate)) return;

    if (isFirstLoad.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const params: Record<string, string> = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [reportRes, realtimeRes] = await Promise.all([
        axios.get("/api/v1/reports", { params }),
        axios.get("/api/v1/reports/realtime"),
      ]);

      setReportData(reportRes.data);
      setRealTimeData(realtimeRes.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      isFirstLoad.current = false;
    }
  }, [period, startDate, endDate]);

  /**
   * AUTO FETCH (NO FLICKER)
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    reportData,
    realTimeData,
    isLoading, // hanya untuk first render
    isFetching, // optional indikator kecil
    lastUpdated,
  };
}
