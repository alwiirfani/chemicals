// export function normalizeChemicalName(fileName: string) {
//   let name = fileName.replace(/\.pdf$/i, ""); // hapus ekstensi

//   // hapus prefix angka + karakter pemisah (spasi, -, _, .)
//   name = name.replace(/^[\d\-\_.\s]+/, "");

//   // ganti underscore ke spasi
//   name = name.replace(/_/g, " ");

//   // rapikan spasi ganda
//   name = name.replace(/\s+/g, " ");

//   return name.trim().toLowerCase();
// }

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
    .replace(/[^a-zA-Z0-9-_',\s]/g, "_"); // ganti huruf spesial ke underscore

  return `${safeBase}.${ext}`;
}

// Normalisasi nama supaya bisa dibandingkan (DB vs nama file)
export function normalizeForCompare(name: string): string {
  return name
    .replace(/\.pdf$/i, "") // hapus ekstensi PDF
    .replace(/^[\d\-\_.\s]+/, "") // hapus prefix angka/karakter pemisah
    .normalize("NFKD") // normalisasi unicode
    .replace(/[\u0300-\u036f]/g, "") // hapus aksen
    .replace(/[^a-zA-Z0-9\s]/g, " ") // simbol jadi spasi
    .replace(/\s+/g, " ") // rapikan spasi ganda
    .trim()
    .toLowerCase();
}

// Levenshtein Distance
function levenshteinDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[a.length][b.length];
}

// Skor similarity antara 0–1
export function similarity(a: string, b: string): number {
  if (!a.length && !b.length) return 1;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}
