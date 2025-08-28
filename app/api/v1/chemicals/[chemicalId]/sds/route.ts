import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { sdsCreateSchema } from "@/lib/validation/sds";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chemicalId: string }> }
) {
  try {
    const userAccess = await requireRoleOrNull(["ADMIN", "LABORAN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { chemicalId } = await params;

    const formData = await request.formData();
    const parsed = sdsCreateSchema.safeParse({
      externalUrl: formData.get("externalUrl") || undefined,
      language: formData.get("language"),
      sdsFile: formData.get("sdsFile") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { externalUrl, language, sdsFile } = parsed.data;

    const chemicalExist = await db.chemical.findUnique({
      where: { id: chemicalId },
    });
    if (!chemicalExist) {
      return NextResponse.json(
        { error: "Chemical not found" },
        { status: 404 }
      );
    }

    //! Validasi hanya salah satu
    if (!externalUrl && !sdsFile) {
      return NextResponse.json(
        { error: "Harus mengirim file SDS atau link eksternal" },
        { status: 400 }
      );
    }
    if (externalUrl && sdsFile) {
      return NextResponse.json(
        { error: "Pilih salah satu: file SDS atau link eksternal" },
        { status: 400 }
      );
    }

    // Simpan file ke folder public/uploads/sds
    let fileUrl = null;
    if (sdsFile) {
      const bytes = await sdsFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public/uploads/sds");
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileName = `${Date.now()}-${sdsFile.name}`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);

      // Path yang akan disimpan ke DB (akses dari FE)
      fileUrl = `/uploads/sds/${fileName}`;
    }

    const sds = await db.safetyDataSheet.create({
      data: {
        fileName: sdsFile?.name || null,
        filePath: fileUrl || null,
        externalUrl,
        language,
        chemicalId: chemicalId,
        createdById: userAccess.userId,
      },
    });

    console.log("SDS created:", sds);

    return NextResponse.json(
      { message: "Safety Data Sheet berhasil ditambahkan", sds },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching SDS [POST]:", error);
    return NextResponse.json(
      { error: "Error fetching SDS", detail: String(error) },
      { status: 500 }
    );
  }
}
