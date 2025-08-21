export interface ChemicalStats {
  totalChemicals: number;
  activeChemicals: number;
  lowStockChemicals: number;
  expiredChemicals: number;
  expiringSoonChemicals: number;
  byForm: Record<string, number>;
  byLocation: Record<string, number>;
  monthlyUsage: MonthlyUsage[];
  topUsedChemicals: TopUsedChemical[];
}

export interface BorrowingStats {
  totalBorrowings: number;
  activeBorrowings: number;
  completedBorrowings: number;
  overdueBorrowings: number;
  rejectedBorrowings: number;
  monthlyBorrowings: MonthlyBorrowing[];
  byUserType: UserTypeStats;
  averageReturnTime: number;
  topBorrowers: TopBorrower[];
}

export interface SDSStats {
  totalSDS: number;
  activeSDS: number;
  byLanguage: Record<string, number>;
  totalDownloads: number;
  monthlyDownloads: MonthlyDownload[];
}

export interface MonthlyUsage {
  month: string;
  usage: number;
}

export interface MonthlyBorrowing {
  month: string;
  borrowings: number;
  returned: number;
}

export interface MonthlyDownload {
  month: string;
  downloads: number;
}

export interface TopUsedChemical {
  name: string;
  formula: string;
  usage: number;
  unit: string;
}

export interface TopBorrower {
  name: string;
  nim: string | null;
  count: number;
}

export interface UserTypeStats {
  students: number;
  lecturers: number;
}

export interface ReportData {
  chemicalStats: ChemicalStats;
  borrowingStats: BorrowingStats;
  sdsStats: SDSStats;
}

export interface RealTimeData {
  activeBorrowings: number;
  recentUsage: number;
  lowStockAlerts: number;
  expiringAlerts: number;
  recentBorrowingActivity: number;
}

// chemicals stats types
export interface TopUsedChemical {
  name: string;
  formula: string;
  usage: number;
  unit: string;
}

export interface MonthlyUsage {
  month: string;
  usage: number;
}

export interface ChemicalStats {
  totalChemicals: number;
  activeChemicals: number;
  lowStockChemicals: number;
  expiredChemicals: number;
  expiringSoonChemicals: number;
  byForm: Record<string, number>;
  byLocation: Record<string, number>;
  monthlyUsage: MonthlyUsage[];
  topUsedChemicals: TopUsedChemical[];
}
