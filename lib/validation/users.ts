import { z } from "zod";

export const editUserForAdminSchema = z.object({
  email: z.email({ message: "Email tidak valid" }),
  name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter" })
    .regex(/^[a-z0-9]+$/, {
      message: "Username hanya boleh huruf kecil dan angka, tanpa spasi",
    }),
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]),
  newPassword: z.string().optional(),
});

export type EditUserForAdminSchemaFormData = z.infer<
  typeof editUserForAdminSchema
>;
