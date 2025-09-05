// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Download, Search, Upload } from "lucide-react";
// import React, { useState } from "react";

// interface SdsFilterProps {
//   searchTerm: string;
//   setSearchTerm: (value: string) => void;
//   filterLanguage: string;
//   setFilterLanguage: (value: string) => void;
//   uniqueLanguages: (string | null)[];
//   onExport: () => void;
//   onImport: (file: File | null) => void;
//   loadingImport?: boolean;
//   userRole: string;
// }

// const SdsFilter = ({
//   searchTerm,
//   setSearchTerm,
//   filterLanguage,
//   setFilterLanguage,
//   uniqueLanguages,
//   onExport,
//   onImport,
//   loadingImport,
//   userRole,
// }: SdsFilterProps) => {
//   const [importOpen, setImportOpen] = useState(false);
//   const [importFile, setImportFile] = useState<File | null>(null);
//   const canAction =
//     userRole === "ADMIN" ||
//     userRole === "LABORAN" ||
//     userRole === "PETUGAS_GUDANG";

//   const handleImportSubmit = () => {
//     onImport(importFile);
//     setImportFile(null);
//   };
//   return (
//     <div className="bg-white rounded-xl border">
//       <div className="p-6 space-y-2">
//         <span className="text-lg font-semibold">Filter & Pencarian</span>
//         <p className="text-sm sm:text-base text-muted-foreground">
//           Cari Safety Data Sheet berdasarkan nama bahan kimia.
//         </p>

//         <div className="flex flex-col lg:flex-row gap-4 mt-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Cari nama bahan kimia atau nama file..."
//               className="pl-10 placeholder:text-xs sm:placeholder:text-base"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <Select value={filterLanguage} onValueChange={setFilterLanguage}>
//             <SelectTrigger className="w-full sm:w-[180px]">
//               <SelectValue placeholder="Bahasa" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Semua Bahasa</SelectItem>
//               {uniqueLanguages.map((language) => (
//                 <SelectItem key={language} value={language || "unknown"}>
//                   {language === "ID"
//                     ? "Indonesia"
//                     : language === "EN"
//                     ? "English"
//                     : language}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Import & Export */}
//           {canAction && (
//             <Dialog open={importOpen} onOpenChange={setImportOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="bg-blue-700 hover:bg-blue-400 text-white"
//                   disabled={loadingImport}>
//                   <Upload className="mr-2 h-4 w-4" />
//                   {loadingImport ? "Mengimpor..." : "Import Data"}
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Import Data Safety Data Sheet</DialogTitle>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                   <Input
//                     type="file"
//                     accept=".zip"
//                     onChange={(e) => setImportFile(e.target.files?.[0] || null)}
//                   />
//                 </div>

//                 <DialogFooter>
//                   <Button disabled={!importFile} onClick={handleImportSubmit}>
//                     {loadingImport ? "Mengimpor..." : "Import Data"}
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           )}

//           <Button
//             variant="outline"
//             className="bg-green-700 hover:bg-green-400 text-white"
//             onClick={onExport}>
//             <Download className="mr-2 h-4 w-4" />
//             Export Excel
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SdsFilter;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, Upload } from "lucide-react";
import React, { useState } from "react";

interface SdsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterLanguage: string;
  setFilterLanguage: (value: string) => void;
  uniqueLanguages: (string | null)[];
  onExport?: () => void;
  onImport?: (file: File | null) => void;
  loadingImport?: boolean;
  userRole?: string;
  mode?: "home" | "management";
}

const SdsFilter = ({
  searchTerm,
  setSearchTerm,
  filterLanguage,
  setFilterLanguage,
  uniqueLanguages,
  onExport,
  onImport,
  loadingImport,
  userRole,
  mode = "home",
}: SdsFilterProps) => {
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const canAction =
    userRole === "ADMIN" ||
    userRole === "LABORAN" ||
    userRole === "PETUGAS_GUDANG";

  const handleImportSubmit = () => {
    onImport?.(importFile);
    setImportFile(null);
  };

  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 space-y-2">
        <span className="text-lg font-semibold">Filter & Pencarian</span>
        <p className="text-sm sm:text-base text-muted-foreground">
          {mode === "home"
            ? "Cari Safety Data Sheet berdasarkan nama bahan kimia, CAS number atau file."
            : "Cari Safety Data Sheet berdasarkan nama bahan kimia."}
        </p>

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama bahan kimia atau nama file..."
              className="pl-10 placeholder:text-xs sm:placeholder:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Language Filter */}
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

          {/* Extra Features hanya untuk Management */}
          {mode === "management" && (
            <>
              {canAction && (
                <Dialog open={importOpen} onOpenChange={setImportOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-blue-700 hover:bg-blue-400 text-white"
                      disabled={loadingImport}>
                      <Upload className="mr-2 h-4 w-4" />
                      {loadingImport ? "Mengimpor..." : "Import Data"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Data Safety Data Sheet</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept=".zip"
                        onChange={(e) =>
                          setImportFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        disabled={!importFile}
                        onClick={handleImportSubmit}>
                        {loadingImport ? "Mengimpor..." : "Import Data"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Button
                variant="outline"
                className="bg-green-700 hover:bg-green-400 text-white"
                onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SdsFilter;
