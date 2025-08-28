"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChemicalSelect } from "@/components/sds/chemical-select";
import useChemicals from "@/hooks/use-chemicals";
import { SDSData, useSds } from "@/hooks/use-sds";
import { useEffect } from "react";

interface UpdateSDSDialogProps {
  sdsData: SDSData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateSDSDialog({
  sdsData,
  open,
  onOpenChange,
}: UpdateSDSDialogProps) {
  const { toast } = useToast();
  const { chemicals } = useChemicals();
  const {
    loading,
    uploadType,
    setUploadType,
    file,
    formData,
    updateFormData,
    handleFileChange,
    updateSds,
    resetForm,
    populateFormData,
  } = useSds();

  // Populate form dengan data SDS ketika dialog dibuka
  useEffect(() => {
    if (open && sdsData) {
      populateFormData(sdsData);
      setUploadType(sdsData.uploadType);
    }
  }, [open, sdsData, populateFormData, setUploadType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await updateSds(sdsData.id);

      console.log("Data: SDS updated", data);

      toast({
        title: "SDS Berhasil Diperbarui! ✅",
        description: `Dokumen SDS untuk ${
          chemicals.find((c) => c.id === formData.chemicalId)?.name
        } telah diperbarui`,
      });

      resetForm();
      onOpenChange(false);

      // Refresh halaman untuk menampilkan data terbaru
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (error) {
      console.error("Error updating SDS:", error);
      toast({
        title: "Error ❌",
        description: "Gagal memperbarui dokumen SDS",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Safety Data Sheet (SDS)</DialogTitle>
          <DialogDescription>
            Perbarui informasi dokumen SDS atau ubah link eksternal untuk bahan
            kimia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chemical Selection */}
            <ChemicalSelect formData={formData} setFormData={updateFormData} />

            {/* Language Selection */}
            <div>
              <Label htmlFor="language">Bahasa *</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => updateFormData("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ID">🇮🇩 Indonesia</SelectItem>
                  <SelectItem value="EN">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload Type Selection */}
          <div className="space-y-4">
            <Label>Jenis Upload *</Label>
            <Tabs
              value={uploadType}
              onValueChange={(value) =>
                setUploadType(value as "file" | "link")
              }>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Upload File PDF
                </TabsTrigger>
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Link Eksternal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <div>
                  <Label htmlFor="file">File PDF SDS</Label>
                  <div className="mt-1">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <FileText className="h-4 w-4" />
                      <span>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimal 10MB, format PDF. Kosongkan jika tidak ingin
                    mengubah file
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="link" className="space-y-4">
                <div>
                  <Label htmlFor="externalUrl">URL Eksternal *</Label>
                  <Input
                    id="externalUrl"
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) =>
                      updateFormData("externalUrl", e.target.value)
                    }
                    placeholder="https://external-url.com/sds"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link ke dokumen SDS di website supplier
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
