import React from 'react';

export default function BillingCycleAndInvoices() {
    return (
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-white/80 font-sans text-lg">
            <p>Portfo.be offers simple, transparent pricing. If you upgrade to a Pro plan in the middle of a billing cycle, you are only charged the prorated amount for the remaining days of that cycle.</p>
            <p>All invoices and tax receipts can be downloaded directly from your Dashboard {'>'} Settings {'>'} Billing tab. If you require a custom company name or VAT number on your invoices, you can add it to your billing profile before the next cycle hits.</p>
        </div>
    );
}
