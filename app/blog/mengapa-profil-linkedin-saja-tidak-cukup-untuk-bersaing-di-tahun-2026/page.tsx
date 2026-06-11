import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ShareButton } from '@/components/ui/ShareButton';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mengapa Profil LinkedIn Saja Tidak Cukup untuk Bersaing di Tahun 2026? | Portfo.be',
  description: 'Mengapa mengandalkan LinkedIn sebagai satu-satunya senjata untuk menarik klien atau pekerjaan impian adalah kesalahan besar di tahun 2026.',
  openGraph: {
    title: 'Mengapa Profil LinkedIn Saja Tidak Cukup di Tahun 2026?',
    description: 'Mengapa mengandalkan LinkedIn sebagai satu-satunya senjata untuk menarik klien atau pekerjaan impian adalah kesalahan besar di tahun 2026.',
    url: 'https://portfo.be/blog/mengapa-profil-linkedin-saja-tidak-cukup-untuk-bersaing-di-tahun-2026',
    siteName: 'Portfo.be',
    images: [
      {
        url: 'https://portfo.be/images/blog/linkedin-vs-portfolio.png',
        width: 1200,
        height: 630,
        alt: 'Mengapa Profil LinkedIn Saja Tidak Cukup untuk Bersaing di Tahun 2026 Illustration',
      },
    ],
    locale: 'id_ID',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mengapa Profil LinkedIn Saja Tidak Cukup di Tahun 2026?',
    description: 'Mengapa mengandalkan LinkedIn sebagai satu-satunya senjata untuk menarik klien atau pekerjaan impian adalah kesalahan besar di tahun 2026.',
    images: ['https://portfo.be/images/blog/linkedin-vs-portfolio.png'],
  },
};

export default function BlogPost() {
  return (
    <div className="font-sans min-h-screen bg-black text-white antialiased selection:bg-[#ff9e00] selection:text-black dark">
      <Navbar isDarkBg={true} />

      {/* Hero Section */}
      <header className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-white/10 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff9e00]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-[#ff9e00] transition-colors mb-8 md:mb-12">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip
          </Link>

          <div className="flex items-center gap-4 font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">
            <span className="text-[#ff9e00]">PRODUCT</span>
            <span>//</span>
            <span>11 JUN 2026</span>
            <span className="hidden md:inline">//</span>
            <span className="hidden md:inline">ARTIKEL 003</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8 text-white">
            Mengapa Profil LinkedIn Saja Tidak Cukup untuk Bersaing di Tahun 2026?
          </h1>

          {/* Hero Illustration */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mt-12 mb-8 bg-zinc-900 group">
            <div className="absolute inset-0 bg-[#ff9e00]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none mix-blend-overlay"></div>
            <Image
              src="/images/blog/linkedin-vs-portfolio.png"
              alt="Mengapa Profil LinkedIn Saja Tidak Cukup untuk Bersaing di Tahun 2026 Illustration"
              fill
              className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
              priority
            />
          </div>

          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/20 overflow-hidden relative flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-white/50">IU</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
            <div>
              <p className="font-bold font-display tracking-wide text-white uppercase">Iklilul Uyun</p>
              <p className="text-xs font-mono text-white/50 uppercase tracking-widest mt-0.5">Founder</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <article className="px-6 py-16 md:py-24 max-w-3xl mx-auto text-lg leading-relaxed text-white/80 font-sans">
        
        <p className="font-medium text-xl md:text-2xl leading-relaxed text-white mb-12">
          <strong>portfo.be</strong> – Memasuki tahun 2026 ini, cara kita mencari klien dan membangun reputasi profesional udah berubah arah. Kamu mungkin pernah bertanya-tanya kenapa penawaran harga yang kamu ajukan sering banget ditolak klien, padahal kamu merasa udah punya pengalaman yang cukup panjang di industri tersebut. Atau kenapa calon klien sering membandingkan kamu dengan kandidat lain yang secara keahlian sebenarnya masih berada jauh di bawah. Jawabannya mungkin ada pada cara kamu mempresentasikan diri di dunia maya selama ini.
        </p>

        <p className="mb-8">
          Hari ini, punya profil LinkedIn emang udah kayak hal yang wajib banget buat siapa aja. Kalau gak punya, kamu seolah gak eksis sama sekali di dunia profesional. Namun, kenyataannya mengandalkan LinkedIn sebagai satu-satunya &quot;senjata&quot; andalan buat menarik klien atau mendapatkan pekerjaan impian adalah sebuah kesalahan besar yang sering gak disadari.
        </p>

        <p className="mb-12">
          Saya merasa kalau mau dilihat sebagai ahli yang layak dibayar mahal, sekadar bagiin tautan profil media sosial itu udah gak cukup lagi buat bikin orang terkesan. Berikut adalah alasan kenapa kamu harus mulai bergerak ngebangun rumah digital atau website portofolio kamu sendiri dari sekarang.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Alasan Kenapa Semua Orang Terlihat Sama Saja di Platform Sosial</h2>

        <p className="mb-6">
          Masalah utama dari platform jejaring sosial buat karir itu sebenarnya ada pada keseragamannya yang bikin bosan. Platform semacam itu emang dirancang dari awal supaya data kamu gampang dibaca oleh sistem dan algoritma, bukan buat menonjolkan keunikan atau kreativitas yang kamu punya.
        </p>

        <p className="mb-6">
          Coba deh bayangkan, kamu adalah seorang desainer grafis dengan karya visual yang bener-bener memukau, atau seorang programmer yang udah berhasil ngebangun sistem aplikasi yang super rumit. Tapi saat klien ngebuka profil LinkedIn kamu, yang mereka lihat hanyalah kotak teks putih yang bentuknya sama persis dengan milik ratusan ribu orang lainnya di luar sana.
        </p>

        <p className="mb-12">
          Saya rasa kalau karya hebat yang udah kamu bikin susah payah itu akhirnya direduksi jadi sekadar deretan tulisan kaku atau tautan kecil yang gampang banget terlewatkan oleh mata. Akibatnya, klien jadi kesulitan buat melihat nilai lebih kamu karena secara visual, kemasan profesional kamu gak ada bedanya sama sekali dengan anak magang yang baru aja lulus kuliah kemarin sore. Kamu butuh panggung yang bisa menonjolkan siapa diri kamu sebenarnya tanpa dibatasi oleh kotak-kotak template bawaan dari media sosial.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Panggung Digital yang Penuh Gangguan dan Distraksi</h2>

        <p className="mb-6">
          Saat kamu mengirimkan tautan profil media sosial kepada calon klien potensial, kamu sebenarnya lagi ngajak mereka masuk ke dalam sebuah ruangan yang sangat bising dan penuh dengan orang jualan.
        </p>

        <p className="mb-6">
          Di saat klien lagi serius membaca daftar riwayat pekerjaan kamu, layar mereka secara bersamaan juga dipenuhi oleh berbagai macam iklan, notifikasi pesan masuk yang bunyi terus, sampai panel rekomendasi yang bertuliskan &quot;Orang yang Mungkin Anda Kenal&quot;. Sadar gak sih, rekomendasi tersebut sebenarnya gak lain adalah kompetitor kamu sendiri yang disodorkan langsung oleh platform ke depan mata klien kamu.
        </p>

        <p className="mb-12">
          Dengan kata lain, kamu dengan sukarela menyerahkan fokus klien berharga kamu kepada algoritma platform yang sama sekali gak peduli sama karir kamu. Saya selalu percaya kalau dalam proses menawarkan jasa, fokus klien itu adalah segalanya. Sekali aja perhatian mereka teralih buat ngeklik profil orang lain yang kebetulan fotonya kelihatan lebih menarik, peluang kamu buat dapetin proyek tersebut bisa hilang seketika itu juga dan susah buat ditarik kembali.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-16 mb-6 tracking-tight">Membangun Persepsi Harga Melalui Kemasan yang Eksklusif</h2>

        <p className="mb-6">
          Ada prinsip sederhana dalam dunia bisnis yang gak akan pernah berubah sampai kapan pun: nilai jual kamu di mata klien itu sangat ditentukan oleh gimana cara kamu mengemas diri.
        </p>

        <p className="mb-6">
          Seorang profesional yang dengan percaya diri mengirimkan tautan portofolio mandiri, misalnya seperti <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#ff9e00]">namakamu.com</code> atau <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#ff9e00]">portfo.be/namakamu</code>, secara otomatis bakal ngasih kesan pertama yang sangat eksklusif dan mahal di mata siapa pun yang melihatnya.
        </p>

        <p className="mb-12">
          Hal ini secara gak langsung ngirim sinyal kuat ke otak klien kalau kamu itu serius, profesional banget, dan rela berinvestasi pada nama baik kamu sendiri di dunia digital. Melalui website pribadi, kamu bisa mengendalikan penuh apa yang klien lihat pertama kali, dengan gaya visual kamu sendiri, tanpa ada gangguan iklan sama sekali di sekitarnya. Sebaliknya, kalau cuma ngirim tautan profil sosial media, secara bawah sadar lagi ngasih kesan kalau kamu masih berada di tahap pencari kerja standar pada umumnya, bukan seorang ahli atau konsultan yang siap memberikan solusi mahal buat masalah bisnis mereka.
        </p>

        <h2 className="font-display font-bold text-3xl md:text-4xl text-[#ff9e00] mt-16 mb-6 tracking-tight font-medium">Kendalikan Cerita Kamu Sendiri Lewat Portfo.be</h2>

        <p className="mb-6">
          Sebenarnya banyak banget profesional yang udah menyadari kenyataan pahit ini, tapi mereka rata-rata enggan buat bikin situs web portofolio sendiri karena ngebayangin prosesnya yang bakal super rumit. Mengurus barisan kode pemrograman, menyewa server bulanan yang mahal, sampai pusing mikirin tata letak desain yang emang terasa buang-buang waktu yang berharga, apalagi buat mereka yang bukan ahli di bidang teknologi informasi.
        </p>

        <p className="mb-6">
          Berangkat dari masalah yang sering banget saya temuin inilah, platform seperti <strong>Portfo.be</strong> akhirnya hadir buat ngasih jalan keluar yang gampang dan elegan.
        </p>

        <p className="mb-6">
          Tujuannya sederhana: Memberikan fasilitas penuh buat para pekerja kreatif dan profesional punya situs portofolio kelas atas tanpa perlu dipusingin sama urusan teknis yang bikin sakit kepala. Kamu cuma perlu berfokus nyiapin karya-karya terbaik, sementara infrastruktur di belakang layarnya udah diatur sedemikian sistem biar portofolio kamu kelihatan mahal, bersih, dan bisa diakses dengan super cepat oleh klien dari mana aja.
        </p>

        <p className="mb-12">
          Udahan deh jadi penyewa ruang di platform milik orang lain yang penuh aturan dan batasan. Buat bisa bener-bener memenangkan persaingan di industri kreatif tahun ini yang makin gila, kamu wajib banget punya panggung kamu sendiri yang bisa kamu kendalikan seratus persen mulai dari sekarang juga. Jangan biarkan karya hebat kamu tenggelam begitu aja di tengah lautan profil teks yang membosankan!
        </p>

        {/* Share / Tags */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">PORTFOLIO</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">LINKEDIN</span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono text-white/50">BRANDING</span>
          </div>
          <ShareButton
            title="Mengapa Profil LinkedIn Saja Tidak Cukup untuk Bersaing di Tahun 2026?"
            text="Mengapa mengandalkan LinkedIn sebagai satu-satunya senjata untuk menarik klien atau pekerjaan impian adalah kesalahan besar di tahun 2026."
            image="/images/blog/linkedin-vs-portfolio.png"
          />
        </div>
      </article>

      <Footer />
    </div>
  );
}
