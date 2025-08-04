import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const totalChemicals = await db.chemical.count();
  const lowStockChemicals = await db.chemical.count({
    where: { stock: { lt: 10 }, isActive: true },
  });
  const expiringChemicals = await db.chemical.count({
    where: {
      expirationDate: {
        gte: new Date(),
        lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
      isActive: true,
    },
  });

  return NextResponse.json({
    totalChemicals,
    lowStockChemicals,
    expiringChemicals,
  });
}
