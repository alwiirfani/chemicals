"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Edit, Trash2, AlertTriangle } from "lucide-react";
import { QRCodeDialog } from "@/components/dialog/chemicals/qr-code-dialog";
import { Chemical } from "@/types/chemicals";
import { isExpired, isExpiringSoon } from "@/helpers/chemicals/chemical-table";
import { formatDateToString } from "@/helpers/format-date";
import { useRouter } from "next/navigation";

interface ChemicalPaginationProps {
  currentPage: number;
  totalPages: number;
}

interface ChemicalTableProps {
  chemicals: Chemical[];
  pagination: ChemicalPaginationProps;
  onPageChange: (page: number) => void;
  onDelete: (chemicalId: string) => void;
  userRole: string;
}

export function ChemicalTable({
  chemicals,
  pagination,
  onPageChange,
  onDelete,
  userRole,
}: ChemicalTableProps) {
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(
    null
  );
  const router = useRouter();

  const canEdit = userRole === "ADMIN" || userRole === "LABORAN";

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-blue-50 hover:bg-blue-100">
                <TableHead className="whitespace-nowrap pl-4 w-[60px]">
                  No
                </TableHead>
                <TableHead className="whitespace-nowrap">Nama Bahan</TableHead>
                <TableHead className="whitespace-nowrap">Rumus</TableHead>
                <TableHead className="whitespace-nowrap">Stok</TableHead>
                <TableHead className="whitespace-nowrap">Lokasi</TableHead>
                <TableHead className="whitespace-nowrap">Kadaluwarsa</TableHead>
                <TableHead className="whitespace-nowrap text-center sm:text-left">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chemicals.map((chemical, index) => (
                <TableRow key={chemical.id}>
                  <TableCell className="pl-4 w-[60px]">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{chemical.name}</div>
                      {chemical.casNumber && (
                        <div className="text-sm text-gray-500">
                          CAS: {chemical.casNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {chemical.formula}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {chemical.stock} {chemical.unit}
                      </span>
                      {chemical.stock < 10 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{chemical.location}</div>
                      {chemical.cabinet && (
                        <div className="text-gray-500">{chemical.cabinet}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {chemical.expirationDate ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isExpired(chemical.expirationDate)
                              ? "text-red-600 font-medium"
                              : isExpiringSoon(chemical.expirationDate)
                              ? "text-yellow-600 font-medium"
                              : ""
                          }>
                          {formatDateToString(chemical.expirationDate)}
                        </span>
                        {isExpired(chemical.expirationDate) && (
                          <Badge variant="destructive" className="text-xs">
                            Expired
                          </Badge>
                        )}
                        {isExpiringSoon(chemical.expirationDate) &&
                          !isExpired(chemical.expirationDate) && (
                            <Badge variant="secondary" className="text-xs">
                              Soon
                            </Badge>
                          )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                        onClick={() => setSelectedChemical(chemical)}>
                        <QrCode className="h-4 w-4" />
                      </Button>
                      {canEdit && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:text-white border-yellow-400 hover:border-yellow-500 transition-all duration-200 hover:scale-105"
                            onClick={() => {
                              router.push(`/chemicals/${chemical.id}/update`);
                            }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-400 hover:bg-red-500 text-red-900 hover:text-white border-red-400 hover:border-red-500 transition-all duration-200 hover:scale-105"
                            onClick={() => onDelete(chemical.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <p className="text-sm text-muted-foreground">
          Halaman {pagination.currentPage} dari {pagination.totalPages}
        </p>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}>
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}>
            Selanjutnya
          </Button>
        </div>
      </div>

      {selectedChemical && (
        <QRCodeDialog
          chemical={selectedChemical}
          open={!!selectedChemical}
          onOpenChange={(open) => !open && setSelectedChemical(null)}
        />
      )}
    </>
  );
}
