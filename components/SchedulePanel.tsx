'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Info } from './Icon';

interface Lesson {
  groupId: number;
  sectionId: number;
  period: number;
  dayOfWeek: number;
  weeks: string;
  shift: number;
}

interface Group {
  id: number;
  name: string;
  tech_school?: string;
}

interface Section {
  id: number;
  name: string;
}

interface SchedulePanelProps {
  lessons: Lesson[];
  groups: Group[];
  sections: Section[];
  currentWeek: number;
  techSchool: string;
  bellSchedule?: any;
}

export default function SchedulePanel({
  lessons,
  groups,
  sections,
  currentWeek,
  techSchool,
  bellSchedule
}: SchedulePanelProps) {
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const today = new Date().getDay();
    const dayVal = today === 0 ? 7 : today;
    setCurrentDayOfWeek(dayVal);
    setSelectedDay(dayVal <= 6 ? dayVal : 1); // Default to Monday if Sunday
  }, []);

  const periodTimes: { [key: number]: { start: string; end: string } } = {
    1: { start: '08:30', end: '09:50' },
    2: { start: '10:00', end: '11:20' },
    3: { start: '11:30', end: '12:50' },
    4: { start: '13:00', end: '14:20' }
  };

  const getDayName = (day: number) => {
    const days = [
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
      'Yakshanba'
    ];
    return days[day - 1] || 'Dushanba';
  };

  // Filter lessons for the selected day of the academic week
  const filteredLessons = lessons.filter((l) => {
    if (Number(l.dayOfWeek) !== selectedDay) return false;
    const weeks = (l.weeks || '').split(',').map(Number);
    return weeks.includes(currentWeek);
  });

  // Resolve group and section details
  const resolvedLessons = filteredLessons
    .map((l) => {
      const group = groups.find((g) => g.id === l.groupId);
      const section = sections.find((s) => s.id === l.sectionId);
      return {
        ...l,
        groupName: group ? group.name : null,
        groupTechSchool: group ? group.tech_school || 'shahrisabz' : null,
        sectionName: section ? section.name : 'Tibbiyotda Axborot Texnologiyalari'
      };
    })
    .filter((l) => l.groupName !== null && l.groupTechSchool === techSchool)
    .sort((a, b) => Number(a.period) - Number(b.period));

  const showClassNotification = (groupName: string, period: number, startTime: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const roman = romanNumerals[period - 1] || period;

    try {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(`${groupName} guruhida dars boshlanmoqda!`, {
            body: `5 daqiqadan so'ng ${roman}-para darsi boshlanadi (Boshlanish vaqti: ${startTime}). Jurnalni to'ldirishni unutmang!`,
            icon: "/images/Logo.png",
            vibrate: [300, 100, 300],
            tag: `lesson-${period}-${startTime}`,
            requireInteraction: true
          } as any);
        });
      } else {
        new Notification(`${groupName} guruhida dars boshlanmoqda!`, {
          body: `5 daqiqadan so'ng ${roman}-para darsi boshlanadi (Boshlanish vaqti: ${startTime}). Jurnalni to'ldirishni unutmang!`,
          icon: "/images/Logo.png"
        });
      }
    } catch (e) {
      console.error("Error showing class notification:", e);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    // Only schedule if selectedDay is today
    const today = new Date().getDay();
    const dayVal = today === 0 ? 7 : today;
    if (selectedDay !== dayVal) return;

    const timers: NodeJS.Timeout[] = [];

    resolvedLessons.forEach((l) => {
      const bell =
        bellSchedule?.[l.shift.toString()]?.[l.period] ||
        bellSchedule?.['1']?.[l.period] ||
        periodTimes[l.period] ||
        { start: '08:30', end: '09:50' };

      const [startHour, startMin] = bell.start.split(':').map(Number);
      const targetTime = new Date();
      targetTime.setHours(startHour);
      targetTime.setMinutes(startMin - 5); // 5 minutes before start
      targetTime.setSeconds(0);
      targetTime.setMilliseconds(0);

      const delayMs = targetTime.getTime() - Date.now();

      if (delayMs > 0) {
        console.log(`Scheduling notification for ${l.groupName} in ${Math.round(delayMs / 60000)} minutes`);
        const timer = setTimeout(() => {
          showClassNotification(l.groupName, l.period, bell.start);
        }, delayMs);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [selectedDay, currentDayOfWeek, resolvedLessons, bellSchedule]);

  const isTodaySelected = selectedDay === currentDayOfWeek;

  if (!isMounted) {
    // SSR Placeholder to prevent layout shift
    return (
      <div className="mb-10 bg-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] min-h-[200px] animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-white/5 rounded-2xl w-full mb-6"></div>
      </div>
    );
  }

  return (
    <div className="mb-10 bg-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      {/* Header with Title and Week info */}
      <div className="flex items-center gap-2.5 border-b border-white/15 pb-4 mb-4">
        <span className="p-2 rounded-xl bg-white/15 border border-white/20">
          <Calendar className="w-5 h-5 text-cyan-300" />
        </span>
        <h3 className="font-extrabold text-base sm:text-lg text-white">
          {isTodaySelected
            ? `Bugungi darslaringiz (${currentWeek}-hafta)`
            : `${getDayName(selectedDay)} kungi darslar (${currentWeek}-hafta)`}
        </h3>
      </div>

      {/* Horizontal Full-Width Day Selector Tabs */}
      <div className="mb-6">
        <div className="flex w-full bg-slate-950/45 p-1 rounded-2xl border border-slate-700/30 gap-1">
          {[
            { val: 1, label: 'Du', full: 'Dushanba' },
            { val: 2, label: 'Se', full: 'Seshanba' },
            { val: 3, label: 'Ch', full: 'Chorshanba' },
            { val: 4, label: 'Pa', full: 'Payshanba' },
            { val: 5, label: 'Ju', full: 'Juma' },
            { val: 6, label: 'Sh', full: 'Shanba' }
          ].map((d) => {
            const isSel = selectedDay === d.val;
            const isToday = currentDayOfWeek === d.val;
            return (
              <button
                key={d.val}
                onClick={() => setSelectedDay(d.val)}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="hidden sm:inline">{d.full}</span>
                <span className="inline sm:hidden">{d.label}</span>
                {isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSel ? 'bg-slate-950' : 'bg-cyan-400 animate-pulse'
                    }`}
                  ></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons Cards */}
      {resolvedLessons.length === 0 ? (
        <div className="text-center py-10 text-cyan-100/70 text-xs sm:text-sm font-semibold italic flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-cyan-300 shrink-0" />
          {getDayName(selectedDay)} kuni uchun rejalashtirilgan faol darslar yo'q. Hordiq oling!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
          {resolvedLessons.map((l: any, idx: number) => {
            const bell =
              bellSchedule?.[l.shift.toString()]?.[l.period] ||
              bellSchedule?.['1']?.[l.period] ||
              periodTimes[l.period] ||
              { start: '08:30', end: '09:50' };

            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
            const roman = romanNumerals[l.period - 1] || l.period;

            return (
              <Link
                key={idx}
                href={`/journal?groupId=${l.groupId}&groupName=${encodeURIComponent(
                  l.groupName
                )}`}
                className="group relative bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl p-4 shadow-md backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/30">
                    {roman}-para
                  </span>
                  <span className="text-[10px] text-cyan-100/70 font-bold">
                    {bell.start} - {bell.end}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors truncate">
                  {l.groupName}
                </h4>
                <p className="text-[11px] text-cyan-100/70 font-semibold mt-1 truncate">
                  {l.sectionName}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-300 font-extrabold border-t border-white/15 pt-2.5">
                  <span>Jurnalni ochish</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
