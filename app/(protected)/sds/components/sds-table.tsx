"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";
import { SDSDetailDialog } from "@/components/dialog/sds/sds-detail-dialog";
import { UpdateSDSDialog } from "@/components/dialog/sds/sds-update-dialog";
import { useToast } from "@/hooks/use-toast";
import { SDS } from "@/types/sds";
import type { SDSData } from "@/hooks/use-sds";
import axios from "axios";

interface SDSTableProps {
  sdsRecords: SDS[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  mode?: "home" | "management";
  userRole?: string;
  onDelete?: (sdsId: string) => void;
}

export function SDSTable({
  sdsRecords,
  currentPage,
  totalPages,
  onPageChange,
  mode = "home",
  userRole,
  onDelete,
}: SDSTableProps) {
  const [selectedSDS, setSelectedSDS] = useState<SDS | null>(null);
  const [editingSDS, setEditingSDS] = useState<SDSData | null>(null);
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const windowSize = 3;
  const { toast } = useToast();

  const canAction =
    mode === "management" &&
    (userRole === "ADMIN" ||
      userRole === "LABORAN" ||
      userRole === "PETUGAS_GUDANG");

  const getLanguageBadge = (language: string) => {
    const colors = {
      ID: "bg-blue-100 text-blue-800",
      EN: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge
        variant="outline"
        className={
          colors[language as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }>
        {language === "ID" ? "🇮🇩 ID" : language === "EN" ? "🇺🇸 EN" : language}
      </Badge>
    );
  };

  const handleDownload = async (sds: SDS) => {
    try {
      if (sds.filePath) {
        const response = await axios.get(sds.filePath, {
          responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const safeName = `from-sds-${sds.fileName}` || "file.pdf";

        const link = document.createElement("a");
        link.href = url;
        link.download = safeName;
        document.body.appendChild(link);

        link.click();
        link.remove();

        toast({
          title: "Download Started! 📥",
          description: `Mengunduh ${sds.fileName}`,
        });
      } else if (sds.externalUrl) {
        window.open(sds.externalUrl, "_blank");
        toast({
          title: "External Link Opened! 🔗",
          description: "Dokumen SDS dibuka di tab baru",
        });
      }
    } catch (error) {
      console.error("Error downloading SDS:", error);
      toast({
        title: "Error ❌",
        description: "Gagal mengunduh dokumen SDS",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (sds: SDS) => {
    const sdsData: SDSData = {
      id: sds.id,
      chemicalId: sds.chemical.id,
      language: sds.language,
      uploadType: sds.filePath ? "file" : "link",
      externalUrl: sds.externalUrl || "",
    };

    setEditingSDS(sdsData);
  };

  useEffect(() => {
    const newWindowStart =
      Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
    setPageWindowStart(newWindowStart);
  }, [currentPage]);

  const handleEllipsisClick = () => {
    const nextStart = pageWindowStart + windowSize;
    if (nextStart <= totalPages) {
      setPageWindowStart(nextStart);
      onPageChange(nextStart);
    }
  };

  const pageNumbers = Array.from(
    { length: Math.min(windowSize, totalPages - pageWindowStart + 1) },
    (_, i) => pageWindowStart + i
  );

  return (
    <>
      <div className="rounded-md border">
        <div className="w-full overflow-x-auto">
          <Table className="table-auto min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-blue-50 hover:bg-blue-100">
                <TableHead className="whitespace-nowrap pl-4 w-[60px]">
                  No
                </TableHead>
                <TableHead>Bahan Kimia</TableHead>
                <TableHead>Dokumen</TableHead>
                <TableHead>Bahasa</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sdsRecords.map((sds, index) => (
                <TableRow key={sds.id}>
                  <TableCell className="pl-4 w-[60px]">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sds.chemical.name}</div>
                      <div className="text-sm text-gray-500">
                        {sds.chemical.formula}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {sds.fileName ? (
                        <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Globe className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        {sds.fileName ? (
                          <div className="font-medium text-sm truncate">
                            {sds.fileName}
                          </div>
                        ) : (
                          <div className="font-medium text-sm text-green-600">
                            External Link
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Upload:{" "}
                          {format(sds.createdAt, "dd/MM/yyyy", { locale: id })}
                        </div>
                        <div className="text-xs text-gray-400">
                          downloads • {sds.createdByName}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {getLanguageBadge(sds.language)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* selalu ada (home & management) */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSDS(sds)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(sds)}>
                        {sds.filePath ? (
                          <Download className="h-4 w-4" />
                        ) : (
                          <ExternalLink className="h-4 w-4" />
                        )}
                      </Button>

                      {/* hanya muncul di management + role sesuai */}
                      {canAction && (
                        <>
                          <Button
                            title="Edit"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sds)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            title="Hapus"
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete?.(sds.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4">
        <Pagination>
          <PaginationContent className="flex flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  currentPage <= 1 || totalPages <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pageWindowStart + windowSize - 1 < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={handleEllipsisClick}>
                  ...
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  currentPage >= totalPages || totalPages <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialogs */}
      {selectedSDS && (
        <SDSDetailDialog
          sds={selectedSDS}
          open={!!selectedSDS}
          onOpenChange={(open) => !open && setSelectedSDS(null)}
        />
      )}
      {editingSDS && (
        <UpdateSDSDialog
          sdsData={editingSDS}
          open={!!editingSDS}
          onOpenChange={(open) => !open && setEditingSDS(null)}
        />
      )}
    </>
  );
}
