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
  returnedAt: Date | null;
  notes: string | null;
  items: Array<{
    id: string;
    chemicalId: string;
    chemical: {
      id: string;
      name: string;
      formula: string;
      unit: string;
    };
    quantity: number;
    returned: boolean;
    returnedQty: number | null;
  }>;
}
