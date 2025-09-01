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
    chemicals,
    pagination,
    loading,
    total,

    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterCharacteristic,
    setFilterCharacteristic,

    handlePageChange,
  } = useChemicals();

  // Filter chemicals based on search and filters
  const filteredChemicals = chemicals.filter((chemical) => {
    const matchesSearch =
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.formula.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesForm = filterForm === "all" || chemical.form === filterForm;

    return matchesSearch && matchesForm;
  });

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
            Menampilkan {filteredChemicals.length} dari {total} bahan kimia
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <HomeChemicalTable
              chemicals={filteredChemicals}
              onPageChange={handlePageChange}
              pagination={pagination}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default HomeChemicalClient;
