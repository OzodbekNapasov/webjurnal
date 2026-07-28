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
  semesterStartDate?: string;
}

export default function SchedulePanel({
  lessons,
  groups,
  sections,
  currentWeek,
  techSchool,
  bellSchedule,
  semesterStartDate
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

  // Helper to format date in Uzbek
  const formatUzDate = (date: Date) => {
    const monthsUz = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    return `${date.getDate()}-${monthsUz[date.getMonth()]}`;
  };

  // Helper to calculate days remaining
  const getDaysRemainingText = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    
    const diff = target.getTime() - today.getTime();
    const diffDays = Math.round(diff / (24 * 60 * 60 * 1000));
    
    if (diffDays === 0) return 'Bugun';
    if (diffDays === 1) return 'Ertaga (1 kun qoldi)';
    if (diffDays > 1) return `${diffDays} kun qoldi`;
    if (diffDays === -1) return "Kecha (o'tib ketdi)";
    return `${Math.abs(diffDays)} kun oldin o'tib ketgan`;
  };

  // Get selected day calendar info
  const getSelectedDayDateInfo = () => {
    if (!semesterStartDate) return null;
    try {
      const start = new Date(semesterStartDate);
      const day = start.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + diffToMonday); // Monday of week 1
      
      const targetMon = new Date(start);
      targetMon.setDate(targetMon.getDate() + (currentWeek - 1) * 7);
      
      const targetSun = new Date(targetMon);
      targetSun.setDate(targetSun.getDate() + 6);
      
      const targetDayDate = new Date(targetMon);
      targetDayDate.setDate(targetDayDate.getDate() + (selectedDay - 1));
      
      return {
        weekStart: targetMon,
        weekEnd: targetSun,
        selectedDate: targetDayDate
      };
    } catch (e) {
      return null;
    }
  };

  const dateInfo = getSelectedDayDateInfo();

  // Helper to compress weeks (e.g. 1,2,3 -> 1-3)
  const compressWeeksList = (weeksStr: string) => {
    if (!weeksStr) return '';
    const weeks = weeksStr.split(',').map(Number).sort((a, b) => a - b);
    if (weeks.length === 0) return '';
    
    const ranges: string[] = [];
    let start = weeks[0];
    let prev = weeks[0];
    
    for (let i = 1; i < weeks.length; i++) {
      if (weeks[i] === prev + 1) {
        prev = weeks[i];
      } else {
        ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
        start = weeks[i];
        prev = weeks[i];
      }
    }
    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
    return ranges.join(', ');
  };

  // Find parallel conflicts for this techSchool
  const findConflicts = () => {
    const conflictsList: { l1: any; l2: any; commonWeeks: number[] }[] = [];
    
    const schoolLessons = lessons.map(l => {
      const group = groups.find(g => g.id === l.groupId);
      return {
        ...l,
        groupName: group ? group.name : 'Noma\'lum',
        school: group ? group.tech_school || 'shahrisabz' : 'shahrisabz'
      };
    }).filter(l => l.school === techSchool);

    for (let i = 0; i < schoolLessons.length; i++) {
      for (let j = i + 1; j < schoolLessons.length; j++) {
        const l1 = schoolLessons[i];
        const l2 = schoolLessons[j];

        if (
          l1.dayOfWeek === l2.dayOfWeek &&
          l1.period === l2.period &&
          l1.shift === l2.shift
        ) {
          const w1 = (l1.weeks || '').split(',').map(Number);
          const w2 = (l2.weeks || '').split(',').map(Number);
          const commonWeeks = w1.filter(w => w2.includes(w));

          if (commonWeeks.length > 0) {
            conflictsList.push({ l1, l2, commonWeeks });
          }
        }
      }
    }
    return conflictsList;
  };

  const conflicts = findConflicts();

  // Filter lessons for the selected day of the academic week
  const filteredLessons = lessons.filter((l) => {
    if (Number(l.dayOfWeek) !== selectedDay) return false;
    const weeks = (l.weeks || '').split(',').map(Number);
    const isCurrent = weeks.includes(currentWeek);
    const isFuture = Math.min(...weeks) > currentWeek;
    return isCurrent || isFuture;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/15 pb-4 mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-white/15 border border-white/20">
            <Calendar className="w-5 h-5 text-cyan-300" />
          </span>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              {isTodaySelected
                ? `Bugungi darslaringiz (${currentWeek}-hafta)`
                : `${getDayName(selectedDay)} kungi darslar (${currentWeek}-hafta)`}
            </h3>
            {dateInfo && (
              <p className="text-xs text-cyan-200/70 font-semibold mt-0.5">
                Oraliq: {formatUzDate(dateInfo.weekStart)} - {formatUzDate(dateInfo.weekEnd)}
              </p>
            )}
          </div>
        </div>

        {dateInfo && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-cyan-300">
            <span>Sana: {formatUzDate(dateInfo.selectedDate)}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-450 animate-pulse"></span>
            <span className="text-white bg-cyan-600/35 px-2 py-0.5 rounded-md">{getDaysRemainingText(dateInfo.selectedDate)}</span>
          </div>
        )}
      </div>

      {/* Conflicts warning alert */}
      {conflicts.length > 0 && (
        <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/50 rounded-2xl text-rose-100 text-xs shadow-xl backdrop-blur-xl">
          <h4 className="font-extrabold text-rose-300 text-sm mb-1.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            Diqqat: Parallel darslar aniqlandi!
          </h4>
          <p className="text-[11px] text-rose-200/90 mb-2 font-semibold">
            Dars jadvalida bir vaqtda parallel kelib qolgan darslar mavjud. Iltimos, o'quv bo'limiga murojaat qiling:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-bold text-[11px] text-rose-300">
            {conflicts.map((c, i) => {
              const dayName = getDayName(c.l1.dayOfWeek);
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
              const roman = romanNumerals[c.l1.period - 1] || c.l1.period;
              return (
                <li key={i}>
                  {dayName}, {roman}-para ({c.l1.shift}-smena):{' '}
                  <span className="text-white">{c.l1.groupName}</span> va{' '}
                  <span className="text-white">{c.l2.groupName}</span>{' '}
                  (Haftalar: <span className="text-cyan-300">{compressWeeksList(c.commonWeeks.join(','))}</span>)
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
                    : isToday
                    ? 'border border-cyan-400/50 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40'
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
        <div className="text-center py-10 text-cyan-100/70 text-xs sm:text-sm font-semibold italic flex items-center justify-center gap-2 border border-slate-700/60 dark:border-slate-600/50 bg-[#0e172a]/70 dark:bg-slate-900/40 rounded-2xl shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)]">
          <Info className="w-4 h-4 text-cyan-350 shrink-0" />
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

            const weeks = (l.weeks || '').split(',').map(Number);
            const minWeek = Math.min(...weeks);
            const isFuture = minWeek > currentWeek;
            const weeksRemaining = isFuture ? minWeek - currentWeek : 0;
            const isAlmostHere = isFuture && weeksRemaining <= 1;
            const isViewingToday = selectedDay === currentDayOfWeek;
            const isTodayLesson = isViewingToday && !isFuture;

            // Compute remaining days text for future lessons
            let futureLabel = '';
            if (isFuture && semesterStartDate) {
              try {
                const start = new Date(semesterStartDate);
                const day = start.getDay();
                const diffToMonday = day === 0 ? -6 : 1 - day;
                start.setDate(start.getDate() + diffToMonday);
                const targetMon = new Date(start);
                targetMon.setDate(targetMon.getDate() + (minWeek - 1) * 7);
                const targetDayDate = new Date(targetMon);
                targetDayDate.setDate(targetDayDate.getDate() + (l.dayOfWeek - 1));
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const target = new Date(targetDayDate);
                target.setHours(0, 0, 0, 0);
                const diffDays = Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
                futureLabel = `${diffDays} kun qoldi`;
              } catch (e) {
                futureLabel = `${weeksRemaining}-haftadan keyin`;
              }
            } else if (isFuture) {
              futureLabel = `${weeksRemaining}-haftadan keyin`;
            }

            // Card class based on state
            let cardClass = '';
            if (isTodayLesson) {
              cardClass = 'group relative bg-gradient-to-br from-[#0f2b4a] via-[#0a3d6b] to-[#051d36] border border-cyan-400/50 ring-1 ring-cyan-400/30 shadow-[0_0_20px_rgba(0,200,255,0.15)] hover:border-cyan-400/70 rounded-2xl p-4 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]';
            } else if (isAlmostHere) {
              // 1 hafta qolgan — hirar
              cardClass = 'group relative bg-slate-900/60 border border-dashed border-amber-500/40 rounded-2xl p-4 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] opacity-50';
            } else if (isFuture) {
              // Ko'p hafta qolgan — odatiy ko'rinish, badge bilan
              cardClass = 'group relative bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl p-4 shadow-md backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]';
            } else {
              cardClass = 'group relative bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-2xl p-4 shadow-md backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98]';
            }

            const paraBadgeCls = isTodayLesson
              ? 'bg-cyan-400/25 text-cyan-300 border-cyan-400/40'
              : isAlmostHere
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30';

            const titleCls = isTodayLesson
              ? 'text-cyan-50 group-hover:text-white'
              : isAlmostHere
              ? 'text-slate-400 group-hover:text-amber-300'
              : isFuture
              ? 'text-white group-hover:text-cyan-300'
              : 'text-white group-hover:text-cyan-300';

            const bottomBarCls = isTodayLesson
              ? 'text-cyan-300 border-cyan-400/30'
              : isAlmostHere
              ? 'text-amber-400/70 border-amber-500/20'
              : isFuture
              ? 'text-cyan-300/60 border-white/15'
              : 'text-cyan-300 border-white/15';

            return (
              <Link
                key={idx}
                href={`/journal?groupId=${l.groupId}&groupName=${encodeURIComponent(l.groupName)}`}
                className={cardClass}
              >
                {/* Today indicator dot */}
                {isTodayLesson && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,220,255,0.8)] animate-pulse" />
                )}

                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${paraBadgeCls}`}>
                    {roman}-para
                  </span>
                  <span className="text-[10px] text-cyan-100/70 font-bold">
                    {bell.start} - {bell.end}
                  </span>
                </div>

                <h4 className={`font-extrabold text-sm sm:text-base transition-colors truncate ${titleCls}`}>
                  {l.groupName}
                </h4>
                <p className="text-[11px] text-cyan-100/70 font-semibold mt-1 truncate">
                  {l.sectionName}
                </p>

                {isFuture ? (
                  <div className="mt-2.5 flex flex-col gap-1">
                    <p className={`text-[10px] font-bold ${isAlmostHere ? 'text-amber-300' : 'text-cyan-300/70'}`}>
                      {isAlmostHere ? '⏰ ' : ''}{futureLabel}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Haftalar: {compressWeeksList(l.weeks)}
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-cyan-300/80 font-bold mt-1.5">
                    Haftalar: {compressWeeksList(l.weeks)}
                  </p>
                )}

                <div className={`mt-3 flex items-center justify-between text-[11px] font-extrabold border-t pt-2.5 ${bottomBarCls}`}>
                  <span>Jurnalni ochish</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>

      )}
    </div>
  );
}
