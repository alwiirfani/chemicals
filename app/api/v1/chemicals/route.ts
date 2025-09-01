import { chemicalsCreateSchema } from "@/lib/validation/chemicals";
import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { ChemicalForm } from "@/types/chemicals";
import { requireRoleOrNull } from "@/lib/auth";

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
    const form = searchParams.get("form") || "";
    const characteristic = searchParams.get("characteristic") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.ChemicalWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { formula: { contains: search, mode: "insensitive" } },
              ],
            }
          : null,
        characteristic ? { characteristic: { equals: characteristic } } : null,
        form ? { form: { equals: form as ChemicalForm } } : null,
      ].filter(Boolean) as Prisma.ChemicalWhereInput[],
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      chemicals,
      total,
      totalChemicals,
      lowStockChemicals,
      expiringChemicals,
    ] = await Promise.all([
      db.chemical.findMany({
        where,
        include: {
          createdBy: {
            include: { admin: true, laboran: true },
          },
          updatedBy: {
            include: { admin: true, laboran: true },
          },
          safetyDataSheet: true,
          borrowings: { include: { borrowing: true } },
          usageHistory: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.chemical.count({ where }),
      db.chemical.count(),
      db.chemical.count({
        where: { currentStock: { lt: 10 } },
      }),
      db.chemical.count({
        where: {
          expirationDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
    ]);

    const formattedChemicals = chemicals.map((chemical) => {
      let createdByName = "";
      let updatedByName = undefined;
      switch (chemical.createdBy.role) {
        case "ADMIN":
          createdByName = "Administrator";
          updatedByName = chemical.updatedBy ? "Administrator" : "";
          break;
        case "LABORAN":
          createdByName = chemical.createdBy.laboran?.full_name || "";
          updatedByName = chemical.updatedBy
            ? chemical.updatedBy.laboran?.full_name
            : "";
          break;
        case "PETUGAS_GUDANG":
          createdByName = chemical.createdBy.laboran?.full_name || "";
          updatedByName = chemical.updatedBy
            ? chemical.updatedBy.laboran?.full_name
            : "";
          break;
        default:
          createdByName = "Tidak diketahui";
          break;
      }

      return {
        id: chemical.id,
        name: chemical.name,
        formula: chemical.formula,
        form: chemical.form,
        characteristic: chemical.characteristic,
        stock: chemical.currentStock,
        unit: chemical.unit,
        purchase_date: chemical.purchaseDate?.toISOString(),
        expiration_date: chemical.expirationDate?.toISOString(),
        created_by: createdByName,
        updated_by: updatedByName,
        created_at: chemical.createdAt.toISOString(),
        updated_at: chemical.updatedAt.toISOString(),
        sds_count: chemical.safetyDataSheet ? 1 : 0,
        borrowing_count: chemical.borrowings.length,
        usage_count: chemical.usageHistory.length,
      };
    });

    return NextResponse.json({
      message: "Chemicals fetched successfully",
      chemicals: chemicals,
      formattedChemicals: formattedChemicals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total: total,
        totalChemicals,
        lowStockChemicals,
        expiringChemicals,
      },
    });
  } catch (error) {
    console.error("Get chemicals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const body = await request.json();
    const parsed = chemicalsCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      name,
      formula = "",
      form,
      characteristic,
      stock,
      unit,
      purchaseDate,
      expirationDate,
    } = parsed.data;

    const chemicaExist = await db.chemical.findFirst({
      where: { name },
    });
    // Pengecekan duplikat CAS number
    if (chemicaExist) {
      return NextResponse.json(
        { error: "Bahan kimia dengan CAS number tersebut sudah ada" },
        { status: 409 }
      );
    }

    const chemical = await db.chemical.create({
      data: {
        name,
        formula,
        form,
        characteristic,
        initialStock: stock,
        currentStock: stock,
        unit,
        purchaseDate: new Date(purchaseDate),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        createdBy: { connect: { id: userAccess.userId } },
      },
    });

    return NextResponse.json(
      { message: "Bahan kimia berhasil ditambahkan", chemical },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding chemical:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
