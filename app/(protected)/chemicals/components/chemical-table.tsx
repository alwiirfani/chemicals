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
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { QRCodeDialog } from "@/components/dialog/chemicals/qr-code-dialog";
import { Chemical } from "@/types/chemicals";
import { useRouter } from "next/navigation";

interface ChemicalTableProps {
  chemicals: Chemical[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (chemicalId: string) => void;
  userRole: string;
}

export function ChemicalTable({
  chemicals,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  userRole,
}: ChemicalTableProps) {
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(
    null
  );
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const windowSize = 3;

  const router = useRouter();

  const canAction =
    userRole === "ADMIN" ||
    userRole === "LABORAN" ||
    userRole === "PETUGAS_GUDANG";

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
                {canAction ? (
                  <TableHead className="whitespace-nowrap text-center sm:text-left">
                    Aksi
                  </TableHead>
                ) : (
                  <TableHead className="whitespace-nowrap text-center sm:text-left"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {chemicals.map((chemical, index) => (
                <TableRow key={chemical.id}>
                  <TableCell className="pl-4 w-[60px]">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{chemical.name}</div>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canAction && (
                        <>
                          {/* <Button
                            title="QR Code"
                            variant="outline"
                            size="sm"
                            className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                            onClick={() => setSelectedChemical(chemical)}>
                            <QrCode className="h-4 w-4" />
                          </Button> */}
                          <Button
                            title="Edit"
                            variant="outline"
                            size="sm"
                            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:text-white border-yellow-400 hover:border-yellow-500 transition-all duration-200 hover:scale-105"
                            onClick={() => {
                              router.push(`/chemicals/${chemical.id}/update`);
                            }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            title="Hapus"
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
}
