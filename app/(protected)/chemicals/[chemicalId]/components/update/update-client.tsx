"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { formatDateToInput } from "@/helpers/format-date";
import UpdateChemicalForm from "./update-form";
import { ChemicalFormData } from "@/types/chemicals";

export default function UpdateChemicalClient() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState<ChemicalFormData>({
    name: "",
    formula: "",
    form: "",
    characteristic: "",
    unit: "",
    purchaseDate: "",
    expirationDate: "",

    // for stock update
    type: "NOTHING",
    quantity: 0,
    description: "",
  });

  const fetchChemical = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/v1/chemicals/${params.chemicalId}`
      );
      const { chemical } = response.data;

      setFormData((prev) => ({
        ...prev,
        name: chemical.name,
        formula: chemical.formula,
        form: chemical.form,
        characteristic: chemical.characteristic,
        unit: chemical.unit,
        purchaseDate: formatDateToInput(chemical.purchaseDate),
        expirationDate: chemical.expirationDate
          ? formatDateToInput(chemical.expirationDate)
          : "",
      }));
    } catch (error) {
      console.error("Error fetching chemical:", error);
      toast({
        title: "Gagal mengambil data",
        description: "Tidak dapat memuat data bahan kimia",
        variant: "destructive",
      });
      router.push("/chemicals");
    }
  }, [params.chemicalId, router, toast]);

  useEffect(() => {
    if (params.chemicalId) fetchChemical();
  }, [fetchChemical, params.chemicalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `/api/v1/chemicals/${params.chemicalId}`,
        {
          ...formData,
          purchaseDate: formatDateToInput(formData.purchaseDate),
          expirationDate: formData.expirationDate
            ? formatDateToInput(formData.expirationDate)
            : null,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      toast({
        title: "Berhasil!",
        description: "Data bahan kimia berhasil diperbarui",
      });

      router.push("/chemicals");
    } catch (error) {
      console.error("Error updating chemical:", error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat memperbarui data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UpdateChemicalForm
      formData={formData}
      setFormData={setFormData}
      loading={loading}
      handleSubmit={handleSubmit}
    />
  );
}
