"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSds } from "@/hooks/use-sds";
import { SDSTable } from "@/app/(protected)/sds/components/sds-table";
import SdsFilter from "@/app/(protected)/sds/components/sds-filter";

const HomeSdsClient = () => {
  const {
    // Data
    sdsRecords,
    paginatedSds,
    filteredSds,
    currentPage,
    totalPages,
    loadingTable,

    // Filter
    searchTerm,
    setSearchTerm,
    filterLanguage,
    setFilterLanguage,

    // Actions
    handlePageChange,
  } = useSds();

  // Get unique values for filters
  const uniqueLanguages = Array.from(
    new Set(sdsRecords.map((s) => s.language))
  );

  return (
    <>
      <SdsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterLanguage={filterLanguage}
        setFilterLanguage={setFilterLanguage}
        uniqueLanguages={uniqueLanguages}
      />

      {/* Chemical Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Safety Data Sheet</CardTitle>
          <CardDescription>
            Menampilkan {paginatedSds.length} dari {filteredSds.length} Safety
            Data Sheet
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loadingTable ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-500">
              Memuat data...
            </div>
          ) : (
            <SDSTable
              sdsRecords={paginatedSds}
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

export default HomeSdsClient;
