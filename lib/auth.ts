import jwt from "jsonwebtoken";
import { UserAuth } from "@/types/auth";
import { cookies } from "next/headers";
import db from "./db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (payload: UserAuth): string => {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" });
};

// verifikasi token dengan format payload UserAuth
export const verifyToken = (token: string): UserAuth | null => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as UserAuth;
  } catch {
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: {
        admin: true,
        mahasiswa: true,
        dosen: true,
        laboran: true,
      },
    });

    if (!user) return null;

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
      case "PETUGAS_GUDANG":
        roleId = user.laboran?.nip || "";
        name = user.laboran?.full_name || "";
        break;
    }

    return {
      userId: user.id,
      roleId: roleId,
      email: user.email,
      name: name,
      username: user.username,
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString(),
      lastLogin: user.updated_at.toISOString(),
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
};

// Client
export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};

export const requireRole = async (allowedRoles: string[]) => {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
};

// Server
export const requireAuthOrNull = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
};

export const requireRoleOrNull = async (allowedRoles: string[]) => {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
