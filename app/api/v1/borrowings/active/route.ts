// app/api/v1/borrowings/active/route.ts

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [allActive, ownActive] = await Promise.all([
      db.borrowing.count({
        where: {
          status: { in: ["APPROVED", "OVERDUE"] },
        },
      }),
      db.borrowing.count({
        where: {
          status: { in: ["APPROVED", "OVERDUE"] },
          borrowerId: user.userId,
        },
      }),
    ]);

    return NextResponse.json({
      allActive,
      ownActive,
    });
  } catch (error) {
    console.error("Gagal mengambil data peminjaman aktif:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
