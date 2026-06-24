//app/dashboard/admin/architecture/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardLayout } from '@/features/dashboard';
import { 
  Lock, FileDown, Play, XCircle, CheckCircle2, AlertTriangle, 
  Circle, Move, Shield, Layers, PlusSquare, Terminal, Loader2 
} from 'lucide-react';

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
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-[#ff9e00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-zinc-950 font-mono">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-widest flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#ff9e00]" />
              <span>Admin Only</span>
            </span>
            <span className="bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-widest">
              Technical Design Document
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Hybrid Modular Builder</h1>
          <p className="text-white/40 mt-1 text-xs">Cetak biru arsitektur Portfo.be: Memecah tema monolitik menjadi komponen seksi yang dinamis.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button className="w-full sm:w-auto px-4 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white/70 hover:text-white text-xs font-bold rounded-none transition-colors flex items-center justify-center gap-2">
            <FileDown className="w-3.5 h-3.5" />
            <span>Ekspor PDF</span>
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-xs font-bold rounded-none transition-colors flex items-center justify-center gap-2">
            <Play className="w-3.5 h-3.5" />
            <span>Mulai Fase 1</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-4xl mx-auto bg-zinc-900/40 rounded-none border border-white/10 overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">1</span> 
                Executive Summary
              </h2>
              <div className="text-white/40 leading-relaxed space-y-4 text-xs font-mono">
                <p>Dokumen ini adalah cetak biru (blueprint) strategis untuk merombak arsitektur <span className="italic">rendering</span> Portfo.be. Berdasarkan keputusan bisnis untuk memberikan kebebasan kustomisasi (<span className="italic">drag-and-drop</span>) tanpa mengorbankan pengalaman instan (<span className="italic">theme presets</span>), kita akan bermigrasi dari <strong className="text-white font-bold">Monolithic Theme Architecture</strong> menuju <strong className="text-white font-bold">Block-Based Hybrid Architecture</strong>.</p>
                <p>Sebagai <span className="italic">Senior Systems Architect</span>, saya telah menyusun peta jalan (roadmap) ini untuk meminimalisir risiko kegagalan sistem (<span className="italic">downtime</span>) dan memastikan transisi kode yang mulus.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">2</span> 
                Analisis Arsitektur (Lama vs Baru)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-none p-6">
                  <h3 className="text-rose-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase"><XCircle className="w-4 h-4" /> Monolitik (Saat Ini)</h3>
                  <p className="text-xs text-rose-300/60 leading-relaxed mb-4">Satu tema adalah satu file raksasa dengan urutan yang dikunci permanen.</p>
                  <ul className="text-xs space-y-2 text-rose-300/40 list-disc pl-4">
                    <li>Database -&gt; Membaca <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 rounded-none">themeTemplate: 'cinematic'</code></li>
                    <li>Halaman memanggil komponen <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 rounded-none">&lt;CinematicTheme /&gt;</code> utuh.</li>
                  </ul>
                </div>
                
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-none p-6">
                  <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase"><CheckCircle2 className="w-4 h-4" /> Modular Block Builder (Baru)</h3>
                  <p className="text-xs text-emerald-300/60 leading-relaxed mb-4">Halaman dirender seksi per seksi berdasarkan Array dari Database.</p>
                  <ul className="text-xs space-y-2 text-emerald-300/40 list-disc pl-4">
                    <li>Database -&gt; Array dari tabel <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 rounded-none">PageBlock</code></li>
                    <li>Halaman memanggil <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 rounded-none">&lt;DynamicBlockRenderer blocks=&#123;data&#125; /&gt;</code></li>
                    <li>Render Looping: <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 rounded-none">&lt;CinematicHeroBlock /&gt;</code>, dll.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">3</span> 
                Desain Database (Skema Prisma)
              </h2>
              <div className="bg-zinc-950 rounded-none overflow-hidden shadow-none border border-white/10">
                <div className="bg-zinc-900/80 px-4 py-2 text-[10px] font-mono text-white/40 border-b border-white/5 flex justify-between">
                  <span>schema.prisma</span>
                  <span>Prisma</span>
                </div>
                <pre className="p-4 text-xs font-mono text-white/60 overflow-x-auto leading-relaxed">
<span className="text-white/30">// Penambahan model baru di schema.prisma</span>{'\n'}
<span className="text-[#ff9e00]">model</span> <span className="text-white">PageBlock</span> {'{\n'}
{'  '}id          <span className="text-[#ff9e00]">String</span>   <span className="text-white/30">@id @default(uuid())</span>{'\n'}
{'  '}userId      <span className="text-[#ff9e00]">String</span>{'\n'}
{'\n'}
{'  '}<span className="text-white/30">// Tipe blok, misal: 'CINEMATIC_HERO', 'ACID_GALLERY'</span>{'\n'}
{'  '}blockType   <span className="text-[#ff9e00]">String</span>{'\n'}
{'\n'}
{'  '}<span className="text-white/30">// Urutan render dari atas ke bawah (0, 1, 2, 3...)</span>{'\n'}
{'  '}orderIndex  <span className="text-[#ff9e00]">Int</span>      <span className="text-white/30">@default(0)</span>{'\n'}
{'\n'}
{'  '}<span className="text-white/30">// Sakelar untuk Toggle Visibility</span>{'\n'}
{'  '}isVisible   <span className="text-[#ff9e00]">Boolean</span>  <span className="text-white/30">@default(true)</span>{'\n'}
{'\n'}
{'  '}<span className="text-white/30">// Konfigurasi spesifik per blok</span>{'\n'}
{'  '}configJson  <span className="text-[#ff9e00]">String?</span>  <span className="text-white/30">@db.Text</span>{'\n'}
{'\n'}
{'  '}createdAt   <span className="text-[#ff9e00]">DateTime</span> <span className="text-white/30">@default(now())</span>{'\n'}
{'  '}updatedAt   <span className="text-[#ff9e00]">DateTime</span> <span className="text-white/30">@updatedAt</span>{'\n'}
{'\n'}
{'  '}user        <span className="text-white">User</span>     <span className="text-white/30">@relation(fields: [userId], references: [id], onDelete: Cascade)</span>{'\n'}
{'\n'}
{'  '}<span className="text-white/30">@@index([userId, orderIndex])</span>{'\n'}
{'}'}
                </pre>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">4</span> 
                Strategi Pemecahan Komponen
              </h2>
              <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-none mb-6 flex gap-4">
                <AlertTriangle className="text-[#ff9e00] mt-0.5 w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#ff9e00] text-xs uppercase">Aturan Isolasi Blok</h4>
                  <p className="text-white/40 text-xs font-mono mt-1">Setiap file blok tidak boleh membocorkan CSS-nya ke luar kontainernya agar tidak terjadi tabrakan desain.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">5</span> 
                Peta Jalan Eksekusi (Roadmap)
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-none bg-zinc-950 border border-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                    <div className="w-0.5 h-full bg-white/5 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-white uppercase text-xs">FASE 1: Fondasi & Basis Data</h4>
                    <p className="text-[10px] text-white/30 mb-3">Durasi: ~2 Hari</p>
                    <ul className="text-xs text-white/40 space-y-2">
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Menambahkan model <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 text-[10px] rounded-none">PageBlock</code> ke schema Prisma.</span></li>
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Membuat API Endpoint CRUD untuk blok.</span></li>
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Membuat mekanisme Seeding (menyiapkan layout default).</span></li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-none bg-zinc-950 border border-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                    <div className="w-0.5 h-full bg-white/5 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-white uppercase text-xs">FASE 2: Pembongkaran Komponen</h4>
                    <p className="text-[10px] text-white/30 mb-3">Durasi: ~4 Hari</p>
                    <ul className="text-xs text-white/40 space-y-2">
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Membedah 1 Tema (CinematicTheme) sebagai Proof of Concept.</span></li>
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Menulis <code className="bg-zinc-950 border border-white/5 px-1 py-0.5 text-[10px] rounded-none">DynamicBlockRenderer</code>.</span></li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-none bg-zinc-950 border border-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
                    <div className="w-0.5 h-full bg-white/5 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <h4 className="font-bold text-white uppercase text-xs">FASE 3: UI Builder di Dashboard</h4>
                    <p className="text-[10px] text-white/30 mb-3">Durasi: ~5 Hari</p>
                    <ul className="text-xs text-white/40 space-y-2">
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Mengimplementasikan Drag and Drop.</span></li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-none bg-zinc-950 border border-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">4</div>
                  </div>
                  <div className="pb-2">
                    <h4 className="font-bold text-white uppercase text-xs">FASE 4: Migrasi Skala Penuh</h4>
                    <p className="text-[10px] text-white/30 mb-3">Durasi: ~2-3 Minggu</p>
                    <ul className="text-xs text-white/40 space-y-2">
                      <li className="flex items-center gap-2"><Circle className="w-3 h-3 text-white/20" /> <span>Membedah sisa 20 tema lainnya.</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">6</span> 
                Kemampuan Post-Launch (Untuk User)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-white/10 rounded-none bg-zinc-950">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Move className="w-4 h-4 text-[#ff9e00]" /></div>
                  <h4 className="font-bold text-white uppercase text-xs mb-2">Drag-and-Drop Layout</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Menggeser posisi seksi secara bebas untuk strategi personal branding.</p>
                </div>
                <div className="p-5 border border-white/10 rounded-none bg-zinc-950">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Shield className="w-4 h-4 text-[#ff9e00]" /></div>
                  <h4 className="font-bold text-white uppercase text-xs mb-2">Strict Theme Integrity</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Hanya bisa memakai blok dari tema yang aktif agar desain tidak rusak.</p>
                </div>
                <div className="p-5 border border-white/10 rounded-none bg-zinc-950">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Layers className="w-4 h-4 text-[#ff9e00]" /></div>
                  <h4 className="font-bold text-white uppercase text-xs mb-2">Singleton Dynamic Blocks</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Seksi seperti Projects/3D hanya bisa digeser/disembunyikan.</p>
                </div>
                <div className="p-5 border border-white/10 rounded-none bg-zinc-950">
                  <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><PlusSquare className="w-4 h-4 text-[#ff9e00]" /></div>
                  <h4 className="font-bold text-white uppercase text-xs mb-2">Addable Static Blocks</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Bisa menambahkan berulang kali seksi statis (Text, Timeline, Banner).</p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">7</span> 
                Katalog Static Blocks (Registri)
              </h2>
              <div className="bg-zinc-950 rounded-none p-6 border border-white/10">
                <p className="text-xs text-white/40 mb-6 font-mono leading-relaxed">Aturan konvensi penamaan (Registry) untuk blok di database: <code className="bg-zinc-900 px-1.5 py-0.5 border border-white/5 text-white">[NAMA_TEMA]_[NAMA_BLOK]</code> (Contoh: <code className="bg-zinc-900 px-1.5 py-0.5 border border-[#ff9e00]/20 text-[#ff9e00]">CINEMATIC_MANIFESTO</code>).</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-white/40 font-mono">
                    <thead className="bg-zinc-900/50 text-white/40 text-[9px] uppercase tracking-widest border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 font-bold rounded-none">Nama Blok</th>
                        <th className="px-4 py-3 font-bold">Kode blockType</th>
                        <th className="px-4 py-3 font-bold rounded-none">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Manifesto / Quote</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_MANIFESTO</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Tipografi raksasa berisi filosofi kerja. Cocok untuk Cinematic.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Trusted By (Logos)</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_CLIENT_LOGOS</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Marquee berjalan atau grid logo klien.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Service Packages</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_PRICING</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Tabel harga 3 kolom untuk freelancer berjualan paket.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Fun Facts (Counters)</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_STATS_COUNTER</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Angka raksasa yang bergerak dari 0 ke target saat di-scroll.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">FAQ Accordion</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_FAQ</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Daftar Pertanyaan Sering Diajukan yang bisa di-expand.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Parallax Banner</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_MEDIA_BREAK</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Pemisah visual berupa foto/video lebar layar parallax.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Career Journey</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_TIMELINE</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Garis waktu statis berisi sejarah pendidikan/pekerjaan.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Massive CTA</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-white/60">*_CTA_FOOTER</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Ajakan kerja sama berukuran raksasa sebelum footer utama.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">8</span> 
                Katalog Enterprise Blocks (Ekspansi Mendatang)
              </h2>
              <div className="bg-zinc-950 rounded-none p-6 border border-white/10">
                <p className="text-xs text-white/40 mb-6 font-mono leading-relaxed">Blok tingkat lanjut untuk memfasilitasi kebutuhan kreator profesional, agensi, dan C-Level.</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-white/40 font-mono">
                    <thead className="bg-zinc-900/50 text-[#ff9e00] text-[9px] uppercase tracking-widest border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 font-bold rounded-none">Nama Blok</th>
                        <th className="px-4 py-3 font-bold">Kode blockType</th>
                        <th className="px-4 py-3 font-bold rounded-none">Deskripsi (Use Case)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Contact & Booking</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_CONTACT</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Formulir kontak sebaris dan integrasi Calendly.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Downloadable Assets</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_ASSETS</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Tombol fokus untuk unduh CV, Resume, atau Media Kit.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Case Studies</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_CASE_STUDY</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Narasi mendalam masalah/solusi khusus Konsultan dan UX.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Before & After Slider</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_BEFORE_AFTER</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Slider komparasi visual untuk Retoucher atau Arsitek.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Press & Media Mentions</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_PRESS</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Deretan publikasi ("As Featured In") untuk kredibilitas.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Process & Workflow</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_WORKFLOW</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Langkah kerja terstruktur dari Discovery hingga Delivery.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Blog / Articles</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_BLOG</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Feed kartu tulisan terbaru dari Medium atau Substack.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Speaking & Events</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_EVENTS</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Daftar jadwal acara, seminar, atau konferensi aktif.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Giant Video Reel</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_VIDEO_REEL</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Pemutar video layar penuh khusus Filmmaker/Animator.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Audio Player</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_AUDIO</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Kaset pemutar audio bagi Podcaster atau Musisi.</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Interactive Map</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_LOCATION</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Peta lokasi elegan berbasis wilayah (Google/Mapbox).</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">Availability Status</td>
                        <td className="px-4 py-3"><code className="text-xs bg-zinc-900 border border-white/5 px-1.5 py-0.5 text-[#ff9e00]">*_AVAILABILITY</code></td>
                        <td className="px-4 py-3 text-[11px] leading-relaxed">Indikator ketersediaan status kerja (Available/Booked).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center text-white/40 text-xs font-mono">9</span> 
                Arsitektur UX Mobile-First (Enterprise Editor)
              </h2>
              <div className="bg-zinc-950 rounded-none p-6 border border-white/10">
                <p className="text-xs text-white/40 mb-6 font-mono leading-relaxed">Mengatasi keterbatasan ruang di layar *smartphone* (HP) untuk menciptakan pengalaman mengedit setara aplikasi *native* seperti Instagram atau Canva.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/20 p-5 rounded-none border border-white/5">
                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Terminal className="w-4 h-4 text-[#ff9e00]" /></div>
                    <h4 className="font-bold text-white uppercase text-xs mb-2">1. Live Canvas First</h4>
                    <p className="text-xs text-white/40 leading-relaxed">Saat dibuka di HP, form editor disembunyikan. Layar 100% dialokasikan untuk <strong>Live Preview</strong>. Pengguna mengedit portofolio dengan menyentuh teks secara langsung (<em>Inline Editing via EditableText</em>).</p>
                  </div>
                  
                  <div className="bg-zinc-900/20 p-5 rounded-none border border-white/5">
                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Layers className="w-4 h-4 text-[#ff9e00]" /></div>
                    <h4 className="font-bold text-white uppercase text-xs mb-2">2. Bottom Sheet Drawer</h4>
                    <p className="text-xs text-white/40 leading-relaxed">Sidebar desktop diubah menjadi <strong>Laci Bawah</strong> (<em>Drawer</em>) yang bisa ditarik naik-turun. Digunakan khusus untuk pengaturan tingkat lanjut (Ganti Tema, Susunan Blok, Warna) agar tidak menutupi seluruh kanvas.</p>
                  </div>
                  
                  <div className="bg-zinc-900/20 p-5 rounded-none border border-white/5">
                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Move className="w-4 h-4 text-[#ff9e00]" /></div>
                    <h4 className="font-bold text-white uppercase text-xs mb-2">3. Floating Action Bar (Dock)</h4>
                    <p className="text-xs text-white/40 leading-relaxed">Bar navigasi mengambang di bagian bawah layar berisi ikon esensial: [Tema, Blok, Pengaturan, Publish]. Sentuhan pada ikon akan memicu animasi <em>Bottom Sheet</em> terbuka.</p>
                  </div>
                  
                  <div className="bg-zinc-900/20 p-5 rounded-none border border-white/5">
                    <div className="w-10 h-10 bg-zinc-900 border border-white/5 text-white/40 rounded-none flex items-center justify-center mb-4"><Play className="w-4 h-4 text-[#ff9e00]" /></div>
                    <h4 className="font-bold text-white uppercase text-xs mb-2">4. Seamless Gestures</h4>
                    <p className="text-xs text-white/40 leading-relaxed">Mendukung <em>Swipe to close</em> pada menu dan <em>Drag handles</em> berukuran besar (minimal 44x44px) agar mudah ditekan dengan jari untuk menyusun urutan blok.</p>
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
