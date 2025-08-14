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
import {
  Check,
  X,
  RotateCcw,
  User,
  Calendar,
  FileText,
  Package,
} from "lucide-react";

interface Borrowing {
  id: string;
  borrowerId: string;
  borrower: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED" | "OVERDUE";
  requestDate: Date;
  approvedAt: Date | null;
  returnedAt: Date | null;
  notes: string | null;
  items: Array<{
    id: string;
    chemicalId: string;
    chemical: {
      id: string;
      name: string;
      formula: string;
      unit: string;
    };
    quantity: number;
    returned: boolean;
    returnedQty: number | null;
  }>;
}

interface BorrowingDetailDialogProps {
  borrowing: Borrowing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: string;
}

export function BorrowingDetailDialog({
  borrowing,
  open,
  onOpenChange,
  userRole,
}: BorrowingDetailDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Menunggu Persetujuan
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Disetujui
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Ditolak</Badge>;
      case "RETURNED":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Dikembalikan
          </Badge>
        );
      case "OVERDUE":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Terlambat
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canManage = userRole === "ADMIN" || userRole === "LABORAN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detail Peminjaman #{borrowing.id.slice(-6).toUpperCase()}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap peminjaman bahan kimia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Status Peminjaman</h3>
            {getStatusBadge(borrowing.status)}
          </div>

          {/* Borrower Info */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Informasi Peminjam
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-medium">{borrowing.borrower.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{borrowing.borrower.email}</p>
                </div>
                {borrowing.borrower.name && (
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-medium">{borrowing.borrower.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">
                    {borrowing.borrower.role === "USER"
                      ? "Mahasiswa/Dosen"
                      : borrowing.borrower.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-3">
            <h4 className="font-medium">Tujuan Peminjaman</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{borrowing.purpose}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Pengajuan</p>
                  <p className="text-xs text-gray-500">
                    {format(borrowing.requestDate, "dd MMMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </p>
                </div>
              </div>

              {borrowing.approvedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Disetujui</p>
                    <p className="text-xs text-gray-500">
                      {format(borrowing.approvedAt, "dd MMMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {borrowing.returnedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Dikembalikan</p>
                    <p className="text-xs text-gray-500">
                      {format(borrowing.returnedAt, "dd MMMM yyyy, HH:mm", {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bahan Kimia ({borrowing.items.length} item)
            </h4>
            <div className="space-y-2">
              {borrowing.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.chemical.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.chemical.formula}
                      </p>
                      <p className="text-sm">
                        Jumlah:{" "}
                        <span className="font-medium">
                          {item.quantity} {item.chemical.unit}
                        </span>
                      </p>
                      {item.returned && item.returnedQty !== null && (
                        <p className="text-sm text-green-600">
                          Dikembalikan:{" "}
                          <span className="font-medium">
                            {item.returnedQty} {item.chemical.unit}
                          </span>
                        </p>
                      )}
                    </div>
                    {item.returned && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800">
                        Dikembalikan
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {borrowing.notes && (
            <div className="space-y-3">
              <h4 className="font-medium">Catatan</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{borrowing.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {canManage && borrowing.status === "PENDING" && (
            <>
              <Separator />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 bg-transparent">
                  <X className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
                <Button className="text-green-600 hover:text-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Setujui
                </Button>
              </div>
            </>
          )}

          {canManage && borrowing.status === "APPROVED" && (
            <>
              <Separator />
              <div className="flex justify-end">
                <Button className="text-blue-600 hover:text-blue-700">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Tandai Dikembalikan
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
