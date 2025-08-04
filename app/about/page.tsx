import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Tentang Sistem Manajemen Inventaris Kimia
      </h1>

      <p className="text-gray-700 text-lg leading-relaxed">
        Sistem Manajemen Inventaris Kimia adalah aplikasi berbasis web yang
        dirancang untuk membantu laboratorium dan institusi pendidikan dalam
        mengelola dan melacak bahan kimia dengan aman dan efisien. Tujuannya
        adalah meminimalisir risiko kesalahan pencatatan, memudahkan pencarian,
        dan meningkatkan keamanan dalam penyimpanan bahan kimia.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">Fitur Utama</h2>
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          <li>Pencatatan bahan kimia lengkap dengan tanggal kadaluarsa.</li>
          <li>Pelacakan stok secara real-time dan otomatis.</li>
          <li>Pengelompokan bahan berdasarkan kategori dan bahaya.</li>
          <li>Login aman dengan akun pengguna terpisah.</li>
          <li>Dukungan akun demo untuk simulasi.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-600">
          Tentang Pengembang
        </h2>
        <p className="text-gray-700">
          Aplikasi ini dikembangkan oleh{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800">
            John Doe
          </a>
          , mahasiswa Teknik Informatika yang tertarik pada pengembangan
          aplikasi berbasis web menggunakan React, TypeScript, Nextjs, Prisma
          ORM dan berbagai teknologi open-source.
        </p>
      </section>

      <section className="text-center pt-6">
        <Footer />
      </section>
    </div>
  );
}
