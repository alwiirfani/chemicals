// Dashboard Data
export type Activity = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED" | "OVERDUE";
  requestDate: string;
  borrower: {
    username: string;
  };
  items: {
    chemical: {
      name: string;
      unit: string;
    };
  }[];
};

export type DashboardData = {
  activeAllBorrowings: number;
  activeBorrowings: number;
  recentActivities: Activity[];
};

export type MappedActivity = {
  id: string;
  type: string;
  message: string;
  time: string;
  color: string;
};
