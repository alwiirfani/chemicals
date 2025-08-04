import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await requireAuth();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allActive = await db.borrowing.count({
      where: {
        status: { in: ["APPROVED", "OVERDUE"] },
      },
    });

    return NextResponse.json({ allActive });
  } catch (error) {
    console.error("Error fetching all active borrowings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
