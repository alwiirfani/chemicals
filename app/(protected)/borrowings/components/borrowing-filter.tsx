import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search } from "lucide-react";

interface BorrowingFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterUser: string;
  setFilterUser: (value: string) => void;
  onExport: () => void;
  canManage: boolean;
}

const BorrowingFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterUser,
  setFilterUser,
  onExport,
  canManage,
}: BorrowingFilterProps) => {
  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 space-y-2">
        <span className="text-lg font-semibold">Filter & Pencarian</span>
        <p className="text-sm sm:text-base text-muted-foreground">
          Cari Data Peminjaman berdasarkan peminjam, tujuan, atau bahan kimia.
        </p>

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari peminjam, tujuan, atau bahan kimia..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PENDING">Menunggu</SelectItem>
              <SelectItem value="APPROVED">Disetujui</SelectItem>
              <SelectItem value="REJECTED">Ditolak</SelectItem>
              <SelectItem value="RETURNED">Dikembalikan</SelectItem>
              <SelectItem value="OVERDUE">Terlambat</SelectItem>
            </SelectContent>
          </Select>

          {canManage && (
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                <SelectItem value="DOSEN">Dosen</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            className="bg-green-700 hover:bg-green-400 text-white"
            onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BorrowingFilter;
