"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import {
  ChemicalCreateSchemaFormData,
  chemicalsCreateSchema,
} from "@/lib/validation/chemicals";
import axios from "axios";

interface AddChemicalDialogProps {
  children: React.ReactNode;
}

export function AddChemicalDialog({ children }: AddChemicalDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChemicalCreateSchemaFormData, string>>
  >({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    formula: "",
    casNumber: "",
    form: "SOLID",
    stock: 0,
    unit: "",
    purchaseDate: "",
    expirationDate: "",
    location: "",
    room: "",
    cabinet: "",
    temperature: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = chemicalsCreateSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof ChemicalCreateSchemaFormData, string>
      > = {};
      for (const err of result.error.issues) {
        const field = err.path[0] as keyof ChemicalCreateSchemaFormData;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/v1/chemicals",
        {
          ...formData,
          purchaseDate: formData.purchaseDate,
          expirationDate: formData.expirationDate || null,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      toast({
        title: "Berhasil! 🎉",
        description: "Bahan kimia berhasil ditambahkan ke inventaris",
      });

      setOpen(false);
      setFormData({
        name: "",
        formula: "",
        casNumber: "",
        form: "SOLID",
        stock: 0,
        unit: "",
        purchaseDate: "",
        expirationDate: "",
        location: "",
        room: "",
        cabinet: "",
        temperature: "",
      });

      setOpen(false);
    } catch (error) {
      console.error("Error adding chemical:", error);

      let errorMessage = "Gagal menambahkan bahan kimia. Silakan coba lagi.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      toast({
        title: "Error ❌",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Bahan Kimia Baru</DialogTitle>
          <DialogDescription>
            Masukkan informasi lengkap bahan kimia yang akan ditambahkan ke
            inventaris
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Bahan */}
            <FormInput
              id="name"
              label="Nama Bahan"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Asam Sulfat"
              error={errors.name}
            />

            {/* Rumus Kimia */}
            <FormInput
              id="formula"
              label="Rumus Kimia"
              value={formData.formula}
              onChange={(e) =>
                setFormData({ ...formData, formula: e.target.value })
              }
              required
              placeholder="H₂SO₄"
              error={errors.formula}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CAS Number */}
            <FormInput
              id="casNumber"
              label="CAS Number"
              value={formData.casNumber}
              onChange={(e) =>
                setFormData({ ...formData, casNumber: e.target.value })
              }
              placeholder="7664-93-9"
              error={errors.casNumber}
            />

            {/* Bentuk Bahan */}
            <FormSelect
              htmlFor="form"
              label="Bentuk"
              value={formData.form}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  form: value as ChemicalCreateSchemaFormData["form"],
                })
              }
              required
              error={errors.form}>
              <SelectItem value="SOLID">Padat</SelectItem>
              <SelectItem value="LIQUID">Cair</SelectItem>
              <SelectItem value="GAS">Gas</SelectItem>
            </FormSelect>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Jumlah Stok */}
            <FormInput
              id="stock"
              label="Jumlah Stok"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              placeholder="Contoh: 500"
              required
              error={errors.stock}
            />

            {/* Satuan */}
            <FormInput
              id="unit"
              label="Satuan"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              placeholder="Contoh: ml, g, kg"
              required
              error={errors.unit}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tanggal Pembelian */}
            <FormInput
              id="purchaseDate"
              label="Tanggal Pembelian"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({ ...formData, purchaseDate: e.target.value })
              }
              required
              error={errors.purchaseDate}
            />

            {/* Tanggal Kadaluwarsa */}
            <FormInput
              id="expirationDate"
              label="Tanggal Kadaluwarsa"
              type="date"
              value={formData.expirationDate}
              onChange={(e) =>
                setFormData({ ...formData, expirationDate: e.target.value })
              }
              required
              error={errors.expirationDate}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Lokasi Penyimpanan */}
            <FormInput
              id="location"
              label="Lokasi Penyimpanan"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Lemari Asam"
              required
              error={errors.location}
            />

            {/* Cabinet/Rak */}
            <FormInput
              id="cabinet"
              label="Cabinet/Rak"
              value={formData.cabinet}
              onChange={(e) =>
                setFormData({ ...formData, cabinet: e.target.value })
              }
              placeholder="A1"
              required
              error={errors.cabinet}
            />

            {/* Ruang Laboratorium */}
            <FormInput
              id="room"
              label="Ruang Laboratorium"
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              placeholder="Lab Kimia-1"
              required
              error={errors.room}
            />

            {/* Suhu Penyimpanan */}
            <FormInput
              id="temperature"
              label="Suhu Penyimpanan"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({ ...formData, temperature: e.target.value })
              }
              placeholder="4°C"
              required
              error={errors.temperature}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
                "Simpan Bahan Kimia"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
