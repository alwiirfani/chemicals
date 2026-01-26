import ExcelJS, { CellValue } from "exceljs";
import { requireRoleOrNull } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import db from "@/lib/db";
import {
  ChemicalCharacteristic,
  ChemicalForm,
  ImportChemicalExcelRow,
} from "@/types/chemicals";
import { Prisma } from "@prisma/client";
import { mapCharacteristic } from "@/helpers/chemicals/chemical-table";

function cellToDate(value: CellValue | undefined): Date | null {
  if (!value) return null;

  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const userAccess = await requireRoleOrNull([
      "ADMIN",
      "LABORAN",
      "PETUGAS_GUDANG",
    ]);
    if (userAccess instanceof NextResponse) return userAccess;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const form = formData.get("form") as ChemicalForm;

    if (!file) {
      return NextResponse.json(
        { message: "File atau form tidak ditemukan" },
        { status: 400 },
      );
    }

    // Simpan file sementara
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join("/tmp", `${nanoid()}.xlsx`);
    await fs.writeFile(tempPath, buffer);

    // Baca Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(tempPath);
    const sheet = workbook.getWorksheet(1); // Data sheet pertama

    if (!sheet) {
      return NextResponse.json(
        { message: "Sheet tidak ditemukan dalam file Excel" },
        { status: 400 },
      );
    }

    const rows: ImportChemicalExcelRow[] = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Lewatkan header

      const data: ImportChemicalExcelRow = {
        name: row.getCell(1).value?.toString().trim() || "",
        formula: cellToString(row.getCell(2).value),
        characteristic: row.getCell(3).value?.toString().trim() || "",
        form: form,
        unit: row.getCell(4).value?.toString().trim() || "-",
        stock: Number(row.getCell(5).value) || 0,
        purchaseDate: cellToDate(row.getCell(6).value),
        expirationDate: cellToDate(row.getCell(7).value),
      };

      console.log(
        "purchaseDate & expirationDate:",
        data.purchaseDate,
        data.expirationDate,
      );

      if (data.name) rows.push(data);
    });

    const data: Prisma.ChemicalCreateManyInput[] = rows.map((row) => ({
      name: row.name,
      formula: row.formula,
      characteristic: mapCharacteristic(
        row.characteristic,
      ) as ChemicalCharacteristic,
      form: row.form as ChemicalForm,
      unit: row.unit,
      currentStock: row.stock,
      initialStock: row.stock,
      purchaseDate: row.purchaseDate || new Date(),
      expirationDate: row.expirationDate || null,
      createdById: userAccess.userId,
      updatedById: userAccess.userId,
    }));

    console.log("Importing chemicals:", data);

    // query insert/update dengan RETURNING info
    const result = await db.$queryRaw<
      { action: "inserted" | "updated"; id: string; name: string }[]
    >(Prisma.sql`
  WITH upserted AS (
    INSERT INTO "chemicals" ("id",
      "name", "formula", "characteristic", "form", "unit",
      "current_stock", "initial_stock", "purchase_date", "expiration_date", "created_at", "updated_at",
      "created_by_id", "updated_by_id"
    )
    VALUES ${Prisma.join(
      data.map(
        (d) =>
          Prisma.sql`(${nanoid()},${d.name}, ${d.formula}, ${Prisma.raw(
            `'${d.characteristic.toUpperCase()}'::"ChemicalCharacteristic"`,
          )} , ${Prisma.raw(`'${d.form.toUpperCase()}'::"ChemicalForm"`)}, ${
            d.unit
          }, ${d.currentStock}, ${d.initialStock}, ${d.purchaseDate}, ${
            d.expirationDate
          }, NOW(), NOW(), ${d.createdById}, ${d.updatedById})`,
      ),
    )}
    ON CONFLICT ("name")
    DO UPDATE SET
      "formula" = EXCLUDED."formula",
      "characteristic" = EXCLUDED."characteristic",
      "form" = EXCLUDED."form",
      "unit" = EXCLUDED."unit",
      "current_stock" = EXCLUDED."current_stock",
      "purchase_date" = EXCLUDED."purchase_date",
      "expiration_date" = EXCLUDED."expiration_date",
      "updated_by_id" = EXCLUDED."updated_by_id",
      "updated_at" = NOW()
    RETURNING "id", "name",
      CASE
        WHEN xmax = 0 THEN 'inserted'
        ELSE 'updated'
      END AS action
  )
  SELECT * FROM upserted;
`);

    // hitung inserted & updated
    const inserted = result.filter((r) => r.action === "inserted").length;
    const updated = result.filter((r) => r.action === "updated").length;

    console.log({ inserted, updated });

    return NextResponse.json({
      message: "Import selesai",
      inserted,
      updated,
    });
  } catch (error) {
    console.error("Error importing chemicals:", error);
    return NextResponse.json(
      { message: "Error importing chemicals" },
      { status: 500 },
    );
  }
}

function cellToString(value: CellValue | undefined): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return value.toISOString();

  // Handle RichText (xample: rumus kimia CH3CH(OH)CH3)
  if ("richText" in value) {
    return value.richText.map((rt) => rt.text).join("");
  }

  // Handle formula cell
  if ("formula" in value) {
    return (
      value.formula?.toString().trim() ?? value.result?.toString().trim() ?? ""
    );
  }

  // Handle text field
  if ("text" in value) {
    return value.text.trim();
  }

  // Handle result field
  if ("result" in value) {
    return value.result != null ? value.result.toString().trim() : "";
  }

  return "";
}
