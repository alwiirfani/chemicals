"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, ExternalLink, FileText, Globe } from "lucide-react";
import { SDSDetailDialog } from "@/components/dialog/sds/sds-detail-dialog";
import { UpdateSDSDialog } from "@/components/dialog/sds/sds-update-dialog";
import { useToast } from "@/hooks/use-toast";
import { SDS } from "@/types/sds";
import type { SDSData } from "@/hooks/use-sds";

interface SDSPaginationProps {
  currentPage: number;
  totalPages: number;
}

interface SDSTableProps {
  sdsRecords: SDS[];
  pagination: SDSPaginationProps;
  onPageChange: (page: number) => void;
}

const HomeSdsTable = ({
  sdsRecords,
  pagination,
  onPageChange,
}: SDSTableProps) => {
  const [selectedSDS, setSelectedSDS] = useState<SDS | null>(null);
  const [editingSDS, setEditingSDS] = useState<SDSData | null>(null);
  const { toast } = useToast();

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
        const link = document.createElement("a");
        link.href = sds.filePath;
        link.download = `from-sds-${sds.chemical.name.replace(
          /\s+/g,
          "-"
        )}.pdf`;
        link.click();

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

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
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
                      <div className="text-xs text-gray-400">
                        CAS: {sds.chemical.casNumber}
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
                          {sds.downloadCount} downloads • {sds.createdByName}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <p className="text-sm text-muted-foreground">
          Halaman {pagination.currentPage} dari {pagination.totalPages}
        </p>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}>
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}>
            Selanjutnya
          </Button>
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedSDS && (
        <SDSDetailDialog
          sds={selectedSDS}
          open={!!selectedSDS}
          onOpenChange={(open) => !open && setSelectedSDS(null)}
        />
      )}

      {/* Update Dialog */}
      {editingSDS && (
        <UpdateSDSDialog
          sdsData={editingSDS}
          open={!!editingSDS}
          onOpenChange={(open) => !open && setEditingSDS(null)}
        />
      )}
    </>
  );
};

export default HomeSdsTable;
