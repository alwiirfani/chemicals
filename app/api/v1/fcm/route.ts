import { requireAuthOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userAccess = await requireAuthOrNull();
    if (userAccess instanceof NextResponse) return userAccess;

    const { fcmToken, browserName, deviceType, deviceMerk } =
      await request.json();

    if (!fcmToken) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    // Cek apakah device sudah ada
    const existingDevice = await db.device.findFirst({
      where: { fcmToken, userId: userAccess.userId },
    });

    if (existingDevice) {
      // Update lastUsed otomatis karena pakai @updatedAt
      await db.device.update({
        where: { id: existingDevice.id },
        data: { deviceType, deviceMerk },
      });
    } else {
      // Simpan device baru
      await db.device.create({
        data: {
          fcmToken,
          browserName,
          deviceType,
          deviceMerk,
          userId: userAccess.userId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Gagal mengirim notifikasi" },
      { status: 500 }
    );
  }
}
