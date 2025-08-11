export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ["application/pdf"];
export const DEFAULT_LANGUAGE = "ID";

export const LANGUAGE_OPTIONS = [
  { value: "ID", label: "🇮🇩 Indonesia" },
  { value: "EN", label: "🇺🇸 English" },
];

export const ERROR_MESSAGES = {
  FILE_TYPE: "Hanya file PDF yang diperbolehkan",
  FILE_SIZE: "Ukuran file maksimal 10MB",
  REQUIRED_FIELD: "Field ini wajib diisi",
  MIN_ONE_CLASSIFICATION: "Masukkan minimal satu klasifikasi bahaya",
  MIN_ONE_STATEMENT: "Masukkan minimal satu pernyataan kehati-hatian",
};
