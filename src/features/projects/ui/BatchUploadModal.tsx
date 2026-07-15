import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileImage, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBatchUpload } from '../model/useBatchUpload';
import { useProjectsState, useProjectsActions } from '@/entities/portfolio/model/useProjects';

export function BatchUploadModal({ state, actions }: { state: useProjectsState; actions: useProjectsActions }) {
  const { isBatchModalOpen, userPlan } = state;
  const { handleCloseBatchModal, fetchAllData } = actions;
  
  const { items, addFiles, removeFile, isUploading, globalProgress, startBatchUpload, resetBatch } = useBatchUpload({
    userPlan,
    onSuccess: () => {
      fetchAllData();
      setTimeout(() => {
        handleCloseBatchModal();
      }, 1500);
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal is opened/closed
  useEffect(() => {
    if (isBatchModalOpen) {
      resetBatch();
    }
  }, [isBatchModalOpen, resetBatch]);

  if (!isBatchModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const pendingCount = items.filter(i => i.status === 'pending' || i.status === 'error').length;
  const totalCount = items.length;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => !isUploading && handleCloseBatchModal()}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 relative z-10 bg-[#0a0a0a]">
          <h2 className="text-sm font-sans font-medium text-white uppercase tracking-wider flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#ff9e00]" /> Bulk Upload Projects
          </h2>
          <button 
            onClick={() => !isUploading && handleCloseBatchModal()}
            disabled={isUploading}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/5 text-white/50 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Progress Bar */}
        {isUploading && (
          <div className="h-1 w-full bg-zinc-900 overflow-hidden">
            <motion.div 
              className="h-full bg-[#ff9e00]"
              initial={{ width: 0 }}
              animate={{ width: `${globalProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Dropzone */}
          {items.length < 10 && !isUploading && (
            <div 
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border border-dashed border-white/10 hover:border-[#ff9e00]/60 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all duration-300 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-6"
            >
              <input 
                type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" 
                className="hidden" ref={fileInputRef} 
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
              />
              <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-full flex items-center justify-center text-white/30 mb-4">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-sans font-medium text-white mb-1">Click or drag photos here</h3>
              <p className="text-xs text-white/40 font-sans">JPG, PNG, WEBP up to {userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB'}. Max 10 files per batch.</p>
            </div>
          )}

          {/* Selected Files List */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-medium text-white/50 uppercase tracking-widest">
                  Selected Files ({items.length}/10)
                </span>
                {totalCount > 0 && !isUploading && (
                  <button onClick={resetBatch} className="text-[10px] text-rose-400 hover:text-rose-300 uppercase tracking-wider">
                    Clear All
                  </button>
                )}
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center shrink-0">
                    {item.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 
                    : item.status === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400" />
                    : <FileImage className="w-5 h-5 text-white/30" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium text-white truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      {item.status === 'uploading' && <span className="text-[10px] text-[#ff9e00]">Uploading...</span>}
                      {item.status === 'error' && <span className="text-[10px] text-rose-400 truncate max-w-[200px]">{item.errorMessage}</span>}
                      {item.status === 'success' && <span className="text-[10px] text-emerald-400">Ready</span>}
                    </div>
                  </div>
                  
                  {!isUploading && item.status !== 'success' && (
                    <button 
                      onClick={() => removeFile(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-end gap-3">
          <button 
            onClick={handleCloseBatchModal}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-md text-[11px] font-sans font-medium text-white/60 hover:text-white uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => startBatchUpload('photo')}
            disabled={pendingCount === 0 || isUploading}
            className="px-6 py-2.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-md text-[11px] font-sans font-medium uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
            ) : (
              `Upload ${pendingCount} Files`
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
