export const getRoleLabel = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "LABORAN":
      return "Laboran";
    case "MAHASISWA":
      return "Mahasiswa";
    case "DOSEN":
      return "Dosen";
    default:
      return role;
  }
};

export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "default";
    case "LABORAN":
      return "secondary";
    case "MAHASISWA":
      return "outline";
    case "DOSEN":
      return "outline";
    default:
      return "outline";
  }
};

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INACTIVE":
      return "secondary";
    case "BLOCKED":
      return "destructive";
    default:
      return "outline";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "Aktif";
    case "INACTIVE":
      return "Tidak Aktif";
    case "BLOCKED":
      return "Diblokir";
    default:
      return status;
  }
};
