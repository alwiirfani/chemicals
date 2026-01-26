"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { UserAuth } from "@/types/auth";

export const useUsers = () => {
  const [users, setUsers] = useState<UserAuth[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingTable, setLoadingTable] = useState(true);
  const [isBlocking, setIsBlocking] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingTable(true);

      const { data } = await axios.get("/api/v1/users");
      console.log("from useUsers: ", data.users);

      setUsers(data.users);
    } catch (error) {
      console.log("Gagal memuat data: ", error);
      toast({
        title: "Gagal",
        description: "Tidak dapat memuat data pengguna",
        variant: "destructive",
      });
    } finally {
      setLoadingTable(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRequestBlock = (userId: string) => {
    setBlockingUserId(userId);
    setOpenBlockModal(true);
  };

  const handleConfirmBlock = async () => {
    if (!blockingUserId) return;

    try {
      setIsBlocking(true);
      await axios.patch(`/api/v1/users/${blockingUserId}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u.userId !== blockingUserId));
      toast({ title: "Berhasil", description: "Pengguna dihapus" });
      setUsers((prev) => prev.filter((u) => u.userId !== blockingUserId));
      toast({ title: "Berhasil", description: "Pengguna diblokir" });
    } catch {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat memblokir",
        variant: "destructive",
      });
    } finally {
      setIsBlocking(false);
      setOpenBlockModal(false);
      setBlockingUserId(null);
    }
  };

  // stats
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const inactive = users.filter((u) => u.status === "INACTIVE").length;
    const blocked = users.filter((u) => u.status === "BLOCKED").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const laborans = users.filter((u) => u.role === "LABORAN").length;
    const regularUsers = total - admins - laborans;

    return { total, active, inactive, blocked, admins, laborans, regularUsers };
  }, [users]);

  // ✅ Filtering (client-side)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // pagination di frontend
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    // data users
    users,
    filteredUsers,
    paginatedUsers,
    stats,
    loadingTable,

    // filter
    searchTerm,
    roleFilter,
    statusFilter,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,

    // delete modal
    openBlockModal,
    setOpenBlockModal,
    isBlocking,
    handleRequestBlock,
    handleConfirmBlock,

    // actions
    currentPage,
    totalPages,
    handlePageChange,

    fetchUsers,
  };
};
