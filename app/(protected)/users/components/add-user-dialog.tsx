"use client";

import type React from "react";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    roleId: "",
    role: "MAHASISWA",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    if (!formData.roleId) {
      toast({
        title: "Error",
        description: "ID role harus diisi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "/api/v1/users",
        {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          roleId: formData.roleId,
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
        title: "Berhasil",
        description: "Pengguna berhasil ditambahkan",
      });

      setFormData({
        email: "",
        name: "",
        roleId: "",
        role: "MAHASISWA",
        password: "",
        confirmPassword: "",
      });

      onUserAdded();
    } catch (error) {
      let message = "Gagal menambahkan pengguna";

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIdLabel = () => {
    switch (formData.role) {
      case "ADMIN":
        return "PIN (5 digit)";
      case "MAHASISWA":
        return "NIM (8 digit)";
      case "DOSEN":
        return "NIDN (10 digit)";
      case "LABORAN":
        return "NIP (10 digit)";
      default:
        return "ID";
    }
  };

  const getRoleIdPlaceholder = () => {
    switch (formData.role) {
      case "ADMIN":
        return "12345";
      case "MAHASISWA":
        return "20210001";
      case "DOSEN":
        return "1234567890";
      case "LABORAN":
        return "1234567890";
      default:
        return "ID";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Buat akun pengguna baru untuk sistem ChemLab
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value, roleId: "" })
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                  <SelectItem value="DOSEN">Dosen</SelectItem>
                  <SelectItem value="LABORAN">Laboran</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleId">{getRoleIdLabel()} *</Label>
              <Input
                id="roleId"
                value={formData.roleId}
                onChange={(e) =>
                  setFormData({ ...formData, roleId: e.target.value })
                }
                placeholder={getRoleIdPlaceholder()}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
                required
                disabled={formData.role === "ADMIN"}
              />
              {formData.role === "ADMIN" && (
                <p className="text-xs text-gray-500">
                  Nama admin akan diset otomatis
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Minimal 6 karakter"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
