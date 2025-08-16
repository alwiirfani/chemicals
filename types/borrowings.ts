export interface Borrowing {
  id: string;
  borrowerId: string;
  borrower: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED" | "OVERDUE";
  requestDate: Date;
  approvedAt: Date | null;
  approvedBy: { userId: string; name: string } | null;
  rejectedBy: { userId: string; name: string } | null;
  returnedAt: Date | null;
  returnedBy: { userId: string; name: string } | null;
  notes: string | null;
  items: Array<{
    id: string;
    chemicalId: string;
    chemical: {
      id: string;
      name: string;
      formula: string;
      unit: string;
      stock: number;
    };
    quantity: number;
    returned: boolean;
    returnedQty: number | null;
  }>;
}

export interface UsageHistory {
  id: string;
  quantity: number;
  purpose: string;
  usedAt: Date;
  userId: string | null;
  chemicalId: string;
  borrowingId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum BorrowingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
}
