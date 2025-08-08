"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatDateToInput } from "@/helpers/format-date";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdateChemicalPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState({
    name: "",
    formula: "",
    casNumber: "",
    form: "",
    stock: "",
    unit: "",
    purchaseDate: "",
    expirationDate: "",
    location: "",
    cabinet: "",
    room: "",
    temperature: "",
  });

  const fetchChemical = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/v1/chemicals/${params.chemicalId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const { chemical } = await response.data;

      console.log("Chemical data:", chemical);

      setFormData({
        name: chemical.name,
        formula: chemical.formula,
        casNumber: chemical.casNumber || "",
        form: chemical.form,
        stock: chemical.stock,
        unit: chemical.unit,
        purchaseDate: formatDateToInput(chemical.purchaseDate),
        expirationDate: chemical.expirationDate
          ? formatDateToInput(chemical.expirationDate)
          : "",
        location: chemical.location,
        cabinet: chemical.cabinet || "",
        room: chemical.room || "",
        temperature: chemical.temperature || "",
      });
    } catch (error) {
      console.error("Error fetching chemical:", error);
      toast({
        title: "Gagal mengambil data",
        description: "Tidak dapat memuat data bahan kimia",
        variant: "destructive",
      });
      router.push("/chemicals");
    }
  }, [params.chemicalId, router, toast]);

  useEffect(() => {
    if (params.chemicalId) {
      fetchChemical();
    }
  }, [fetchChemical, params.chemicalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `/api/v1/chemicals/${params.chemicalId}`,
        {
          ...formData,
          purchaseDate: formatDateToInput(formData.purchaseDate),
          expirationDate: formData.expirationDate
            ? formatDateToInput(formData.expirationDate)
            : null,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast({
        title: "Berhasil!",
        description: "Data bahan kimia berhasil diperbarui",
      });

      router.push("/chemicals");
    } catch (error) {
      console.error("Error updating chemical:", error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat memperbarui data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:ml-auto">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Edit Bahan Kimia
          </CardTitle>
          <p className="text-sm text-gray-500">
            Perbarui informasi bahan kimia di formulir berikut
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informasi Dasar */}
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Nama *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Rumus Kimia *</Label>
                  <Input
                    value={formData.formula}
                    onChange={(e) =>
                      setFormData({ ...formData, formula: e.target.value })
                    }
                    className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700">CAS Number</Label>
                  <Input
                    value={formData.casNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, casNumber: e.target.value })
                    }
                    className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bentuk dan Stok */}
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Bentuk *</Label>
                  <Select
                    value={formData.form}
                    onValueChange={(value) =>
                      setFormData({ ...formData, form: value })
                    }>
                    <SelectTrigger className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500">
                      <SelectValue placeholder="Pilih bentuk bahan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOLID" className="hover:bg-blue-50">
                        Padat
                      </SelectItem>
                      <SelectItem value="LIQUID" className="hover:bg-blue-50">
                        Cair
                      </SelectItem>
                      <SelectItem value="GAS" className="hover:bg-blue-50">
                        Gas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Stok *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Satuan *</Label>
                    <Input
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-700">Tanggal Pembelian *</Label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700">Tanggal Kadaluwarsa</Label>
                <Input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expirationDate: e.target.value })
                  }
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            {/* Penyimpanan */}
            <div>
              <Label className="text-gray-700">Lokasi Penyimpanan *</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-700">Kabinet</Label>
                <Input
                  value={formData.cabinet}
                  onChange={(e) =>
                    setFormData({ ...formData, cabinet: e.target.value })
                  }
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700">Ruang</Label>
                <Input
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-700">Suhu</Label>
                <Input
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
