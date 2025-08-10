import { Chemical } from "@/types/chemicals";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { useToast } from "./use-toast";
import axios from "axios";
import { convertSnakeToCamel } from "@/helpers/case";

const useChemicals = () => {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForm, setFilterForm] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [loading, setLoading] = useState(true);
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

  const fetchChemicals = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(filterForm !== "all" && { form: filterForm }),
          ...(filterLocation !== "all" && { room: filterLocation }),
        };

        const { data } = await axios.get("/api/v1/chemicals", { params });
        console.log(
          "Data bahan kimia dari useChemicals:",
          data.formattedChemicals
        );

        const chemicalsCamelCase = convertSnakeToCamel<Chemical[]>(
          data.formattedChemicals
        );
        setChemicals(chemicalsCamelCase);
        setTotal(data.total);
        setPagination({
          currentPage: data.pagination.page,
          total: data.pagination.total,
          totalPages: data.pagination.pages,
        });
      } catch (error) {
        console.error("Gagal memuat data bahan kimia: ", error);
        toast({
          title: "Gagal",
          description: "Tidak dapat memuat data bahan kimia",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, filterForm, filterLocation, toast]
  );

  useEffect(() => {
    fetchChemicals(pagination.currentPage);
  }, [
    debouncedSearch,
    filterForm,
    filterLocation,
    pagination.currentPage,
    fetchChemicals,
  ]);

  const handleRequestDelete = (chemicalId: string) => {
    setDeletingChemicalId(chemicalId);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingChemicalId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/v1/chemicals/${deletingChemicalId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setChemicals((prev) => prev.filter((c) => c.id !== deletingChemicalId));
      toast({
        title: "Berhasil",
        description: "Bahan kimia berhasil dihapus",
      });
    } catch (error) {
      console.error("Gagal menghapus bahan kimia: ", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus bahan kimia",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpenDeleteModal(false);
      setDeletingChemicalId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
  return {
    // Data
    chemicals,
    total,
    pagination,
    loading,

    // Filter & search
    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterLocation,
    setFilterLocation,

    // Actions
    fetchChemicals,
    handlePageChange,

    // Delete modal
    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,
  };
};

export default useChemicals;
