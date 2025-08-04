import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const recentActivities = await db.borrowing.findMany({
    take: 5,
    orderBy: { requestDate: "desc" },
    include: {
      borrower: { select: { username: true } },
      items: {
        select: {
          chemical: {
            select: { name: true, unit: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ recentActivities });
}
