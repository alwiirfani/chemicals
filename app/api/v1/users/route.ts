import { type NextRequest, NextResponse } from "next/server";
import { hashPassword, requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const userAccess = await requireRoleOrNull(["ADMIN", "LABORAN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const users = await db.user.findMany({
      include: {
        admin: true,
        mahasiswa: true,
        dosen: true,
        laboran: true,
      },
      orderBy: { created_at: "desc" },
    });

    const formattedUsers = users.map((user) => {
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

      return {
        email: user.email,
        name,
        username: user.username,
        roleId,
        role: user.role,
        status: user.status,
        createdAt: user.created_at.toISOString(),
        lastLogin: user.updated_at.toISOString(),
        userId: user.id,
      };
    });

    return NextResponse.json({
      message: "Users fetched successfully",
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userAccess = await requireRoleOrNull(["ADMIN"]);
    if (userAccess instanceof NextResponse) return userAccess;

    const body = await request.json();
    const { email, password, role, roleId, name } = body;

    if (!email || !password || !role || !roleId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username: email.split("@")[0] }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const username = email.split("@")[0];

    // Create user in transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: role,
        },
      });

      // Create role-specific record
      switch (role) {
        case "ADMIN":
          await tx.admin.create({
            data: {
              pin: roleId,
              user_id: user.id,
            },
          });
          break;
        case "MAHASISWA":
          await tx.mahasiswa.create({
            data: {
              nim: roleId,
              full_name: name,
              user_id: user.id,
            },
          });
          break;
        case "DOSEN":
          await tx.dosen.create({
            data: {
              nidn: roleId,
              full_name: name,
              user_id: user.id,
            },
          });
          break;
        case "LABORAN":
          await tx.laboran.create({
            data: {
              nip: roleId,
              full_name: name,
              user_id: user.id,
            },
          });
          break;
      }

      return user;
    });

    return NextResponse.json({
      message: "User created successfully",
      userId: result.id,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
