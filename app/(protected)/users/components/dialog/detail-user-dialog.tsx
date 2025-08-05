"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UserAuth } from "@/types/auth";
import { User, Mail, Calendar, Clock, Shield, Hash } from "lucide-react";

interface DetaiUserlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAuth;
}

export const DetailUserDialog: React.FC<DetaiUserlDialogProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "LABORAN":
        return "Laboran";
      case "USER":
        return "Pengguna";
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "default";
      case "LABORAN":
        return "secondary";
      case "USER":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "INACTIVE":
        return "Tidak Aktif";
      case "SUSPENDED":
        return "Ditangguhkan";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Pengguna</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang pengguna ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">Nama Lengkap</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">Alamat Email</p>
              </div>
            </div>

            {user.roleId && (
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{user.roleId}</p>
                  <p className="text-sm text-gray-500">Nomor Induk Mahasiswa</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Role & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
                <span className="text-sm text-gray-500">Role</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center">
                <div
                  className={`h-3 w-3 rounded-full ${
                    user.status === "ACTIVE"
                      ? "bg-green-500"
                      : user.status === "INACTIVE"
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
                <span className="text-sm text-gray-500">Status Akun</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
                <p className="text-sm text-gray-500">Tanggal Dibuat</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">
                  {user.lastLogin
                    ? formatDate(user.lastLogin)
                    : "Belum pernah login"}
                </p>
                <p className="text-sm text-gray-500">Login Terakhir</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Informasi Tambahan</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• ID Pengguna: {user.userId}</p>
              <p>• Tipe Akun: {user.roleId ? "Mahasiswa" : "Staff/Dosen"}</p>
              <p>
                • Akses Sistem:{" "}
                {user.status === "ACTIVE" ? "Diizinkan" : "Dibatasi"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
