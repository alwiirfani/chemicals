import { type NextRequest, NextResponse } from "next/server";
import { requireRole, hashPassword } from "@/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireRole(["ADMIN", "LABORAN"]);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination params" },
        { status: 400 }
      );
    }

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { email: { contains: search, mode: "insensitive" } },
                { username: { contains: search, mode: "insensitive" } },
                {
                  mahasiswa: {
                    full_name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  dosen: {
                    full_name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  laboran: {
                    full_name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : null, // ✅ null bukan string kosong
        status ? { status } : null,
        role ? { role } : null,
      ].filter(Boolean) as Prisma.UserWhereInput[], // ✅ filter buang null
    };

    const [
      users,
      total,
      active,
      inactive,
      blocked,
      admins,
      laborans,
      mahasiswa,
      dosen,
    ] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          admin: true,
          mahasiswa: true,
          dosen: true,
          laboran: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      db.user.count({ where }),
      db.user.count({ where: { ...where, status: "ACTIVE" } }),
      db.user.count({ where: { ...where, status: "INACTIVE" } }),
      db.user.count({ where: { ...where, status: "BLOCKED" } }),
      db.user.count({ where: { ...where, role: "ADMIN" } }),
      db.user.count({ where: { ...where, role: "LABORAN" } }),
      db.user.count({ where: { ...where, role: "MAHASISWA" } }),
      db.user.count({ where: { ...where, role: "DOSEN" } }),
    ]);

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
        roleId,
        role: user.role,
        status: user.status,
        createdAt: user.created_at.toISOString(),
        lastLogin: user.updated_at.toISOString(),
        userId: user.id,
      };
    });

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total,
        active,
        inactive,
        blocked,
        admins,
        laborans,
        regularUsers: mahasiswa + dosen,
      },
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
    await requireRole(["ADMIN"]);

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
