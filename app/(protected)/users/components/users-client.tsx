"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Users, UserCheck, UserX, Shield } from "lucide-react";
import { UserTable } from "./user-table";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { UserDetailDialog } from "./user-detail-dialog";
import { useToast } from "@/hooks/use-toast";
import { UserAuth } from "@/types/auth";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";

export function UsersClient() {
  const [users, setUsers] = useState<UserAuth[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserAuth | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    admins: 0,
    laborans: 0,
    regularUsers: 0,
  });

  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        setLoadingTable(true);
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(roleFilter !== "all" && { role: roleFilter }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        };

        const { data } = await axios.get("/api/v1/users", { params });

        setUsers(data.users);
        setPagination({
          currentPage: data.pagination.page,
          total: data.pagination.total,
          totalPages: data.pagination.pages,
        });
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast({
          title: "Gagal",
          description: "Tidak dapat memuat data pengguna",
          variant: "destructive",
        });
      } finally {
        setLoadingTable(false);
      }
    },
    [debouncedSearch, roleFilter, statusFilter, toast]
  );
  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [
    debouncedSearch,
    roleFilter,
    statusFilter,
    pagination.currentPage,
    fetchUsers,
  ]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleEditUser = (user: UserAuth) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleViewUser = (user: UserAuth) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter((u) => u.userId !== userId));
      toast({ title: "Berhasil", description: "Pengguna dihapus" });
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (
    userId: string,
    newStatus: "ACTIVE" | "INACTIVE" | "BLOCKED"
  ) => {
    try {
      const { data } = await axios.patch(`/api/v1/users/${userId}/status`, {
        status: newStatus,
      });
      toast({
        title: "Status Diubah",
        description: `Status kini ${data.newStatus}`,
      });
      fetchUsers(pagination.currentPage);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengubah status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manajemen Pengguna
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola akun pengguna dan hak akses sistem
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          size="sm"
          className="w-full sm:w-48">
          <Plus className="h-4 w-4 mr-1" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.active} aktif</span> •{" "}
              <span className="text-gray-500">
                {stats.inactive} tidak aktif
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Pengguna Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.total > 0
                ? ((stats.active / stats.total) * 100).toFixed(1)
                : 0}
              % dari total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Administrator</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.admins}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.laborans} laboran • {stats.regularUsers} pengguna
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm">Ditangguhkan</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.blocked}
            </div>
            <div className="text-xs text-muted-foreground">Akun bermasalah</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          <CardDescription>
            Cari pengguna berdasarkan nama, email, role, atau status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama, email, atau NIM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="LABORAN">Laboran</SelectItem>
                <SelectItem value="DOSEN">Dosen</SelectItem>
                <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                <SelectItem value="BLOCKED">Ditangguhkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Pengguna</CardTitle>
          <CardDescription>Menampilkan {users.length} pengguna</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loadingTable ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <UserTable
              users={users}
              pagination={pagination}
              onPageChange={handlePageChange}
              onEdit={handleEditUser}
              onView={handleViewUser}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onUserAdded={() => fetchUsers()}
      />
      {selectedUser && (
        <>
          <EditUserDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            user={selectedUser}
            onUserUpdated={() => {
              fetchUsers();
              setSelectedUser(null);
              setShowEditDialog(false);
            }}
          />
          <UserDetailDialog
            open={showDetailDialog}
            onOpenChange={setShowDetailDialog}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}
