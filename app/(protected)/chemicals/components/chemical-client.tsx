"use client";

import React, { useState } from "react";
import { ChemicalTable } from "./chemical-table";
import { AddChemicalDialog } from "@/components/dialog/chemicals/add-chemical-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserAuth } from "@/types/auth";
import useChemicals from "@/hooks/use-chemicals";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertModal } from "@/components/alert-modal";
import { exportChemicalsToExcel } from "@/helpers/chemicals/export-chemicals-to-excel";
import { ChemicalFilter } from "./chemical-filter";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface ChemicalsClientProps {
  user: UserAuth;
}
export const ChemicalsClient: React.FC<ChemicalsClientProps> = ({ user }) => {
  const [loadingImport, setLoadingImport] = useState(false);
  const {
    chemicals,
    paginatedChemicals,
    filteredChemicals,
    currentPage,
    totalPages,
    loading,

    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterCharacteristic,
    setFilterCharacteristic,

    handlePageChange,

    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,
  } = useChemicals();

  const handleImport = async (form: string, file: File | null) => {
    try {
      setLoadingImport(true);
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("form", form);

      const response = await axios.post("/api/v1/chemicals/import", formData, {
        withCredentials: true,
      });

      console.log("Import response:", response.data);

      toast({
        title: "Import Selesai! 🎉",
        description: `Berhasil mengimpor ${response.data.inserted} bahan kimia baru, memperbarui ${response.data.updated} bahan kimia.`,
      });

      // Refresh the chemical list after import
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error importing chemicals:", error);
      toast({
        title: "Error ❌",
        description:
          "Gagal mengimpor bahan kimia. Pastikan format file benar dan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoadingImport(false);
    }
  };

  const canEdit =
    user.role === "ADMIN" ||
    user.role === "LABORAN" ||
    user.role === "PETUGAS_GUDANG";

  return (
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className=" text-xl sm:text-3xl font-bold text-gray-900">
            Inventaris Bahan Kimia
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola stok dan informasi bahan kimia
          </p>
        </div>
        {canEdit && (
          <AddChemicalDialog>
            <Button className="w-full sm:py-[20px] sm:w-48">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Bahan
            </Button>
          </AddChemicalDialog>
        )}
      </div>

      {/* Search and Filter */}
      <ChemicalFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterForm={filterForm}
        onFilterFormChange={setFilterForm}
        filterCharacteristic={filterCharacteristic}
        onFilterCharacteristicChange={setFilterCharacteristic}
        onExport={() => exportChemicalsToExcel(chemicals)}
        onImport={handleImport}
        loadingImport={loadingImport}
        userRole={user.role}
      />

      {/* Chemical Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Bahan Kimia</CardTitle>
          <CardDescription>
            Menampilkan {paginatedChemicals.length} dari{" "}
            {filteredChemicals.length} bahan kimia
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <ChemicalTable
              chemicals={paginatedChemicals}
              userRole={user.role}
              onPageChange={handlePageChange}
              onDelete={handleRequestDelete}
              currentPage={currentPage}
              totalPages={totalPages}
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
};
