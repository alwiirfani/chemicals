import { type NextRequest, NextResponse } from "next/server";
import { requireRole, hashPassword } from "@/lib/auth";
import db from "@/lib/db";

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
    let fullName = "";

    switch (user.role) {
      case "ADMIN":
        roleId = user.admin?.pin || "";
        fullName = "Administrator";
        break;
      case "MAHASISWA":
        roleId = user.mahasiswa?.nim || "";
        fullName = user.mahasiswa?.full_name || "";
        break;
      case "DOSEN":
        roleId = user.dosen?.nidn || "";
        fullName = user.dosen?.full_name || "";
        break;
      case "LABORAN":
        roleId = user.laboran?.nip || "";
        fullName = user.laboran?.full_name || "";
        break;
    }

    const formattedUser = {
      id: roleId,
      email: user.email,
      name: fullName,
      nim: user.role === "MAHASISWA" ? roleId : undefined,
      role: user.role,
      status: "ACTIVE",
      createdAt: user.created_at.toISOString(),
      lastLogin: user.updated_at.toISOString(),
      userId: user.id,
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
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["ADMIN"]);

    const userId = params.id;
    const body = await request.json();
    const { email, password, roleData } = body;

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

    await db.$transaction(async (tx) => {
      // Update user basic info
      const updateData: { email?: string; password?: string } = {};
      if (email) updateData.email = email;
      if (password) updateData.password = await hashPassword(password);

      if (Object.keys(updateData).length > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }

      // Update role-specific data
      if (roleData) {
        switch (user.role) {
          case "ADMIN":
            if (user.admin) {
              await tx.admin.update({
                where: { pin: user.admin.pin },
                data: { pin: roleData.pin },
              });
            }
            break;
          case "MAHASISWA":
            if (user.mahasiswa) {
              await tx.mahasiswa.update({
                where: { nim: user.mahasiswa.nim },
                data: {
                  nim: roleData.nim,
                  full_name: roleData.full_name,
                },
              });
            }
            break;
          case "DOSEN":
            if (user.dosen) {
              await tx.dosen.update({
                where: { nidn: user.dosen.nidn },
                data: {
                  nidn: roleData.nidn,
                  full_name: roleData.full_name,
                },
              });
            }
            break;
          case "LABORAN":
            if (user.laboran) {
              await tx.laboran.update({
                where: { nip: user.laboran.nip },
                data: {
                  nip: roleData.nip,
                  full_name: roleData.full_name,
                },
              });
            }
            break;
        }
      }
    });

    return NextResponse.json({ message: "User updated successfully" });
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
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(["ADMIN"]);

    const userId = params.id;

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
