'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { attemptLogin, storeSession } from '../../lib/auth';
import { AlertCircle, CheckCircle, User, Lock } from '../../components/Icon';

/* ─── Animated background blobs ─────────────────────────────────────── */
function Blob({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none ${className}`}
    />
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─── Main Login Page ────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);

  /* Shake animation */
  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }

  /* Form validation */
  function validate() {
    let valid = true;
    if (!username.trim()) {
      setUsernameError('Foydalanuvchi nomi kiritilmagan');
      valid = false;
    } else {
      setUsernameError('');
    }
    if (!password.trim()) {
      setPasswordError('Parol kiritilmagan');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  }

  /* Handle login submit */
  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const redirect = await attemptLogin(username.trim(), password);

      if (!redirect) {
        setLoading(false);
        setError('Foydalanuvchi nomi yoki parol noto\'g\'ri');
        triggerShake();
        return;
      }

      // Success flow
      storeSession(username.trim());
      setSuccess(true);

      // Brief success delay then navigate
      setTimeout(() => {
        router.push(redirect);
      }, 800);

    } catch (err) {
      setLoading(false);
      setError('Tizimda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
      triggerShake();
    }
  }

  return (
    <>
      {/* ── Custom Dark Ocean Background ── */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0a1628 35%, #041030 65%, #060a1a 100%)',
        }}
      >
        {/* Glowing Ambient Blobs */}
        <div
          className="blob1 absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="blob2 absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="blob3 absolute top-[40%] left-[55%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Centered Glass Card ── */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-10 font-sans">
        
        {/* Card outer wrapper with spotlight ambient light */}
        <div className="relative w-full max-w-md flex flex-col items-center">
          
          {/* Top spotlight glow beam */}
          <div className="w-48 h-20 bg-cyan-400/20 blur-3xl rounded-full -mb-10 pointer-events-none" />

          {/* Main Glass Card */}
          <div
            ref={cardRef}
            className={`card-anim w-full ${shake ? 'card-shake' : ''} ${success ? 'success-ring' : ''}`}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '32px',
              boxShadow: '0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08) inset',
              padding: '40px 36px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top edge glow light */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

            {/* Title: Tizimga Kirish */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-8 tracking-wide">
              Tizimga Kirish
            </h1>

            {/* Error Notification */}
            {error && (
              <div className="error-msg flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {success && (
              <div className="error-msg flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold">
                <CheckCircle className="w-4 h-4 shrink-0 text-cyan-300" />
                <span>Muvaffaqiyatli! Yo'naltirilmoqda…</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} noValidate className="space-y-5">
              
              {/* Username Input (Pill shape with icon on right, high-contrast dark glass) */}
              <div>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setError(''); }}
                    placeholder="Foydalanuvchi nomi"
                    disabled={loading || success}
                    className="w-full px-6 py-3.5 pr-12 bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-full text-white font-bold text-sm placeholder-slate-400 outline-none transition-all shadow-inner"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-300/70 pointer-events-none">
                    <User className="w-5 h-5" />
                  </span>
                </div>
                {usernameError && (
                  <p className="error-msg mt-1.5 ml-4 text-xs font-semibold text-rose-300">{usernameError}</p>
                )}
              </div>

              {/* Password Input (Pill shape with icon on right) */}
              <div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); setError(''); }}
                    placeholder="Parol"
                    disabled={loading || success}
                    className="w-full px-6 py-3.5 pr-12 bg-slate-950/60 hover:bg-slate-950/80 focus:bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-full text-white font-bold text-sm placeholder-slate-400 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-300/70 hover:text-cyan-200 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                </div>
                {passwordError && (
                  <p className="error-msg mt-1.5 ml-4 text-xs font-semibold text-rose-300">{passwordError}</p>
                )}
              </div>

              {/* Remember me & Forgot Password (Uzbek text) */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-2 pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-cyan-400 cursor-pointer"
                  />
                  <span>Eslab qolish</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Parolni tiklash uchun tizim administratori bilan bog'laning: +998 90 123 45 67")}
                  className="text-cyan-300/90 hover:text-cyan-200 hover:underline transition-all cursor-pointer"
                >
                  Parolni unutdingizmi?
                </button>
              </div>

              {/* Radiant Cyan Gradient Button (Replaced plain white with rich cyan gradient) */}
              <button
                id="login-btn"
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-full text-base transition-all shadow-[0_10px_25px_rgba(6,182,212,0.35)] hover:shadow-[0_15px_35px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && !success ? (
                  <Spinner />
                ) : success ? (
                  <span>Kirilmoqda...</span>
                ) : (
                  <span>Kirish</span>
                )}
              </button>
            </form>

            {/* Footer / Subtext in Uzbek */}
            <p className="mt-8 text-center text-xs font-medium text-slate-400">
              Akkauntingiz yo'qmi? <span className="font-bold text-cyan-300 hover:underline cursor-pointer" onClick={() => alert("Ro'yxatdan o'tish va biriktirish uchun administratorga murojaat qiling.")}>Ro'yxatdan o'tish</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
