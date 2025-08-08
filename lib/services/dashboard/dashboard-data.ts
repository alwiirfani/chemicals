import { DashboardData } from "@/types/dashboard";
import axios from "axios";

export const getDashboardData = async (): Promise<DashboardData> => {
  const [chemicalsRes, activeBorrowingsRes, recentRes] = await Promise.all([
    axios.get("/api/v1/chemicals"),
    axios.get("/api/v1/borrowings/active"),
    axios.get("/api/v1/borrowings/recent"),
  ]);

  return {
    totalChemicals: chemicalsRes.data.stats.totalChemicals,
    lowStockChemicals: chemicalsRes.data.stats.lowStockChemicals,
    expiringChemicals: chemicalsRes.data.stats.expiringChemicals,
    activeBorrowings: activeBorrowingsRes.data.ownActive,
    activeAllBorrowings: activeBorrowingsRes.data.allActive,
    recentActivities: recentRes.data.recentActivities,
  };
};
