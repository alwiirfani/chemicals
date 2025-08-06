import { type NextRequest, NextResponse } from "next/server";
import { requireRole, hashPassword, requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { editUserForAdminSchema } from "@/lib/validation/users";
import { updateUserRoleData } from "@/helpers/users/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await requireRole(["ADMIN", "LABORAN"]);

    const userId = params.userId;

    const user = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { admin: { pin: userId } },
          { mahasiswa: { nim: userId } },
          { dosen: { nidn: userId } },
          { laboran: { nip: userId } },
        ],
      },
      include: {
        admin: true,
        mahasiswa: true,
        dosen: true,
        laboran: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let roleId = "";
    let name = "";

    switch (user.role) {
      case "ADMIN":
        roleId = user.admin?.pin || "";
        name = "Administrator";
        break;
      case "MAHASISWA":
        roleId = user.mahasiswa?.nim || "";
        name = user.mahasiswa?.full_name || "";
        break;
      case "DOSEN":
        roleId = user.dosen?.nidn || "";
        name = user.dosen?.full_name || "";
        break;
      case "LABORAN":
        roleId = user.laboran?.nip || "";
        name = user.laboran?.full_name || "";
        break;
    }

    const formattedUser = {
      userId: user.id,
      roleId: roleId,
      email: user.email,
      name,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString(),
      lastLogin: user.updated_at.toISOString(),
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userAccess = await requireRoleOrNull(["ADMIN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const { userId } = await params;
    const body = await request.json();
    const parsed = editUserForAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, newPassword, status, username, name } = parsed.data;

    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        admin: true,
        mahasiswa: true,
        dosen: true,
        laboran: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let roleId = "";
    switch (existingUser.role) {
      case "ADMIN":
        roleId = existingUser.admin?.pin || "";
        break;
      case "MAHASISWA":
        roleId = existingUser.mahasiswa?.nim || "";
        break;
      case "DOSEN":
        roleId = existingUser.dosen?.nidn || "";
        break;
      case "LABORAN":
        roleId = existingUser.laboran?.nip || "";
        break;
    }

    const hashedPassword = newPassword
      ? await hashPassword(newPassword)
      : existingUser.password;

    // Update user data and role data
    const updatedUser = await db.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          email,
          password: hashedPassword,
          status,
          username,
        },
      });

      await updateUserRoleData(tx, user.role, roleId, name);

      return user;
    });

    return NextResponse.json(
      { message: "User updated successfully", userId: updatedUser.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await requireRole(["ADMIN"]);

    const { userId } = await params;

    const user = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { admin: { pin: userId } },
          { mahasiswa: { nim: userId } },
          { dosen: { nidn: userId } },
          { laboran: { nip: userId } },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
