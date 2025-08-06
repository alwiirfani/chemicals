import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email({ message: "Email tidak valid" }),
    name: z.string().min(1, { message: "Nama harus diisi" }),
    username: z
      .string()
      .min(3, { message: "Username minimal 3 karakter" })
      .regex(/^[a-z0-9]+$/, {
        message: "Username hanya boleh huruf kecil dan angka, tanpa spasi",
      }),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]),
    roleId: z.string().min(1, { message: "ID Role harus diisi" }),
    role: z.enum(["ADMIN", "MAHASISWA", "DOSEN", "LABORAN"]),
    password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterSchemaFormData = z.infer<typeof registerSchema>;
