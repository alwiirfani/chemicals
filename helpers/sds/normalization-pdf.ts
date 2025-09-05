import db from "@/lib/db";
import { Chemical } from "@prisma/client";
import { distance } from "fastest-levenshtein";

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

export async function findClosestChemical(
  baseName: string
): Promise<Chemical | null> {
  const allChemicals = await db.chemical.findMany();

  let bestMatch: Chemical | null = null;
  let bestScore = Infinity;

  for (const chem of allChemicals) {
    const score = distance(baseName.toLowerCase(), chem.name.toLowerCase());
    if (score < bestScore) {
      bestScore = score;
      bestMatch = chem;
    }
  }

  // misal toleransi maksimal edit distance 3
  return bestScore <= 3 ? bestMatch : null;
}
