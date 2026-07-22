'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingScreen from '../../components/LoadingScreen';

export const dynamic = 'force-dynamic';

function ScheduleContent() {
  const searchParams = useSearchParams();
  const [techSchool, setTechSchool] = useState('shahrisabz');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const ts = searchParams.get('techSchool') || 'shahrisabz';
    setTechSchool(ts);
  }, [searchParams]);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const iframeSrc = `/schedule/index.html?supabaseUrl=${encodeURIComponent(supabaseUrl)}&supabaseKey=${encodeURIComponent(supabaseKey)}&techSchool=${encodeURIComponent(techSchool)}`;

  if (!isMounted) {
    return (
      <LoadingScreen
        message="Dars jadvali yuklanmoqda..."
        subMessage="Mashg'ulotlar grafigi va xonalar ma'lumotlari tayyorlanmoqda"
      />
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-[#050a16]">
      <iframe 
        src={iframeSrc}
        className="w-full h-full border-none" 
        title="Dars Jadvali - O'qituvchi Portali"
      />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={
      <LoadingScreen
        message="Dars jadvali yuklanmoqda..."
        subMessage="Mashg'ulotlar grafigi va xonalar ma'lumotlari tayyorlanmoqda"
      />
    }>
      <ScheduleContent />
    </Suspense>
  );
}
