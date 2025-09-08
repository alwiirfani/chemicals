import { z } from "zod";

export const itemsBorrowingSchema = z.object({
  chemicalId: z.string().min(1, "Chemical ID harus diisi"),
  quantity: z.number().positive("Jumlah harus lebih dari 0"),
});

export const createBorrowingSchema = z.object({
  nrp: z.string().optional(),
  supervisor: z.string().optional(),
  noTelp: z.number().optional(),
  sarjanaLevel: z.enum(["S1", "S2", "S3"]).optional(),
  purpose: z.string().min(1, "Tujuan peminjaman harus diisi"),
  notes: z.string().optional(),
  items: z
    .array(itemsBorrowingSchema)
    .min(1, "Minimal harus ada satu bahan kimia yang dipinjam"),
});

export type CreateBorrowingFormData = z.infer<typeof createBorrowingSchema>;
