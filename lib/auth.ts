import jwt from "jsonwebtoken";
import { UserAuth } from "@/types/auth";
import { cookies } from "next/headers";
import db from "./db";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const generateToken = (payload: UserAuth): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d", algorithm: "HS256" });
};

export const verifyToken = (token: string): UserAuth | null => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as UserAuth;
  } catch {
    return null;
  }
};

export async function getCurrentUser() {
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
    }

    return {
      userId: user.id,
      roleId: roleId,
      email: user.email,
      name: name,
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString(),
      lastLogin: user.updated_at.toISOString(),
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
