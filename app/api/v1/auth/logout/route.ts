import { requireAuthOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userAccess = await requireAuthOrNull();
    if (userAccess instanceof NextResponse) return userAccess;

    await db.device.deleteMany({
      where: {
        userId: userAccess.userId,
      },
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
