'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DesktopSidebar from './DesktopSidebar';
import MobileTopHeader from './MobileTopHeader';

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
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
    </div>
  );
}
