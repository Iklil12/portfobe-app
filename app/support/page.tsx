"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookOpen, Mail, MessageSquare, Send, ArrowRight, Lock, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const isLoggedIn = false;
  const isPro = false;

  const handleSend = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please complete all fields.");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading("Sending message...");

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Message sent! We will contact you shortly.", { id: toastId });
        setFormData(prev => ({ ...prev, message: '' }));
      } else {
        toast.error("Failed to send message. Please try again.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error occurred.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const waNumber = "6283144303789";
  const waMessage = encodeURIComponent(`Hello Portfobe Admin! I am a User (Guest). I need help regarding...`);
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-[#ff9e00] selection:text-black">
      <Navbar isDarkBg={true} />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight leading-[1.15] mb-6">
            How can we <span className="text-white/40 italic font-light">Help</span> you?
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            We are ready to help you build the best portfolio. Choose the support channel that suits your plan.
          </p>
        </div>

        {/* Support channels grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* FAQ / Knowledge Base */}
          <div className="bg-zinc-950 p-8 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-[#ff9e00] group-hover:text-black transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-3">Help Center</h3>
              <p className="text-xs text-white/50 font-mono tracking-wide leading-relaxed mb-8">Find quick answers to common questions about features and settings.</p>
            </div>
            <Link href="/learn/knowledge-base" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff9e00] hover:text-white transition-colors flex items-center gap-2">
              Open Articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Email Support */}
          <div className="bg-zinc-950 p-8 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-[#ff9e00] group-hover:text-black transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-3">Send Email</h3>
              <p className="text-xs text-white/50 font-mono tracking-wide leading-relaxed mb-8">Contact our team via email for more technical or specific questions.</p>
            </div>
            <a href="mailto:ikliluluyun@ritions.com" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff9e00] hover:text-white transition-colors flex items-center gap-2">
              Send Message <Send className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* WhatsApp Priority Support */}
          <div className={`relative p-8 border transition-all flex flex-col justify-between ${isPro ? 'bg-zinc-950 border-[#ff9e00]' : 'bg-zinc-950/40 border-white/5 opacity-85'}`}>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 border flex items-center justify-center ${isPro ? 'bg-[#ff9e00]/10 border-[#ff9e00]/20 text-[#ff9e00]' : 'bg-white/5 border-white/10 text-white/40'}`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                {isPro ? (
                  <span className="text-[#ff9e00] text-[9px] font-mono uppercase tracking-widest border border-[#ff9e00]/30 px-2 py-0.5">Priority Active</span>
                ) : (
                  <span className="text-white/30 text-[9px] font-mono uppercase tracking-widest border border-white/10 px-2 py-0.5 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Locked</span>
                )}
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-3">WhatsApp Chat</h3>
              <p className="text-xs text-white/50 font-mono tracking-wide leading-relaxed mb-8">
                Get 1-on-1 support directly from our team. Exclusive for PRO users.
              </p>
            </div>

            {isPro ? (
              <a href={waUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#ff9e00] text-black text-xs font-mono font-bold uppercase tracking-widest text-center transition-all active:scale-95 hover:bg-[#ffaa22]">
                Start Chat Now
              </a>
            ) : (
              <Link href="/pricing" className="w-full py-4 border border-white/20 text-white/60 hover:text-white hover:bg-white/5 text-xs font-mono font-bold uppercase tracking-widest text-center transition-all">
                Upgrade to Pro for Access
              </Link>
            )}
          </div>

        </div>

        {/* Contact Section */}
        <div className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Business Info */}
          <div className="md:col-span-2 bg-zinc-950 p-10 border border-white/10 h-fit">
            <h4 className="text-xl font-display font-bold text-white mb-2">Business Information</h4>
            <p className="text-xs text-white/50 font-mono tracking-wide mb-8">Official contact details for Portfo.be support and inquiries.</p>
            
            <div className="space-y-6 text-sm font-mono text-white/70">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Legal Name</div>
                <strong className="text-white">Portfobe</strong>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Physical Address</div>
                <div>
                  Jl. jl.Raya Telang, Kamal, Bangkalan, jawa Timur, Indonesia 69162<br/>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Email</div>
                <a href="mailto:ikiluluyun@ritions.com" className="text-[#ff9e00] hover:underline">ikiluluyun@ritions.com</a>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Phone</div>
                <a href="tel:+6283144303789" className="text-[#ff9e00] hover:underline">+6283144303789</a>
              </div>
            </div>
          </div>

          {/* Form Support Section */}
          <div className="md:col-span-3 bg-zinc-950 p-10 border border-white/10">
            <h4 className="text-xl font-display font-bold text-white mb-2">Contact Form</h4>
            <p className="text-xs text-white/50 font-mono tracking-wide mb-8">Need further assistance? Fill out the form below and we will reply within 24-48 hours.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    className="w-full px-4 py-3 bg-black border border-white/10 text-sm font-mono text-white placeholder:text-white/20 focus:border-[#ff9e00] outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 block">Email</label>
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    className="w-full px-4 py-3 bg-black border border-white/10 text-sm font-mono text-white placeholder:text-white/20 focus:border-[#ff9e00] outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 mb-2 block">Message / Issue</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your issue in detail..."
                  className="w-full px-4 py-3 bg-black border border-white/10 text-sm font-mono text-white placeholder:text-white/20 focus:border-[#ff9e00] outline-none transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="w-full py-4 bg-[#ff9e00] text-black text-xs font-mono font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffaa22]"
              >
                {isSending ? 'Sending...' : 'Submit Form'}
              </button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

