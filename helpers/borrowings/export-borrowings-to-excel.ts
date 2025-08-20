import { Borrowing } from "@/types/borrowings";
import ExcelJS from "exceljs";

export const exportBorrowingsToExcel = async (borrowings: Borrowing[]) => {
  if (!borrowings || borrowings.length === 0) {
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
    { header: "Nama Peminjam", key: "borrowerName", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Role", key: "role", width: 15 },
    { header: "Tujuan", key: "purpose", width: 25 },
    { header: "Status", key: "status", width: 15 },
    { header: "Tanggal Request", key: "requestDate", width: 20 },
    { header: "Disetujui Oleh", key: "approvedBy", width: 20 },
    { header: "Ditolak Oleh", key: "rejectedBy", width: 20 },
    { header: "Dikembalikan Oleh", key: "returnedBy", width: 20 },
    { header: "Nama Bahan", key: "chemicalName", width: 20 },
    { header: "Rumus", key: "formula", width: 15 },
    { header: "Jumlah", key: "quantity", width: 10 },
    { header: "Satuan", key: "unit", width: 10 },
    { header: "Stok Saat Ini", key: "stock", width: 15 },
    { header: "Sudah Dikembalikan", key: "returnedQty", width: 15 },
    { header: "Catatan", key: "notes", width: 25 },
  ];

  // Menambahkan data
  borrowings.forEach((borrowing, index) => {
    borrowing.items.forEach((item) => {
      worksheet.addRow({
        no: index + 1,
        borrowerName: borrowing.borrower?.name ?? "-",
        email: borrowing.borrower?.email ?? "-",
        role: borrowing.borrower?.role ?? "-",
        purpose: borrowing.purpose ?? "-",
        status: borrowing.status,
        requestDate: borrowing.requestDate
          ? new Date(borrowing.requestDate).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "-",
        approvedBy: borrowing.approvedBy?.name ?? "-",
        rejectedBy: borrowing.rejectedBy?.name ?? "-",
        returnedBy: borrowing.returnedBy?.name ?? "-",
        chemicalName: item.chemical?.name ?? "-",
        formula: item.chemical?.formula ?? "-",
        quantity: item.quantity,
        unit: item.chemical?.unit ?? "-",
        stock: item.chemical?.stock ?? "-",
        returnedQty: item.returnedQty ?? 0,
        notes: borrowing.notes ?? "-",
      });
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
  const fileName = `data_peminjaman_${day}-${month}-${year}.xlsx`;

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
