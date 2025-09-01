"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Download,
  ExternalLink,
  Package,
  Globe,
  Calendar,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SDS } from "@/types/sds";
import Link from "next/link";
import axios from "axios";

interface SDSDetailDialogProps {
  sds: SDS;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SDSDetailDialog({
  sds,
  open,
  onOpenChange,
}: SDSDetailDialogProps) {
  const { toast } = useToast();

  const handleDownload = async (path: string) => {
    try {
      if (path) {
        const response = await axios.get(path, { responseType: "blob" });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `from-sds-${sds.chemical.name.replace(
          /\s+/g,
          "-"
        )}.pdf`;
        document.body.appendChild(link);

        link.click();
        link.remove();

        toast({
          title: "Download Started! 📥",
          description: `Mengunduh ${sds.fileName}`,
        });
      } else if (sds.externalUrl) {
        const fullUrl = `${sds.externalUrl}`;
        window.open(fullUrl, "_blank");

        toast({
          title: "External Link Opened! 🔗",
          description: "Dokumen SDS dibuka di tab baru",
        });
      }
    } catch (error) {
      console.error("Error downloading SDS:", error);

      toast({
        title: "Error ❌",
        description:
          error instanceof Error
            ? error.message
            : "Gagal mengunduh dokumen SDS",
        variant: "destructive",
      });
    }
  };

  const viewPdf = (fileUrl: string) => {
    const fullUrl = `${window.location.origin}${fileUrl}`;
    window.open(fullUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Safety Data Sheet - {sds.chemical.name}
          </DialogTitle>
          <DialogDescription>
            Informasi keselamatan dan bahaya bahan kimia
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  {sds.language === "ID"
                    ? "🇮🇩 Indonesia"
                    : sds.language === "EN"
                    ? "🇺🇸 English"
                    : sds.language}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {sds.filePath ? (
                  <div className="flex items-center gap-4">
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2 px-4 py-2"
                      onClick={() => handleDownload(sds.filePath || "")}>
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4 py-2"
                      onClick={() => viewPdf(sds.filePath || "")}>
                      <FileText className="h-4 w-4" />
                      Baca Dokumen
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline">
                    <Link
                      href={sds.externalUrl || ""}
                      target="_blank"
                      className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Buka Link
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Chemical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Informasi Bahan Kimia
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium">{sds.chemical.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rumus:</span>
                      <span className="font-medium">
                        {sds.chemical.formula}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bentuk:</span>
                      <span className="font-medium">
                        {sds.chemical.form === "LIQUID"
                          ? "Cair"
                          : sds.chemical.form === "SOLID"
                          ? "Padat"
                          : "Gas"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Informasi Dokumen
                  </h4>
                </div>
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                {sds.fileName ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                Dokumen
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">File:</span>
                  <p className="font-medium">
                    {sds.fileName || "External Link"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Upload:</span>
                  <p className="font-medium">
                    {format(sds.createdAt, "dd/MM/yyyy", { locale: id })}
                  </p>
                </div>
                {/* <div>
                  <span className="text-gray-600">Diunduh:</span>
                  <p className="font-medium">{sds.downloadCount} kali</p>
                </div> */}
              </div>
            </div>

            {/* Upload Information */}
            <Separator />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Informasi Upload
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Diupload oleh:</span>
                  <p className="font-medium">{sds.createdByName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tanggal upload:</span>
                  <p className="font-medium">
                    {format(sds.createdAt, "dd MMMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
