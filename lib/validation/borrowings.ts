import { z } from "zod";

export const itemsBorrowingSchema = z.object({
  chemicalId: z.string().min(1, "Chemical ID harus diisi"),
  quantity: z.number().positive("Jumlah harus lebih dari 0"),
});

export const createBorrowingSchema = z.object({
  purpose: z.string().min(1, "Tujuan peminjaman harus diisi"),
  notes: z.string().optional(),
  items: z
    .array(itemsBorrowingSchema)
    .min(1, "Minimal harus ada satu bahan kimia yang dipinjam"),
});

export type BorrowingCreateFormData = z.infer<typeof createBorrowingSchema>;
