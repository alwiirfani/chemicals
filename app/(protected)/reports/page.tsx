import { getCurrentUser } from "@/lib/auth";
import { ReportsClient } from "./components/reports-client";

// // Dummy data for reports
// const DUMMY_REPORT_DATA = {
//   // Chemical inventory statistics
//   chemicalStats: {
//     totalChemicals: 156,
//     activeChemicals: 148,
//     lowStockChemicals: 12,
//     expiredChemicals: 8,
//     expiringSoonChemicals: 15,
//     byForm: {
//       SOLID: 89,
//       LIQUID: 62,
//       GAS: 5,
//     },
//     byLocation: {
//       "Lab 1": 45,
//       "Lab 2": 38,
//       "Lab 3": 32,
//       Storage: 41,
//     },
//     monthlyUsage: [
//       { month: "Jan", usage: 245 },
//       { month: "Feb", usage: 189 },
//       { month: "Mar", usage: 267 },
//       { month: "Apr", usage: 198 },
//       { month: "May", usage: 234 },
//       { month: "Jun", usage: 289 },
//     ],
//     topUsedChemicals: [
//       { name: "Etanol", formula: "C₂H₅OH", usage: 45, unit: "L" },
//       { name: "Asam Sulfat", formula: "H₂SO₄", usage: 38, unit: "L" },
//       { name: "Natrium Klorida", formula: "NaCl", usage: 32, unit: "kg" },
//       { name: "Asam Klorida", formula: "HCl", usage: 28, unit: "L" },
//       { name: "Natrium Hidroksida", formula: "NaOH", usage: 25, unit: "kg" },
//     ],
//   },

//   // Borrowing statistics
//   borrowingStats: {
//     totalBorrowings: 234,
//     activeBorrowings: 18,
//     completedBorrowings: 198,
//     overdueBorrowings: 6,
//     rejectedBorrowings: 12,
//     monthlyBorrowings: [
//       { month: "Jan", borrowings: 32, returned: 30 },
//       { month: "Feb", borrowings: 28, returned: 26 },
//       { month: "Mar", borrowings: 45, returned: 42 },
//       { month: "Apr", borrowings: 38, returned: 35 },
//       { month: "May", borrowings: 41, returned: 39 },
//       { month: "Jun", borrowings: 50, returned: 46 },
//     ],
//     byUserType: {
//       students: 189,
//       lecturers: 45,
//     },
//     averageReturnTime: 4.2, // days
//     topBorrowers: [
//       { name: "Rina Sari", nim: "2021001001", count: 12 },
//       { name: "Dani Pratama", nim: "2021001002", count: 10 },
//       { name: "Dr. Hartono, M.Si", nim: null, count: 8 },
//       { name: "Maya Putri", nim: "2021001003", count: 7 },
//       { name: "Andi Wijaya", nim: "2021001004", count: 6 },
//     ],
//   },

//   // SDS statistics
//   sdsStats: {
//     totalSDS: 89,
//     activeSDS: 76,
//     expiredSDS: 8,
//     pendingSDS: 5,
//     byLanguage: {
//       ID: 45,
//       EN: 44,
//     },
//     bySupplier: {
//       "Merck KGaA": 32,
//       "Sigma-Aldrich": 28,
//       "PT Kimia Farma": 15,
//       Others: 14,
//     },
//     expiringIn30Days: 12,
//     totalDownloads: 1247,
//     monthlyDownloads: [
//       { month: "Jan", downloads: 189 },
//       { month: "Feb", downloads: 156 },
//       { month: "Mar", downloads: 234 },
//       { month: "Apr", downloads: 198 },
//       { month: "May", downloads: 212 },
//       { month: "Jun", downloads: 258 },
//     ],
//   },
// };

export default async function ReportsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return <ReportsClient />;
}
