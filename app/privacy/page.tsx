// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Kebijakan Privasi
      </h1>
      <p className="text-gray-700 text-center">
        Terakhir diperbarui: 2 Agustus 2025
      </p>

      <section className="space-y-4 text-gray-800 text-justify">
        <p>
          Kami menghargai privasi Anda dan berkomitmen untuk melindungi
          informasi pribadi yang Anda berikan saat menggunakan Sistem Manajemen
          Inventaris Kimia ini. Kebijakan ini menjelaskan bagaimana kami
          mengumpulkan, menggunakan, dan melindungi informasi tersebut.
        </p>

        <h2 className="font-semibold text-lg text-gray-900">
          1. Informasi yang Kami Kumpulkan
        </h2>
        <ul className="list-disc list-inside">
          <li>Nama dan alamat email Anda saat mendaftar atau login</li>
          <li>
            Data aktivitas Anda dalam aplikasi (seperti login/log aktivitas)
          </li>
          <li>Data penggunaan bahan kimia untuk keperluan inventaris</li>
        </ul>

        <h2 className="font-semibold text-lg text-gray-900">
          2. Penggunaan Informasi
        </h2>
        <p>Informasi yang kami kumpulkan digunakan untuk:</p>
        <ul className="list-disc list-inside">
          <li>Mengelola akun pengguna</li>
          <li>Meningkatkan layanan dan fitur aplikasi</li>
          <li>Memastikan keamanan sistem</li>
        </ul>

        <h2 className="font-semibold text-lg text-gray-900">
          3. Keamanan Data
        </h2>
        <p>
          Kami menggunakan langkah-langkah teknis dan organisasi untuk
          melindungi data pribadi Anda dari akses yang tidak sah, penggunaan
          yang tidak sah, atau pengungkapan yang tidak sah.
        </p>

        <h2 className="font-semibold text-lg text-gray-900">4. Hak Pengguna</h2>
        <p>
          Anda berhak untuk mengakses, memperbarui, atau menghapus data pribadi
          Anda. Anda dapat menghubungi kami kapan saja melalui email untuk
          permintaan ini.
        </p>

        <h2 className="font-semibold text-lg text-gray-900">
          5. Perubahan Kebijakan
        </h2>
        <p>
          Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu.
          Perubahan akan diinformasikan di halaman ini.
        </p>

        <p>
          Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan
          hubungi kami melalui{" "}
          <a href="/contact" className="text-blue-600 underline">
            halaman kontak
          </a>
          .
        </p>
      </section>
    </div>
  );
}
