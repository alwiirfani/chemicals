import z from "zod";

export const sdsCreateSchema = z
  .object({
    externalUrl: z.string().optional(),
    language: z.enum(["ID", "EN"]),
    hazardClassification: z
      .array(z.string().min(1, { message: "Tidak boleh kosong" }))
      .min(1, { message: "Minimal 1 klasifikasi bahayag" }),
    precautionaryStatement: z
      .array(z.string().min(1, { message: "Tidak boleh kosong" }))
      .min(1, { message: "Minimal 1 pernyataan kehati-hatian" }),
    firstAidInhalation: z.string().optional(),
    firstAidSkin: z.string().optional(),
    firstAidEye: z.string().optional(),
    firstAidIngestion: z.string().optional(),
    storageConditions: z.string().optional(),
    disposalInfo: z.string().optional(),
    sdsFile: z
      .instanceof(File)
      .optional()
      .refine((f) => !f || f.size > 0, { message: "File tidak boleh kosong" })
      .refine((f) => !f || f.type === "application/pdf", {
        message: "File harus berformat PDF",
      })
      .refine((f) => !f || f.size <= 10 * 1024 * 1024, {
        message: "Ukuran file maksimal 10MB",
      }),
  })
  .refine((data) => data.sdsFile || data.externalUrl, {
    message: "Harus mengirim salah satu: file atau URL",
    path: ["sdsFile"],
  })
  .refine((data) => !(data.sdsFile && data.externalUrl), {
    message: "Pilih salah satu: file atau URL, tidak boleh keduanya",
    path: ["externalUrl"],
  });

export const sdsUpdateSchema = z
  .object({
    chemicalId: z.string().min(1, { message: "Tidak boleh kosong" }),
    externalUrl: z.string().optional(),
    language: z.enum(["ID", "EN"]),
    hazardClassification: z
      .array(z.string().min(1, { message: "Tidak boleh kosong" }))
      .min(1, { message: "Minimal 1 klasifikasi bahayag" }),
    precautionaryStatement: z
      .array(z.string().min(1, { message: "Tidak boleh kosong" }))
      .min(1, { message: "Minimal 1 pernyataan kehati-hatian" }),
    firstAidInhalation: z.string().optional(),
    firstAidSkin: z.string().optional(),
    firstAidEye: z.string().optional(),
    firstAidIngestion: z.string().optional(),
    storageConditions: z.string().optional(),
    disposalInfo: z.string().optional(),
    sdsFile: z
      .instanceof(File)
      .optional()
      .refine((f) => !f || f.size > 0, { message: "File tidak boleh kosong" })
      .refine((f) => !f || f.type === "application/pdf", {
        message: "File harus berformat PDF",
      })
      .refine((f) => !f || f.size <= 10 * 1024 * 1024, {
        message: "Ukuran file maksimal 10MB",
      }),
  })
  .refine((data) => data.sdsFile || data.externalUrl, {
    message: "Harus mengirim salah satu: file atau URL",
    path: ["sdsFile"],
  })
  .refine((data) => !(data.sdsFile && data.externalUrl), {
    message: "Pilih salah satu: file atau URL, tidak boleh keduanya",
    path: ["externalUrl"],
  });

export type SDSCreateSchemaFormData = z.infer<typeof sdsCreateSchema>;
export type SDSUpdateSchemaFormData = z.infer<typeof sdsUpdateSchema>;
