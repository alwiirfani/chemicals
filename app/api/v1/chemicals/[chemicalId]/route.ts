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
    const userAccess = await requireRoleOrNull(["ADMIN", "LABORAN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { chemicalId } = await params;
    const body = await request.json();
    const parsed = chemicalUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      name,
      formula,
      casNumber,
      form,
      stock,
      unit,
      purchaseDate,
      expirationDate,
      location,
      cabinet,
      room,
      temperature,
    } = parsed.data;

    const existingChemical = await db.chemical.findUnique({
      where: { id: chemicalId },
    });

    if (!existingChemical) {
      return NextResponse.json(
        { error: "Chemical not found" },
        { status: 404 }
      );
    }

    const updatedChemical = await db.chemical.update({
      where: { id: chemicalId },
      data: {
        name,
        formula,
        casNumber,
        form,
        stock,
        unit,
        purchaseDate: new Date(purchaseDate).toISOString(),
        expirationDate: expirationDate
          ? new Date(expirationDate).toISOString()
          : null,
        location,
        cabinet,
        room,
        temperature,
        updatedBy: { connect: { id: userAccess.userId } },
      },
    });

    console.log("Updated Chemical:", updatedChemical);

    return NextResponse.json(
      { message: "Chemical updated successfully" },
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
    const userAccess = await requireRoleOrNull(["ADMIN", "LABORAN"]);
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
