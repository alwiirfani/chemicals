import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import db from "@/lib/db";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(request: NextRequest) {
  const { userIds, title, body, url } = await request.json();

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: "userIds tidak valid" }, { status: 400 });
  }

  try {
    const devices = await db.device.findMany({
      where: { userId: { in: userIds } },
      select: { fcmToken: true },
    });

    if (devices.length === 0) {
      return NextResponse.json({ error: "Tidak ada device" }, { status: 404 });
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens: devices.map((d) => d.fcmToken),
      notification: { title, body },
      webpush: {
        notification: { icon: "/icon.svg" },
        fcmOptions: {
          link:
            url || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        },
      },
    });

    console.log("Notification sent:", response);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Gagal mengirim notifikasi" },
      { status: 500 }
    );
  }
}
