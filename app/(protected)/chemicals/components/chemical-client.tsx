"use client";

import React from "react";
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
import { exportChemicalsToExcel } from "@/helpers/chemicals/export-to-excel";
import { ChemicalFilter } from "./chemical-filter";

interface ChemicalsClientProps {
  user: UserAuth;
}
export const ChemicalsClient: React.FC<ChemicalsClientProps> = ({ user }) => {
  const {
    chemicals,
    pagination,
    loading,

    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterLocation,
    setFilterLocation,

    handlePageChange,

    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,
  } = useChemicals();

  // Filter chemicals based on search and filters
  const filteredChemicals = chemicals.filter((chemical) => {
    const matchesSearch =
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chemical.casNumber && chemical.casNumber.includes(searchTerm));

    const matchesForm = filterForm === "all" || chemical.form === filterForm;

    const matchesLocation =
      filterLocation === "all" ||
      (chemical.room &&
        chemical.room.toLowerCase().includes(filterLocation.toLowerCase()));

    return matchesSearch && matchesForm && matchesLocation;
  });

  // Get unique locations for filter
  const uniqueRooms = Array.from(
    new Set(chemicals.map((c) => c.room).filter(Boolean))
  );

  const canEdit = user.role === "ADMIN" || user.role === "LABORAN";

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
        filterLocation={filterLocation}
        onFilterLocationChange={setFilterLocation}
        uniqueRooms={uniqueRooms}
        onExport={() => exportChemicalsToExcel(filteredChemicals)}
      />

      {/* Chemical Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Bahan Kimia</CardTitle>
          <CardDescription>
            Menampilkan {filteredChemicals.length} dari {chemicals.length} bahan
            kimia
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <ChemicalTable
              chemicals={filteredChemicals}
              userRole={user.role}
              onPageChange={handlePageChange}
              onDelete={handleRequestDelete}
              pagination={pagination}
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
