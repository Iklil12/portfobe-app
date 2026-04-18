"use client";

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProjectsPage() {
  
  // Fungsi Coming Soon yang Anda inginkan
  const handleComingSoon = () => {
    toast('Fitur ini akan segera hadir!', {
      icon: '🚧',
      style: { 
        borderRadius: '12px', 
        background: '#111827', 
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold'
      }
    });
  };

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      {/* Container untuk Toast */}
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <p className="text-sm text-gray-500 mt-1">Pamerkan proyek dan hasil kerja terbaik Anda.</p>
        </div>

        {/* Tombol dengan trigger handleComingSoon dan animasi active:scale */}
        <button 
          onClick={handleComingSoon}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-90 transition-all duration-200"
        >
          <i className="fas fa-plus text-xs"></i>
          Tambah Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empty State Tampilan Proyek */}
        <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <i className="fas fa-folder-open text-gray-300 text-xl"></i>
           </div>
           <p className="text-gray-400 font-medium">Belum ada karya yang diunggah.</p>
           <button onClick={handleComingSoon} className="text-blue-600 text-xs font-bold mt-2 hover:underline">
             Mulai unggah sekarang
           </button>
        </div>
      </div>
    </main>
  );
}