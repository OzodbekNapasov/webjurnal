'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Laptop, 
  BookOpen, 
  Calendar, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen, 
  LogOut, 
  User,
  Edit,
  CheckCircle,
  X,
  Lock,
  Save
} from './Icon';
import { clearSession, getStoredUser, updateUserProfile } from '../lib/auth';
import MonthlyReport from './MonthlyReport';

interface DesktopSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// Mini Uzbek Month Calendar Component
function MiniUzbekCalendar({ isCollapsed }: { isCollapsed: boolean }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthNamesUz = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", 
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ];

  const weekDaysUz = ["D", "S", "Ch", "P", "J", "Sh", "Y"];

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const startDay = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayCells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) dayCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) dayCells.push(d);

  if (isCollapsed) {
    return (
      <div className="relative group flex justify-center my-1 shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/35 flex flex-col items-center justify-center text-cyan-300 shadow-md cursor-default hover:scale-105 transition-transform">
          <span className="text-[9px] font-black uppercase tracking-tighter text-cyan-300">{monthNamesUz[month].slice(0, 3)}</span>
          <span className="text-xs font-black text-white leading-none mt-0.5">{today}</span>
        </div>
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 pointer-events-none whitespace-nowrap bg-[#073059]/95 backdrop-blur-xl text-white text-xs font-extrabold px-3.5 py-2 rounded-xl border border-cyan-400/40 shadow-2xl z-50">
          {monthNamesUz[month]} {year} ({today}-kun)
        </div>
      </div>
    );
  }

  return (
    <div className="my-2.5 p-3 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-md shadow-inner text-slate-200 shrink-0">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
        <span className="text-xs font-black text-cyan-300 tracking-wide">
          {monthNamesUz[month]} {year}
        </span>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
          {today}-kun
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
        {weekDaysUz.map((wd, idx) => (
          <span key={idx} className={idx >= 5 ? 'text-amber-400/80' : ''}>{wd}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold">
        {dayCells.map((d, i) => {
          if (!d) return <span key={i} className="h-5"></span>;
          const isToday = d === today;
          return (
            <span
              key={i}
              className={`h-5.5 flex items-center justify-center rounded-md transition-all ${
                isToday
                  ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-black shadow-[0_0_10px_rgba(56,189,248,0.8)] scale-105'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function DesktopSidebar({ isCollapsed, onToggleCollapse }: DesktopSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const techSchool = searchParams.get('techSchool') || 'shahrisabz';
  const [user, setUser] = useState<{ username: string; fullName?: string } | null>(null);

  // Profile modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [inputUsername, setInputUsername] = useState('');
  const [inputFullName, setInputFullName] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    if (u) {
      setInputUsername(u.username);
      setInputFullName(u.fullName || u.username);
    }
  }, []);

  // Render sidebar ONLY on the main homepage ('/')
  if (pathname !== '/') {
    return null;
  }

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

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setProfileMsg(null);

    const res = await updateUserProfile(
      user.username,
      inputUsername,
      inputFullName,
      inputPassword
    );

    setIsSaving(false);
    if (res.success) {
      setProfileMsg({ type: 'success', text: "Profil va parol muvaffaqiyatli saqlandi!" });
      setUser({ username: inputUsername, fullName: inputFullName });
      setInputPassword('');
      setTimeout(() => {
        setIsProfileOpen(false);
        setProfileMsg(null);
      }, 1500);
    } else {
      setProfileMsg({ type: 'error', text: res.message || "Xatolik yuz berdi" });
    }
  }

  return (
    <>
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 h-screen z-40 bg-gradient-to-b from-[#05163d]/95 via-[#073059]/95 to-[#044663]/95 backdrop-blur-2xl transition-all duration-300 ease-out select-none ${
          isCollapsed ? 'w-20 px-3 py-6 items-center border-r-0 shadow-[5px_0_25px_rgba(0,0,0,0.4)]' : 'w-64 px-4 py-5 border-r border-cyan-400/20 shadow-[10px_0_35px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* 1. Header & Logo */}
        <div className={`flex flex-col mb-4 w-full ${isCollapsed ? 'items-center' : 'items-start px-1 gap-2'}`}>
          <Link
            href={buildUrl('/')}
            className={`flex items-center gap-3 group shrink-0 ${
              isCollapsed ? 'justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 shadow-md mx-auto hover:scale-105 transition-all' : 'w-full'
            }`}
            title="Bosh sahifaga qaytish"
          >
            <img
              src="/images/Logo.png"
              alt="Logo"
              className="h-9 w-auto object-contain drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)] group-hover:scale-110 transition-transform duration-300"
            />
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-black text-sm text-white tracking-tight leading-snug whitespace-nowrap group-hover:text-cyan-300 transition-colors">
                  Tibbiyot Texnikumi
                </span>
              </div>
            )}
          </Link>

          {/* Fan Nomi Info Badge */}
          {!isCollapsed && (
            <div className="mt-2 w-full px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center gap-2 text-cyan-200 text-xs font-extrabold shadow-sm">
              <Laptop className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="truncate">Fan: Tibbiyotda AT</span>
            </div>
          )}
        </div>

        {/* 2. Navigation Items & Oylik Hisobot */}
        <nav className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar py-1 w-full ${
          isCollapsed ? 'gap-3.5 items-center' : 'gap-2'
        }`}>
          {navItems.map((item) => {
            const IconComp = item.icon;
            const active = item.isActive;

            return (
              <div key={item.id} className="relative group shrink-0 w-full flex justify-center">
                <Link
                  href={item.href}
                  target={item.target}
                  rel={item.target ? 'noopener noreferrer' : undefined}
                  className={`relative flex items-center h-12 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCollapsed ? 'justify-center w-12 mx-auto' : 'px-3.5 gap-3 w-full'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-cyan-400/35 via-blue-500/25 to-cyan-400/15 border border-cyan-300/60 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                      : 'text-cyan-100/75 hover:text-white hover:bg-white/15 hover:border-white/25 border border-transparent'
                  }`}
                >
                  {/* Active Pill Glow Indicator */}
                  {active && !isCollapsed && (
                    <span className="absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-300 rounded-r-full shadow-[0_0_10px_#38bdf8] left-0"></span>
                  )}

                  <IconComp
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                      active ? 'text-cyan-300 scale-110' : 'group-hover:scale-110 text-cyan-100/80'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="whitespace-nowrap truncate tracking-wide">{item.name}</span>
                  )}
                </Link>

                {/* Collapsed Mode Pop-up Tooltip Label */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 pointer-events-none whitespace-nowrap bg-[#073059]/95 backdrop-blur-xl text-white text-xs font-extrabold px-3.5 py-2 rounded-xl border border-cyan-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>{item.name}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Oylik Hisobot Button inside Nav List */}
          <MonthlyReport techSchool={techSchool} isCollapsed={isCollapsed} />
        </nav>

        {/* 3. Uzbek Mini Calendar Widget */}
        <MiniUzbekCalendar isCollapsed={isCollapsed} />

        {/* 4. Footer Actions: User Profile & Collapse Toggle */}
        <div className={`pt-3 flex flex-col w-full shrink-0 ${
          isCollapsed ? 'gap-3 items-center border-t-0' : 'border-t border-white/10 gap-2'
        }`}>
          {/* User Info Badge (Clickable to Edit Profile) */}
          {user && (
            <div className="relative group w-full flex justify-center">
              <button
                onClick={() => setIsProfileOpen(true)}
                className={`flex items-center h-12 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-cyan-400/40 transition-all text-left cursor-pointer ${
                  isCollapsed ? 'justify-center w-12 mx-auto' : 'px-3 gap-2.5 w-full'
                }`}
                title="Profil va parolni tahrirlash"
              >
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 font-extrabold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col truncate flex-1">
                    <span className="text-xs font-extrabold text-white truncate flex items-center gap-1">
                      <span>{user.fullName || user.username}</span>
                      <Edit className="w-3 h-3 text-cyan-300 opacity-60 group-hover:opacity-100 shrink-0" />
                    </span>
                    <span className="text-[10px] text-cyan-200/70 truncate">
                      {techSchool === 'ibn_sino' ? 'Ibn Sino' : 'Shahrisabz'}
                    </span>
                  </div>
                )}

                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Chiqish"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </button>

              {/* Collapsed User Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 pointer-events-none whitespace-nowrap bg-[#073059]/95 backdrop-blur-xl text-white text-xs font-extrabold px-3 py-2 rounded-xl border border-cyan-400/40 shadow-2xl z-50 flex items-center gap-2">
                  <span>{user.fullName || user.username} (Tahrirlash)</span>
                </div>
              )}
            </div>
          )}

          {/* Minimallashtirish / Kengaytirish Tugmasi */}
          <div className="relative group w-full flex justify-center">
            <button
              onClick={onToggleCollapse}
              className={`flex items-center h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all duration-300 cursor-pointer ${
                isCollapsed ? 'justify-center w-12 mx-auto' : 'px-3 gap-2.5 w-full'
              }`}
              title={isCollapsed ? 'Kengaytirish' : 'Minimallashtirish'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-cyan-400 shrink-0" />
              )}

              {!isCollapsed && (
                <span className="text-xs font-extrabold whitespace-nowrap">Minimallashtirish</span>
              )}
            </button>

            {/* Collapsed Toggle Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-200 pointer-events-none whitespace-nowrap bg-[#073059]/95 backdrop-blur-xl text-white text-xs font-extrabold px-3.5 py-2 rounded-xl border border-cyan-400/40 shadow-2xl z-50">
                Kengaytirish ➔
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Profile Edit Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#072448]/95 border border-cyan-400/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Profilni tahrirlash</h3>
                <p className="text-xs text-cyan-200/80">Ism, login va parolni yangilang</p>
              </div>
            </div>

            {profileMsg && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 border ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                }`}
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-cyan-200 mb-1">
                  Ism va Familiya (F.I.SH)
                </label>
                <input
                  type="text"
                  required
                  value={inputFullName}
                  onChange={(e) => setInputFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-sm font-semibold"
                  placeholder="Masalan: Ozodbek Napasov"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-cyan-200 mb-1">
                  Foydalanuvchi nomi (Login)
                </label>
                <input
                  type="text"
                  required
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-sm font-semibold"
                  placeholder="Napasov"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-cyan-200 mb-1">
                  Yangi Parol (O'zgartirish shart emas)
                </label>
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 text-sm font-semibold"
                  placeholder="Eski parolni qoldirish uchun bo'sh qoldiring"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saqlanmoqda..." : "Saqlash"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
