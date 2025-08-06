"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { UserTable } from "./user-table";
import { UserAuth } from "@/types/auth";
import { UserStats } from "./user-stats";
import { UserFilter } from "./user-filter";
import { UserDialogs } from "./user-dialogs";
import { useUsers } from "@/hooks/use-users";
import { AlertModal } from "@/components/alert-modal";

export function UserClient() {
  const {
    users,
    stats,
    pagination,
    searchTerm,
    roleFilter,
    statusFilter,
    loadingTable,
    isDeleting,
    openDeleteModal,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setOpenDeleteModal,
    handlePageChange,
    handleRequestDelete,
    handleConfirmDelete,
    fetchUsers,
  } = useUsers();
  const [selectedUser, setSelectedUser] = useState<UserAuth | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleEditUser = (user: UserAuth) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleViewUser = (user: UserAuth) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
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
          className="w-full sm:py-[20px] sm:w-48">
          <Plus className="h-4 w-4 mr-1" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Stats */}
      <UserStats stats={stats} />

      {/* Filter & Search */}
      <UserFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRoleChange={setRoleFilter}
        role={roleFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Tabel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Pengguna</CardTitle>
          <CardDescription>Menampilkan {users.length} pengguna</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loadingTable ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <UserTable
              users={users}
              pagination={pagination}
              onPageChange={handlePageChange}
              onEdit={handleEditUser}
              onView={handleViewUser}
              onDelete={handleRequestDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <UserDialogs
        selectedUser={selectedUser}
        showAddDialog={showAddDialog}
        showEditDialog={showEditDialog}
        showDetailDialog={showDetailDialog}
        onCloseAdd={() => setShowAddDialog(false)}
        onCloseEdit={() => {
          setShowEditDialog(false);
          setSelectedUser(null);
        }}
        onCloseDetail={() => {
          setShowDetailDialog(false);
          setSelectedUser(null);
        }}
        onUserAdded={() => fetchUsers()}
        onUserUpdated={() => {
          fetchUsers();
          setSelectedUser(null);
          setShowEditDialog(false);
        }}
      />

      {/* Modal Konfirmasi Hapus */}
      <AlertModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
