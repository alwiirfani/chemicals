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

export function normalizeFileName(baseName: string) {
  // bersihkan karakter aneh
  let safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  // lowercase semua
  safeName = safeName.toLowerCase();
  // paksa ekstensi jadi .pdf
  safeName = safeName.replace(/\.[^.]+$/, ".pdf");
  return safeName;
}
