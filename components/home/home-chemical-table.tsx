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
import { AlertTriangle } from "lucide-react";
import { QRCodeDialog } from "@/components/dialog/chemicals/qr-code-dialog";
import { Chemical } from "@/types/chemicals";

interface ChemicalPaginationProps {
  currentPage: number;
  totalPages: number;
}

interface ChemicalTableProps {
  chemicals: Chemical[];
  pagination: ChemicalPaginationProps;
  onPageChange: (page: number) => void;
}

const HomeChemicalTable = ({
  chemicals,
  pagination,
  onPageChange,
}: ChemicalTableProps) => {
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(
    null
  );
  return (
    <>
      <div className="rounded-md border">
        <div className="w-full overflow-x-auto">
          <Table className="table-auto min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-blue-50 hover:bg-blue-100">
                <TableHead className="whitespace-nowrap pl-4 w-[60px]">
                  No
                </TableHead>
                <TableHead className="whitespace-nowrap">Nama Bahan</TableHead>
                <TableHead className="whitespace-nowrap">Rumus</TableHead>
                <TableHead className="whitespace-nowrap">Stok</TableHead>
                <TableHead className="whitespace-nowrap">Kadaluwarsa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chemicals.map((chemical, index) => (
                <TableRow key={chemical.id}>
                  <TableCell className="pl-4 w-[60px]">{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{chemical.name}</div>
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
                    {/* {chemical.expirationDate ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isExpired(new Date(chemical.expirationDate))
                              ? "text-red-600 font-medium"
                              : isExpiringSoon(
                                  new Date(chemical.expirationDate)
                                )
                              ? "text-yellow-600 font-medium"
                              : ""
                          }>
                          {formatDateToString(
                            new Date(chemical.expirationDate)
                          )}
                        </span>
                        {isExpired(new Date(chemical.expirationDate)) && (
                          <Badge variant="destructive" className="text-xs">
                            Expired
                          </Badge>
                        )}
                        {isExpiringSoon(new Date(chemical.expirationDate)) &&
                          !isExpired(new Date(chemical.expirationDate)) && (
                            <Badge variant="secondary" className="text-xs">
                              Soon
                            </Badge>
                          )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )} */}
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
};

export default HomeChemicalTable;
