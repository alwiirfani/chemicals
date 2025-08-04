import { DashboardData } from "@/types/dashboard";
import axios from "axios";

export async function getDashboardData(): Promise<DashboardData> {
  const [chemicalsRes, activeBorrowingsRes, recentRes] = await Promise.all([
    axios.get("/api/v1/chemicals/stats"),
    axios.get("/api/v1/borrowings/active"),
    axios.get("/api/v1/borrowings/recent"),
  ]);

  return {
    totalChemicals: chemicalsRes.data.totalChemicals,
    lowStockChemicals: chemicalsRes.data.lowStockChemicals,
    expiringChemicals: chemicalsRes.data.expiringChemicals,
    activeBorrowings: activeBorrowingsRes.data.ownActive,
    activeAllBorrowings: activeBorrowingsRes.data.allActive,
    recentActivities: recentRes.data.recentActivities,
  };
}
