"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { UserAuth } from "@/types/auth";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
}
interface UserTableProps {
  users: UserAuth[];
  pagination: UserPaginationProps;
  onPageChange: (page: number) => void;
  onEdit: (user: UserAuth) => void;
  onView: (user: UserAuth) => void;
  onDelete: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  pagination,
  onPageChange,
  onEdit,
  onView,
  onDelete,
}) => {
  const getRoleLabel = (role: string) => {
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

  const getRoleBadgeVariant = (role: string) => {
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

  const getStatusBadgeVariant = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Nama</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">
                  Login Terakhir
                </TableHead>
                <TableHead className="whitespace-nowrap">Dibuat</TableHead>
                <TableHead className="w-[70px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500">
                    Tidak ada pengguna yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {user.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="truncate max-w-[120px] md:max-w-none inline-block">
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.roleId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.lastLogin
                        ? formatDate(user.lastLogin)
                        : "Belum pernah"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-2">
                          <DropdownMenuItem onClick={() => onView(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onDelete(user.userId)}
                            className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <p className="text-sm text-muted-foreground">
          Halaman {pagination.currentPage} dari {pagination.totalPages}
        </p>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}>
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}>
            Selanjutnya
          </Button>
        </div>
      </div>
    </>
  );
};
