// app/dashboard/projects/page.tsx
export default function ProjectsPage() {
  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manajemen Karya</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
          + Tambah Baru
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {/* Daftar karya akan muncul di sini */}
        <p className="text-gray-400">Belum ada karya yang diunggah.</p>
      </div>
    </main>
  );
}