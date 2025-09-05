export function normalizeChemicalName(fileName: string) {
  let name = fileName.replace(/\.pdf$/i, ""); // hapus ekstensi
  name = name.replace(/^\d+\s*/, ""); // hapus angka prefix
  name = name.replace(/_/g, " "); // ganti underscore ke spasi
  name = name.replace(/\s+/g, " "); // rapikan spasi ganda
  return name.trim().toLowerCase();
}

export function normalizeFileName(baseName: string) {
  // bersihkan karakter aneh
  let safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  // lowercase semua
  safeName = safeName.toLowerCase();
  // paksa ekstensi jadi .pdf
  safeName = safeName.replace(/\.[^.]+$/, ".pdf");
  return safeName;
}
