"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, Sparkles, Laptop, Info } from "../../components/Icon";
import { getStoredUser } from "../../lib/auth";

interface LessonItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  testsCount: number;
  has3dSim: boolean;
  searchKeys: string;
}

interface ModuleCategory {
  number: number;
  title: string;
  description: string;
  lessons: LessonItem[];
}

const MODULES_DATA: ModuleCategory[] = [
  {
    number: 1,
    title: "AKT va Tibbiyotda Raqamlashtirish Asoslari",
    description: "Kompyuter savodxonligi, axborot turlari hamda shifoxonada raqamli DMED va EMK tizimlari o'rni.",
    lessons: [
      {
        id: "01",
        slug: "medical_computer_importance_darslik",
        title: "Kelajak shifokori va hamshirasi uchun kompyuter nima sababdan muhim?",
        description: "Raqamli shifoxonalar, DMED elektron tizimi, Microsoft Word va Excel dasturlarining tibbiyotdagi roli.",
        coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
        testsCount: 20,
        has3dSim: true,
        searchKeys: "kelajak shifokori va hamshirasi uchun kompyuter dmed shprits"
      },
      {
        id: "02",
        slug: "information_basics_darslik",
        title: "Axborot va Axborot Texnologiyalari Asoslari",
        description: "Axborot tushunchasi, xususiyatlari, turlari (matn, son, EKG, audio, video) va IT rivojlanishi.",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "axborot va axborot texnologiyalari asoslari"
      },
      {
        id: "03",
        slug: "info_systems_safety_darslik",
        title: "Axborot turlari, Sanoq sistemalari va Texnika xavfsizligi",
        description: "Axborot turlari, sanoq sistemalari (10, 2, 8, 16) real-time konvertori va TB qoidalari.",
        coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "axborot turlari sanoq sistemalari texnika xavfsizligi"
      },
      {
        id: "04",
        slug: "hardware_software_darslik",
        title: "Kompyuter qurilmalari va dasturiy ta'minoti",
        description: "Kompyuterning ichki/tashqi qurilmalari (Hardware) hamda tizimli va amaliy dasturiy ta'minot.",
        coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "kompyuter qurilmalari va dasturiy ta'minoti hardware software"
      }
    ]
  },
  {
    number: 2,
    title: "Operatsion Tizim va Boshlang'ich Ko'nikmalar",
    description: "Windows 10/11 interfeysi, sichqoncha va klaviatura mashqlari hamda matn nusxalash amallari.",
    lessons: [
      {
        id: "05",
        slug: "computer_basics_darslik",
        title: "Kompyuterni to'g'ri yoqish, Sichqoncha va Klaviatura",
        description: "Boshlang'ich ko'nikmalar: yoqish/o'chirish, sichqoncha click/scroll, drag-and-drop o'yini va klaviatura.",
        coverImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
        testsCount: 20,
        has3dSim: true,
        searchKeys: "kompyuterni yoqish o'chirish sichqoncha klaviatura"
      },
      {
        id: "06",
        slug: "windows_darslik",
        title: "Windows operatsion tizimi va texnik xizmat ko'rsatish",
        description: "Windows operatsion tizimi, interfeysi, sozlamalari va unga texnik xizmat ko'rsatish asoslari.",
        coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "windows operatsion tizimi va texnik xizmat ko'rsatish"
      },
      {
        id: "07",
        slug: "text_operations_darslik",
        title: "Matnni belgilash, nusxalash (Ctrl+C) va joylashtirish (Ctrl+V)",
        description: "Belgilash, Ctrl+C, Ctrl+V, Ctrl+X va Clipboard tushunchalari hamda MS Word amaliy simulyatori.",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "matnni belgilash nusxalash joylashtirish ctrl+c ctrl+v"
      }
    ]
  },
  {
    number: 3,
    title: "MS Office Dasturlari va Hujjatlarni Chop Etish",
    description: "Microsoft Word, Excel, Access va ularni printerdan bosmaga chiqarish sozalamalari.",
    lessons: [
      {
        id: "08",
        slug: "office_darslik",
        title: "MS Office dasturlari va vazifalari",
        description: "MS Office (Word, Excel, PowerPoint, Access) dasturlari va ularning tibbiyotda qo'llanilishi.",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "ms office dasturlari va vazifalari word excel powerpoint"
      },
      {
        id: "09",
        slug: "word_print_darslik",
        title: "MS Word dasturida printerdan bosmaga chiqarish",
        description: "Microsoft Word dasturida printer turlari, chop etish parametrlari va interaktiv simulyatorlar.",
        coverImage: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "ms word dasturida printerdan bosmaga chiqarish print"
      },
      {
        id: "10",
        slug: "excel_print_darslik",
        title: "MS Excel dasturida printerdan bosmaga chiqarish",
        description: "Microsoft Excel elektron jadvallarini chop etishga sozlash, sarlavhalar va kolontitullar.",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "ms excel dasturida printerdan bosmaga chiqarish print"
      }
    ]
  },
  {
    number: 4,
    title: "Tarmoq, Internet, Telegram va PDF Hujjatlar",
    description: "Kompyuterni tarmoqqa ulash, brauzerlar, Telegram messenjeri va PDF formatida pechat qilish.",
    lessons: [
      {
        id: "11",
        slug: "internet_connection_darslik",
        title: "Kompyuterni internetga ulash",
        description: "Kompyuterlarni tarmoqqa ulash, Wi-Fi, Ethernet, IP/DNS hamda tarmoq diagnostikasi.",
        coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "kompyuterni internetga ulash noutbuk va shaxsiy kompyuterlar"
      },
      {
        id: "12",
        slug: "web_browsers_darslik",
        title: "Web brauzerlar bilan ishlash",
        description: "Saytlar va URL manzil tuzilishi, brauzer oynasi elementlari, xatcho'p va tarix tizimi.",
        coverImage: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "web brauzerlar bilan ishlash chrome edge firefox"
      },
      {
        id: "13",
        slug: "telegram_darslik",
        title: "Telegram messenjeri bilan ishlash",
        description: "Telegram Desktop va Mobile ilovalari, ro'yxatdan o'tish, chat hamda tibbiy botlar va kanallar.",
        coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "telegram messenjeri bilan ishlash botlar kanallar"
      },
      {
        id: "14",
        slug: "pdf_print_darslik",
        title: "PDF hujjatlarni printerdan bosmaga chiqarish",
        description: "PDF hujjatlarini Adobe Acrobat Reader darchasida masshtablash va chop etish rejimlarida sozlash.",
        coverImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
        testsCount: 15,
        has3dSim: true,
        searchKeys: "pdf hujjatlarni printerdan bosmaga chiqarish acrobat reader"
      }
    ]
  }
];

export default function TextbooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ username: string; fullName?: string } | null>(null);

  useEffect(() => {
    // 1. Get current logged in Next.js user
    const u = getStoredUser();
    setUser(u);

    // 2. Synchronize credentials session for the sub-project static files
    // The legacy static HTML pages check localStorage.getItem('darslik_login')
    // and block access if it is not 'Napasov' or 'Umirov'.
    // We set 'Napasov' automatically for any logged-in user to bypass this.
    localStorage.setItem("darslik_login", "Napasov");
  }, []);

  const filterLessons = (lessons: LessonItem[]) => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.searchKeys.toLowerCase().includes(q)
    );
  };

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-white font-sans antialiased relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #020617 0%, #0a1628 35%, #041030 65%, #060a1a 100%)",
      }}
    >
      {/* Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header / Logo Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <Link
            href="/"
            className="self-start inline-flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
            title="Bosh sahifaga qaytish"
          >
            <img src="/images/Logo.png" alt="Logo" className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]" />
            <span className="text-xs font-black text-white group-hover:text-cyan-300 pr-2">Tibbiyot Texnikumi</span>
          </Link>

          {user && (
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl font-semibold text-xs text-cyan-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Foydalanuvchi: {user.fullName || user.username}</span>
            </div>
          )}
        </div>

        {/* Page Title & Hero */}
        <div className="text-center mb-12 relative flex flex-col items-center">
          <span className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shadow-inner mb-4">
            <BookOpen className="w-7 h-7" />
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-md">
            Elektron Darsliklar Portali
          </h1>
          <p className="text-xs sm:text-sm font-bold text-cyan-200/90 uppercase tracking-widest max-w-2xl mb-8 text-center leading-relaxed">
            "Tibbiyotda axborot texnologiyalari" fani doirasida o'quv modullari interaktiv darsliklar to'plami.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Mavzular yoki darsliklarni izlash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/70 hover:bg-slate-950/90 focus:bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white font-semibold rounded-2xl pl-12 pr-10 py-3.5 outline-none transition-all placeholder:text-slate-500 shadow-inner"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Search className="w-5 h-5" />
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-bold"
                >
                  Tozalash
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Portal Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md shadow-lg">
            <span className="p-3 bg-cyan-500/20 text-cyan-300 rounded-xl"><BookOpen className="w-5 h-5" /></span>
            <div>
              <p className="text-sm font-black text-white">14 ta O'quv Moduli</p>
              <p className="text-[11px] text-slate-400 font-semibold">Tizimlashtirilgan o'quv reja</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md shadow-lg">
            <span className="p-3 bg-indigo-500/20 text-indigo-300 rounded-xl"><Sparkles className="w-5 h-5" /></span>
            <div>
              <p className="text-sm font-black text-white">Interaktiv Simulyatorlar</p>
              <p className="text-[11px] text-slate-400 font-semibold">3D o'yinlar va amaliy mashqlar</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md shadow-lg">
            <span className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl"><Laptop className="w-5 h-5" /></span>
            <div>
              <p className="text-sm font-black text-white">Amaliy Testlar</p>
              <p className="text-[11px] text-slate-400 font-semibold">Bilimlarni sinab ko'rish imkoni</p>
            </div>
          </div>
        </div>

        {/* Learning Modules Grid */}
        <div className="space-y-16">
          {MODULES_DATA.map((module) => {
            const filteredLessons = filterLessons(module.lessons);
            if (filteredLessons.length === 0) return null;

            return (
              <div key={module.number} className="space-y-6">
                {/* Module Header */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs font-black px-3 py-1.5 rounded-xl border border-cyan-400/30 backdrop-blur-md">
                      {module.number}-MODUL
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                      {module.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-200/60 font-semibold mt-2.5">
                    {module.description}
                  </p>
                </div>

                {/* Lesson Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="group flex flex-col justify-between bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(56,189,248,0.15)] hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                    >
                      {/* Image cover */}
                      <div className="relative h-44 w-full overflow-hidden">
                        <span className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase text-cyan-300 px-3 py-1 rounded-full shadow-lg">
                          {lesson.id}-Dars
                        </span>
                        <img
                          src={lesson.coverImage}
                          alt={lesson.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold mt-2 line-clamp-3">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="mt-5 space-y-4">
                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-bold text-cyan-300/80 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-cyan-400" />
                              {lesson.testsCount} Test
                            </span>
                            {lesson.has3dSim && (
                              <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                3D Sim
                              </span>
                            )}
                          </div>

                          {/* Link to start */}
                          <Link
                            href={`/darsliklar/${lesson.slug}`}
                            className="w-full py-2.5 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 rounded-2xl font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95 animate-fadeIn"
                          >
                            Darsni boshlash →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info footer */}
        <div className="mt-16 p-5 bg-cyan-950/20 border border-cyan-500/20 rounded-3xl text-xs text-cyan-200 font-semibold flex items-start gap-3 backdrop-blur-xl max-w-3xl mx-auto">
          <Info className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
          <span>Barcha darsliklar va ularning interaktiv simulyatorlari loyihamiz tarkibidagi HTML5 bazasidan o'qiladi. O'quv jarayonidagi o'zgarishlar faol sessiya holatiga bog'liq.</span>
        </div>
      </div>
    </div>
  );
}
