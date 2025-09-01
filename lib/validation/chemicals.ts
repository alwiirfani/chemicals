// lib/validations/chemical.ts
import { z } from "zod";

export const chemicalsCreateSchema = z.object({
  name: z.string().min(1),
  form: z.enum(["LIQUID", "SOLID", "GAS"]),
  characteristic: z.enum(["ACID", "BASE", "OXIDANT", "GENERAL"]),
  formula: z.string().min(1).optional(),
  casNumber: z.string().optional(),
  stock: z.number().min(0),
  unit: z.string().min(1),
  purchaseDate: z.string(),
  expirationDate: z.string().optional(),
});

export const chemicalUpdateSchema = z.object({
  name: z.string().min(1),
  form: z.enum(["LIQUID", "SOLID", "GAS"]),
  characteristic: z.enum(["ACID", "BASE", "OXIDANT", "GENERAL"]),
  formula: z.string().min(1).optional(),
  unit: z.string().min(1),
  purchaseDate: z.string(),
  expirationDate: z.string().optional(),
  type: z.enum(["ADD", "REDUCE"]).optional(), // jenis perubahan stok
  quantity: z.number().positive().optional(), // jumlah perubahan stok
  description: z.string().optional(),
});

export type ChemicalCreateSchemaFormData = z.infer<
  typeof chemicalsCreateSchema
>;
export type ChemicalUpdateSchemaFormData = z.infer<typeof chemicalUpdateSchema>;
