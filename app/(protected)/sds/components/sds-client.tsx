"use client";

import { SDSTable } from "./sds-table";
import { UploadSDSDialog } from "./sds-upload-dialog";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAuth } from "@/types/auth";
import useSds from "@/hooks/use-sds";
import { AlertModal } from "@/components/alert-modal";

interface SDSClientProps {
  user: UserAuth;
}

export function SDSClient({ user }: SDSClientProps) {
  const {
    // Data
    sdsRecords,
    total,
    pagination,
    loadingTable,

    // Filter
    searchTerm,
    setSearchTerm,
    filterLanguage,
    setFilterLanguage,

    // Actions
    handlePageChange,

    // Delete Modal
    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,
  } = useSds();

  // Apply search and filters
  const filteredSDS = sdsRecords.filter((sds) => {
    const matchesSearch =
      sds.chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sds.chemical.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sds.chemical.casNumber.includes(searchTerm) ||
      (sds.fileName &&
        sds.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLanguage =
      filterLanguage === "all" || sds.language === filterLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Get unique values for filters
  const uniqueLanguages = Array.from(
    new Set(sdsRecords.map((s) => s.language))
  );

  const canManage = user.role === "ADMIN" || user.role === "LABORAN";

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16 sm:mt-0">
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Safety Data Sheet (SDS)
              </h1>
              <p className="text-gray-600">
                Kelola dokumen keselamatan bahan kimia dan informasi bahaya
              </p>
            </div>
            {canManage && (
              <UploadSDSDialog>
                <Button className="w-full sm:py-[20px] sm:w-48">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload SDS
                </Button>
              </UploadSDSDialog>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total SDS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sdsRecords.length}</div>
                <p className="text-xs text-muted-foreground">dokumen</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama bahan, CAS number, supplier, atau file..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {uniqueLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language === "ID"
                        ? "Indonesia"
                        : language === "EN"
                        ? "English"
                        : language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredSDS.length} dari {sdsRecords.length} dokumen
              SDS
              {searchTerm && ` untuk pencarian "${searchTerm}"`}
            </p>
          </div>

          {/* SDS Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Bahan Kimia</CardTitle>
              <CardDescription>
                Menampilkan {filteredSDS.length} dari {total} bahan kimia
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loadingTable ? (
                <div className="flex items-center justify-center h-48 text-sm text-gray-500">
                  Memuat data...
                </div>
              ) : (
                <SDSTable
                  sdsRecords={filteredSDS}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  onDelete={handleRequestDelete}
                  userRole={user.role}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Konfirmasi Hapus Bahan Kimia */}
      <AlertModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
