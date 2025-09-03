import { requireRoleOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { UploadedFile } from "@/types/sds";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const userAccess = await requireRoleOrNull([
//       "ADMIN",
//       "LABORAN",
//       "PETUGAS_GUDANG",
//     ]);
//     if (userAccess instanceof NextResponse) return userAccess;

//     const formData = await request.formData();
//     const file = formData.get("file") as File | null;

//     if (!file || file.type !== "application/zip") {
//       return NextResponse.json(
//         { error: "File harus berupa file ZIP" },
//         { status: 400 }
//       );
//     }

//     // Validasi ukuran file ZIP
//     if (file.size > MAX_ZIP_FILE_SIZE) {
//       return NextResponse.json(
//         {
//           error: `Ukuran file ZIP terlalu besar. Maksimum ${
//             MAX_ZIP_FILE_SIZE / 1024 / 1024
//           }MB`,
//         },
//         { status: 413 }
//       );
//     }

//     console.log(
//       `📦 Memproses file ZIP: ${(file.size / 1024 / 1024).toFixed(2)}MB`
//     );

//     // Load ZIP
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const zip = await JSZip.loadAsync(buffer);

//     // Ambil semua entry PDF valid
//     const pdfEntries = Object.entries(zip.files).filter(
//       ([path, entry]) => !entry.dir && path.toLowerCase().endsWith(".pdf")
//     );

//     if (pdfEntries.length === 0) {
//       return NextResponse.json(
//         { error: "File ZIP tidak mengandung file PDF" },
//         { status: 400 }
//       );
//     }

//     console.log(`📄 Ditemukan ${pdfEntries.length} file PDF dalam ZIP`);

//     // Ambil semua chemical sekaligus dari DB
//     const allChemicals = await db.chemical.findMany();
//     const chemicalMap = new Map(
//       allChemicals.map((c) => [c.name.toLowerCase(), c])
//     );

//     const failed: { file: string; reason: string }[] = [];
//     const limit = pLimit(10); // maksimal 10 file bersamaan

//     // Fungsi untuk proses satu file
//     const processFile = async ([path, entry]: [string, JSZip.JSZipObject]) => {
//       try {
//         const pdfBuffer = await entry.async("nodebuffer");

//         // Validasi ukuran file PDF individual
//         if (pdfBuffer.length > MAX_PDF_SIZE) {
//           failed.push({
//             file: path,
//             reason: `File PDF terlalu besar (${(
//               pdfBuffer.length /
//               1024 /
//               1024
//             ).toFixed(2)}MB, maksimum ${MAX_PDF_SIZE / 1024 / 1024}MB)`,
//           });
//           return null;
//         }

//         const originalName = path.split("/").pop() || path;
//         const baseName = originalName.replace(/\.pdf$/i, "").toLowerCase();

//         const existingChemical = chemicalMap.get(baseName);
//         if (!existingChemical) {
//           failed.push({ file: originalName, reason: "Chemical not found" });
//           return null;
//         }

//         // Upload ke Vercel Blob
//         const fileName = `${Date.now()}-${originalName}`;
//         const { url } = await put(fileName, pdfBuffer, {
//           access: "public",
//           contentType: "application/pdf",
//           token: process.env.BLOB_READ_WRITE_TOKEN,
//         });

//         // Upsert SDS
//         const record = await db.safetyDataSheet.upsert({
//           where: { chemicalId: existingChemical.id },
//           update: {
//             fileName: originalName,
//             filePath: url,
//             language: "ID",
//             updatedById: userAccess.userId,
//           },
//           create: {
//             chemicalId: existingChemical.id,
//             fileName: originalName,
//             filePath: url,
//             language: "ID",
//             createdById: userAccess.userId,
//           },
//         });

//         console.log(`✅ Berhasil memproses: ${originalName}`);

//         return {
//           id: record.id,
//           fileName: record.fileName,
//           filePath: record.filePath,
//           externalUrl: record.externalUrl ?? null,
//           language: record.language,
//           createdByName:
//             userAccess.role === "ADMIN"
//               ? "Administrator"
//               : userAccess.name || "Unknown",
//           updatedByName:
//             userAccess.role === "ADMIN"
//               ? "Administrator"
//               : userAccess.name || "Unknown",
//           createdAt: record.createdAt,
//           updatedAt: record.updatedAt,
//           chemical: {
//             id: existingChemical.id,
//             name: existingChemical.name,
//             formula: existingChemical.formula,
//             form: existingChemical.form,
//             characteristic: existingChemical.characteristic,
//           },
//         } as SDS;
//       } catch (err) {
//         failed.push({ file: path, reason: String(err) });
//         return null;
//       }
//     };

//     // Proses semua file dengan concurrency limit
//     const records: SDS[] = (
//       await Promise.all(
//         pdfEntries.map((entry) => limit(() => processFile(entry)))
//       )
//     ).filter((r): r is SDS => r !== null);

//     console.log(
//       `\n📊 Import selesai. Berhasil: ${records.length}, Gagal: ${failed.length}`
//     );
//     if (failed.length > 0) console.table(failed);

//     return NextResponse.json({
//       message: "Import SDS selesai",
//       success: records.length,
//       failed: failed.length,
//       records,
//       errors: failed,
//     });
//   } catch (error) {
//     console.error("Error importing SDS:", error);
//     return NextResponse.json(
//       { error: "Error importing SDS", detail: String(error) },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  // Inisialisasi results array di luar try block untuk scope yang lebih luas
  const results: {
    fileName: string;
    status: string;
    message?: string;
    chemical?: string;
    sdsId?: string;
  }[] = [];

  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const body = await request.json();
    const files: UploadedFile[] = body.files;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada file yang dikirim atau format data salah" },
        { status: 400 }
      );
    }

    console.log(`📦 Memulai proses impor untuk ${files.length} file`);

    for (const [index, file] of files.entries()) {
      // Gunakan block try-catch terpisah untuk SETIAP file
      try {
        console.log(
          `\n🔍 Memproses file ${index + 1}/${files.length}:`,
          file?.fileName || "Unknown"
        );

        if (!file || !file.fileName || !file.filePath) {
          throw new Error("Data file tidak valid atau null");
        }

        const { fileName, filePath } = file;

        // Validasi dasar nama file dan path
        if (typeof fileName !== "string" || typeof filePath !== "string") {
          throw new Error("Nama file atau path tidak valid");
        }

        // ambil nama bahan kimia dari nama file (misal "Butanol.pdf" → "Butanol")
        const baseName = fileName.replace(/\.pdf$/i, "").trim();

        if (!baseName) {
          throw new Error("Nama file tidak valid (setelah menghapus ekstensi)");
        }

        console.log(`Mencari chemical untuk: '${baseName}'`);

        // coba cari chemical di database
        const chemical = await db.chemical.findFirst({
          where: {
            name: {
              equals: baseName,
              mode: "insensitive", // case-insensitive match
            },
          },
        });

        if (!chemical) {
          results.push({
            fileName,
            status: "not_found",
            message: `Bahan kimia '${baseName}' tidak ditemukan dalam database`,
          });
          console.warn(`❌ Chemical tidak ditemukan: ${baseName}`);
          continue; // Lanjut ke file berikutnya
        }

        console.log(
          `✅ Chemical ditemukan: ${chemical.name} (ID: ${chemical.id})`
        );

        // simpan atau update SDS record
        const sds = await db.safetyDataSheet.upsert({
          where: {
            chemicalId: chemical.id,
          },
          update: {
            fileName,
            filePath,
            language: "ID",
            updatedAt: new Date(),
            updatedById: userAccess.userId,
          },
          create: {
            chemicalId: chemical.id,
            fileName,
            filePath,
            language: "ID",
            createdAt: new Date(),
            createdById: userAccess.userId,
          },
        });

        console.log(`✅ Berhasil menyimpan SDS: ${sds.id}`);

        results.push({
          fileName,
          status: "success",
          chemical: chemical.name,
          sdsId: sds.id,
          message: "Berhasil diimpor",
        });
      } catch (error) {
        // Error handling untuk file spesifik ini
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error(
          `❌ Error memproses file ${file?.fileName || "Unknown"}:`,
          errorMessage
        );

        results.push({
          fileName: file?.fileName || "Unknown",
          status: "error",
          message: `Gagal memproses: ${errorMessage}`,
        });
      }
    }

    // Hitung statistik hasil proses
    const successCount = results.filter((r) => r.status === "success").length;
    const notFoundCount = results.filter(
      (r) => r.status === "not_found"
    ).length;
    const errorCount = results.filter((r) => r.status === "error").length;

    console.log(`\n📊 Hasil akhir impor:
    ✅ Sukses: ${successCount}
    🔍 Tidak ditemukan: ${notFoundCount}
    ❌ Error: ${errorCount}
    📋 Total diproses: ${results.length}`);

    return NextResponse.json({
      results,
      summary: {
        total: results.length,
        success: successCount,
        not_found: notFoundCount,
        error: errorCount,
      },
    });
  } catch (error) {
    // Error global yang menangkap exception di luar loop
    const errorMessage =
      error instanceof Error ? error.message : "Unknown global error";
    console.error("❌ Error global dalam proses import SDS:", error);

    // Kembalikan results yang sudah berhasil dikumpulkan + error global
    return NextResponse.json(
      {
        error: "Terjadi kesalahan dalam proses import",
        detail: errorMessage,
        results, // Hasil yang sudah berhasil diproses sebelum error global terjadi
      },
      { status: 500 }
    );
  }
}
