import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { SDS } from "@/types/sds";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import pLimit from "p-limit";

// ukuran maksimal file ZIP (50MB)
const MAX_ZIP_FILE_SIZE = 50 * 1024 * 1024;
// ukuran maksimal file PDF individual (10MB)
const MAX_PDF_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.type !== "application/zip") {
      return NextResponse.json(
        { error: "File harus berupa file ZIP" },
        { status: 400 }
      );
    }

    // Validasi ukuran file ZIP
    if (file.size > MAX_ZIP_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Ukuran file ZIP terlalu besar. Maksimum ${
            MAX_ZIP_FILE_SIZE / 1024 / 1024
          }MB`,
        },
        { status: 413 }
      );
    }

    console.log(
      `📦 Memproses file ZIP: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );

    // Load ZIP
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = await JSZip.loadAsync(buffer);

    // Ambil semua entry PDF valid
    const pdfEntries = Object.entries(zip.files).filter(
      ([path, entry]) => !entry.dir && path.toLowerCase().endsWith(".pdf")
    );

    if (pdfEntries.length === 0) {
      return NextResponse.json(
        { error: "File ZIP tidak mengandung file PDF" },
        { status: 400 }
      );
    }

    console.log(`📄 Ditemukan ${pdfEntries.length} file PDF dalam ZIP`);

    // Ambil semua chemical sekaligus dari DB
    const allChemicals = await db.chemical.findMany();
    const chemicalMap = new Map(
      allChemicals.map((c) => [c.name.toLowerCase(), c])
    );

    const failed: { file: string; reason: string }[] = [];
    const limit = pLimit(10); // maksimal 10 file bersamaan

    // Fungsi untuk proses satu file
    const processFile = async ([path, entry]: [string, JSZip.JSZipObject]) => {
      try {
        const pdfBuffer = await entry.async("nodebuffer");

        // Validasi ukuran file PDF individual
        if (pdfBuffer.length > MAX_PDF_SIZE) {
          failed.push({
            file: path,
            reason: `File PDF terlalu besar (${(
              pdfBuffer.length /
              1024 /
              1024
            ).toFixed(2)}MB, maksimum ${MAX_PDF_SIZE / 1024 / 1024}MB)`,
          });
          return null;
        }

        const originalName = path.split("/").pop() || path;
        const baseName = originalName.replace(/\.pdf$/i, "").toLowerCase();

        const existingChemical = chemicalMap.get(baseName);
        if (!existingChemical) {
          failed.push({ file: originalName, reason: "Chemical not found" });
          return null;
        }

        // Upload ke Vercel Blob
        const fileName = `${Date.now()}-${originalName}`;
        const { url } = await put(fileName, pdfBuffer, {
          access: "public",
          contentType: "application/pdf",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // Upsert SDS
        const record = await db.safetyDataSheet.upsert({
          where: { chemicalId: existingChemical.id },
          update: {
            fileName: originalName,
            filePath: url,
            language: "ID",
            updatedById: userAccess.userId,
          },
          create: {
            chemicalId: existingChemical.id,
            fileName: originalName,
            filePath: url,
            language: "ID",
            createdById: userAccess.userId,
          },
        });

        console.log(`✅ Berhasil memproses: ${originalName}`);

        return {
          id: record.id,
          fileName: record.fileName,
          filePath: record.filePath,
          externalUrl: record.externalUrl ?? null,
          language: record.language,
          createdByName:
            userAccess.role === "ADMIN"
              ? "Administrator"
              : userAccess.name || "Unknown",
          updatedByName:
            userAccess.role === "ADMIN"
              ? "Administrator"
              : userAccess.name || "Unknown",
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          chemical: {
            id: existingChemical.id,
            name: existingChemical.name,
            formula: existingChemical.formula,
            form: existingChemical.form,
            characteristic: existingChemical.characteristic,
          },
        } as SDS;
      } catch (err) {
        failed.push({ file: path, reason: String(err) });
        return null;
      }
    };

    // Proses semua file dengan concurrency limit
    const records: SDS[] = (
      await Promise.all(
        pdfEntries.map((entry) => limit(() => processFile(entry)))
      )
    ).filter((r): r is SDS => r !== null);

    console.log(
      `\n📊 Import selesai. Berhasil: ${records.length}, Gagal: ${failed.length}`
    );
    if (failed.length > 0) console.table(failed);

    return NextResponse.json({
      message: "Import SDS selesai",
      success: records.length,
      failed: failed.length,
      records,
      errors: failed,
    });
  } catch (error) {
    console.error("Error importing SDS:", error);
    return NextResponse.json(
      { error: "Error importing SDS", detail: String(error) },
      { status: 500 }
    );
  }
}

// Konfigurasi untuk App Router - Nonaktifkan bodyParser default
export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser default untuk handle FormData
  },
};
