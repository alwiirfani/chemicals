export function normalizeChemicalName(fileName: string) {
  let name = fileName.replace(/\.pdf$/i, ""); // hapus ekstensi

  // hapus prefix angka + karakter pemisah (spasi, -, _, .)
  name = name.replace(/^[\d\-\_.\s]+/, "");

  // ganti underscore ke spasi
  name = name.replace(/_/g, " ");

  // rapikan spasi ganda
  name = name.replace(/\s+/g, " ");

  return name.trim().toLowerCase();
}

export function normalizeFileName(fileName: string): string {
  // Cari titik terakhir
  const lastDot = fileName.lastIndexOf(".");
  let base = fileName;
  let ext = "pdf"; // default fallback

  if (lastDot !== -1) {
    base = fileName.substring(0, lastDot);
    ext = fileName.substring(lastDot + 1); // ambil ekstensi persis, bisa pdf/PDF
  }

  // Normalisasi base name tanpa ubah ekstensi
  const safeBase = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // hapus aksen
    .replace(/[^a-zA-Z0-9-_]/g, "_"); // ganti spasi/simbol jadi underscore

  return `${safeBase}.${ext}`;
}
