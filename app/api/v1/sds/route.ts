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
                { fileName: { contains: search, mode: "insensitive" } },
              ],
            }
          : null,
        language
          ? { language: { contains: language, mode: "insensitive" } }
          : null,
      ].filter(Boolean) as Prisma.SafetyDataSheetWhereInput[],
    };

    const [sdsRecords, totalConditional, totalAllSds] = await Promise.all([
      db.safetyDataSheet.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.safetyDataSheet.count({ where }),
      db.safetyDataSheet.count(),
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
        message: "SDS fetched successfully",
        sds: sdsRecords,
        formattedSdsRecords: formattedSdsRecords,
        totalConditional,
        pagination: {
          page,
          totalAllSds,
          pages: Math.ceil(totalAllSds / limit),
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
