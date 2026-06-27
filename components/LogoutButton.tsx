'use client';

import { useRouter, usePathname } from 'next/navigation';
import { clearSession, getStoredUser } from '../lib/auth';
import { useEffect, useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getStoredUser());
  }, []);

  // Don't render on the login page itself
  if (pathname === '/login') return null;
  if (!username) return null;

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* User chip */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
        style={{
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(148,163,184,0.9)',
        }}
      >
        <span
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold"
          style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee' }}
        >
          {username.charAt(0).toUpperCase()}
        </span>
        {username}
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
        style={{
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: 'rgba(248,113,113,0.9)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(15,23,42,0.7)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        Chiqish
      </button>
    </div>
  );
}
