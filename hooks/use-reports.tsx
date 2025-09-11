"use client";

import { RealTimeData, ReportData } from "@/types/reports";
import axios from "axios";
import { useEffect, useState } from "react";

export function useReports(period: string) {
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

  const fetchReportData = async (period: string = "6months") => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/v1/reports?period=${period}`);
      const data = response.data;

      console.log("data reports: ", data);

      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchRealTimeData = async () => {
    try {
      const response = await axios.get("/api/v1/reports/realtime");
      const data = response.data;

      console.log("real time data reports: ", data);

      setRealTimeData(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    }
  };

  useEffect(() => {
    fetchReportData();
    fetchRealTimeData();
  }, [period]);

  return {
    reportData,
    realTimeData,
    isLoading,
    fetchReportData,
    fetchRealTimeData,
    lastUpdated,
  };
}
