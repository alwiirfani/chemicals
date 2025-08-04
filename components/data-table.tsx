import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  inputSearch?: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  searchKey?: (keyof TData)[];
}

export function DataTable<TData, TValue>({
  inputSearch,
  data,
  columns,
  searchKey = [],
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: createGlobalFilterFn<TData>(searchKey),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <div>
      {/* Search */}
      <div className="flex items-center py-4">
        <input
          placeholder={`Search..... ${inputSearch ?? ""}`}
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full text-sm sm:text-lg border border-gray-300 rounded-md p-2 overflow-auto"
        />
      </div>

      {/* Table Header */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Kembali
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}

function createGlobalFilterFn<TData>(
  searchKeys: (keyof TData)[]
): (row: Row<TData>, columnId: string, filterValue: string) => boolean {
  return (row, _columnId, filterValue) => {
    return searchKeys.some((key) =>
      String(row.original[key] ?? "")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  };
}
