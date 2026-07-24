'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingScreen from '../../components/LoadingScreen';

function ScheduleContent() {
  const searchParams = useSearchParams();
  const [techSchool, setTechSchool] = useState('shahrisabz');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const ts = searchParams.get('techSchool') || 'shahrisabz';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const targetUrl = `/schedule/index.html?supabaseUrl=${encodeURIComponent(supabaseUrl)}&supabaseKey=${encodeURIComponent(supabaseKey)}&techSchool=${encodeURIComponent(ts)}`;
    window.location.href = targetUrl;
  }, [searchParams]);

  return (
    <LoadingScreen
      message="Dars jadvali sahifasiga o'tilmoqda..."
      subMessage="Mashg'ulotlar grafigi va xonalar ma'lumotlari tayyorlanmoqda"
    />
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
