import { matchChemical } from "@/helpers/sds/normalization-pdf";
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

    const chemicals = await db.chemical.findMany();

    for (const file of files) {
      if (!file?.fileName || !file?.filePath) {
        results.push({
          fileName: file?.fileName ?? "Unknown",
          status: "error",
          message: "File tidak valid atau null",
        });
        continue;
      }

      const { fileName, filePath } = file;
      const matched = matchChemical(fileName, chemicals);

      if (!matched) {
        results.push({
          fileName,
          status: "error",
          message: "Bahan kimia tidak ditemukan",
        });
        continue;
      }

      // Simpan atau update SDS
      const sds = await db.safetyDataSheet.upsert({
        where: { chemicalId: matched.id },
        update: {
          fileName,
          filePath,
          language: "ID",
          updatedAt: new Date(),
          updatedById: userAccess.userId,
        },
        create: {
          chemicalId: matched.id,
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
        chemical: matched.name,
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
