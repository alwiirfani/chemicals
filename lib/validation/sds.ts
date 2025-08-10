import z from "zod";

export const sdsCreateSchema = z.object({
  externalUrl: z.string().optional(),
  language: z.enum(["ID", "EN"]),
  hazardClassification: z.array(
    z.string().min(1, { message: "Tidak boleh kosong" })
  ),
  precautionaryStatement: z.array(
    z.string().min(1, { message: "Tidak boleh kosong" })
  ),
  firstAidInhalation: z.string().optional(),
  firstAidSkin: z.string().optional(),
  firstAidEye: z.string().optional(),
  firstAidIngestion: z.string().optional(),
  storageConditions: z.string().optional(),
  disposalInfo: z.string().optional(),
  sdsFile: z
    .instanceof(File)
    .refine((f) => f.type === "application/pdf", {
      message: "File harus berformat PDF",
    })
    .refine((f) => f.size <= 10 * 1024 * 1024, {
      message: "Ukuran file maksimal 10MB",
    }),
});

export type SDSCreateSchemaFormData = z.infer<typeof sdsCreateSchema>;
