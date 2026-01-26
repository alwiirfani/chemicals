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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { UserAuth } from "@/types/auth";
import {
  getRoleBadgeVariant,
  getRoleLabel,
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/helpers/users/user-table";
import { formatDateToString } from "@/helpers/format-date";
import { useEffect, useState } from "react";

interface UserTableProps {
  users: UserAuth[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (user: UserAuth) => void;
  onView: (user: UserAuth) => void;
  onBlocked: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onView,
  onBlocked,
}) => {
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const windowSize = 3;

  useEffect(() => {
    const newWindowStart =
      Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
    setPageWindowStart(newWindowStart);
  }, [currentPage]);

  const handleEllipsisClick = () => {
    const nextStart = pageWindowStart + windowSize;
    if (nextStart <= totalPages) {
      setPageWindowStart(nextStart);
      onPageChange(nextStart); // pindah ke awal window baru
    }
  };

  const pageNumbers = Array.from(
    { length: Math.min(windowSize, totalPages - pageWindowStart + 1) },
    (_, i) => pageWindowStart + i,
  );
  return (
    <>
      <div className="rounded-md border">
        <div className="w-full overflow-x-auto">
          <Table className="table-auto min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-blue-50 hover:bg-blue-100">
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
                        ? formatDateToString(user.lastLogin)
                        : "Belum pernah"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateToString(user.createdAt)}
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
                          {user.role !== "ADMIN" && (
                            <DropdownMenuItem onClick={() => onEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            onClick={() => onBlocked(user.userId)}
                            className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Blokir
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
      <div className="flex justify-center py-4">
        <Pagination>
          <PaginationContent className="flex flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  currentPage <= 1 || totalPages <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pageWindowStart + windowSize - 1 < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={handleEllipsisClick}>
                  ...
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  currentPage >= totalPages || totalPages <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};
