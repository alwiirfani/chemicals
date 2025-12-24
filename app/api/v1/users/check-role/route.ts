import { NextResponse } from "next/server";
import { isRoleIdTakenServer } from "@/lib/services/users/user.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const roleId = searchParams.get("roleId");

  if (!role || !roleId) {
    return NextResponse.json({ exists: false });
  }

  const exists = await isRoleIdTakenServer(role, roleId);
  return NextResponse.json({ exists: !!exists });
}
