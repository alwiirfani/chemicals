"use client";

import { useState } from "react";
import { BorrowingTable } from "./borrowing-table";
import { CreateBorrowingDialog } from "@/components/dialog/borrowings/create-borrowing-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAuth } from "@/types/auth";
import useBorrowings from "@/hooks/use-borrowings";
import BorrowingFilter from "./borrowing-filter";
import { exportBorrowingsToExcel } from "@/helpers/borrowings/export-borrowings-to-excel";

interface BorrowingsClientProps {
  user: UserAuth;
}

export function BorrowingClient({ user }: BorrowingsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("all");

  const { borrowings, pagination, handlePageChange, isLoading } =
    useBorrowings();

  // Filter borrowings based on user role
  const userBorrowings =
    user.role === "MAHASISWA" || user.role === "DOSEN"
      ? borrowings.filter((b) => b.borrowerId === user.userId)
      : borrowings;

  // Apply search and filters
  const filteredBorrowings = userBorrowings.filter((borrowing) => {
    const matchesSearch =
      borrowing.borrower.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      borrowing.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrowing.items.some(
        (item) =>
          item.chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.chemical.formula.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || borrowing.status === filterStatus;

    const matchesUser =
      filterUser === "all" || borrowing.borrower.role === filterUser;

    return matchesSearch && matchesStatus && matchesUser;
  });

  // Get statistics
  const stats = {
    total: userBorrowings.length,
    pending: userBorrowings.filter((b) => b.status === "PENDING").length,
    approved: userBorrowings.filter((b) => b.status === "APPROVED").length,
    overdue: userBorrowings.filter((b) => b.status === "OVERDUE").length,
    returned: userBorrowings.filter((b) => b.status === "RETURNED").length,
  };

  const canManage = user.role === "ADMIN" || user.role === "LABORAN";

  return (
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === "MAHASISWA" || user.role === "DOSEN"
              ? "Peminjaman Saya"
              : "Kelola Peminjaman"}
          </h1>
          <p className="text-gray-600">
            {user.role === "MAHASISWA" || user.role === "DOSEN"
              ? "Lihat status peminjaman dan ajukan peminjaman baru"
              : "Kelola permintaan peminjaman bahan kimia"}
          </p>
        </div>
        <CreateBorrowingDialog user={user}>
          <Button className="w-full sm:py-[20px] sm:w-48">
            <Plus className="mr-2 h-4 w-4" />
            Ajukan Peminjaman
          </Button>
        </CreateBorrowingDialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">peminjaman</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
            <p className="text-xs text-muted-foreground">overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dikembalikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.returned}
            </div>
            <p className="text-xs text-muted-foreground">returned</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <BorrowingFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterUser={filterUser}
        setFilterUser={setFilterUser}
        onExport={() => exportBorrowingsToExcel(filteredBorrowings)}
        canManage={canManage}
      />

      {/* Borrowing Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Peminjaman</CardTitle>
          <CardDescription>
            Menampilkan {filteredBorrowings.length} dari {userBorrowings.length}{" "}
            data peminjaman
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <BorrowingTable
              borrowings={filteredBorrowings}
              pagination={pagination}
              onPageChange={handlePageChange}
              userRole={user.role}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
