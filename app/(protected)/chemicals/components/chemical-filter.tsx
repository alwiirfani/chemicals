"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

interface ChemicalFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterForm: string;
  onFilterFormChange: (value: string) => void;
  filterLocation: string;
  onFilterLocationChange: (value: string) => void;
  uniqueRooms: (string | null)[];
  onExport: () => void;
}

export const ChemicalFilter = ({
  searchTerm,
  onSearchChange,
  filterForm,
  onFilterFormChange,
  filterLocation,
  onFilterLocationChange,
  uniqueRooms,
  onExport,
}: ChemicalFilterProps) => {
  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 space-y-2">
        <span className="text-lg font-semibold">Filter & Pencarian</span>
        <p className="text-sm sm:text-base text-muted-foreground">
          Cari bahan kimia berdasarkan nama bahan, rumus, atau CAS number.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama bahan, rumus, atau CAS number..."
              className="pl-10 placeholder:text-xs sm:placeholder:text-base"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Select value={filterForm} onValueChange={onFilterFormChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Bentuk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bentuk</SelectItem>
              <SelectItem value="SOLID">Padat</SelectItem>
              <SelectItem value="LIQUID">Cair</SelectItem>
              <SelectItem value="GAS">Gas</SelectItem>
              <SelectItem value="ACID">Asam</SelectItem>
              <SelectItem value="BASE">Basa</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="OXIDANT">Oksidan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterLocation} onValueChange={onFilterLocationChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Ruang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Ruang</SelectItem>
              {uniqueRooms.map((room) => (
                <SelectItem key={room} value={room ?? "unknown"}>
                  {room ?? "-"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
