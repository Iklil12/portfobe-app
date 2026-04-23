// lib/customToast.tsx
import toast from 'react-hot-toast';

interface ToastOptions {
  message: string;
  id: string; // Wajib diisi agar anti-spam berfungsi
  icon?: string; // Opsional, defaultnya pakai ikon info
}

export const showToast = ({ message, id, icon = 'fa-info-circle' }: ToastOptions) => {
  toast(
    (t) => (
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <i className={`fas ${icon} text-slate-400`}></i>
          <span>{message}</span>
        </div>
        
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 text-slate-400 hover:text-white transition-all shrink-0"
          title="Tutup"
        >
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    ),
    {
      id: id, // ID unik ini mencegah popup bertumpuk (Anti-spam)
      duration: 4000,
      style: { 
        borderRadius: '12px', 
        background: '#0a0a0a', 
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '13px',
        padding: '12px 16px',
        border: '1px solid #27272a',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        minWidth: '320px',
      }
    }
  );
};