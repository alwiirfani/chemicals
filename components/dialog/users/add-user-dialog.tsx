"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { registerSchema, RegisterSchemaFormData } from "@/lib/validation/auth";
import { FormInput } from "@/components/form/form-input";
import {
  getRoleIdLabel,
  getRoleIdPlaceholder,
} from "@/helpers/users/user-client";
import { FormSelect } from "@/components/form/form-select";
import { SelectItem } from "@/components/ui/select";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  onUserAdded,
}) => {
  const [formData, setFormData] = useState<RegisterSchemaFormData>({
    email: "",
    name: "",
    username: "",
    roleId: "",
    status: "ACTIVE",
    role: "MAHASISWA",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterSchemaFormData, string>>
  >({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterSchemaFormData, string>> =
        {};
      for (const err of result.error.issues) {
        const field = err.path[0] as keyof RegisterSchemaFormData;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.post(
        "/api/v1/auth/register",
        {
          ...formData,
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
        username: "",
        status: "ACTIVE",
        roleId: "",
        role: "MAHASISWA",
        password: "",
        confirmPassword: "",
      });

      onUserAdded();
      onOpenChange(false);
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
            {/* Role Select */}
            <FormSelect
              htmlFor="role"
              label="Role"
              value={formData.role}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as RegisterSchemaFormData["role"],
                  roleId: "",
                  name: value === "ADMIN" ? "Administrator" : "",
                })
              }
              error={errors.role}>
              <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
              <SelectItem value="DOSEN">Dosen</SelectItem>
              <SelectItem value="LABORAN">Laboran</SelectItem>
              <SelectItem value="ADMIN">Administrator</SelectItem>
            </FormSelect>

            {/* Role ID */}
            <FormInput
              id="roleId"
              label={getRoleIdLabel(formData.role)}
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: e.target.value })
              }
              placeholder={getRoleIdPlaceholder(formData.role)}
              required
              error={errors.roleId}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <FormInput
              id="name"
              label="Nama Lengkap"
              value={
                formData.role === "ADMIN" ? "Administrator" : formData.name
              }
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Masukkan nama lengkap"
              required
              disabled={formData.role === "ADMIN"}
              error={errors.name}
              hint={
                formData.role === "ADMIN"
                  ? "Nama admin akan diset otomatis"
                  : undefined
              }
            />

            {/* Email */}
            <FormInput
              id="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              placeholder="Masukkan email"
              required
              error={errors.email}
            />

            {/* Username */}
            <FormInput
              id="username"
              label="Username"
              value={formData.username || ""}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Masukkan username"
              required
              error={errors.username}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <FormInput
              id="password"
              label="Password"
              value={formData.password}
              type="password"
              placeholder="Minimal 6 karakter"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              error={errors.password}
            />

            {/* Konfirmasi Password */}
            <FormInput
              id="confirmPassword"
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              error={errors.confirmPassword}
            />
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
};
