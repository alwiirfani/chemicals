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
      select: { id: true, fcmToken: true },
    });

    if (devices.length === 0) {
      return NextResponse.json({ error: "Tidak ada device" }, { status: 404 });
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens: devices.map((d) => d.fcmToken),
      notification: { title, body },
      webpush: {
        notification: {
          icon: "/notification192.png",
          badge: "/notification48.png",
        },
        fcmOptions: {
          link:
            url || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
        },
      },
      data: { url: url || "/" },
      android: {
        notification: {
          icon: "/notification192.png",
          color: "#2196F3", // biru muda
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
      },
    });

    console.log("Notification sent:", response);

    // Handle token invalid
    await Promise.all(
      response.responses.map(async (res, idx) => {
        if (!res.success) {
          const errorCode = res.error?.code;
          if (errorCode === "messaging/registration-token-not-registered") {
            const invalidToken = devices[idx].fcmToken;
            await db.device.deleteMany({ where: { fcmToken: invalidToken } });
            console.log("Deleted invalid token:", invalidToken);
          }
        }
      })
    );

    return NextResponse.json({
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Gagal mengirim notifikasi" },
      { status: 500 }
    );
  }
}
