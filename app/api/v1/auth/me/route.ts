import { NextResponse } from "next/server";
import { requireAuthOrNull } from "@/lib/auth";

export async function GET() {
  const user = await requireAuthOrNull();
  if (user instanceof NextResponse) return user;

  return NextResponse.json({ user });
}
