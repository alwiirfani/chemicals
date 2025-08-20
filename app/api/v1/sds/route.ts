import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination params" },
        { status: 400 }
      );
    }

    const search = searchParams.get("search") || "";
    const language = searchParams.get("language") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.SafetyDataSheetWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  chemical: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  chemical: {
                    formula: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  chemical: {
                    casNumber: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  chemical: { form: { contains: search, mode: "insensitive" } },
                },
                { fileName: { contains: search, mode: "insensitive" } },
              ],
            }
          : null,
        language
          ? { language: { contains: language, mode: "insensitive" } }
          : null,
      ].filter(Boolean) as Prisma.SafetyDataSheetWhereInput[],
    };

    const [sdsRecords, total] = await Promise.all([
      db.safetyDataSheet.findMany({
        where,
        include: {
          chemical: {
            select: { name: true, formula: true, casNumber: true, form: true },
          },
          createdBy: { include: { admin: true, laboran: true } },
          updatedBy: { include: { admin: true, laboran: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.safetyDataSheet.count({ where }),
    ]);

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
        hazard_classification: sds.hazardClassification,
        precautionary_statement: sds.precautionaryStatement,
        first_aid_inhalation: sds.firstAidInhalation,
        first_aid_skin: sds.firstAidSkin,
        first_aid_eyes: sds.firstAidEye,
        first_aid_ingestion: sds.firstAidIngestion,
        storage_conditions: sds.storageConditions,
        disposal_info: sds.disposalInfo,
        download_count: sds.downloadCount,
        created_at: sds.createdAt.toISOString(),
        updated_at: sds.updatedAt.toISOString(),
        created_by: createdByName,
        opdated_by: updatedByName,
        chemical: {
          name: sds.chemical.name,
          formula: sds.chemical.formula,
          cas_number: sds.chemical.casNumber,
          form: sds.chemical.form,
        },
      };
    });

    return NextResponse.json(
      {
        message: "SDS fetched successfully",
        sds: sdsRecords,
        formattedSdsRecords: formattedSdsRecords,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching SDS [GET]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
