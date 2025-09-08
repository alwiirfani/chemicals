import { z } from "zod";

export const itemsBorrowingSchema = z.object({
  chemicalId: z.string().min(1, "Chemical ID harus diisi"),
  quantity: z.number().positive("Jumlah harus lebih dari 0"),
});

export const createBorrowingSchema = z
  .object({
    role: z.enum(["MAHASISWA", "DOSEN", "LABORAN", "ADMIN", "PETUGAS_GUDANG"]),
    nrp: z.string().optional(),
    supervisor: z.string().optional(),
    noTelp: z
      .string()
      .regex(/^\d+$/, "Nomor WA hanya boleh angka")
      .min(10, "Nomor WA minimal 10 digit")
      .max(15, "Nomor WA maksimal 15 digit")
      .optional(),
    sarjanaLevel: z.enum(["S1", "S2", "S3"]).optional(),
    purpose: z.string().min(1, "Tujuan peminjaman harus diisi"),
    notes: z.string().optional(),
    items: z
      .array(itemsBorrowingSchema)
      .min(1, "Minimal harus ada satu bahan kimia yang dipinjam"),
  })
  .superRefine((data, ctx) => {
    if (data.role === "MAHASISWA") {
      if (!data.nrp) {
        ctx.addIssue({
          code: "custom",
          path: ["nrp"],
          message: "NRP wajib diisi untuk mahasiswa",
        });
      }
      if (!data.supervisor) {
        ctx.addIssue({
          code: "custom",
          path: ["supervisor"],
          message: "Supervisor wajib diisi untuk mahasiswa",
        });
      }
      if (!data.noTelp) {
        ctx.addIssue({
          code: "custom",
          path: ["noTelp"],
          message: "No WA wajib diisi untuk mahasiswa",
        });
      }
      if (!data.sarjanaLevel) {
        ctx.addIssue({
          code: "custom",
          path: ["sarjanaLevel"],
          message: "Jenjang sarjana wajib diisi untuk mahasiswa",
        });
      }
    } else {
      if (!data.noTelp) {
        ctx.addIssue({
          code: "custom",
          path: ["noTelp"],
          message: "No WA wajib diisi",
        });
      }
    }
  });
export type CreateBorrowingFormData = z.infer<typeof createBorrowingSchema>;
