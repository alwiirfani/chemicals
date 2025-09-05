"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { AlertTriangle } from "lucide-react";
import { QRCodeDialog } from "@/components/dialog/chemicals/qr-code-dialog";
import { Chemical } from "@/types/chemicals";

interface ChemicalTableProps {
  chemicals: Chemical[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const HomeChemicalTable = ({
  chemicals,
  currentPage,
  totalPages,
  onPageChange,
}: ChemicalTableProps) => {
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(
    null
  );
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const windowSize = 3;

  useEffect(() => {
    const newWindowStart =
      Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
    setPageWindowStart(newWindowStart);
  }, [currentPage]);

  const handleEllipsisClick = () => {
    const nextStart = pageWindowStart + windowSize;
    if (nextStart <= totalPages) {
      setPageWindowStart(nextStart);
      onPageChange(nextStart); // pindah ke awal window baru
    }
  };

  const pageNumbers = Array.from(
    { length: Math.min(windowSize, totalPages - pageWindowStart + 1) },
    (_, i) => pageWindowStart + i
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
      <div className="flex justify-center py-4">
        <Pagination>
          <PaginationContent className="flex flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  currentPage <= 1 || totalPages <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pageWindowStart + windowSize - 1 < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={handleEllipsisClick}>
                  ...
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  currentPage >= totalPages || totalPages <= 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
