// app/api/reports/realtime/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { subHours } from "date-fns";

export async function GET() {
  try {
    const oneHourAgo = subHours(new Date(), 1);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [
      activeBorrowings,
      recentUsage,
      lowStockChemicals,
      expiringSoonChemicals,
      recentBorrowingActivity,
    ] = await Promise.all([
      // Active borrowings (approved but not returned)
      db.borrowing.count({
        where: {
          status: "APPROVED",
          returnedAt: null,
        },
      }),

      // Recent usage (last 1 hour) - sum of quantities
      db.usageHistory.aggregate({
        where: {
          usedAt: {
            gte: oneHourAgo,
          },
        },
        _sum: {
          quantity: true,
        },
      }),

      // Low stock alerts (stock less than 10)
      db.chemical.count({
        where: {
          currentStock: {
            lt: 10,
          },
        },
      }),

      // Expiring soon (next 7 days)
      db.chemical.count({
        where: {
          expirationDate: {
            lte: sevenDaysFromNow,
            gte: new Date(),
          },
        },
      }),

      // Recent borrowing activity (last 1 hour)
      db.borrowing.count({
        where: {
          requestDate: {
            gte: oneHourAgo,
          },
        },
      }),
    ]);

    return NextResponse.json({
      activeBorrowings,
      recentUsage: recentUsage._sum.quantity || 0,
      lowStockAlerts: lowStockChemicals,
      expiringAlerts: expiringSoonChemicals,
      recentBorrowingActivity,
    });
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time data" },
      { status: 500 }
    );
  }
}
