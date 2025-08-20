"use client";

import { SDSTable } from "./sds-table";
import { UploadSDSDialog } from "@/components/dialog/sds/sds-upload-dialog";
import { Button } from "@/components/ui/button";
import { Plus, File } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAuth } from "@/types/auth";
import { AlertModal } from "@/components/alert-modal";
import { useSds } from "@/hooks/use-sds";
import CardStats from "@/components/card-stats";
import SdsFilter from "./sds-filter";
import { exportSdsToExcel } from "@/helpers/sds/export-sds-to-excel";

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
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <CardStats
          title="Total SDS"
          icon={<File className="h-4 w-4 text-green-600" />}>
          <div className="text-xl sm:text-2xl text-green-600 font-bold pt-4 sm:pt-7">
            {sdsRecords.length}
          </div>
          <p className="text-xs text-muted-foreground">dokumen</p>
        </CardStats>
      </div>

      {/* Search and Filter */}
      <SdsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        uniqueLanguages={uniqueLanguages}
        setFilterLanguage={setFilterLanguage}
        filterLanguage={filterLanguage}
        onExport={() => exportSdsToExcel(filteredSDS)}
      />

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
