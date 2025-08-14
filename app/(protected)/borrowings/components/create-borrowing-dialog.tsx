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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { UserAuth } from "@/types/auth";
import useChemicals from "@/hooks/use-chemicals";

interface CreateBorrowingDialogProps {
  children: React.ReactNode;
  user: UserAuth;
}

interface BorrowingItem {
  chemicalId: string;
  quantity: number;
}

export function CreateBorrowingDialog({
  children,
}: CreateBorrowingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<BorrowingItem[]>([
    { chemicalId: "", quantity: 0 },
  ]);

  const { chemicals } = useChemicals();

  const addItem = () => {
    setItems([...items, { chemicalId: "", quantity: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (
    index: number,
    field: keyof BorrowingItem,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const getChemicalInfo = (chemicalId: string) => {
    return chemicals.find((c) => c.id === chemicalId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate items
      const validItems = items.filter(
        (item) => item.chemicalId && item.quantity > 0
      );

      if (validItems.length === 0) {
        throw new Error("Pilih minimal satu bahan kimia");
      }

      // Check stock availability
      for (const item of validItems) {
        const chemical = getChemicalInfo(item.chemicalId);
        if (chemical && item.quantity > chemical.stock) {
          throw new Error(
            `Stok ${chemical.name} tidak mencukupi (tersedia: ${chemical.stock} ${chemical.unit})`
          );
        }
      }

      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Peminjaman Berhasil Diajukan! 🎉",
        description:
          "Permintaan peminjaman Anda sedang menunggu persetujuan dari laboran",
      });

      // Reset form
      setPurpose("");
      setNotes("");
      setItems([{ chemicalId: "", quantity: 0 }]);
      setOpen(false);

      // Refresh page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Gagal mengajuka peminjaman: ", error);

      toast({
        title: "Error ❌",
        description: "Gagal mengajukan peminjaman",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajukan Peminjaman Bahan Kimia</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk mengajukan peminjaman bahan kimia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Tujuan Peminjaman *</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              placeholder="Contoh: Praktikum Kimia Analitik - Titrasi Asam Basa"
              rows={3}
            />
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Bahan Kimia yang Dipinjam *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Bahan
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Bahan #{index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pilih Bahan Kimia</Label>
                      <Select
                        value={item.chemicalId}
                        onValueChange={(value) =>
                          updateItem(index, "chemicalId", value)
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bahan kimia" />
                        </SelectTrigger>
                        <SelectContent>
                          {chemicals.map((chemical) => (
                            <SelectItem key={chemical.id} value={chemical.id}>
                              <div className="flex flex-col">
                                <span>{chemical.name}</span>
                                <span className="text-xs text-gray-500">
                                  {chemical.formula} - Stok: {chemical.stock}{" "}
                                  {chemical.unit}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Jumlah</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                        {item.chemicalId && (
                          <div className="flex items-center px-3 bg-gray-100 rounded-md text-sm text-gray-600">
                            {getChemicalInfo(item.chemicalId)?.unit}
                          </div>
                        )}
                      </div>
                      {item.chemicalId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Stok tersedia:{" "}
                          {getChemicalInfo(item.chemicalId)?.stock}{" "}
                          {getChemicalInfo(item.chemicalId)?.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan atau informasi tambahan (opsional)"
              rows={2}
            />
          </div>

          {/* Submit */}
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
                  Mengajukan...
                </div>
              ) : (
                "Ajukan Peminjaman"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
