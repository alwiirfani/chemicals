import { Borrowing } from "@/types/borrowings";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { useToast } from "./use-toast";
import axios from "axios";
import { convertSnakeToCamel } from "@/helpers/case";

const useBorrowings = () => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingChemicalId, setDeletingChemicalId] = useState<string | null>(
    null
  );
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 1,
  });

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { toast } = useToast();

  const fetchBorrowings = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(filterStatus !== "all" && { status: filterStatus }),
          ...(filterRole !== "all" && { userRole: filterRole }),
        };

        const { data } = await axios.get(`/api/v1/borrowings`, {
          params,
        });

        const borrowingsCamelCase = convertSnakeToCamel<Borrowing[]>(
          data.formattedBorrowings
        );

        console.log("Data peminjaman: ", borrowingsCamelCase);

        setBorrowings(borrowingsCamelCase);
        setTotal(data.pagination.total);
        setPagination({
          currentPage: data.pagination.page,
          total: data.pagination.total,
          totalPages: data.pagination.pages,
        });
      } catch (error) {
        console.error("Error fetching borrowings: ", error);
        toast({
          title: "Error ❌",
          description: "Gagal memuat data peminjaman",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, filterRole, filterStatus, toast]
  );

  useEffect(() => {
    fetchBorrowings(pagination.currentPage);
  }, [
    debouncedSearch,
    filterRole,
    filterStatus,
    fetchBorrowings,
    pagination.currentPage,
  ]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return {
    borrowings,
    total,
    isLoading,
    searchTerm,
    filterStatus,
    filterRole,
    isDeleting,
    openDeleteModal,
    deletingChemicalId,
    pagination,
    handlePageChange,
    setSearchTerm,
    setFilterStatus,
    setFilterRole,
    setIsDeleting,
    setOpenDeleteModal,
    setDeletingChemicalId,
  };
};

export default useBorrowings;
