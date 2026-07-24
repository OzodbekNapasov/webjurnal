'use client';

import { useRouter, usePathname } from 'next/navigation';
import { clearSession, getStoredUser, updateUserProfile } from '../lib/auth';
import { useEffect, useState } from 'react';
import { LogOut, User, Lock, CheckCircle, X, Save } from './Icon';

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<{ username: string; fullName?: string } | null>(null);
  
  // Profile editing modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserInfo(user);
      setUsernameInput(user.username);
      setFullNameInput(user.fullName || user.username);
    }
  }, []);

  // Profile and Logout are now built into DesktopSidebar and MobileBottomDock
  return null;

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  function openProfileModal() {
    setStatusMessage(null);
    setNewPassword('');
    setConfirmPassword('');
    if (userInfo) {
      setUsernameInput(userInfo.username);
      setFullNameInput(userInfo.fullName || userInfo.username);
    }
    setIsModalOpen(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setStatusMessage(null);

    if (!usernameInput.trim()) {
      setStatusMessage({ type: 'error', text: "Foydalanuvchi logini bo'sh bo'lishi mumkin emas!" });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: "Yangi parollar bir-biriga mos kelmadi!" });
      return;
    }

    setIsSaving(true);
    const result = await updateUserProfile(
      userInfo?.username || usernameInput,
      usernameInput.trim(),
      fullNameInput.trim(),
      newPassword.trim() ? newPassword.trim() : undefined
    );
    setIsSaving(false);

    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message || "Profil muvaffaqiyatli saqlandi!" });
      setUserInfo({ username: usernameInput.trim(), fullName: fullNameInput.trim() });
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } else {
      setStatusMessage({ type: 'error', text: result.message || "Saqlashda xatolik yuz berdi" });
    }
  }

  return (
    <>
      {/* Crisp Unified Floating Glass Capsule for Profile & Logout */}
      <div className="fixed top-4 right-4 z-50 inline-flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)] font-sans">
        
        {/* User Profile Button Segment */}
        <button
          onClick={openProfileModal}
          className="inline-flex items-center justify-center gap-2 h-[36px] px-3.5 rounded-full text-xs font-extrabold text-white hover:bg-white/20 transition-all duration-200 cursor-pointer group shrink-0"
          title="Profil sozlamalari va parolni tahrirlash"
        >
          <span className="w-6 h-6 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-black text-[11px] group-hover:scale-105 transition-transform shadow-inner shrink-0">
            {(userInfo.fullName || userInfo.username).charAt(0).toUpperCase()}
          </span>
          <span className="truncate max-w-[120px] sm:max-w-[160px]">
            {userInfo.fullName || userInfo.username}
          </span>
        </button>

        {/* Subtle Divider */}
        <div className="h-4 w-px bg-white/20 shrink-0" />

        {/* Logout Button Segment */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-1.5 h-[36px] px-3.5 rounded-full text-xs font-extrabold text-rose-300 hover:text-rose-100 hover:bg-rose-500/25 transition-all duration-200 cursor-pointer shrink-0"
          title="Tizimdan chiqish"
        >
          <LogOut className="w-4 h-4 text-rose-300 shrink-0" />
          <span>Chiqish</span>
        </button>
      </div>

      {/* User Profile Editing Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl text-white backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                  <User className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Profil sozlamalari</h3>
                  <p className="text-xs text-slate-400 font-medium">Login va parollarni tahrirlash</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Alert */}
            {statusMessage && (
              <div className={`mb-5 p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Profile Edit Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                  Foydalanuvchi logini (Username)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl text-sm font-bold text-white outline-none transition-all"
                    placeholder="Login kirituvchi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">
                  F.I.O. (Ism va Familiya)
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl text-sm font-bold text-white outline-none transition-all"
                  placeholder="Masalan: Ozodbek Napasov"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-extrabold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Yangi Parol (Ixtiyoriy)
                </label>
                <div className="space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl text-sm font-bold text-white outline-none transition-all"
                    placeholder="Parolni o'zgartirmaslik uchun bo'sh qoldiring"
                  />
                  {newPassword.length > 0 && (
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 rounded-xl text-sm font-bold text-white outline-none transition-all"
                      placeholder="Yangi parolni qayta kiriting"
                    />
                  )}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saqlanmoqda..." : "Saqlash va Sinxronlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
