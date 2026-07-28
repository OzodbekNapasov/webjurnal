"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Laptop, BookOpen, Sparkles, Info } from "../../../components/Icon";

const LESSON_TITLES: Record<string, string> = {
  medical_computer_importance_darslik: "Kelajak shifokori va hamshirasi uchun kompyuter nima sababdan muhim?",
  information_basics_darslik: "Axborot va Axborot Texnologiyalari Asoslari",
  info_systems_safety_darslik: "Axborot turlari, Sanoq sistemalari va Texnika xavfsizligi",
  hardware_software_darslik: "Kompyuter qurilmalari va dasturiy ta'minoti",
  computer_basics_darslik: "Kompyuterni to'g'ri yoqish, Sichqoncha va Klaviatura",
  windows_darslik: "Windows operatsion tizimi va texnik xizmat ko'rsatish",
  text_operations_darslik: "Matnni belgilash, nusxalash (Ctrl+C) va joylashtirish (Ctrl+V)",
  office_darslik: "MS Office dasturlari va vazifalari",
  word_print_darslik: "MS Word dasturida printerdan bosmaga chiqarish",
  excel_print_darslik: "MS Excel dasturida printerdan bosmaga chiqarish",
  internet_connection_darslik: "Kompyuterni internetga ulash",
  web_browsers_darslik: "Web brauzerlar bilan ishlash",
  telegram_darslik: "Telegram messenjeri bilan ishlash",
  pdf_print_darslik: "PDF hujjatlarni printerdan bosmaga chiqarish"
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function LessonViewerPage({ params }: PageProps) {
  const { slug } = params;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const lessonTitle = LESSON_TITLES[slug] || "Elektron Darslik Mashg'uloti";

  useEffect(() => {
    setIsMounted(true);
    // Sync credentials session for the sub-project static files
    // Legacy static HTML pages check localStorage.getItem('darslik_login')
    // and block access if it is not 'Napasov' or 'Umirov'.
    localStorage.setItem("darslik_login", "Napasov");
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-400 mb-4"></div>
        <p className="text-sm font-semibold text-cyan-200">Darslik yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col overflow-hidden">
      {/* Dynamic Header */}
      {!isFullscreen && (
        <header
          className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-white/10 z-20 backdrop-blur-xl transition-all duration-300"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
          }}
        >
          {/* Back button */}
          <div className="flex items-center gap-3">
            <Link
              href="/darsliklar"
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Mundarijaga qaytish"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Elektron Darslik</span>
              <span className="text-xs font-bold text-slate-300 truncate max-w-[300px] md:max-w-[450px]">
                {lessonTitle}
              </span>
            </div>
          </div>

          {/* Center Logo on mobile */}
          <div className="flex sm:hidden items-center justify-center">
            <img src="/images/Logo.png" alt="Logo" className="h-7 w-auto object-contain" />
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/25 text-cyan-200 hover:bg-cyan-500/25 transition-all text-xs font-black cursor-pointer shadow-sm"
              title="Butun ekranga o'tish"
            >
              Kengaytirish
            </button>
          </div>
        </header>
      )}

      {/* Floating Exit Fullscreen Button */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-[999] px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-950 border border-cyan-400/50 text-cyan-300 text-xs font-black shadow-2xl transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Ekranni tiklash</span>
        </button>
      )}

      {/* Main Content Area (Iframe Shell) */}
      <div className="flex-1 w-full relative">
        <iframe
          src={`/darsliklar/pages/${slug}.html`}
          className="w-full h-full border-none absolute inset-0"
          title={lessonTitle}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
