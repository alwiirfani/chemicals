import { ChemicalCharacteristic } from "@/types/chemicals";

export const isExpired = (date: Date | null) => {
  if (!date) return false;
  return new Date() > date;
};

export const isExpiringSoon = (date: Date | null) => {
  if (!date) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return date <= thirtyDaysFromNow && date > new Date();
};

export const mapCharacteristic = (
  value: string,
): ChemicalCharacteristic | null => {
  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case "asam":
      return "ACID";
    case "basa":
      return "BASE";
    case "oksidan":
      return "OXIDANT";
    case "general":
      return "GENERAL";
    case "indikator":
      return "INDICATOR";
    default:
      return null;
  }
};
