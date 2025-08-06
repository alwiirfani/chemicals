"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { UserAuth } from "@/types/auth";

export const useUsers = () => {
  const [users, setUsers] = useState<UserAuth[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingTable, setLoadingTable] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    admins: 0,
    laborans: 0,
    regularUsers: 0,
  });

  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        setLoadingTable(true);
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(roleFilter !== "all" && { role: roleFilter }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        };

        const { data } = await axios.get("/api/v1/users", { params });
        console.log("from useUsers: ", data.users);

        setUsers(data.users);
        setPagination({
          currentPage: data.pagination.page,
          total: data.pagination.total,
          totalPages: data.pagination.pages,
        });
        setStats(data.stats);
      } catch (error) {
        console.log("Error fetching users:", error);
        toast({
          title: "Gagal",
          description: "Tidak dapat memuat data pengguna",
          variant: "destructive",
        });
      } finally {
        setLoadingTable(false);
      }
    },
    [debouncedSearch, roleFilter, statusFilter, toast]
  );

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [
    debouncedSearch,
    roleFilter,
    statusFilter,
    pagination.currentPage,
    fetchUsers,
  ]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleRequestDelete = (userId: string) => {
    setDeletingUserId(userId);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/v1/users/${deletingUserId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== deletingUserId));
      toast({ title: "Berhasil", description: "Pengguna dihapus" });
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpenDeleteModal(false);
      setDeletingUserId(null);
    }
  };

  return {
    // data users
    users,
    stats,
    pagination,
    loadingTable,

    // filter
    searchTerm,
    roleFilter,
    statusFilter,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,

    // delete modal
    openDeleteModal,
    setOpenDeleteModal,
    isDeleting,
    handleRequestDelete,
    handleConfirmDelete,

    // actions
    fetchUsers,
    handlePageChange,
  };
};
