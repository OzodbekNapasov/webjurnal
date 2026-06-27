'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { attemptLogin, storeSession } from '../../lib/auth';

/* ─── Animated background blobs ─────────────────────────────────────── */
function Blob({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none ${className}`}
    />
  );
}

/* ─── Eye icon ───────────────────────────────────────────────────────── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);

  // Ripple effect state
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  /* Ripple on button click */
  function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
    setTimeout(() => setRipple(null), 600);
  }

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
      }, 1000);

    } catch (err) {
      setLoading(false);
      setError('Tizimda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
      triggerShake();
    }
  }

  return (
    <>

      {/* ── Background ── */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0a1628 35%, #041030 65%, #060a1a 100%)',
        }}
      >
        {/* Blobs */}
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

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Centered Card ── */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-10">
        <div
          ref={cardRef}
          className={`card-anim w-full max-w-md ${shake ? 'card-shake' : ''} ${success ? 'success-ring' : ''}`}
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(255,255,255,0.10)',
            borderRadius: '28px',
            boxShadow:
              '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Card inner glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)' }}
          />

          {/* ── Logo ── */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(99,102,241,0.2) 100%)',
                border: '1.5px solid rgba(34,211,238,0.25)',
                boxShadow: '0 8px 32px rgba(6,182,212,0.2)',
              }}
            >
              {/* Stethoscope / medical icon */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="rgba(6,182,212,0.15)" />
                <path d="M13 12C13 10.895 13.895 10 15 10H17C18.105 10 19 10.895 19 12V18C19 20.761 16.761 23 14 23C11.239 23 9 20.761 9 18V15" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="26" r="3" stroke="#22D3EE" strokeWidth="2" />
                <path d="M14 29V32C14 33.657 15.343 35 17 35H23C24.657 35 26 33.657 26 32V22" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" />
                <circle cx="26" cy="19" r="3" stroke="#A5B4FC" strokeWidth="2" fill="rgba(165,180,252,0.1)" />
                <path d="M24 12L27 10L30 12" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              Xush kelibsiz
            </h1>
            <p className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.9)' }}>
              Davom etish uchun tizimga kiring
            </p>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div
              className="error-msg flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <span className="text-red-400 text-lg">⚠</span>
              <span className="text-red-300 text-sm font-medium">{error}</span>
            </div>
          )}

          {/* ── Success Banner ── */}
          {success && (
            <div
              className="error-msg flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(34,211,238,0.12)',
                border: '1px solid rgba(34,211,238,0.3)',
              }}
            >
              <span className="text-cyan-400 text-lg">✓</span>
              <span className="text-cyan-300 text-sm font-medium">Muvaffaqiyatli! Yo'naltirilmoqda…</span>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleLogin} noValidate>
            {/* Username */}
            <div className="mb-5">
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: 'rgba(148,163,184,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                Foydalanuvchi nomi
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(148,163,184,0.5)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setError(''); }}
                  placeholder="Username"
                  className={`input-field ${usernameError ? 'error' : ''}`}
                  style={{ paddingLeft: '44px' }}
                  disabled={loading || success}
                />
              </div>
              {usernameError && (
                <p className="error-msg mt-2 text-xs font-medium text-red-400">{usernameError}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-7">
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: 'rgba(148,163,184,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                Parol
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(148,163,184,0.5)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); setError(''); }}
                  placeholder="••••••••"
                  className={`input-field ${passwordError ? 'error' : ''}`}
                  style={{ paddingLeft: '44px', paddingRight: '48px' }}
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: showPassword ? 'rgba(34,211,238,0.8)' : 'rgba(148,163,184,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {passwordError && (
                <p className="error-msg mt-2 text-xs font-medium text-red-400">{passwordError}</p>
              )}
            </div>

            {/* Login button */}
            <button
              id="login-btn"
              type="submit"
              onClick={(e) => { if (!loading && !success) addRipple(e); }}
              disabled={loading || success}
              className="relative w-full overflow-hidden rounded-2xl py-4 text-base font-bold text-white transition-all duration-300"
              style={{
                background: loading || success
                  ? 'rgba(34,211,238,0.3)'
                  : 'linear-gradient(135deg, #0891b2 0%, #6366f1 100%)',
                boxShadow: loading || success
                  ? 'none'
                  : '0 8px 32px rgba(6,182,212,0.35), 0 2px 8px rgba(99,102,241,0.3)',
                transform: loading || success ? 'scale(1)' : undefined,
                cursor: loading || success ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                if (!loading && !success) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 12px 40px rgba(6,182,212,0.45), 0 4px 12px rgba(99,102,241,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !success) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 8px 32px rgba(6,182,212,0.35), 0 2px 8px rgba(99,102,241,0.3)';
                }
              }}
            >
              {/* Ripple */}
              {ripple && (
                <span
                  key={ripple.key}
                  className="ripple-span"
                  style={{ left: ripple.x, top: ripple.y }}
                />
              )}

              {/* Button content */}
              <span className="flex items-center justify-center gap-2">
                {loading && !success && <Spinner />}
                {success
                  ? '✓ Muvaffaqiyatli kirish'
                  : loading
                  ? 'Tekshirilmoqda…'
                  : 'Kirish'}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p
            className="mt-6 text-center text-xs"
            style={{ color: 'rgba(100,116,139,0.8)' }}
          >
            Tibbiyot Texnikumlari · Elektron Dars Jurnali
          </p>
        </div>
      </div>
    </>
  );
}
