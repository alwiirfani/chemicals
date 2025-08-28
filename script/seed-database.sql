
-- Clear existing data (in correct order to avoid foreign key constraints)
DELETE FROM borrowing_items;
DELETE FROM borrowings;
DELETE FROM usage_history;
DELETE FROM safety_data_sheets;
DELETE FROM chemicals;
DELETE FROM reports;
DELETE FROM admin;
DELETE FROM laboran;
DELETE FROM dosen;
DELETE FROM mahasiswa;
DELETE FROM users;

-- Insert sample users with hashed passwords (password: "password123")
INSERT INTO users (id, username, email, password, role, created_at, updated_at) VALUES
('admin001', 'admin', 'admin@chemlab.com', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'ADMIN', NOW(), NOW()),
('laboran001', 'laboran1', 'laboran1@chemlab.com', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'LABORAN', NOW(), NOW()),
('laboran002', 'laboran2', 'laboran2@chemlab.com', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'LABORAN', NOW(), NOW()),
('gudang001', 'petugas_gudang1', 'gudang1@chemlab.com', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'PETUGAS_GUDANG', NOW(), NOW()),
('dosen001', 'dosen1', 'dosen1@chemlab.com', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'DOSEN', NOW(), NOW()),
('dosen002', 'dosen2', 'dosen2@chemlab.com', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'DOSEN', NOW(), NOW()),
('mhs001', 'mahasiswa1', 'mhs1@student.ac.id', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'MAHASISWA', NOW(), NOW()),
('mhs002', 'mahasiswa2', 'mhs2@student.ac.id', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'MAHASISWA', NOW(), NOW()),
('mhs003', 'mahasiswa3', 'mhs3@student.ac.id', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'MAHASISWA', NOW(), NOW()),
('mhs004', 'mahasiswa4', 'mhs4@student.ac.id', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'MAHASISWA', NOW(), NOW()),
('mhs005', 'mahasiswa5', 'mhs5@student.ac.id', '$2a$12$xEcdWrmpwDwje2AkneNs9.m9ZhWKHgQN3Fo3XusYnapW01h.Nv2Ki', 'MAHASISWA', NOW(), NOW());
-- Insert role-specific data
INSERT INTO admin (pin, user_id) VALUES
('12345', 'admin001');

INSERT INTO laboran (nip, full_name, user_id) VALUES
('1234567890', 'Dr. Siti Aminah, M.Si', 'laboran001'),
('1234567891', 'Ahmad Fauzi, S.Si', 'laboran002'),
('1234567892', 'Budi Santoso, S.Kom', 'gudang001');

INSERT INTO dosen (nidn, full_name, user_id) VALUES
('0123456789', 'Prof. Dr. Budi Santoso, M.Sc', 'dosen001'),
('0123456790', 'Dr. Rina Kartika, M.Si', 'dosen002');

INSERT INTO mahasiswa (nim, full_name, user_id) VALUES
('20210001', 'Andi Pratama', 'mhs001'),
('20210002', 'Sari Dewi', 'mhs002'),
('20210003', 'Rudi Hermawan', 'mhs003'),
('20210004', 'Maya Sari', 'mhs004'),
('20210005', 'Doni Setiawan', 'mhs005');

-- Insert sample chemicals sesuai schema
INSERT INTO chemicals (
  id, name, formula, form, characteristic, initial_stock, current_stock, unit,
  purchase_date, expiration_date, created_by_id, created_at, updated_at
) VALUES
('chem001', 'Asam Sulfat', 'H2SO4', 'LIQUID', 'ACID', 500, 500, 'mL', '2024-01-15', '2025-01-15', 'laboran001', NOW(), NOW()),
('chem002', 'Natrium Hidroksida', 'NaOH', 'SOLID', 'BASE', 250, 250, 'g', '2024-01-10', '2026-01-10', 'laboran001', NOW(), NOW()),
('chem003', 'Asam Klorida', 'HCl', 'LIQUID', 'ACID', 1000, 1000, 'mL', '2024-01-20', '2025-06-20', 'laboran002', NOW(), NOW()),
('chem004', 'Etanol', 'C2H5OH', 'LIQUID', 'GENERAL', 2000, 2000, 'mL', '2024-01-05', '2025-12-05', 'laboran001', NOW(), NOW()),
('chem005', 'Benzena', 'C6H6', 'LIQUID', 'GENERAL', 500, 500, 'mL', '2024-01-12', '2025-01-12', 'laboran002', NOW(), NOW()),
('chem006', 'Asam Asetat', 'CH3COOH', 'LIQUID', 'ACID', 750, 750, 'mL', '2024-02-01', '2025-08-01', 'laboran001', NOW(), NOW()),
('chem007', 'Kalium Permanganat', 'KMnO4', 'SOLID', 'OXIDANT', 100, 100, 'g', '2024-01-25', '2026-01-25', 'laboran002', NOW(), NOW()),
('chem008', 'Metanol', 'CH3OH', 'LIQUID', 'GENERAL', 1500, 1500, 'mL', '2024-02-10', '2025-11-10', 'laboran001', NOW(), NOW());
-- Insert sample borrowings
-- Insert sample borrowings dengan informasi approved/rejected/returned
INSERT INTO borrowings (
  id, borrower_id, purpose, status, request_date, 
  approved_at, rejected_at, returned_at,
  approved_by_id, rejected_by_id, returned_by_id,
  notes, created_at, updated_at
) VALUES
('borrow001', 'mhs001', 'Praktikum Kimia Analitik - Titrasi Asam Basa', 'APPROVED', 
 '2024-01-25 09:00:00', '2024-01-25 10:00:00', NULL, NULL,
 'laboran001', NULL, NULL,
 'Disetujui untuk praktikum', NOW(), NOW()),

('borrow002', 'mhs002', 'Penelitian Tugas Akhir', 'PENDING', 
 '2024-01-28 08:30:00', NULL, NULL, NULL,
 NULL, NULL, NULL,
 NULL, NOW(), NOW()),

('borrow003', 'dosen001', 'Penelitian Dosen - Sintesis Senyawa Organik', 'APPROVED', 
 '2024-01-26 14:00:00', '2024-01-26 15:00:00', NULL, NULL,
 'laboran002', NULL, NULL,
 'Untuk penelitian jangka panjang', NOW(), NOW()),

('borrow004', 'mhs003', 'Praktikum Kimia Organik', 'RETURNED', 
 '2024-01-20 10:00:00', '2024-01-20 11:00:00', NULL, '2024-01-22 14:00:00',
 'admin001', NULL, 'laboran001',
 'Sudah dikembalikan', NOW(), NOW()),

('borrow005', 'dosen002', 'Penelitian Analisis Lingkungan', 'APPROVED', 
 '2024-01-29 13:00:00', '2024-01-29 14:00:00', NULL, NULL,
 'laboran001', NULL, NULL,
 'Untuk penelitian lingkungan', NOW(), NOW()),

('borrow006', 'mhs004', 'Praktikum Kimia Dasar', 'REJECTED', 
 '2024-01-27 10:00:00', NULL, '2024-01-27 11:00:00', NULL,
 NULL, 'laboran002', NULL,
 'Stok tidak mencukupi', NOW(), NOW()),

('borrow007', 'mhs005', 'Penelitian Skripsi', 'RETURNED', 
 '2024-01-23 09:00:00', '2024-01-23 10:00:00', NULL, '2024-01-25 15:00:00',
 'admin001', NULL, 'laboran002',
 'Pengembalian tepat waktu', NOW(), NOW());

-- Insert borrowing items
INSERT INTO borrowing_items (id, borrowing_id, chemical_id, quantity, returned, returned_qty, created_at, updated_at) VALUES
('item001', 'borrow001', 'chem001', 50.0, false, NULL, NOW(), NOW()),
('item002', 'borrow001', 'chem002', 25.0, false, NULL, NOW(), NOW()),
('item003', 'borrow002', 'chem004', 100.0, false, NULL, NOW(), NOW()),
('item004', 'borrow003', 'chem005', 200.0, false, NULL, NOW(), NOW()),
('item005', 'borrow003', 'chem004', 300.0, false, NULL, NOW(), NOW()),
('item006', 'borrow004', 'chem008', 150.0, true, 140.0, NOW(), NOW()),
('item007', 'borrow005', 'chem007', 30.0, false, NULL, NOW(), NOW()),
('item008', 'borrow005', 'chem006', 200.0, false, NULL, NOW(), NOW());

-- Insert usage history
INSERT INTO usage_history (id, chemical_id, quantity, purpose, used_at, user_id, created_at, updated_at) VALUES
('usage001', 'chem001', 25.0, 'Praktikum Titrasi', '2024-01-20 10:00:00', 'mhs001', NOW(), NOW()),
('usage002', 'chem002', 15.0, 'Praktikum Titrasi', '2024-01-20 10:00:00', 'mhs002', NOW(), NOW()),
('usage003', 'chem004', 50.0, 'Penelitian Ekstraksi', '2024-01-22 14:00:00', 'dosen001', NOW(), NOW()),
('usage004', 'chem008', 10.0, 'Praktikum Sintesis', '2024-01-18 09:00:00', 'mhs003', NOW(), NOW()),
('usage005', 'chem007', 5.0, 'Analisis Permanganometri', '2024-01-24 11:00:00', 'dosen002', NOW(), NOW()),
('usage006', 'chem006', 30.0, 'Preparasi Buffer', '2024-01-26 15:00:00', 'mhs004', NOW(), NOW());

-- Insert sample SDS records sesuai schema
INSERT INTO safety_data_sheets (
    id, chemical_id, file_name, file_path, external_url, language,
    created_by_id, updated_by_id, created_at, updated_at
) VALUES
('sds001', 'chem001', 'H2SO4_SDS.pdf', '/uploads/sds/H2SO4_SDS.pdf', NULL, 'English',
 'admin001', 'laboran001', NOW(), NOW()),
('sds002', 'chem002', 'NaOH_SDS.pdf', '/uploads/sds/NaOH_SDS.pdf', NULL, 'English',
 'admin001', 'laboran001', NOW(), NOW());



-- Insert sample reports
INSERT INTO reports (id, title, description, type, data, created_by, created_at, updated_at) VALUES
('report001', 'Laporan Inventori Bulanan - Januari 2024', 'Laporan inventori bahan kimia bulan Januari 2024', 'INVENTORY', '{"total_chemicals": 8, "low_stock": 2, "expired_soon": 1}', 'admin001', NOW(), NOW()),
('report002', 'Laporan Peminjaman - Minggu 4 Januari', 'Laporan peminjaman bahan kimia minggu keempat Januari', 'BORROWING', '{"total_borrowings": 5, "approved": 3, "pending": 1, "returned": 1}', 'laboran001', NOW(), NOW()),
('report003', 'Laporan Keamanan Lab - Januari 2024', 'Laporan keamanan dan keselamatan laboratorium', 'SAFETY', '{"incidents": 0, "sds_updated": 6, "safety_checks": 12}', 'laboran002', NOW(), NOW());

-- Update sequences (if needed)
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));