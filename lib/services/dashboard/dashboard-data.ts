import { DashboardData } from "@/types/dashboard";
import axios from "axios";

export const getDashboardData = async (): Promise<DashboardData> => {
  const [chemicalsRes, borrowingsRes] = await Promise.all([
    axios.get("/api/v1/chemicals"),
    axios.get("/api/v1/borrowings"),
  ]);

  return {
    totalChemicals: chemicalsRes.data.stats.totalChemicals,
    lowStockChemicals: chemicalsRes.data.stats.lowStockChemicals,
    expiringChemicals: chemicalsRes.data.stats.expiringChemicals,
    activeBorrowings: borrowingsRes.data.ownActive,
    activeAllBorrowings: borrowingsRes.data.allActive,
    recentActivities: borrowingsRes.data.recentActivities,
  };
};
