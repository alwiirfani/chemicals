"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAuth } from "@/types/auth";
import {
  editUserForAdminSchema,
  EditUserForAdminSchemaFormData,
} from "@/lib/validation/users";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { FormSelect } from "@/components/form/form-select";
import { FormInput } from "@/components/form/form-input";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAuth;
  onUserUpdated: (user: UserAuth) => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onUserUpdated,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    username: "",
    roleId: "",
    role: "",
    status: "",
    resetPassword: false,
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditUserForAdminSchemaFormData, string>>
  >({});
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: user.name,
        username: user.username,
        roleId: user.roleId,
        role: user.role,
        status: user.status,
        resetPassword: false,
        newPassword: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("userId: ", user.userId);

    e.preventDefault();

    const result = editUserForAdminSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof EditUserForAdminSchemaFormData, string>
      > = {};
      for (const err of result.error.issues) {
        const field = err.path[0] as keyof EditUserForAdminSchemaFormData;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.put(
        `/api/v1/users/${user.userId}`,
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
        title: "Berhasil mengubah pengguna ",
        description: "Pengguna berhasil diperbarui",
      });

      onUserUpdated(user);
      onOpenChange(false);
    } catch (error) {
      let message = "Gagal mengubah pengguna";

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
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Ubah informasi pengguna dan pengaturan akun
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <FormInput
              id="name"
              label="Nama Lengkap"
              value={formData.name}
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
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Masukkan username"
              required
              error={errors.username}
            />
          </div>
          {/* Status */}
          <FormSelect
            htmlFor="status"
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            error={errors.status}>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
            <SelectItem value="BLOCKED">Diblokir</SelectItem>
          </FormSelect>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="resetPassword"
                checked={formData.resetPassword}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    resetPassword: checked as boolean,
                  })
                }
              />
              <Label htmlFor="resetPassword">Reset password pengguna</Label>
            </div>

            {formData.resetPassword && (
              <FormInput
                id="newPassword"
                label="Password Baru"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                type="password"
                placeholder="Masukkan password baru"
                error={errors.newPassword}
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
