"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useTranslations, useLocale } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useSWR(`/api/receipts/${id}`, fetcher);
  const t = useTranslations("Receipt");
  const locale = useLocale();

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
        <p className="text-rose-600 font-bold">{data?.error || t("failedLoad")}</p>
      </div>
    );
  }

  const dateStr = new Date(data.createdAt).toLocaleDateString(locale === 'id' ? "id-ID" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white flex justify-center text-slate-800 font-sans">
      <div className="w-full max-w-3xl bg-white p-12 print:p-0 print:shadow-none shadow-xl border border-gray-150 print:border-none text-slate-800 rounded-none">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-16 gap-8 border-b border-slate-100 pb-10">
          <div className="text-[13px] leading-relaxed text-slate-600 font-sans">
            <h2 className="font-bold text-lg mb-2 text-slate-900 tracking-tight">
              Portfobe
            </h2>
            <p>Jl. Raya Telang, Kamal</p>
            <p>Bangkalan, Jawa Timur, Indonesia 69162</p>
            <div className="mt-4">
              <p>Phone: +6283144303789</p>
              <p>Email: ikiluluyun@ritions.com</p>
            </div>
          </div>
          <div className="text-right shrink-0">
             <div className="flex items-center justify-end gap-2 mb-2">
                <img src="/portfo.be.webp" alt="Portfobe Logo" className="h-10 w-auto object-contain" />
             </div>
          </div>
        </div>

        {/* CUSTOMER INFO & RECEIPT INFO */}
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-8">
          <div className="text-[13px] leading-relaxed text-slate-600 font-sans">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t("billedTo")}</p>
            <h3 className="font-bold text-slate-900 text-sm mb-0.5 tracking-wide">{data.user.fullName}</h3>
            <p>{data.user.email}</p>
            <p>{data.user.location}</p>
          </div>
          <div className="text-right text-[13px] leading-relaxed text-slate-600 font-sans">
            <p className="font-bold text-slate-900 mb-0.5">{t("receiptNo", { no: data.receiptNumber })}</p>
            <p>{t("dateOfIssue", { date: dateStr })}</p>
            <div className="mt-4">
              <span className="uppercase text-[11px] font-sans font-bold tracking-widest px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full inline-block">
                 {t("paid")}
              </span>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="mb-10">
          <h3 className="font-sans font-bold uppercase tracking-wider mb-4 text-sm border-b border-slate-200 pb-2 text-slate-900">{t("itemsTitle")}</h3>
          <table className="w-full text-[13px] font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="text-left py-3 font-bold uppercase tracking-wider w-full text-xs">{t("descHeader")}</th>
                <th className="text-right py-3 font-bold uppercase tracking-wider whitespace-nowrap pl-8 text-xs">{t("amountHeader")}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="py-5">
                  <p className="font-bold text-slate-900 mb-0.5 text-sm">{t("planDesc", { plan: data.plan.toUpperCase() })}</p>
                  <p className="text-slate-500 text-[12px]">{data.durationDays >= 36500 ? t("lifetimeAccess") : t("daysAccess", { days: data.durationDays })}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {t("paymentVia", { gateway: data.gateway })}
                  </p>
                </td>
                <td className="py-5 text-right align-top font-bold text-slate-900 text-sm whitespace-nowrap pl-8">
                  Rp {data.amount.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center py-5 font-sans font-bold text-sm border-b-2 border-slate-900 text-slate-900 uppercase tracking-widest mt-4">
          <p>{t("totalPaid")}</p>
          <p>Rp {data.amount.toLocaleString("id-ID")}</p>
        </div>

        {/* FOOTER MESSAGE */}
        <div className="mt-24 text-center text-[12px] font-sans text-slate-400 print:mt-16 leading-relaxed">
          <p>{t("thankYou")}</p>
          <p>{t("contact")} ikiluluyun@ritions.com</p>
        </div>

      </div>
    </div>
  );
}
