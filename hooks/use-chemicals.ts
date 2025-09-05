import { Chemical } from "@/types/chemicals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "./use-toast";
import axios from "axios";
import { convertSnakeToCamel } from "@/helpers/case";

const useChemicals = () => {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForm, setFilterForm] = useState("all");
  const [filterCharacteristic, setFilterCharacteristic] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingChemicalId, setDeletingChemicalId] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  const fetchChemicals = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/chemicals");

      const chemicalsCamelCase = convertSnakeToCamel<Chemical[]>(
        data.chemicals
      );

      setChemicals(chemicalsCamelCase);
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
  }, [toast]);

  useEffect(() => {
    fetchChemicals();
  }, [fetchChemicals]);

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

  const filteredChemicals = useMemo(() => {
    return chemicals.filter((chemical) => {
      const matchesSearch =
        chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chemical.formula.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesForm = filterForm === "all" || chemical.form === filterForm;

      const matchesLocation =
        filterCharacteristic === "all" ||
        (chemical.characteristic &&
          chemical.characteristic
            .toLowerCase()
            .includes(filterCharacteristic.toLowerCase()));

      return matchesSearch && matchesForm && matchesLocation;
    });
  }, [chemicals, searchTerm, filterForm, filterCharacteristic]);

  const dasboardStatsChemicals = useMemo(() => {
    const totalChemicals = chemicals.length;
    const lowStockChemicals = chemicals.filter(
      (chemical) => chemical.stock <= 10
    ).length;
    const expiringChemicals = chemicals.filter(
      (chemical) =>
        chemical.expirationDate && chemical.expirationDate < new Date()
    ).length;

    return { totalChemicals, lowStockChemicals, expiringChemicals };
  }, [chemicals]);

  // pagination di frontend
  const totalPages = Math.ceil(filteredChemicals.length / pageSize);
  const paginatedChemicals = filteredChemicals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    // Data
    chemicals: chemicals,
    filteredChemicals: filteredChemicals,
    paginatedChemicals: paginatedChemicals,
    dasboardStatsChemicals,
    loading,

    // Filter & search
    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterCharacteristic,
    setFilterCharacteristic,

    // Actions
    currentPage,
    totalPages,
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
