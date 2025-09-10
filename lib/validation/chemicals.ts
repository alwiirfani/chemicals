// lib/validations/chemical.ts
import { z } from "zod";

export const chemicalsCreateSchema = z.object({
  name: z.string().min(1),
  form: z.enum(["LIQUID", "SOLID"]),
  characteristic: z.enum(["ACID", "BASE", "OXIDANT", "GENERAL"]),
  formula: z.string().min(1).optional(),
  casNumber: z.string().optional(),
  stock: z.number().min(0),
  unit: z.string().min(1),
  purchaseDate: z.string(),
  expirationDate: z.string().optional(),
});

export const chemicalUpdateSchema = z
  .object({
    name: z.string().min(1),
    form: z.enum(["LIQUID", "SOLID"]),
    characteristic: z.enum(["ACID", "BASE", "OXIDANT", "GENERAL", "INDICATOR"]),
    formula: z.string().min(1).optional(),
    unit: z.string().min(1),
    purchaseDate: z.string(),
    expirationDate: z.string().optional(),
    type: z.enum(["ADD", "REDUCE", "NOTHING"]).default("NOTHING"), // jenis perubahan stok
    quantity: z.number().optional(), // jumlah perubahan stok
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "ADD" || data.type === "REDUCE") {
        return data.quantity && data.quantity > 0;
      }
      return true; // kalau type = NOTHING, quantity boleh 0
    },
    {
      message: "Quantity wajib jika type = ADD atau REDUCE",
      path: ["quantity"],
    }
  );

export type ChemicalCreateSchemaFormData = z.infer<
  typeof chemicalsCreateSchema
>;
export type ChemicalUpdateSchemaFormData = z.infer<typeof chemicalUpdateSchema>;
