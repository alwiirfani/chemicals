export interface Chemical {
  id: string;
  name: string;
  formula: string;
  casNumber: string | null;
  form: string;
  stock: number;
  unit: string;
  purchaseDate: Date;
  expirationDate: Date | null;
  location: string;
  cabinet: string | null;
  room: string | null;
  qrCode: string | null;
  createdBy: { name: string };
}

export type ChemicalForm = "LIQUID" | "SOLID" | "GAS";
