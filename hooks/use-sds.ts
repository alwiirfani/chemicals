import { SDS } from "@/types/sds";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useDebounce } from "./use-debounce";
import axios from "axios";
import { convertSnakeToCamel } from "@/helpers/case";

const useSds = () => {
  const [sdsRecords, setSdsRecords] = useState<SDS[]>([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [loadingTable, setLoadingTable] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingSdsId, setDeletingSdsId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 1,
  });

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { toast } = useToast();

  const fetchSds = useCallback(
    async (page = 1) => {
      try {
        setLoadingTable(true);
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(filterLanguage !== "all" && { language: filterLanguage }),
        };
        const { data } = await axios.get("/api/v1/sds", { params });
        console.log("Data safety documents: ", data);

        const sdsCamelCase = convertSnakeToCamel<SDS[]>(
          data.formattedSdsRecords
        );

        setSdsRecords(sdsCamelCase);
        setTotal(data.total);
        setPagination({
          currentPage: data.pagination.page,
          total: data.total,
          totalPages: data.pagination.pages,
        });
        setLoadingTable(false);
      } catch (error) {
        console.error("Error fetching SDS:", error);
        toast({
          title: "Gagal",
          description: "Tidak dapat memuat data SDS",
          variant: "destructive",
        });
      } finally {
        setLoadingTable(false);
      }
    },
    [debouncedSearch, filterLanguage, toast]
  );

  useEffect(() => {
    fetchSds(pagination.currentPage);
  }, [fetchSds, pagination.currentPage, debouncedSearch, filterLanguage]);

  const handleRequestDelete = (sdsId: string) => {
    setDeletingSdsId(sdsId);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSdsId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/v1/sds/${deletingSdsId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSdsRecords((prev) => prev.filter((s) => s.id !== deletingSdsId));
      toast({ title: "Berhasil", description: "SDS dihapus" });
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpenDeleteModal(false);
      setDeletingSdsId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
  return {
    // Data
    sdsRecords,
    total,
    pagination,
    loadingTable,

    // Filter
    searchTerm,
    setSearchTerm,
    filterLanguage,
    setFilterLanguage,

    // Actions
    fetchSds,
    handlePageChange,

    // Delete Modal
    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,
  };
};

export default useSds;
