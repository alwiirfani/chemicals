import { requireAuthOrNull, requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { chemicalUpdateSchema } from "@/lib/validation/chemicals";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chemicalId: string }> }
) {
  try {
    const userAccess = await requireAuthOrNull();
    if (userAccess instanceof NextResponse) return userAccess;

    const { chemicalId } = await params;

    if (!chemicalId)
      return NextResponse.json(
        { error: "Chemical ID not provided" },
        { status: 400 }
      );

    const chemical = await db.chemical.findUnique({
      where: { id: chemicalId },
    });

    if (!chemical) {
      return NextResponse.json(
        { error: "Chemical not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Chemical fetched successfully", chemical },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chemical:", error);
    return NextResponse.json(
      { error: "Failed to fetch chemical" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ chemicalId: string }> }
) {
  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { chemicalId } = await params;
    const body = await request.json();

    // validasi chemical selalu wajib
    const parsedChemical = chemicalUpdateSchema.safeParse(body);
    if (!parsedChemical.success) {
      return NextResponse.json(
        { error: "Data tidak valid", issues: parsedChemical.error.issues },
        { status: 400 }
      );
    }

    const {
      name,
      formula,
      form,
      characteristic,
      unit,
      purchaseDate,
      expirationDate,
      type,
      quantity,
      description,
    } = parsedChemical.data;

    const existingChemical = await db.chemical.findUnique({
      where: { id: chemicalId },
    });
    if (!existingChemical) {
      return NextResponse.json(
        { error: "Chemical not found" },
        { status: 404 }
      );
    }

    // default: stok lama dipakai
    let newStock = existingChemical.currentStock;

    // hanya kalau ada mutasi stok
    if (type && quantity !== undefined) {
      if (type === "ADD") {
        newStock += quantity;
      } else if (type === "REDUCE") {
        newStock -= quantity;
        if (newStock < 0) {
          return NextResponse.json(
            { error: "Stok tidak boleh negatif" },
            { status: 400 }
          );
        }
      }
    }

    // cek mutasi stok hari ini
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingMutation = await db.stockMutation.findFirst({
      where: {
        chemicalId,
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
    });

    const safeQuantity = quantity ?? 0;
    const quantityChange = type === "ADD" ? safeQuantity : -safeQuantity;

    if (existingMutation) {
      await db.stockMutation.update({
        where: { id: existingMutation.id },
        data: {
          quantity: existingMutation.quantity + quantityChange,
          description: description || "Perubahan stok (otomatis)",
          updatedById: userAccess.userId,
        },
      });
    } else {
      await db.stockMutation.create({
        data: {
          chemicalId,
          quantity: quantityChange,
          description: description || "Perubahan stok (otomatis)",
          createdById: userAccess.userId,
        },
      });
    }

    // update data kimia (stok ikut diupdate jika ada mutasi)
    const updatedChemical = await db.chemical.update({
      where: { id: chemicalId },
      data: {
        name,
        formula,
        form,
        characteristic,
        currentStock: newStock,
        unit,
        purchaseDate: new Date(purchaseDate).toISOString(),
        expirationDate: expirationDate
          ? new Date(expirationDate).toISOString()
          : null,
        updatedBy: { connect: { id: userAccess.userId } },
      },
    });

    return NextResponse.json(
      { message: "Chemical updated successfully", chemical: updatedChemical },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chemical:", error);
    return NextResponse.json(
      { error: "Failed to update chemical" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chemicalId: string }> }
) {
  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { chemicalId } = await params;

    await db.chemical.delete({
      where: { id: chemicalId },
    });

    return NextResponse.json(
      { message: "Chemical deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting chemical:", error);
    return NextResponse.json(
      { error: "Failed to delete chemical" },
      { status: 500 }
    );
  }
}
