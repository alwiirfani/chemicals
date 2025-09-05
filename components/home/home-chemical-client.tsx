"use client";

import useChemicals from "@/hooks/use-chemicals";
import React from "react";
import HomeChemicalFilter from "./home-chemical-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import HomeChemicalTable from "./home-chemical-table";

const HomeChemicalClient = () => {
  // chemicals hook
  const {
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
  } = useChemicals();

  return (
    <>
      <HomeChemicalFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterForm={filterForm}
        onFilterFormChange={setFilterForm}
        filterCharacteristic={filterCharacteristic}
        onFilterCharacteristicChange={setFilterCharacteristic}
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
            <HomeChemicalTable
              chemicals={paginatedChemicals}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default HomeChemicalClient;
