import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useDebounce } from "./use-debounce";
import { convertSnakeToCamel } from "@/helpers/case";
import { FirstAidMeasures, SDS, StorageInfo, UploadType } from "@/types/sds";

export const useSds = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>("file");
  const [file, setFile] = useState<File | null>(null);
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

  // State untuk form
  const [formData, setFormData] = useState({
    chemicalId: "",
    externalUrl: "",
    language: "ID",
    firstAidMeasures: {
      inhalation: "",
      skinContact: "",
      eyeContact: "",
      ingestion: "",
    },
    storageInfo: {
      conditions: "",
      disposal: "",
    },
    hazardInfo: {
      classifications: [""],
      statements: [""],
    },
  });

  // State untuk data array
  const [hazardClassifications, setHazardClassifications] = useState<string[]>([
    "",
  ]);
  const [precautionaryStatements, setPrecautionaryStatements] = useState<
    string[]
  >([""]);
  const [firstAidMeasures, setFirstAidMeasures] = useState<FirstAidMeasures>({
    inhalation: "",
    skinContact: "",
    eyeContact: "",
    ingestion: "",
  });
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    conditions: "",
    disposal: "",
  });

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

        const sdsCamelCase = convertSnakeToCamel<SDS[]>(
          data.formattedSdsRecords
        );

        console.log("Data safety documents: ", sdsCamelCase);

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

  // Fungsi untuk update form dasar
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk update storage info
  const updateStorageInfo = (field: keyof StorageInfo, value: string) => {
    setStorageInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk klasifikasi bahaya
  const addHazardClassification = () => {
    setHazardClassifications((prev) => [...prev, ""]);
  };

  const removeHazardClassification = (index: number) => {
    if (hazardClassifications.length > 1) {
      setHazardClassifications((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateHazardClassification = (index: number, value: string) => {
    setHazardClassifications((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Fungsi untuk pernyataan kehati-hatian
  const addPrecautionaryStatement = () => {
    setPrecautionaryStatements((prev) => [...prev, ""]);
  };

  const removePrecautionaryStatement = (index: number) => {
    if (precautionaryStatements.length > 1) {
      setPrecautionaryStatements((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updatePrecautionaryStatement = (index: number, value: string) => {
    setPrecautionaryStatements((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Fungsi untuk first aid measures
  const updateFirstAidMeasure = (
    field: keyof FirstAidMeasures,
    value: string
  ) => {
    setFirstAidMeasures((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      validateFile(selectedFile);
      setFile(selectedFile);
    } catch (error) {
      console.error("Error validating file:", error);

      toast({
        title: "Error ❌",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const validateFile = (file: File) => {
    if (file.type !== "application/pdf") {
      throw new Error("Hanya file PDF yang diperbolehkan");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Ukuran file maksimal 10MB");
    }
  };

  // Fungsi utama untuk upload SDS
  const uploadSds = async () => {
    setLoading(true);

    try {
      // Validasi manual sebelum kirim
      if (!formData.chemicalId) throw new Error("Pilih bahan kimia");

      // Prepare form data
      const fd = new FormData();
      fd.append("chemicalId", formData.chemicalId);
      fd.append("language", formData.language);

      // Hazard classifications
      hazardClassifications
        .filter((h) => h.trim() !== "")
        .forEach((h) => fd.append("hazardClassification", h));

      // Precautionary statements
      precautionaryStatements
        .filter((s) => s.trim() !== "")
        .forEach((s) => fd.append("precautionaryStatement", s));

      fd.append("firstAidInhalation", firstAidMeasures.inhalation);
      fd.append("firstAidSkin", firstAidMeasures.skinContact);
      fd.append("firstAidEye", firstAidMeasures.eyeContact);
      fd.append("firstAidIngestion", firstAidMeasures.ingestion);

      fd.append("storageConditions", storageInfo.conditions || "");
      fd.append("disposalInfo", storageInfo.disposal || "");

      // File atau URL
      if (uploadType === "file" && file) {
        fd.append("sdsFile", file);
      } else if (uploadType === "link") {
        fd.append("externalUrl", formData.externalUrl || "");
      }
      // Debugging - log isi FormData
      console.log("=== ISI FORM DATA ===");
      for (const [key, value] of fd.entries()) {
        console.log(key, value);
      }

      // Kirim ke API
      const { data } = await axios.post(
        `/api/v1/chemicals/${formData.chemicalId}/sds`,
        fd,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      // LOG ERROR
      if (axios.isAxiosError(error)) {
        if (axios.isAxiosError(error)) {
          console.error("Detail error:", error.response?.data);
          throw new Error(error.response?.data.error || "Gagal mengupload SDS");
        }
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk update sds
  const updateSds = async (sdsId: string) => {
    setLoading(true);

    try {
      if (!formData.chemicalId) throw new Error("Pilih bahan kimia");

      const fd = new FormData();
      fd.append("chemicalId", formData.chemicalId);
      fd.append("language", formData.language);

      // Hazard classifications
      hazardClassifications
        .filter((h) => h.trim() !== "")
        .forEach((h) => fd.append("hazardClassification", h));

      // Precautionary statements
      precautionaryStatements
        .filter((s) => s.trim() !== "")
        .forEach((s) => fd.append("precautionaryStatement", s));

      fd.append("firstAidInhalation", firstAidMeasures.inhalation);
      fd.append("firstAidSkin", firstAidMeasures.skinContact);
      fd.append("firstAidEye", firstAidMeasures.eyeContact);
      fd.append("firstAidIngestion", firstAidMeasures.ingestion);

      fd.append("storageConditions", storageInfo.conditions || "");
      fd.append("disposalInfo", storageInfo.disposal || "");

      // File atau URL
      if (uploadType === "file" && file) {
        // Hanya append file jika user memilih file baru
        fd.append("sdsFile", file);
      } else if (uploadType === "link") {
        fd.append("externalUrl", formData.externalUrl || "");
      }

      // Debugging isi FormData
      console.log("=== ISI FORM DATA (UPDATE) ===");
      for (const [key, value] of fd.entries()) {
        console.log(key, value);
      }

      // Kirim ke API
      const { data } = await axios.put(`/api/v1/sds/${sdsId}`, fd, {
        withCredentials: true,
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Detail error:", error.response?.data);
        throw new Error(error.response?.data.error || "Gagal mengupdate SDS");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi reset form
  const resetForm = () => {
    setFormData({
      chemicalId: "",
      externalUrl: "",
      language: "ID",
      firstAidMeasures: {
        inhalation: "",
        skinContact: "",
        eyeContact: "",
        ingestion: "",
      },
      storageInfo: {
        conditions: "",
        disposal: "",
      },
      hazardInfo: {
        classifications: [""],
        statements: [""],
      },
    });
    setHazardClassifications([""]);
    setPrecautionaryStatements([""]);
    setFirstAidMeasures({
      inhalation: "",
      skinContact: "",
      eyeContact: "",
      ingestion: "",
    });
    setFile(null);
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

    // State
    open,
    setOpen,
    loading,
    uploadType,
    setUploadType,
    file,
    formData,
    setFormData,
    hazardClassifications,
    precautionaryStatements,
    firstAidMeasures,
    storageInfo,

    // Functions
    updateStorageInfo,
    updateFormData,
    addHazardClassification,
    removeHazardClassification,
    updateHazardClassification,
    addPrecautionaryStatement,
    removePrecautionaryStatement,
    updatePrecautionaryStatement,
    updateFirstAidMeasure,
    handleFileChange,
    uploadSds,
    updateSds,
    resetForm,
  };
};
