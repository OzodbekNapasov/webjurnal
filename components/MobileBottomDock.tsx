'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Laptop, BookOpen, Calendar, Settings, Clipboard } from './Icon';

export default function MobileBottomDock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const techSchool = searchParams.get('techSchool') || 'shahrisabz';

  if (pathname !== '/') return null;

  const buildUrl = (path: string) => {
    if (path.includes('darsliklar')) return path;
    return `${path}?techSchool=${encodeURIComponent(techSchool)}`;
  };

  const isHomeActive = pathname === '/';
  const isJournalActive = pathname.startsWith('/journal');
  const isScheduleActive = pathname.startsWith('/schedule');
  const isDarsliklarActive = pathname.startsWith('/darsliklar');
  const isSettingsActive = pathname.startsWith('/settings');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden select-none pb-safe">
      {/* Background Container with Curved Glass Shadow */}
      <div className="relative w-full h-[68px]">
        {/* SVG Curved Dip Dock Background (1-rasm uslubida) */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[76px] drop-shadow-[0_-10px_25px_rgba(0,0,0,0.6)] pointer-events-none"
          viewBox="0 0 375 76"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,24 
               L122,24 
               C136,24 144,56 187.5,56 
               C231,56 239,24 253,24 
               L375,24 
               L375,76 
               L0,76 Z"
            fill="#07274a"
            fillOpacity="0.95"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1"
          />
        </svg>

        {/* Center Floating Elevated Home Button (1-rasm uslubida) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-20">
          <Link
            href={buildUrl('/')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
              isHomeActive
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-[0_8px_30px_rgba(56,189,248,0.7)] scale-105 ring-4 ring-cyan-400/30'
                : 'bg-gradient-to-tr from-blue-700 to-cyan-500 text-white shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:scale-105'
            }`}
            title="Bosh sahifa"
          >
            <Laptop className="w-7 h-7 stroke-[2.5]" />
          </Link>
        </div>

        {/* Action Items Dock Bar Grid */}
        <div className="absolute inset-x-0 bottom-0 h-16 px-6 flex items-center justify-between z-10">
          {/* Left Item: Dars Jadvali */}
          <Link
            href={buildUrl('/schedule')}
            className={`flex flex-col items-center justify-center w-16 h-12 transition-all ${
              isScheduleActive ? 'text-cyan-300 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Jadval</span>
          </Link>

          {/* Center Spacer for Floating Home Circle */}
          <div className="w-16"></div>

          {/* Right Item 1: Darsliklar */}
          <Link
            href="/darsliklar/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center w-16 h-12 transition-all ${
              isDarsliklarActive ? 'text-cyan-300 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Darslik</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
