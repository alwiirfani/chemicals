import axios from "axios";

export type Role =
  | "ADMIN"
  | "MAHASISWA"
  | "DOSEN"
  | "LABORAN"
  | "PETUGAS_GUDANG";

/* ===== UI ONLY ===== */

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
    case "PETUGAS_GUDANG":
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
    default:
      return "ID";
  }
}

/* ===== API CALLS (CLIENT SAFE) ===== */

export async function isRoleIdTaken(
  role: string,
  roleId: string
): Promise<boolean> {
  try {
    const { data } = await axios.get("/api/users/check-role", {
      params: {
        role,
        roleId,
      },
    });

    return Boolean(data?.exists);
  } catch (error) {
    console.error("isRoleIdTaken error:", error);
    return false;
  }
}
