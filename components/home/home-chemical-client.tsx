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

    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterLocation,
    setFilterLocation,

    handlePageChange,
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
  return (
    <>
      <HomeChemicalFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterForm={filterForm}
        onFilterFormChange={setFilterForm}
        filterLocation={filterLocation}
        onFilterLocationChange={setFilterLocation}
        uniqueRooms={uniqueRooms}
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
