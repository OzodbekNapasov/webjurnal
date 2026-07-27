'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DesktopSidebar from './DesktopSidebar';
import MobileTopHeader from './MobileTopHeader';

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastType, setToastType] = useState<'offline' | 'online'>('online');

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }

    // Set initial connection status securely in useEffect
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOnline(online);
    if (!online) {
      setToastType('offline');
      setShowToast(true);
    }

    let timerId: NodeJS.Timeout;

    const handleOnline = () => {
      setIsOnline(true);
      setToastType('online');
      setShowToast(true);
      
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        setShowToast(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastType('offline');
      setShowToast(true);
      clearTimeout(timerId);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timerId);
    };
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebar_collapsed', String(nextState));
  };

  // Show left sidebar and mobile header ONLY on the main homepage ('/')
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-background text-on-background antialiased relative">
      {/* 1. Global Navigation Components (Main Page Only) */}
      {isHomePage && (
        <>
          <DesktopSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />
          <MobileTopHeader />
        </>
      )}

      {/* 2. Main Content Area */}
      <main
        className={`transition-all duration-300 ease-out ${
          isHomePage
            ? `${isCollapsed ? 'md:pl-20' : 'md:pl-64'} pt-16 md:pt-0 pb-6`
            : ''
        }`}
      >
        {children}
      </main>

      {/* 3. PWA Connection Status Toast */}
      {isMounted && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-500 ease-out transform ${
            showToast
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
          } ${
            toastType === 'offline'
              ? 'bg-slate-900/90 border-amber-500/30 text-amber-200 shadow-amber-950/40'
              : 'bg-slate-900/90 border-emerald-500/30 text-emerald-200 shadow-emerald-950/40'
          }`}
        >
          {/* Status Dot */}
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                toastType === 'offline' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                toastType === 'offline' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
          </div>

          {/* Text Message */}
          <span className="text-sm font-medium">
            {toastType === 'offline' ? (
              <>
                Offline rejimdasiz. <span className="opacity-80">Ma'lumotlar keshdan o'qilmoqda.</span>
              </>
            ) : (
              <>
                Internet aloqasi tiklandi! <span className="opacity-80">Dastur onlayn ishlamoqda.</span>
              </>
            )}
          </span>

          {/* Close button */}
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 hover:opacity-80 transition-opacity p-0.5 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
