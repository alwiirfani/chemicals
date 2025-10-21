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

// cek token apakah expired
export const isTokenExpiredRuntimeEdge = (token: string): boolean => {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const { exp } = JSON.parse(decodedPayload);

    console.log("Token Expiration Time (exp):", new Date(exp * 1000));
    console.log("Current Time:", new Date());

    if (!exp) {
      console.log("Token does not have an 'exp' property.");
      return true;
    }

    const expiryDate = new Date(exp * 1000);
    const isExpired = expiryDate.getTime() < Date.now();
    console.log("Is token expired?", isExpired);
    return isExpired;
  } catch (error) {
    console.error(
      "Error parsing token. Token will be considered invalid.",
      error
    );
    return true;
  }
};

// apakah token masih aktif (tidak expired) (runtime nodejs)
export function isTokenExpiredRuntimeNodeJS(token: string): boolean {
  try {
    const payload = verifyToken(token) as UserAuth;
    console.log("Payload: ", payload);

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.log("Token expired: ", error);
    return true;
  }
}

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
