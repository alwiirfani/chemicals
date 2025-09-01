import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { SDS } from "@/types/sds";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

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

    // Load ZIP
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = await JSZip.loadAsync(buffer);

    // Ambil semua entry PDF valid
    const pdfEntries = Object.entries(zip.files).filter(
      ([path, entry]) => !entry.dir && path.toLowerCase().endsWith(".pdf")
    );

    const failed: { file: string; reason: string }[] = [];

    // Proses paralel dengan Promise.all
    const records: SDS[] = (
      await Promise.all(
        pdfEntries.map(async ([path, entry]) => {
          try {
            const pdfBuffer = await entry.async("nodebuffer");

            const originalName = path.split("/").pop() || path;
            const baseName = originalName.replace(/\.pdf$/i, "").toLowerCase();

            const existingChemical = await db.chemical.findFirst({
              where: {
                name: { equals: baseName, mode: "insensitive" },
              },
            });

            if (!existingChemical) {
              console.warn(`No chemical found for ${baseName}`);
              failed.push({ file: originalName, reason: "Chemical not found" });
              return null; // skip
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
            console.error("Error processing file:", path, err);
            failed.push({ file: path, reason: String(err) });
            return null;
          }
        })
      )
    ).filter((r): r is SDS => r !== null);

    return NextResponse.json({
      message: "Import SDS selesai",
      count: records.length,
      records,
    });
  } catch (error) {
    console.error("Error importing SDS:", error);
    return NextResponse.json(
      { error: "Error importing SDS", detail: String(error) },
      { status: 500 }
    );
  }
}
