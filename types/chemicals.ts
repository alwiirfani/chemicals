export interface Chemical {
  id: string;
  name: string;
  formula: string;
  form: string;
  characteristic: string;
  stock: number;
  unit: string;
  purchaseDate: Date;
  expirationDate: Date | null;
  createdBy: { name: string };
}

export type ChemicalForm = "LIQUID" | "SOLID" | "GAS";
export type ChemicalCharacteristic = "ACID" | "BASE" | "OXIDANT" | "GENERAL";

export interface ChemicalFormData {
  name: string;
  formula: string;
  form: string;
  characteristic: string;
  unit: string;
  purchaseDate: string;
  expirationDate: string;

  // for stock update
  type: "ADD" | "REDUCE";
  quantity: number;
  description: string;
}

export interface ImportChemicalExcelRow {
  name: string;
  formula: string;
  characteristic: string;
  form: string;
  unit: string;
  stock: number;
  purchaseDate: string;
  expirationDate: string;
}
