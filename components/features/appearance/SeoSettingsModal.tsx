import React, { useState } from 'react';
import { X, Globe, Share2, Image as ImageIcon, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export function SeoSettingsModal({ state, actions }: { state: any, actions: any }) {
  const customTexts = state.livePreviewTheme?.customTexts || {};
  
  const profile = state.livePreviewData?.profile || {};

  // Computed fallback values based on user's real profile
  const fallbackTitle = `${profile.fullName || 'Nama Anda'} - ${profile.profession || 'Creative Professional'}`;
  const fallbackDescription = profile.bio || `Welcome to the creative portfolio of ${profile.fullName || 'me'}. Explore my latest works and experiences.`;
  const displayImage = profile.avatarUrl || '/default-og-image.jpg'; // Menggunakan foto profil asli atau default

  // Local state pre-filled with real data if customTexts is empty
  const [seoTitle, setSeoTitle] = useState(customTexts?.seo_title || fallbackTitle);
  const [seoDescription, setSeoDescription] = useState(customTexts?.seo_description || fallbackDescription);

  const displayTitle = seoTitle || fallbackTitle;
  const displayDescription = seoDescription || fallbackDescription;

  const handleSave = () => {
    actions.updateCustomText('seo_title', seoTitle);
    actions.updateCustomText('seo_description', seoDescription);
    actions.setIsSeoModalOpen(false);
    
    // Tampilkan notifikasi
    toast.success('Draft SEO tersimpan! Klik "Publish" untuk menerapkannya.', {
      style: {
        background: '#111',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
        fontSize: '13px'
      },
      iconTheme: {
        primary: '#0099ff',
        secondary: '#fff',
      },
      duration: 4000,
    });
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Scrollable Overlay Area */}
      <div className="absolute inset-0 overflow-y-auto" onClick={() => actions.setIsSeoModalOpen(false)}>
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
          
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-4xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect in background */}
            <div className="absolute -top-[200px] -left-[200px] w-[400px] h-[400px] bg-[#0099ff]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-[200px] -right-[200px] w-[400px] h-[400px] bg-[#ff9e00]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => actions.setIsSeoModalOpen(false)}
              className="absolute right-6 top-6 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEFT COLUMN: Controls */}
            <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col border-b md:border-b-0 md:border-r border-white/5 relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#0099ff]/10 text-[#0099ff] flex items-center justify-center border border-[#0099ff]/20 shadow-[0_0_15px_rgba(0,153,255,0.2)]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">SEO & Social Card</h2>
                  <p className="text-xs text-white/50">Atur tampilan link portofolio Anda di media sosial.</p>
                </div>
              </div>

            <div className="space-y-6 flex-1 relative z-10">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Meta Title</label>
                <input 
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={fallbackTitle}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0099ff] hover:border-white/20 transition-all"
                />
                <p className="text-[10px] text-white/30 text-right">{seoTitle.length}/60 karakter</p>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Meta Description</label>
                <textarea 
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={fallbackDescription}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0099ff] hover:border-white/20 transition-all resize-none"
                />
                <p className="text-[10px] text-white/30 text-right">{seoDescription.length}/160 karakter</p>
              </div>

          </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
              <button
                onClick={() => {
                  setSeoTitle('');
                  setSeoDescription('');
                }}
                className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2 rounded-lg hover:bg-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset ke Default
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => actions.setIsSeoModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#0099ff] hover:bg-[#0077cc] text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:shadow-[0_0_30px_rgba(0,153,255,0.5)]"
                >
                  Simpan SEO
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="w-full md:w-[360px] lg:w-[400px] bg-zinc-900/50 p-6 md:p-8 lg:p-10 flex flex-col relative z-10 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Preview</h3>
              <Share2 className="w-4 h-4 text-white/30" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent blur-xl pointer-events-none" />
              
              {/* Social Card Mockup */}
              <div className="w-full bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group transform hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-[1.91/1] w-full bg-zinc-800 relative overflow-hidden">
                {displayImage ? (
                  <img src={displayImage} alt="SEO Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-4 md:p-5">
                <p className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wide">portfo.be/{state.subdomain || 'username'}</p>
                <h4 className="text-sm md:text-base font-bold text-white mb-1.5 truncate">{displayTitle}</h4>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{displayDescription}</p>
              </div>
            </div>
            
            <div className="mt-8 text-center relative z-10">
              <p className="text-[10px] text-white/30 font-medium">Tampilan ini adalah simulasi saat link Anda dibagikan di Twitter, LinkedIn, WhatsApp, dll.</p>
            </div>
          </div>

        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
