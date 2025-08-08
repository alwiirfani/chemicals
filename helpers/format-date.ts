export const formatDateToString = (input: Date | string) => {
  const date = typeof input === "string" ? new Date(input) : input;

  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatToDDMMYYYY = (input: Date | string) => {
  const date = typeof input === "string" ? new Date(input) : input;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateToInput = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);

  // Cek apakah date valid
  if (isNaN(d.getTime())) return "";

  return d.toISOString().split("T")[0];
};
