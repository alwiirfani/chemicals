"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Borrowing } from "@/types/borrowings";
import axios from "axios";

interface ReturnBorrowingDialogProps {
  borrowing: Borrowing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReturnBorrowingDialog({
  borrowing,
  open,
  onOpenChange,
}: ReturnBorrowingDialogProps) {
  const { toast } = useToast();
  const [returnedItems, setReturnedItems] = useState<
    { id: string; returnedQty: number }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize returned items when borrowing changes
  useEffect(() => {
    if (borrowing) {
      setReturnedItems(
        borrowing.items.map((item) => ({
          id: item.id,
          returnedQty: item.quantity, // Default kembalikan semua
        }))
      );
    }
  }, [borrowing]);

  const handleReturnSubmit = async () => {
    if (!borrowing) return;

    try {
      setIsProcessing(true);
      const body = {
        action: "RETURNED",
        returnedItems,
      };

      const { data } = await axios.patch(
        `/api/v1/borrowings/${borrowing.id}`,
        body,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Berhasil! 🎉",
        description: data.message,
      });

      onOpenChange(false);

      // Refresh halaman untuk menampilkan data terbaru
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error processing return:", error);

      toast({
        title: "Error ❌",
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQtyChange = (itemId: string, value: number, max: number) => {
    setReturnedItems((prev) =>
      prev.map((ri) =>
        ri.id === itemId
          ? {
              ...ri,
              returnedQty: Math.min(Math.max(value, 0), max),
            }
          : ri
      )
    );
  };

  if (!borrowing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            <DialogTitle>Proses Pengembalian</DialogTitle>
          </div>
          <DialogDescription>
            Konfirmasi jumlah bahan kimia yang dikembalikan oleh{" "}
            <span className="font-semibold">{borrowing.borrower.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {borrowing.items.map((item) => {
            const returnedItem = returnedItems.find((ri) => ri.id === item.id);
            const returnedQty = returnedItem?.returnedQty || 0;

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 items-center gap-2">
                <Label
                  htmlFor={`return-${item.id}`}
                  className="col-span-3 flex flex-col">
                  <span className="font-medium">{item.chemical.name}</span>
                  <span className="text-sm text-gray-500">
                    Dipinjam: {item.quantity} {item.chemical.unit}
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={`return-${item.id}`}
                    type="number"
                    max={item.quantity}
                    value={returnedQty}
                    onChange={(e) =>
                      handleQtyChange(
                        item.id,
                        parseInt(e.target.value) || 0,
                        item.quantity
                      )
                    }
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {item.chemical.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}>
            Batal
          </Button>
          <Button
            onClick={handleReturnSubmit}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700">
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 animate-spin" />
                Memproses...
              </span>
            ) : (
              "Konfirmasi Pengembalian"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
