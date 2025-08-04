-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MAHASISWA', 'DOSEN', 'LABORAN');

-- CreateEnum
CREATE TYPE "public"."ChemicalForm" AS ENUM ('SOLID', 'LIQUID', 'GAS');

-- CreateEnum
CREATE TYPE "public"."BorrowingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'OVERDUE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'MAHASISWA',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admin" (
    "pin" CHAR(5) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("pin")
);

-- CreateTable
CREATE TABLE "public"."mahasiswa" (
    "nim" CHAR(8) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("nim")
);

-- CreateTable
CREATE TABLE "public"."dosen" (
    "nidn" CHAR(10) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("nidn")
);

-- CreateTable
CREATE TABLE "public"."laboran" (
    "nip" CHAR(10) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "laboran_pkey" PRIMARY KEY ("nip")
);

-- CreateTable
CREATE TABLE "public"."chemicals" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "formula" VARCHAR(100) NOT NULL,
    "cas_number" VARCHAR(50),
    "form" "public"."ChemicalForm" NOT NULL,
    "stock" DOUBLE PRECISION NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "location" VARCHAR(255) NOT NULL,
    "cabinet" VARCHAR(100),
    "room" VARCHAR(100),
    "temperature" VARCHAR(50),
    "qr_code" VARCHAR(255),
    "barcode" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" VARCHAR(255) NOT NULL,
    "updated_by_id" VARCHAR(255),

    CONSTRAINT "chemicals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sds" (
    "id" TEXT NOT NULL,
    "chemical_id" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_path" VARCHAR(500),
    "external_url" VARCHAR(500),
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."borrowings" (
    "id" TEXT NOT NULL,
    "borrower_id" VARCHAR(255) NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "public"."BorrowingStatus" NOT NULL DEFAULT 'PENDING',
    "request_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "borrowings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."borrowing_items" (
    "id" TEXT NOT NULL,
    "borrowing_id" TEXT NOT NULL,
    "chemical_id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "returned" BOOLEAN NOT NULL DEFAULT false,
    "returned_qty" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "borrowing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usage_history" (
    "id" TEXT NOT NULL,
    "chemical_id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(100) NOT NULL,
    "data" JSONB NOT NULL,
    "created_by" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_email_idx" ON "public"."users"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_id_key" ON "public"."admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_user_id_key" ON "public"."mahasiswa"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_user_id_key" ON "public"."dosen"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "laboran_user_id_key" ON "public"."laboran"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chemicals_qr_code_key" ON "public"."chemicals"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "chemicals_barcode_key" ON "public"."chemicals"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "sds_chemical_id_key" ON "public"."sds"("chemical_id");

-- AddForeignKey
ALTER TABLE "public"."admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mahasiswa" ADD CONSTRAINT "mahasiswa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dosen" ADD CONSTRAINT "dosen_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."laboran" ADD CONSTRAINT "laboran_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chemicals" ADD CONSTRAINT "chemicals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chemicals" ADD CONSTRAINT "chemicals_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sds" ADD CONSTRAINT "sds_chemical_id_fkey" FOREIGN KEY ("chemical_id") REFERENCES "public"."chemicals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowings" ADD CONSTRAINT "borrowings_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowing_items" ADD CONSTRAINT "borrowing_items_borrowing_id_fkey" FOREIGN KEY ("borrowing_id") REFERENCES "public"."borrowings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowing_items" ADD CONSTRAINT "borrowing_items_chemical_id_fkey" FOREIGN KEY ("chemical_id") REFERENCES "public"."chemicals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usage_history" ADD CONSTRAINT "usage_history_chemical_id_fkey" FOREIGN KEY ("chemical_id") REFERENCES "public"."chemicals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
