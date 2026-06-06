"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

export default function ArchitecturePlanPage() {
  const { userRole, isLoading } = useDashboardLayout();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;
    
    if (userRole !== 'ADMIN') {
      setIsAuthorized(false);
      router.push('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [userRole, isLoading, router]);

  if (isAuthorized === null || !isAuthorized) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-violet-200">
              <i className="fas fa-lock mr-1"></i> Admin Only
            </span>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-200">
              Technical Design Document
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Hybrid Modular Builder</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Cetak biru arsitektur Portfo.be: Memecah tema monolitik menjadi komponen seksi yang dinamis.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button className="w-full sm:w-auto px-4 py-2.5 md:py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors shadow-sm">
            <i className="fas fa-file-pdf mr-2"></i> Ekspor PDF
          </button>
          <button className="w-full sm:w-auto px-4 py-2.5 md:py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
            <i className="fas fa-play mr-2"></i> Mulai Fase 1
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">1</span> 
                Executive Summary
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 text-[15px]">
                <p>Dokumen ini adalah cetak biru (blueprint) strategis untuk merombak arsitektur <span className="italic">rendering</span> Portfo.be. Berdasarkan keputusan bisnis untuk memberikan kebebasan kustomisasi (<span className="italic">drag-and-drop</span>) tanpa mengorbankan pengalaman instan (<span className="italic">theme presets</span>), kita akan bermigrasi dari <strong className="text-slate-900">Monolithic Theme Architecture</strong> menuju <strong className="text-slate-900">Block-Based Hybrid Architecture</strong>.</p>
                <p>Sebagai <span className="italic">Senior Systems Architect</span>, saya telah menyusun peta jalan (roadmap) ini untuk meminimalisir risiko kegagalan sistem (<span className="italic">downtime</span>) dan memastikan transisi kode yang mulus.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">2</span> 
                Analisis Arsitektur (Lama vs Baru)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6">
                  <h3 className="text-red-800 font-bold mb-3 flex items-center gap-2"><i className="fas fa-times-circle"></i> Monolitik (Saat Ini)</h3>
                  <p className="text-sm text-red-700/80 mb-4">Satu tema adalah satu file raksasa dengan urutan yang dikunci permanen.</p>
                  <ul className="text-sm space-y-2 text-red-900/70 list-disc pl-4">
                    <li>Database -&gt; Membaca <code className="bg-white/50 px-1 py-0.5 rounded">themeTemplate: 'cinematic'</code></li>
                    <li>Halaman memanggil komponen <code className="bg-white/50 px-1 py-0.5 rounded">&lt;CinematicTheme /&gt;</code> utuh.</li>
                  </ul>
                </div>
                
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                  <h3 className="text-emerald-800 font-bold mb-3 flex items-center gap-2"><i className="fas fa-check-circle"></i> Modular Block Builder (Baru)</h3>
                  <p className="text-sm text-emerald-700/80 mb-4">Halaman dirender seksi per seksi berdasarkan Array dari Database.</p>
                  <ul className="text-sm space-y-2 text-emerald-900/70 list-disc pl-4">
                    <li>Database -&gt; Array dari tabel <code className="bg-white/50 px-1 py-0.5 rounded">PageBlock</code></li>
                    <li>Halaman memanggil <code className="bg-white/50 px-1 py-0.5 rounded">&lt;DynamicBlockRenderer blocks=&#123;data&#125; /&gt;</code></li>
                    <li>Render Looping: <code className="bg-white/50 px-1 py-0.5 rounded">&lt;CinematicHeroBlock /&gt;</code>, dll.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">3</span> 
                Desain Database (Skema Prisma)
              </h2>
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-800/50 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700/50 flex justify-between">
                  <span>schema.prisma</span>
                  <span>Prisma</span>
                </div>
                <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
<span className="text-slate-500">// Penambahan model baru di schema.prisma</span>{'\n'}
<span className="text-blue-400">model</span> <span className="text-yellow-200">PageBlock</span> {'{\n'}
{'  '}id          <span className="text-blue-400">String</span>   <span className="text-slate-400">@id @default(uuid())</span>{'\n'}
{'  '}userId      <span className="text-blue-400">String</span>{'\n'}
{'\n'}
{'  '}<span className="text-slate-500">// Tipe blok, misal: 'CINEMATIC_HERO', 'ACID_GALLERY'</span>{'\n'}
{'  '}blockType   <span className="text-blue-400">String</span>{'\n'}
{'\n'}
{'  '}<span className="text-slate-500">// Urutan render dari atas ke bawah (0, 1, 2, 3...)</span>{'\n'}
{'  '}orderIndex  <span className="text-blue-400">Int</span>      <span className="text-slate-400">@default(0)</span>{'\n'}
{'\n'}
{'  '}<span className="text-slate-500">// Sakelar untuk Toggle Visibility</span>{'\n'}
{'  '}isVisible   <span className="text-blue-400">Boolean</span>  <span className="text-slate-400">@default(true)</span>{'\n'}
{'\n'}
{'  '}<span className="text-slate-500">// Konfigurasi spesifik per blok</span>{'\n'}
{'  '}configJson  <span className="text-blue-400">String?</span>  <span className="text-slate-400">@db.Text</span>{'\n'}
{'\n'}
{'  '}createdAt   <span className="text-blue-400">DateTime</span> <span className="text-slate-400">@default(now())</span>{'\n'}
{'  '}updatedAt   <span className="text-blue-400">DateTime</span> <span className="text-slate-400">@updatedAt</span>{'\n'}
{'\n'}
{'  '}user        <span className="text-yellow-200">User</span>     <span className="text-slate-400">@relation(fields: [userId], references: [id], onDelete: Cascade)</span>{'\n'}
{'\n'}
{'  '}<span className="text-slate-400">@@index([userId, orderIndex])</span>{'\n'}
{'}'}
                </pre>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">4</span> 
                Strategi Pemecahan Komponen
              </h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex gap-4">
                <i className="fas fa-exclamation-triangle text-amber-500 mt-0.5"></i>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">Aturan Isolasi Blok</h4>
                  <p className="text-amber-800/80 text-sm mt-1">Setiap file blok tidak boleh membocorkan CSS-nya ke luar kontainernya agar tidak terjadi tabrakan desain.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">5</span> 
                Peta Jalan Eksekusi (Roadmap)
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                    <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-slate-900">FASE 1: Fondasi & Basis Data</h4>
                    <p className="text-sm text-slate-500 mb-3">Durasi: ~2 Hari</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Menambahkan model <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">PageBlock</code> ke schema Prisma.</li>
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Membuat API Endpoint CRUD untuk blok.</li>
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Membuat mekanisme Seeding (menyiapkan layout default).</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                    <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-slate-900">FASE 2: Pembongkaran Komponen</h4>
                    <p className="text-sm text-slate-500 mb-3">Durasi: ~4 Hari</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Membedah 1 Tema (CinematicTheme) sebagai Proof of Concept.</li>
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Menulis <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">DynamicBlockRenderer</code>.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                    <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-slate-900">FASE 3: UI Builder di Dashboard</h4>
                    <p className="text-sm text-slate-500 mb-3">Durasi: ~5 Hari</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Mengimplementasikan Drag and Drop.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">4</div>
                  </div>
                  <div className="pb-2">
                    <h4 className="font-bold text-slate-900">FASE 4: Migrasi Skala Penuh</h4>
                    <p className="text-sm text-slate-500 mb-3">Durasi: ~2-3 Minggu</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li><i className="far fa-circle text-slate-300 mr-2"></i> Membedah sisa 20 tema lainnya.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">6</span> 
                Kemampuan Post-Launch (Untuk User)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4"><i className="fas fa-arrows-alt"></i></div>
                  <h4 className="font-bold text-slate-900 mb-2">Drag-and-Drop Layout</h4>
                  <p className="text-sm text-slate-600">Menggeser posisi seksi secara bebas untuk strategi personal branding.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4"><i className="fas fa-shield-alt"></i></div>
                  <h4 className="font-bold text-slate-900 mb-2">Strict Theme Integrity</h4>
                  <p className="text-sm text-slate-600">Hanya bisa memakai blok dari tema yang aktif agar desain tidak rusak.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><i className="fas fa-layer-group"></i></div>
                  <h4 className="font-bold text-slate-900 mb-2">Singleton Dynamic Blocks</h4>
                  <p className="text-sm text-slate-600">Seksi seperti Projects/3D hanya bisa digeser/disembunyikan.</p>
                </div>
                <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><i className="fas fa-plus-square"></i></div>
                  <h4 className="font-bold text-slate-900 mb-2">Addable Static Blocks</h4>
                  <p className="text-sm text-slate-600">Bisa menambahkan berulang kali seksi statis (Text, Timeline, Banner).</p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">7</span> 
                Katalog Static Blocks (Registri)
              </h2>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <p className="text-sm text-slate-600 mb-6">Aturan konvensi penamaan (Registry) untuk blok di database: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">[NAMA_TEMA]_[NAMA_BLOK]</code> (Contoh: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600">CINEMATIC_MANIFESTO</code>).</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-bold rounded-tl-xl">Nama Blok</th>
                        <th className="px-4 py-3 font-bold">Kode blockType</th>
                        <th className="px-4 py-3 font-bold rounded-tr-xl">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 bg-white">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Manifesto / Quote</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_MANIFESTO</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Tipografi raksasa berisi filosofi kerja. Cocok untuk Cinematic.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Trusted By (Logos)</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_CLIENT_LOGOS</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Marquee berjalan atau grid logo klien.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Service Packages</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_PRICING</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Tabel harga 3 kolom untuk freelancer berjualan paket.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Fun Facts (Counters)</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_STATS_COUNTER</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Angka raksasa yang bergerak dari 0 ke target saat di-scroll.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">FAQ Accordion</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_FAQ</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Daftar Pertanyaan Sering Diajukan yang bisa di-expand.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Parallax Banner</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_MEDIA_BREAK</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Pemisah visual berupa foto/video lebar layar parallax.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Career Journey</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_TIMELINE</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Garis waktu statis berisi sejarah pendidikan/pekerjaan.</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Massive CTA</td>
                        <td className="px-4 py-3"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">*_CTA_FOOTER</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Ajakan kerja sama berukuran raksasa sebelum footer utama.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm">8</span> 
                Katalog Enterprise Blocks (Ekspansi Mendatang)
              </h2>
              <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                <p className="text-sm text-slate-600 mb-6">Blok tingkat lanjut untuk memfasilitasi kebutuhan kreator profesional, agensi, dan C-Level.</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-indigo-100/50 text-indigo-800 text-xs uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3 font-bold rounded-tl-xl">Nama Blok</th>
                        <th className="px-4 py-3 font-bold">Kode blockType</th>
                        <th className="px-4 py-3 font-bold rounded-tr-xl">Deskripsi (Use Case)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-100/60 bg-white">
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Contact & Booking</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_CONTACT</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Formulir kontak sebaris dan integrasi Calendly.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Downloadable Assets</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_ASSETS</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Tombol fokus untuk unduh CV, Resume, atau Media Kit.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Case Studies</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_CASE_STUDY</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Narasi mendalam masalah/solusi khusus Konsultan dan UX.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Before & After Slider</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_BEFORE_AFTER</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Slider komparasi visual untuk Retoucher atau Arsitek.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Press & Media Mentions</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_PRESS</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Deretan publikasi ("As Featured In") untuk kredibilitas.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Process & Workflow</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_WORKFLOW</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Langkah kerja terstruktur dari Discovery hingga Delivery.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Blog / Articles</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_BLOG</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Feed kartu tulisan terbaru dari Medium atau Substack.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Speaking & Events</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_EVENTS</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Daftar jadwal acara, seminar, atau konferensi aktif.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Giant Video Reel</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_VIDEO_REEL</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Pemutar video layar penuh khusus Filmmaker/Animator.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Audio Player</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_AUDIO</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Kaset pemutar audio bagi Podcaster atau Musisi.</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Interactive Map</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_LOCATION</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Peta lokasi elegan berbasis wilayah (Google/Mapbox).</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">Availability Status</td>
                        <td className="px-4 py-3"><code className="text-xs bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-indigo-600">*_AVAILABILITY</code></td>
                        <td className="px-4 py-3 text-xs leading-relaxed">Indikator ketersediaan status kerja (Available/Booked).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">9</span> 
                Arsitektur UX Mobile-First (Enterprise Editor)
              </h2>
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                <p className="text-sm text-slate-600 mb-6">Mengatasi keterbatasan ruang di layar *smartphone* (HP) untuk menciptakan pengalaman mengedit setara aplikasi *native* seperti Instagram atau Canva.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-emerald-100/60 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><i className="fas fa-mobile-alt text-lg"></i></div>
                    <h4 className="font-bold text-slate-900 mb-2">1. Live Canvas First</h4>
                    <p className="text-sm text-slate-600">Saat dibuka di HP, form editor disembunyikan. Layar 100% dialokasikan untuk <strong>Live Preview</strong>. Pengguna mengedit portofolio dengan menyentuh teks secara langsung (<em>Inline Editing via EditableText</em>).</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-emerald-100/60 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><i className="fas fa-layer-group text-lg"></i></div>
                    <h4 className="font-bold text-slate-900 mb-2">2. Bottom Sheet Drawer</h4>
                    <p className="text-sm text-slate-600">Sidebar desktop diubah menjadi <strong>Laci Bawah</strong> (<em>Drawer</em>) yang bisa ditarik naik-turun. Digunakan khusus untuk pengaturan tingkat lanjut (Ganti Tema, Susunan Blok, Warna) agar tidak menutupi seluruh kanvas.</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-emerald-100/60 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><i className="fas fa-ellipsis-h text-lg"></i></div>
                    <h4 className="font-bold text-slate-900 mb-2">3. Floating Action Bar (Dock)</h4>
                    <p className="text-sm text-slate-600">Bar navigasi mengambang di bagian bawah layar berisi ikon esensial: [Tema, Blok, Pengaturan, Publish]. Sentuhan pada ikon akan memicu animasi <em>Bottom Sheet</em> terbuka.</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-emerald-100/60 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><i className="fas fa-magic text-lg"></i></div>
                    <h4 className="font-bold text-slate-900 mb-2">4. Seamless Gestures</h4>
                    <p className="text-sm text-slate-600">Mendukung <em>Swipe to close</em> pada menu dan <em>Drag handles</em> berukuran besar (minimal 44x44px) agar mudah ditekan dengan jari untuk menyusun urutan blok.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
