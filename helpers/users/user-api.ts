import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export type Role = "ADMIN" | "MAHASISWA" | "DOSEN" | "LABORAN";

export function getRoleIdLabel(role: Role | string): string {
  switch (role) {
    case "ADMIN":
      return "PIN";
    case "MAHASISWA":
      return "NIM";
    case "DOSEN":
      return "NIDN";
    case "LABORAN":
      return "NIP";
    default:
      return "ID";
  }
}

export function getRoleIdPlaceholder(role: Role | string): string {
  switch (role) {
    case "ADMIN":
      return "12345";
    case "MAHASISWA":
      return "20210001";
    case "DOSEN":
      return "1234567890";
    case "LABORAN":
      return "1234567890";
    default:
      return "ID";
  }
}

// Fungsi untuk memeriksa apakah roleId sudah digunakan
export async function isRoleIdTaken(role: string, roleId: string) {
  switch (role) {
    case "ADMIN":
      return await db.admin.findUnique({ where: { pin: roleId } });
    case "MAHASISWA":
      return await db.mahasiswa.findUnique({ where: { nim: roleId } });
    case "DOSEN":
      return await db.dosen.findUnique({ where: { nidn: roleId } });
    case "LABORAN":
      return await db.laboran.findUnique({ where: { nip: roleId } });
    default:
      return null;
  }
}

// Fungsi untuk membuat data role berdasarkan role
export async function createUserRoleData(
  tx: Prisma.TransactionClient,
  role: Role,
  roleId: string,
  name: string | undefined,
  userId: string
) {
  switch (role) {
    case "ADMIN":
      return tx.admin.create({
        data: {
          pin: roleId,
          user_id: userId,
        },
      });

    case "MAHASISWA":
      return tx.mahasiswa.create({
        data: {
          nim: roleId,
          full_name: name || "",
          user_id: userId,
        },
      });

    case "DOSEN":
      return tx.dosen.create({
        data: {
          nidn: roleId,
          full_name: name || "",
          user_id: userId,
        },
      });

    case "LABORAN":
      return tx.laboran.create({
        data: {
          nip: roleId,
          full_name: name || "",
          user_id: userId,
        },
      });

    default:
      throw new Error("Role tidak valid");
  }
}

// Fungsi untuk memperbarui data role berdasarkan role
export async function updateUserRoleData(
  tx: Prisma.TransactionClient,
  role: Role,
  roleId: string,
  name: string | undefined
) {
  switch (role) {
    case "MAHASISWA":
      return tx.mahasiswa.update({
        where: { nim: roleId },
        data: { full_name: name || "" },
      });

    case "DOSEN":
      return tx.dosen.update({
        where: { nidn: roleId },
        data: {
          full_name: name || "",
        },
      });

    case "LABORAN":
      return tx.laboran.update({
        where: { nip: roleId },
        data: {
          full_name: name || "",
        },
      });

    default:
      throw new Error("Role tidak valid");
  }
}
