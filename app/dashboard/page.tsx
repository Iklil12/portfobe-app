// app/dashboard/page.tsx
export default function DashboardOverview() {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Total Views</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black">1.2k</h3>
            <span className="text-green-500 text-xs font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Project Clicks</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black">482</h3>
            <span className="text-green-500 text-xs font-bold">+5%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Leads</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black">14</h3>
            <span className="text-gray-400 text-xs font-bold">New</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Active Theme</p>
          <h3 className="text-lg font-bold truncate">The Gallery</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Aktivitas Terakhir</h3>
          <button className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">View All</button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><i className="fas fa-cloud-upload-alt"></i></div>
            <div><p className="text-sm font-bold">Berhasil upload "Nike Campaign"</p><p className="text-xs text-gray-400">2 jam yang lalu</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"><i className="fas fa-palette"></i></div>
            <div><p className="text-sm font-bold">Ganti tema ke "The Gallery"</p><p className="text-xs text-gray-400">Kemarin, 14:20</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}