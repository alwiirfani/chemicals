import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
