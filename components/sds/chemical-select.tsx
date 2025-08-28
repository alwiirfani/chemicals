"use client";

import React from "react";
import useChemicals from "@/hooks/use-chemicals";
import { Combobox } from "@/components/ui/combobox";
import { SDSFormData } from "@/types/sds";

interface ChemicalSelectProps {
  formData: Pick<SDSFormData, "chemicalId">;
  setFormData: (field: string, value: string) => void;
}

export function ChemicalSelect({ formData, setFormData }: ChemicalSelectProps) {
  const { chemicals, searchTerm, setSearchTerm } = useChemicals();

  // Memetakan data bahan kimia ke format yang dibutuhkan Combobox
  const chemicalOptions = chemicals.map((chemical) => ({
    value: chemical.id,
    label: `${chemical.name} - ${chemical.formula} (CAS: ${chemical.characteristic})`,
  }));

  return (
    <Combobox
      label="Bahan Kimia *"
      options={chemicalOptions}
      value={formData.chemicalId}
      onValueChange={(newValue) => setFormData("chemicalId", newValue || "")}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder="Pilih Bahan Kimia..."
      searchPlaceholder="Cari bahan kimia..."
      emptyMessage="Bahan kimia tidak ditemukan."
    />
  );
}
