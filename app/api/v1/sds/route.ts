import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sdsRecords = await db.safetyDataSheet.findMany({
      include: {
        chemical: {
          select: {
            name: true,
            formula: true,
            form: true,
            characteristic: true,
          },
        },
        createdBy: { include: { admin: true, laboran: true } },
        updatedBy: { include: { admin: true, laboran: true } },
      },
      orderBy: { fileName: "asc" },
    });

    const formattedSdsRecords = sdsRecords.map((sds) => {
      let createdByName = "";
      let updatedByName = undefined;

      switch (sds.createdBy.role) {
        case "ADMIN":
          createdByName = "Administrator";
          updatedByName = sds.updatedBy ? "Administrator" : "";
          break;
        case "LABORAN":
          createdByName = sds.createdBy.laboran?.full_name || "";
          updatedByName = sds.updatedBy ? sds.updatedBy.laboran?.full_name : "";
          break;
        case "PETUGAS_GUDANG":
          createdByName = sds.createdBy.laboran?.full_name || "";
          updatedByName = sds.updatedBy ? sds.updatedBy.laboran?.full_name : "";
          break;
        default:
          createdByName = "Tidak diketahui";
          break;
      }

      return {
        id: sds.id,
        file_name: sds.fileName,
        file_path: sds.filePath,
        external_url: sds.externalUrl,
        language: sds.language,
        created_at: sds.createdAt.toISOString(),
        updated_at: sds.updatedAt.toISOString(),
        created_by: createdByName,
        updated_by: updatedByName,
        chemical: {
          name: sds.chemical.name,
          formula: sds.chemical.formula,
          form: sds.chemical.form,
          characteristic: sds.chemical.characteristic,
        },
      };
    });

    return NextResponse.json(
      {
        message: "All SDS fetched successfully",
        total: sdsRecords.length,
        sds: formattedSdsRecords,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all SDS [GET]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
