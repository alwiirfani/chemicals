import {
  findClosestChemical,
  normalizeChemicalName,
} from "@/helpers/sds/normalization-pdf";
import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { UploadedFile } from "@/types/sds";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const body = await request.json();
    const files: UploadedFile[] = body.files;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada file yang dikirim" },
        { status: 400 }
      );
    }

    const results: {
      fileName: string;
      status: string;
      message?: string;
      chemical?: string;
      sdsId?: string;
    }[] = [];

    console.log("Files:", files);

    for (const file of files) {
      if (!file || !file.fileName || !file.filePath) {
        results.push({
          fileName: file?.fileName ?? "Unknown",
          status: "error",
          message: "File tidak valid atau null",
        });
        continue;
      }

      const { fileName, filePath } = file;

      // ambil nama bahan kimia dari nama file (misal "Butanol.pdf" → "Butanol")
      const baseName = normalizeChemicalName(fileName);

      // coba cari chemical di database
      let chemical = await db.chemical.findFirst({
        where: {
          name: {
            equals: baseName,
            mode: "insensitive", // case-insensitive match
          },
        },
      });

      if (!chemical) {
        chemical = await db.chemical.findFirst({
          where: {
            name: { contains: baseName, mode: "insensitive" },
          },
        });
      }

      if (!chemical) {
        // jika chemical tidak ditemukan, cari chemical dengan edit distance
        chemical = await findClosestChemical(baseName);
      }

      if (!chemical) {
        results.push({
          fileName,
          status: "error",
          message: "Bahan kimia tidak ditemukan",
        });
        continue;
      }

      // simpan atau update SDS record
      const sds = await db.safetyDataSheet.upsert({
        where: {
          chemicalId: chemical.id,
        },
        update: {
          fileName,
          filePath,
          language: "ID",
          updatedAt: new Date(),
          updatedById: userAccess.userId,
        },
        create: {
          chemicalId: chemical.id,
          fileName,
          filePath,
          language: "ID",
          createdAt: new Date(),
          createdById: userAccess.userId,
        },
      });

      results.push({
        fileName,
        status: "success",
        chemical: chemical.name,
        sdsId: sds.id,
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error import SDS:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
