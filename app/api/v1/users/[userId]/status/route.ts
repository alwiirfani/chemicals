import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { UserStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    await requireRole(["ADMIN", "LABORAN"]);

    const { userId } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["ACTIVE", "INACTIVE", "BLOCKED"].includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { status: status as UserStatus },
    });

    return NextResponse.json({
      message: "Status updated successfully",
      newStatus: updated.status,
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    return NextResponse.json(
      { error: "Failed to toggle status" },
      { status: 500 }
    );
  }
}
