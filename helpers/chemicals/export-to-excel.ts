import ExcelJS from "exceljs";
import { Chemical } from "@/types/chemicals"; // Ganti dengan path tipe kamu

export const exportChemicalsToExcel = async (chemicals: Chemical[]) => {
  if (!chemicals || chemicals.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  // Membuat workbook baru
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Bahan Kimia");

  // Menambahkan header
  worksheet.columns = [
    {
      header: "No",
      key: "no",
      width: 5,
      style: { alignment: { horizontal: "center" } },
    },
    { header: "Nama Bahan", key: "name", width: 20 },
    { header: "Rumus", key: "formula", width: 15 },
    { header: "CAS Number", key: "casNumber", width: 15 },
    { header: "Stok", key: "stock", width: 15 },
    { header: "Lokasi", key: "location", width: 15 },
    { header: "Lemari", key: "cabinet", width: 15 },
    { header: "Ruangan", key: "room", width: 25 },
    { header: "Kadaluwarsa", key: "expirationDate", width: 15 },
    { header: "Dibuat oleh", key: "createdBy", width: 25 },
  ];

  // Menambahkan data
  chemicals.forEach((item, index) => {
    worksheet.addRow({
      no: index + 1,
      name: item.name,
      formula: item.formula,
      casNumber: item.casNumber ?? "-",
      stock: `${item.stock} ${item.unit}`,
      location: item.location,
      cabinet: item.cabinet ?? "-",
      room: item.room ?? "-",
      expirationDate: item.expirationDate
        ? new Date(item.expirationDate).toLocaleDateString("id-ID")
        : "-",
      createdBy: item.createdBy ?? "-",
    });
  });

  // Style untuk header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Format tanggal untuk nama file
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const year = now.getFullYear();
  const fileName = `data_bahan_kimia_${day}-${month}-${year}.xlsx`;

  // Export ke file
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Gagal mengekspor data ke Excel");
  }
};
