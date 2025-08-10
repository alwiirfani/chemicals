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
      externalUrl: formData.get("externalUrl") as string,
      language: formData.get("language"),
      hazardClassification: JSON.parse(
        formData.get("hazardClassification") as string
      ),
      precautionaryStatement: JSON.parse(
        formData.get("precautionaryStatement") as string
      ),
      firstAidInhalation: formData.get("firstAidInhalation") as string,
      firstAidSkin: formData.get("firstAidSkin") as string,
      firstAidEye: formData.get("firstAidEye") as string,
      firstAidIngestion: formData.get("firstAidIngestion") as string,
      storageConditions: formData.get("storageConditions") as string,
      sdsFile: formData.get("sdsFile") as File,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      externalUrl,
      language,
      hazardClassification,
      precautionaryStatement,
      firstAidInhalation,
      firstAidSkin,
      firstAidEye,
      firstAidIngestion,
      storageConditions,
      disposalInfo,
      sdsFile,
    } = parsed.data;

    const chemicalExist = await db.chemical.findUnique({
      where: { id: chemicalId },
    });
    if (!chemicalExist) {
      return NextResponse.json(
        { error: "Chemical not found" },
        { status: 404 }
      );
    }

    // Simpan file ke folder public/uploads/sds
    const bytes = await sdsFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public/uploads/sds");
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${sdsFile.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Path yang akan disimpan ke DB (akses dari FE)
    const fileUrl = `/uploads/sds/${fileName}`;

    const sds = await db.safetyDataSheet.create({
      data: {
        fileName: sdsFile.name.toString(),
        filePath: fileUrl,
        externalUrl,
        language,
        hazardClassification,
        precautionaryStatement,
        firstAidInhalation,
        firstAidSkin,
        firstAidEye,
        firstAidIngestion,
        storageConditions,
        disposalInfo,
        chemical: { connect: { id: chemicalId } },
        createdBy: { connect: { id: userAccess.userId } },
      },
    });

    return NextResponse.json(
      { message: "Safety Data Sheet berhasil ditambahkan", sds },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching SDS [POST]:", error);
  }
}
