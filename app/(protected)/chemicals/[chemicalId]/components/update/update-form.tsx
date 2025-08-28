"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { ChemicalFormData } from "@/types/chemicals";

interface ChemicalFormDataProps {
  formData: ChemicalFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChemicalFormData>>;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const UpdateChemicalForm: React.FC<ChemicalFormDataProps> = ({
  formData,
  setFormData,
  loading,
  handleSubmit,
}) => {
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
              <div className="space-y-4">
                {/* Nama Bahan Kimia */}
                <FormInput
                  id="name"
                  label="Nama"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={loading}
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />

                {/* Rumus Kimia */}
                <FormInput
                  id="formula"
                  label="Rumus Kimia"
                  value={formData.formula}
                  onChange={(e) => {
                    setFormData({ ...formData, formula: e.target.value });
                    console.log(formData);
                  }}
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                  disabled={loading}
                  required
                />
              </div>

              {/* Bentuk dan Stok */}
              <div className="space-y-4">
                {/* Bentuk */}
                <FormSelect
                  htmlFor="form"
                  label="Bentuk"
                  value={formData.form}
                  onChange={(value) =>
                    setFormData({ ...formData, form: value })
                  }
                  placeholder="Pilih bentuk"
                  required>
                  <SelectItem value="SOLID" className="hover:bg-blue-50">
                    Padat
                  </SelectItem>
                  <SelectItem value="LIQUID" className="hover:bg-blue-50">
                    Cair
                  </SelectItem>
                  <SelectItem value="GAS" className="hover:bg-blue-50">
                    Gas
                  </SelectItem>
                </FormSelect>

                {/* Sifat */}
                <FormSelect
                  htmlFor="characteristic"
                  label="Sifat"
                  value={formData.characteristic}
                  onChange={(value) =>
                    setFormData({ ...formData, form: value })
                  }
                  placeholder="Pilih sifat"
                  required>
                  <SelectItem value="ACID" className="hover:bg-blue-50">
                    Asam
                  </SelectItem>
                  <SelectItem value="BASE" className="hover:bg-blue-50">
                    Basa
                  </SelectItem>
                  <SelectItem value="GENERAL" className="hover:bg-blue-50">
                    General
                  </SelectItem>
                  <SelectItem value="OXIDANT" className="hover:bg-blue-50">
                    Oksidan
                  </SelectItem>
                </FormSelect>
                {/* Aksi Stok */}
                <FormSelect
                  htmlFor="type"
                  label="Aksi Stok"
                  value={formData.type}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as "ADD" | "REDUCE",
                    })
                  }
                  placeholder="Pilih aksi"
                  required>
                  <SelectItem value="ADD" className="hover:bg-blue-50">
                    Tambah Stok
                  </SelectItem>
                  <SelectItem value="REDUCE" className="hover:bg-blue-50">
                    Kurangi Stok
                  </SelectItem>
                </FormSelect>

                <div className="grid grid-cols-2 gap-4">
                  {/* Stok */}
                  <FormInput
                    id="quantity"
                    label="Jumlah"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        quantity: Number(e.target.value),
                      });
                    }}
                    placeholder="1000"
                    className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={loading}
                    required
                  />

                  {/* Satuan */}
                  <FormInput
                    id="unit"
                    label="Satuan"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    placeholder="gram, ml, kg"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Deskripsi Mutasi Stok */}
                <FormInput
                  id="description"
                  label="Deskripsi"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Misal: tambah untuk percobaan A"
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                  disabled={loading}
                />
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
                  disabled={loading}
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
};

export default UpdateChemicalForm;
