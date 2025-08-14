"use client";

import { useState } from "react";
import { BorrowingTable } from "./borrowing-table";
import { CreateBorrowingDialog } from "./create-borrowing-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAuth } from "@/types/auth";
import useBorrowings from "@/hooks/use-borrowings";

interface BorrowingsClientProps {
  user: UserAuth;
}

export function BorrowingsClient({ user }: BorrowingsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("all");

  const { borrowings } = useBorrowings();

  // Filter borrowings based on user role
  const userBorrowings =
    user.role === "MAHASISWA"
      ? borrowings.filter((b) => b.borrowerId === user.id)
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
    <div className="flex min-h-screen bg-gray-50 mt-16 sm:mt-0">
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.role === "USER" ? "Peminjaman Saya" : "Kelola Peminjaman"}
              </h1>
              <p className="text-gray-600">
                {user.role === "USER"
                  ? "Lihat status peminjaman dan ajukan peminjaman baru"
                  : "Kelola permintaan peminjaman bahan kimia"}
              </p>
            </div>
            <CreateBorrowingDialog user={user}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajukan Peminjaman
              </Button>
            </CreateBorrowingDialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                <CardTitle className="text-sm font-medium">
                  Dikembalikan
                </CardTitle>
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
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari peminjam, tujuan, atau bahan kimia..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="APPROVED">Disetujui</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
                  <SelectItem value="RETURNED">Dikembalikan</SelectItem>
                  <SelectItem value="OVERDUE">Terlambat</SelectItem>
                </SelectContent>
              </Select>

              {canManage && (
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pengguna</SelectItem>
                    <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                    <SelectItem value="DOSEN">Dosen</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredBorrowings.length} dari{" "}
              {userBorrowings.length} peminjaman
              {searchTerm && ` untuk pencarian "${searchTerm}"`}
            </p>
          </div>

          {/* Borrowing Table */}
          <BorrowingTable
            borrowings={filteredBorrowings}
            userRole={user.role}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  );
}
