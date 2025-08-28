"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ChemicalFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterForm: string;
  onFilterFormChange: (value: string) => void;
  filterCharacteristic: string;
  onFilterCharacteristicChange: (value: string) => void;
}

const HomeChemicalFilter = ({
  searchTerm,
  onSearchChange,
  filterForm,
  onFilterFormChange,
  filterCharacteristic,
  onFilterCharacteristicChange,
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
            </SelectContent>
          </Select>

          <Select
            value={filterCharacteristic}
            onValueChange={onFilterCharacteristicChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sifat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Sifat</SelectItem>
              <SelectItem value="ACID">Asam</SelectItem>
              <SelectItem value="BASE">Basa</SelectItem>
              <SelectItem value="GENERAL">General</SelectItem>
              <SelectItem value="OXIDANT">Oksidan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default HomeChemicalFilter;
