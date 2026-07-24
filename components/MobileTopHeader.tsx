'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Laptop, BookOpen, Calendar, Settings, Menu, X, LogOut, User, BarChart } from './Icon';
import { clearSession, getStoredUser } from '../lib/auth';
import MonthlyReport from './MonthlyReport';

export default function MobileTopHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const techSchool = searchParams.get('techSchool') || 'shahrisabz';
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; fullName?: string } | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  // Show ONLY on main homepage ('/')
  if (pathname !== '/') return null;

  const buildUrl = (path: string) => {
    if (path.includes('darsliklar')) return path;
    return `${path}?techSchool=${encodeURIComponent(techSchool)}`;
  };

  const navItems = [
    {
      id: 'home',
      name: 'Bosh sahifa',
      href: buildUrl('/'),
      icon: Laptop,
      isActive: pathname === '/'
    },
    {
      id: 'schedule',
      name: 'Dars Jadvali',
      href: buildUrl('/schedule/index.html'),
      icon: Calendar,
      isActive: pathname.startsWith('/schedule')
    },
    {
      id: 'darsliklar',
      name: 'Elektron Darsliklar',
      href: '/darsliklar/index.html',
      target: '_blank',
      icon: BookOpen,
      isActive: pathname.startsWith('/darsliklar')
    },
    {
      id: 'settings',
      name: 'Sozlamalar',
      href: buildUrl('/settings'),
      icon: Settings,
      isActive: pathname.startsWith('/settings')
    }
  ];

  function handleLogout() {
    clearSession();
    window.location.href = '/login';
  }

  return (
    <>
      {/* 1. Fixed Mobile Top Bar (3 chiziq tugmali) */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-gradient-to-r from-[#05163d]/95 via-[#073059]/95 to-[#044663]/95 backdrop-blur-2xl border-b border-cyan-400/20 px-4 h-16 flex items-center justify-between shadow-lg select-none">
        {/* Logo & School Title */}
        <Link href={buildUrl('/')} className="flex items-center gap-2.5" title="Bosh sahifaga qaytish">
          <img
            src="/images/Logo.png"
            alt="Logo"
            className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]"
          />
          <span className="font-extrabold text-sm text-white tracking-tight">
            Tibbiyot Texnikumi
          </span>
        </Link>

        {/* Hamburger Menu Button (3 chiziq) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-cyan-300 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          title="Menyu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* 2. Slide-Down Glass Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-40 md:hidden bg-[#072448]/95 backdrop-blur-2xl border-b border-cyan-400/30 p-5 shadow-2xl animate-slideDown text-white flex flex-col gap-3.5 select-none">
          {/* Fan Nomi Info Badge */}
          <div className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center gap-2.5 text-cyan-200 text-xs font-extrabold shadow-sm">
            <Laptop className="w-4 h-4 text-cyan-300 shrink-0" />
            <span>Fan: Tibbiyotda Axborot Texnologiyalari</span>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const active = item.isActive;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.target}
                  rel={item.target ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center h-12 px-4 rounded-2xl font-bold text-sm transition-all gap-3.5 ${
                    active
                      ? 'bg-gradient-to-r from-cyan-400/30 via-blue-500/25 to-cyan-400/15 border border-cyan-300/50 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                      : 'text-cyan-100/80 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${active ? 'text-cyan-300' : 'text-cyan-200/80'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Oylik Hisobot Modal Trigger */}
            <MonthlyReport techSchool={techSchool} isCollapsed={false} />
          </div>

          {/* User Info & Logout Footer */}
          {user && (
            <div className="pt-3 border-t border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-white">
                    {user.fullName || user.username}
                  </span>
                  <span className="text-[10px] text-cyan-200/70">
                    {techSchool === 'ibn_sino' ? 'Ibn Sino' : 'Shahrisabz'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-300 text-xs font-bold transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
