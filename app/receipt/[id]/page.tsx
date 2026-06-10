"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useSWR(`/api/receipts/${id}`, fetcher);

  useEffect(() => {
    if (data && !data.error) {
      // Auto-trigger print dialog after a short delay so styling can apply
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-slate-800 font-mono text-xs uppercase tracking-wider">
        <p className="text-rose-600 font-bold">{data?.error || "Gagal memuat receipt"}</p>
      </div>
    );
  }

  const dateStr = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white flex justify-center text-slate-800 font-sans">
      <div className="w-full max-w-3xl bg-white p-12 print:p-0 print:shadow-none shadow-xl border border-gray-150 print:border-none text-slate-800 rounded-none">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-16 gap-8">
          <div className="text-[12px] leading-relaxed text-slate-600 font-mono">
            <h2 className="font-bold text-sm mb-1 text-slate-900 uppercase tracking-wider">
              Portfo.be, Inc.
            </h2>
            <p>Jakarta, Indonesia</p>
            <div className="mt-4">
              <p>Registration no.: 1234567890</p>
              <p>Email: support@portfo.be</p>
            </div>
          </div>
          <div className="text-right shrink-0">
             <div className="flex items-center justify-end gap-2 mb-2">
                <img src="/portfo.be.png" alt="Portfobe Logo" className="h-8 w-auto object-contain" />
             </div>
          </div>
        </div>

        {/* CUSTOMER INFO & RECEIPT INFO */}
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-8">
          <div className="text-[12px] leading-relaxed text-slate-600 font-mono">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
            <h3 className="font-bold text-slate-900 text-xs mb-0.5 uppercase tracking-wide">{data.user.fullName}</h3>
            <p>{data.user.email}</p>
            <p>{data.user.location}</p>
          </div>
          <div className="text-right text-[12px] leading-relaxed text-slate-600 font-mono">
            <p className="font-bold text-slate-900 mb-0.5">Receipt No.: {data.receiptNumber}</p>
            <p>Date of issue: {dateStr}</p>
            <div className="mt-3">
              <span className="uppercase text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none inline-block">
                 PAID
              </span>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="mb-10">
          <h3 className="font-mono font-bold uppercase tracking-wider mb-4 text-xs border-b border-slate-900 pb-2 text-slate-900">Items</h3>
          <table className="w-full text-[12px] font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="text-left py-3 font-bold uppercase tracking-wider w-full">Description</th>
                <th className="text-right py-3 font-bold uppercase tracking-wider whitespace-nowrap pl-8">Amount</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="py-5">
                  <p className="font-bold text-slate-900 mb-0.5 uppercase tracking-wider">Portfo.be {data.plan} Plan</p>
                  <p className="text-slate-500 text-[11px]">{data.durationDays >= 36500 ? "Lifetime access" : `${data.durationDays} Days access`}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Payment via {data.gateway}
                  </p>
                </td>
                <td className="py-5 text-right align-top font-bold text-slate-900 whitespace-nowrap pl-8">
                  Rp {data.amount.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center py-4 font-mono font-bold text-xs border-b border-slate-900 text-slate-900 uppercase tracking-widest">
          <p>Total paid</p>
          <p>Rp {data.amount.toLocaleString("id-ID")}</p>
        </div>

        {/* FOOTER MESSAGE */}
        <div className="mt-24 text-center text-[10px] font-mono text-slate-400 print:mt-16 leading-relaxed">
          <p>Thank you for subscribing to Portfo.be PRO.</p>
          <p>If you have any questions, contact us at support@portfo.be</p>
        </div>

      </div>
    </div>
  );
}
