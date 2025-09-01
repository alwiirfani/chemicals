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

    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = await JSZip.loadAsync(buffer);

    const createRecords: SDS[] = [];

    for (const [path, entry] of Object.entries(zip.files)) {
      if (entry.dir || !path.toLowerCase().endsWith(".pdf")) continue; // skip folder & non-PDF file

      const pdfBuffer = await entry.async("nodebuffer");

      // ambil nama file asli tanpa folder
      const originalName = path.split("/").pop() || path;
      const fileName = `${Date.now()}-${originalName}`;

      const baseName = originalName.replace(/\.pdf$/i, "").toLowerCase(); // Remove .pdf extension

      const existingChemical = await db.chemical.findFirst({
        where: {
          name: {
            equals: baseName,
            mode: "insensitive",
          },
        },
      });

      if (!existingChemical) {
        console.warn(`No chemical found for ${baseName}`);
        continue; // Skip if no matching chemical found
      }

      const { url } = await put(fileName, pdfBuffer, {
        access: "public",
        contentType: "application/pdf",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const record = await db.safetyDataSheet.upsert({
        where: { chemicalId: existingChemical.id },
        update: {
          chemicalId: existingChemical.id,
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

      createRecords.push({
        id: record.id,
        fileName: record.fileName,
        filePath: record.filePath,
        externalUrl: record.externalUrl ? record.externalUrl : null,
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
      });
    }

    return NextResponse.json({
      message: "import berhasil",
      count: createRecords.length,
      records: createRecords,
    });
  } catch (error) {
    console.error("Error importing SDS:", error);
    return NextResponse.json(
      { error: "Error importing SDS", detail: String(error) },
      { status: 500 }
    );
  }
}
