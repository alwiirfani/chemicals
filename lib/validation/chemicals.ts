// lib/validations/chemical.ts
import { z } from "zod";

export const chemicalsCreateSchema = z.object({
  name: z.string().min(1),
  form: z.enum(["LIQUID", "SOLID", "GAS"]),
  formula: z.string().min(1).optional(),
  casNumber: z.string().optional(),
  stock: z.number().min(0),
  unit: z.string().min(1),
  location: z.string().min(1),
  purchaseDate: z.string(),
  expirationDate: z.string().optional(),
  cabinet: z.string().optional(),
  room: z.string().optional(),
  temperature: z.string().optional(),
});

export const chemicalUpdateSchema = z.object({
  name: z.string().min(1),
  form: z.enum(["LIQUID", "SOLID", "GAS"]),
  formula: z.string().min(1).optional(),
  casNumber: z.string().optional(),
  stock: z.number().min(0),
  unit: z.string().min(1),
  location: z.string().min(1),
  purchaseDate: z.string(),
  expirationDate: z.string().optional(),
  cabinet: z.string().optional(),
  room: z.string().optional(),
  temperature: z.string().optional(),
});

export type ChemicalCreateSchemaFormData = z.infer<
  typeof chemicalsCreateSchema
>;
export type ChemicalUpdateSchemaFormData = z.infer<typeof chemicalUpdateSchema>;
