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
import React from "react";

interface SdsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterLanguage: string;
  setFilterLanguage: (value: string) => void;
  uniqueLanguages: (string | null)[];
  onExport: () => void;
}

const SdsFilter = ({
  searchTerm,
  setSearchTerm,
  filterLanguage,
  setFilterLanguage,
  uniqueLanguages,
  onExport,
}: SdsFilterProps) => {
  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 space-y-2">
        <span className="text-lg font-semibold">Filter & Pencarian</span>
        <p className="text-sm sm:text-base text-muted-foreground">
          Cari Safety Data Sheet berdasarkan nama bahan kimia, CAS number atau
          file.
        </p>

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama bahan kimia, CAS number, atau file..."
              className="pl-10 placeholder:text-xs sm:placeholder:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Bahasa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bahasa</SelectItem>
              {uniqueLanguages.map((language) => (
                <SelectItem key={language} value={language || "unknown"}>
                  {language === "ID"
                    ? "Indonesia"
                    : language === "EN"
                    ? "English"
                    : language}
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

export default SdsFilter;
