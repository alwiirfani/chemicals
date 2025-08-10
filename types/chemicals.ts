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

export interface ChemicalFormData {
  name: string;
  formula: string;
  casNumber: string;
  form: string;
  stock: number;
  unit: string;
  purchaseDate: string;
  expirationDate: string;
  location: string;
  cabinet: string;
  room: string;
  temperature: string;
}
