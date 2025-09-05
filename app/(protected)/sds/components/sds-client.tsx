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
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";
import pLimit from "p-limit";
import { ImportResult, UploadedFile } from "@/types/sds";
import { normalizeFileName } from "@/helpers/sds/normalization-pdf";

interface SDSClientProps {
  user: UserAuth;
}

export function SDSClient({ user }: SDSClientProps) {
  const [loadingImport, setLoadingImport] = useState(false);

  const {
    // Data
    sdsRecords,
    filteredSds,
    paginatedSds,
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

    // Delete Modal
    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,
  } = useSds();

  const limit = pLimit(5);
  const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50MB
  const handleImport = async (file: File | null) => {
    try {
      if (!file) return;

      // Validasi ukuran file
      if (file.size > MAX_ZIP_SIZE) {
        toast({
          title: "File terlalu besar",
          description: `Ukuran file maksimum adalah ${
            MAX_ZIP_SIZE / 1024 / 1024
          }MB`,
          variant: "destructive",
        });
        return;
      }

      setLoadingImport(true);

      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      // bikin array task upload tapi dibungkus dengan limit
      const uploadTasks = Object.keys(zipData.files).map((fileName) =>
        limit(async () => {
          const entry = zipData.files[fileName];
          if (entry.dir || !fileName.toLowerCase().endsWith(".pdf"))
            return null;

          try {
            const blobContent = await entry.async("blob");

            // ambil nama asli tanpa folder
            const baseName = fileName.split("/").pop() || fileName;

            const safeName = normalizeFileName(baseName);

            const fileObj = new globalThis.File([blobContent], safeName, {
              type: "application/pdf",
            });

            const formData = new FormData();
            formData.append("file", fileObj);

            const resUpload = await axios.post("/api/v1/sds/upload", formData, {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            });

            const { url } = resUpload.data;

            console.log("Nama file:", safeName);
            console.log("URL:", url);

            return { fileName: safeName, filePath: url };
          } catch (err) {
            console.error(`Upload gagal untuk ${fileName}`, err);
            return null;
          }
        })
      );

      // eksekusi semua upload dengan concurrency limit
      const uploadedFiles = (await Promise.all(uploadTasks)).filter(
        Boolean
      ) as UploadedFile[];

      console.log("Files uploaded:", uploadedFiles);

      try {
        // kirim metadata ke backend untuk matching
        const response = await axios.post(
          "/api/v1/sds/import",
          { files: uploadedFiles },
          { withCredentials: true }
        );

        const results: ImportResult[] = response.data.results || [];
        const successCount = results.filter(
          (r) => r.status === "success"
        ).length;
        const failCount = results.length - successCount;

        // simpan ke localStorage
        localStorage.setItem(
          "sdsImportSummary",
          JSON.stringify({
            total: results.length,
            success: successCount,
            failed: failCount,
            results,
          })
        );

        toast({
          title: "Import selesai 🎉",
          description: `${response.data.results?.length} file diproses`,
        });
      } catch (error) {
        console.error("Error importing SDS:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mengimpor",
          variant: "destructive",
        });
      }

      // Refresh the SDS list after import
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error importing SDS:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengimpor",
        variant: "destructive",
      });
    } finally {
      setLoadingImport(false);
    }
  };

  useEffect(() => {
    const summary = localStorage.getItem("sdsImportSummary");
    if (summary) {
      const { total, success, failed, results } = JSON.parse(summary);

      console.log("===== IMPORT SUMMARY (AFTER RELOAD) =====");
      console.log("Total files:", total);
      console.log("✅ Berhasil masuk DB:", success);
      console.log("❌ Gagal masuk DB:", failed);
      console.table(results);

      // hapus biar tidak muncul lagi di reload berikutnya
      localStorage.removeItem("sdsImportSummary");
    }
  }, []);

  // Get unique values for filters
  const uniqueLanguages = Array.from(
    new Set(sdsRecords.map((s) => s.language))
  );

  const canManage =
    user.role === "ADMIN" ||
    user.role === "LABORAN" ||
    user.role === "PETUGAS_GUDANG";

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
        mode="management"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        uniqueLanguages={uniqueLanguages}
        setFilterLanguage={setFilterLanguage}
        filterLanguage={filterLanguage}
        onExport={() => exportSdsToExcel(sdsRecords)}
        onImport={handleImport}
        loadingImport={loadingImport}
        userRole={user.role}
      />

      {/* SDS Table */}
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
              mode="management"
              sdsRecords={paginatedSds}
              currentPage={currentPage}
              totalPages={totalPages}
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
