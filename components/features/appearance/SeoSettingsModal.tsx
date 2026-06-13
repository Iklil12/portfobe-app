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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => actions.setIsSeoModalOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#111111] border border-white/10 rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* LEFT COLUMN: Controls */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0099ff]/10 text-[#0099ff] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">SEO & Social Card</h2>
                <p className="text-[11px] text-white/40">Atur tampilan link portofolio Anda di media sosial.</p>
              </div>
            </div>
            <button onClick={() => actions.setIsSeoModalOpen(false)} className="lg:hidden text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 flex-1">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Meta Title</label>
              <input 
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={fallbackTitle}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099ff] transition-colors"
              />
              <p className="text-[10px] text-white/30 text-right">{seoTitle.length}/60 karakter</p>
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/70 uppercase tracking-wider">Meta Description</label>
              <textarea 
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={fallbackDescription}
                rows={3}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0099ff] transition-colors resize-none"
              />
              <p className="text-[10px] text-white/30 text-right">{seoDescription.length}/160 karakter</p>
            </div>

          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
            <button
              onClick={() => {
                setSeoTitle('');
                setSeoDescription('');
              }}
              className="px-4 py-2 text-xs font-medium text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ke Default
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => actions.setIsSeoModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[#0099ff] hover:bg-[#0077cc] text-white text-xs font-medium rounded-lg transition-colors shadow-lg"
              >
                Simpan SEO
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="flex-1 bg-zinc-900 p-6 lg:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Live Preview</h3>
            <div className="flex gap-2">
              <Share2 className="w-4 h-4 text-white/30" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {/* Social Card Mockup */}
            <div className="w-full max-w-sm bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-[1.91/1] w-full bg-zinc-800 relative overflow-hidden">
                {displayImage ? (
                  <img src={displayImage} alt="SEO Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] text-white/40 mb-1">portfo.be/{state.subdomain || 'username'}</p>
                <h4 className="text-sm font-semibold text-white mb-1 truncate">{displayTitle}</h4>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{displayDescription}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] text-white/30">Tampilan ini adalah simulasi saat link Anda dibagikan di Twitter, LinkedIn, WhatsApp, dll.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
