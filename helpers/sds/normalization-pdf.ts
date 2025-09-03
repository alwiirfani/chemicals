export function normalizeFileName(baseName: string) {
  // bersihkan karakter aneh
  let safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  // lowercase semua
  safeName = safeName.toLowerCase();
  // paksa ekstensi jadi .pdf
  safeName = safeName.replace(/\.[^.]+$/, ".pdf");
  return safeName;
}
