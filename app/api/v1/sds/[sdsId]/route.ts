import fs from "fs/promises";
import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { sdsUpdateSchema } from "@/lib/validation/sds";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sdsId: string }> }
) {
  try {
    const userAccess = await requireRoleOrNull(["ADMIN", "LABORAN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { sdsId } = await params;

    // Cek apakah SDS ada
    const existingSds = await db.safetyDataSheet.findUnique({
      where: { id: sdsId },
    });

    if (!existingSds) {
      return NextResponse.json(
        { error: "Safety Data Sheet tidak ditemukan" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const parsed = sdsUpdateSchema.safeParse({
      chemicalId: formData.get("chemicalId") || undefined,
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

    const { chemicalId, externalUrl, language, sdsFile } = parsed.data;

    // Kalau user mau ganti chemical
    if (chemicalId) {
      const chemicalExist = await db.chemical.findUnique({
        where: { id: chemicalId },
      });
      if (!chemicalExist) {
        return NextResponse.json(
          { error: "Chemical tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    //! Validasi hanya salah satu (file atau link)
    if (
      !externalUrl &&
      !sdsFile &&
      !existingSds.filePath &&
      !existingSds.externalUrl
    ) {
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

    let fileUrl = existingSds.filePath;
    let fileName = existingSds.fileName;

    // Kalau ada file baru → hapus file lama
    if (sdsFile) {
      if (existingSds.filePath) {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          existingSds.filePath
        );
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.warn("Gagal menghapus file lama:", err);
        }
      }

      const bytes = await sdsFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public/uploads/sds");
      await fs.mkdir(uploadsDir, { recursive: true });

      fileName = `${Date.now()}-${sdsFile.name}`;
      const newFilePath = path.join(uploadsDir, fileName);
      await fs.writeFile(newFilePath, buffer);

      fileUrl = `/uploads/sds/${fileName}`;
    }

    // Kalau ganti external URL → hapus file lama
    if (externalUrl && existingSds.filePath) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        existingSds.filePath
      );
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn("Gagal menghapus file lama:", err);
      }
      fileUrl = null;
      fileName = null;
    }

    const sds = await db.safetyDataSheet.update({
      where: { id: sdsId },
      data: {
        chemicalId: chemicalId || existingSds.chemicalId,
        fileName,
        filePath: fileUrl,
        externalUrl,
        language,
      },
    });

    console.log("SDS created:", sds);

    return NextResponse.json(
      { message: "Safety Data Sheet berhasil ditambahkan", sds },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating SDS:", error);
    return NextResponse.json(
      { error: "Failed to update SDS" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sdsId: string }> }
) {}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sdsId: string }> }
) {
  try {
    const userAccess = await requireRoleOrNull(["ADMIN", "LABORAN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { sdsId } = await params;

    await db.safetyDataSheet.delete({
      where: { id: sdsId },
    });

    return NextResponse.json(
      { message: "SDS deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting SDS:", error);
    return NextResponse.json(
      { error: "Failed to delete SDS" },
      { status: 500 }
    );
  }
}
