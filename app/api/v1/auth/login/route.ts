import { type NextRequest, NextResponse } from "next/server";
import { generateToken, verifyPassword } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log(email, password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        admin: true,
        mahasiswa: true,
        dosen: true,
        laboran: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    console.log("Password validation result:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Get role-specific data
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

    const token = generateToken({
      userId: user.id,
      roleId,
      email: user.email,
      name,
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString(),
      lastLogin: user.updated_at.toISOString(),
    });

    const response = NextResponse.json({
      user: {
        userId: user.id,
        roleId,
        email: user.email,
        name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at.toISOString(),
        lastLogin: user.updated_at.toISOString(),
      },
    });

    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { updated_at: new Date() },
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
