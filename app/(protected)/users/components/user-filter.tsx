import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserFilterProps {
  searchTerm: string;
  role: string;
  status: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  searchTerm,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 space-y-2">
        <span className="text-lg font-semibold">Filter & Pencarian</span>
        <p className="text-sm text-muted-foreground">
          Cari pengguna berdasarkan nama atau email.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama atau email...."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={role} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="LABORAN">Laboran</SelectItem>
              <SelectItem value="DOSEN">Dosen</SelectItem>
              <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="ACTIVE">Aktif</SelectItem>
              <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
              <SelectItem value="BLOCKED">Ditangguhkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
