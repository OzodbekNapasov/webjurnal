import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { GraduationCap, Activity, Download, Calendar, Info, AlertTriangle, Stethoscope, Laptop, Users, Ban, BookOpen, Settings } from '../components/Icon';
import CreateGroup from '../components/CreateGroup';
import EditGroup from '../components/EditGroup';
import SemesterManager from '../components/SemesterManager';
import MonthlyReport from '../components/MonthlyReport';
import fs from 'fs';
import path from 'path';
import DashboardClient from '../components/DashboardClient';

export const dynamic = 'force-dynamic';

const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const envKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

interface PageProps {
    searchParams?: {
        techSchool?: string;
    };
}

export default async function HomePage({ searchParams }: PageProps) {
    const techSchool = searchParams?.techSchool;

    let groups: any[] = [];
    let fetchError: string | null = null;

    let scheduleData: any = null;
    try {
        const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
        if (fs.existsSync(filePath)) {
            scheduleData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (e) {
        console.error("Failed to read schedule data.json:", e);
    }

    function getAcademicWeek(startDateStr: string) {
        if (!startDateStr) return 1;
        const start = new Date(startDateStr);
        const now = new Date();
        now.setHours(0,0,0,0);
        const diffTime = now.getTime() - start.getTime();
        if (diffTime < 0) return 1;
        const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) + 1;
        return Math.min(20, Math.max(1, diffWeeks));
    }

    const todayDate = new Date();
    let dayOfWeek = todayDate.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    const currentWeek = scheduleData?.settings?.semesterStartDate
        ? getAcademicWeek(scheduleData.settings.semesterStartDate)
        : (scheduleData?.settings?.currentWeek || 1);

    const todayLessons: any[] = [];
    if (scheduleData && Array.isArray(scheduleData.lessons)) {
        scheduleData.lessons.forEach((l: any) => {
            if (Number(l.dayOfWeek) === dayOfWeek) {
                const weeks = (l.weeks || '').split(',').map(Number);
                if (weeks.includes(currentWeek)) {
                    todayLessons.push(l);
                }
            }
        });
    }

    const periodTimes: { [key: number]: { start: string, end: string } } = {
        1: { start: "08:30", end: "09:50" },
        2: { start: "10:00", end: "11:20" },
        3: { start: "11:30", end: "12:50" },
        4: { start: "13:00", end: "14:20" }
    };

    const hasUrl = !!envUrl;
    const hasKey = !!envKey;
    const isClientCreated = hasUrl && hasKey;

    if (isClientCreated && (techSchool === 'shahrisabz' || techSchool === 'ibn_sino')) {
        try {
            const supabase = createClient(envUrl, envKey, {
                auth: { persistSession: false },
                global: {
                    fetch: (url, options) => {
                        return fetch(url, { ...options, cache: 'no-store' });
                    }
                }
            });
            const { data, error } = await supabase.from('groups').select('*');
            if (error) {
                fetchError = `Supabase xatoligi: ${error.message} (Kod: ${error.code})`;
                console.error(fetchError);
            } else {
                const allGroups = data || [];
                groups = allGroups.filter((g: any) => {
                    const school = g.tech_school || 'shahrisabz';
                    return school === techSchool;
                });
            }
        } catch (err: any) {
            fetchError = `Ulanish xatoligi (Failed to fetch). Tarmoq o'chirilgan yoki Supabase domeni bloklangan bo'lishi mumkin. Batafsil xatolik: ${err.message || String(err)}`;
            console.error(fetchError);
        }
    } else if (!isClientCreated && techSchool === 'shahrisabz') {
        fetchError = "Supabase sozlamalari (.env/Vercel) topilmadi. Iltimos, NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY kalitlarini tekshiring.";
    }

    const todayLessonsWithGroup = todayLessons.map((l: any) => {
        const group = groups.find((g: any) => g.id === l.groupId);
        const section = scheduleData?.sections?.find((s: any) => s.id === l.sectionId);
        return {
            ...l,
            groupName: group ? group.name : null,
            groupTechSchool: group ? (group.tech_school || 'shahrisabz') : null,
            sectionName: section ? section.name : 'Tibbiyotda Axborot Texnologiyalari'
        };
    }).filter(l => l.groupName !== null)
      .sort((a, b) => Number(a.period) - Number(b.period));

    function isSpecial(g: any) {
        const id = Number(g.id);
        const n = g.name?.toLowerCase() || '';
        return id === 6 || id === 7 || n.includes('chetlat') || n.includes('akadem');
    }
    const sortByName = (a: any, b: any) => (a.name || '').localeCompare(b.name || '', 'uz', { sensitivity: 'base' });
    const hamshiralik3 = groups.filter(g => g.name?.toLowerCase().includes('3 yillik') && !isSpecial(g)).sort(sortByName);
    const hamshiralik2 = groups.filter(g => g.name?.toLowerCase().includes('2 yillik') && !isSpecial(g)).sort(sortByName);
    const farmatsiya = groups.filter(g => g.name?.toLowerCase().includes('farmatsiya') && !isSpecial(g)).sort(sortByName);
    const maxsusGroups = groups.filter(g => !hamshiralik3.includes(g) && !hamshiralik2.includes(g) && !farmatsiya.includes(g)).sort(sortByName);

    // 1. LANDING PAGE: Texnikumni tanlash sahifasi
    if (!techSchool || (techSchool !== 'shahrisabz' && techSchool !== 'ibn_sino')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#051336] via-[#083a6b] to-[#04597b] py-16 px-4 sm:px-6 lg:px-8 text-white antialiased flex flex-col justify-center items-center relative overflow-hidden font-sans">
                {/* Ambient Radial Background Glows */}
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.2),transparent_70%)] pointer-events-none"></div>
                <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-[130px] rounded-full -z-10 pointer-events-none animate-pulse"></div>

                <div className="max-w-4xl w-full">
                    {/* Hero Header */}
                    <div className="text-center mb-16 relative">
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            Tibbiyot Texnikumlari
                        </h1>
                        <p className="text-sm sm:text-base font-bold text-cyan-200/90 uppercase tracking-widest mb-6">
                            Elektron Dars Jurnali Platformasi
                        </p>

                        <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-xl border border-white/30 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-cyan-950/40">
                            <Stethoscope className="w-5 h-5 text-cyan-300" />
                            <span className="text-xs sm:text-sm">Tibbiyotda Axborot Texnologiyalari fani jurnallari</span>
                        </div>
                    </div>

                    {/* School Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

                        {/* Shahrisabz Card */}
                        <Link
                            href="/?techSchool=shahrisabz"
                            className="group relative bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 hover:border-white/40 hover:bg-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(56,189,248,0.35)] transition-all duration-300 flex flex-col justify-between items-center text-center h-[340px]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                <GraduationCap className="w-8 h-8 text-cyan-300" />
                            </div>

                            <div className="my-4">
                                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors duration-200">
                                    Shahrisabz Tibbiyot Texnikumi
                                </h2>
                                <p className="text-xs sm:text-sm text-cyan-100/80 font-medium mt-2.5 leading-relaxed">
                                    Shahrisabz filiali guruhlari, talabalar ro'yxati va dars jurnali platformasi.
                                </p>
                            </div>

                            <span className="w-full py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl font-extrabold text-sm transition-all shadow-md text-center backdrop-blur-md">
                                Kirish →
                            </span>
                        </Link>

                        {/* Ibn Sino Card */}
                        <Link
                            href="/?techSchool=ibn_sino"
                            className="group relative bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 hover:border-white/40 hover:bg-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(52,211,153,0.35)] transition-all duration-300 flex flex-col justify-between items-center text-center h-[340px]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                <Activity className="w-8 h-8 text-emerald-300" />
                            </div>

                            <div className="my-4">
                                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors duration-200">
                                    IBN SINO Tibbiyot Texnikumi
                                </h2>
                                <p className="text-xs sm:text-sm text-emerald-100/80 font-medium mt-2.5 leading-relaxed">
                                    Ibn Sino filiali guruhlari, talabalar ro'yxati va dars jurnali platformasi.
                                </p>
                            </div>

                            <span className="w-full py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl font-extrabold text-sm transition-all shadow-md text-center backdrop-blur-md">
                                Kirish →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isIbnSino = techSchool === 'ibn_sino';
    const schoolTitle = isIbnSino ? "Ibn Sino Tibbiyot Texnikumi" : "Shahrisabz Tibbiyot Texnikumi";

    // 2. UNIFIED DYNAMIC DASHBOARD
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#051336] via-[#083a6b] to-[#04597b] py-12 px-4 sm:px-6 lg:px-8 text-white antialiased relative overflow-hidden font-sans">
            {/* Ambient Mesh Glows */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(56,189,248,0.2),transparent_70%)] pointer-events-none"></div>
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-[130px] rounded-full -z-10 pointer-events-none animate-pulse"></div>

            <div className="max-w-6xl mx-auto">

                {/* Hero Header */}
                <div className="text-center mb-12 relative flex flex-col items-center">

                    {/* Logo */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src="/images/Logo.png"
                            alt="Logo"
                            className="h-44 sm:h-48 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-md">
                        {schoolTitle}
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-cyan-200/90 uppercase tracking-widest mb-4">
                        Elektron Dars Jurnali Platformasi
                    </p>

                    {/* Custom PWA Install Button */}
                    <div id="pwa-install-container" className="hidden mt-5">
                        <button 
                            id="pwa-install-btn"
                            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-full font-extrabold text-xs sm:text-sm transition-all shadow-xl backdrop-blur-xl active:scale-95 cursor-pointer"
                        >
                            <Download className="w-4 h-4 text-cyan-300" />
                            <span>Dastur sifatda o'rnatish</span>
                        </button>
                    </div>
                </div>

                {/* Bugungi Darslar Paneli (Liquid Glass Card) */}
                {techSchool && (
                    <div className="mb-10 bg-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                        <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-white/15 border border-white/20"><Calendar className="w-5 h-5 text-cyan-300" /></span>
                                <h3 className="font-extrabold text-base sm:text-lg text-white">Bugungi darslaringiz ({currentWeek}-hafta)</h3>
                            </div>
                            <span className="text-[10px] sm:text-xs bg-white/20 text-white font-extrabold px-3 py-1 rounded-full border border-white/30 uppercase tracking-wider backdrop-blur-md">
                                {dayOfWeek === 1 ? "Dushanba" : dayOfWeek === 2 ? "Seshanba" : dayOfWeek === 3 ? "Chorshanba" : dayOfWeek === 4 ? "Payshanba" : dayOfWeek === 5 ? "Juma" : dayOfWeek === 6 ? "Shanba" : "Yakshanba"}
                            </span>
                        </div>

                        {todayLessonsWithGroup.length === 0 ? (
                            <div className="text-center py-8 text-cyan-100/70 text-xs sm:text-sm font-semibold italic flex items-center justify-center gap-2">
                                <Info className="w-4 h-4 text-cyan-300 shrink-0" /> Bugun siz uchun rejalashtirilgan faol darslar yo'q. Hordiq oling!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {todayLessonsWithGroup.map((l: any, idx: number) => {
                                    const bell = scheduleData?.settings?.bellSchedule?.[l.shift.toString()]?.[l.period] || 
                                                 scheduleData?.settings?.bellSchedule?.["1"]?.[l.period] || 
                                                 periodTimes[l.period] || 
                                                 { start: "08:30", end: "09:50" };
                                    
                                    const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
                                    const roman = romanNumerals[l.period - 1] || l.period;

                                    return (
                                        <Link
                                            key={idx}
                                            href={`/journal?groupId=${l.groupId}&groupName=${encodeURIComponent(l.groupName)}`}
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
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Error Banner */}
                {fetchError && (
                    <div className="mb-10 p-6 bg-rose-950/30 border border-rose-500/40 rounded-3xl text-rose-100 text-sm shadow-xl backdrop-blur-xl">
                        <h3 className="font-extrabold text-rose-300 text-base mb-1 flex items-center gap-1.5">
                            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" /> Ma'lumotlar bazasidan guruhlarni yuklab bo'lmadi
                        </h3>
                        <p className="font-semibold text-rose-300/90 mb-4">{fetchError}</p>

                        <div className="bg-black/30 p-4 rounded-2xl border border-rose-500/30 space-y-2 text-xs text-rose-200 leading-relaxed font-semibold">
                            <p className="text-rose-100 font-bold">Diagnostika bo'yicha tavsiyalar:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    Server tomonida ma'lumotlarni olishda xatolik yuz berdi. Supabase loyihangiz faol holatdaligini va ulanish kalitlari to'g'riligini tekshiring.
                                </li>
                                <li>
                                    Loyiha terminalini me'yorda qaytadan ishga tushiring.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Guruhlar ro'yxati sarlavhasi */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-6 w-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Guruhlar ro'yxati</h2>
                </div>

                {/* Distinct Rich Color Glass Grid Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Column 1: Hamshiralik 3 yillik (Cyan Sky Glass Theme) */}
                    <div className="bg-cyan-950/20 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_25px_60px_rgba(56,189,248,0.25)] transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-cyan-400/20 pb-4 mb-5">
                                <h3 className="font-extrabold text-cyan-300 text-base">Hamshiralik ishi (3 yilliklar)</h3>
                                <span className="bg-cyan-500/20 text-cyan-200 text-xs px-3 py-1 rounded-full font-extrabold border border-cyan-400/30 backdrop-blur-md">
                                    {hamshiralik3.length} guruh
                                </span>
                            </div>
                            <div className="space-y-3">
                                {hamshiralik3.length > 0 ? (
                                    hamshiralik3.map((g: any) => (
                                        <div key={g.id} className="flex items-center gap-2">
                                            <Link
                                                href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                                className="flex-1 flex items-center justify-between p-3.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 hover:border-cyan-400/40 rounded-2xl font-bold text-sm transition-all duration-200 text-white hover:text-cyan-300 shadow-sm hover:shadow group backdrop-blur-md"
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <Users className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                                                    {g.name}
                                                </span>
                                                <span className="text-xs text-cyan-200/70 group-hover:text-cyan-300 transition-colors">→</span>
                                            </Link>
                                            <SemesterManager groupId={g.id} groupName={g.name} accentColor="blue" />
                                            <EditGroup group={g} accentColor="blue" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-cyan-100/60 text-center py-4 font-medium">Guruhlar topilmadi</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-cyan-400/20">
                            <CreateGroup
                                defaultDirection="3 yillik"
                                techSchool={techSchool}
                                buttonText="Guruh qo'shish"
                                buttonClassName="w-full py-3 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md backdrop-blur-md cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Column 2: Hamshiralik 2 yillik (Electric Purple Glass Theme) */}
                    <div className="bg-purple-950/20 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-purple-400/30 hover:border-purple-400/60 hover:shadow-[0_25px_60px_rgba(168,85,247,0.25)] transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-purple-400/20 pb-4 mb-5">
                                <h3 className="font-extrabold text-purple-300 text-base">Hamshiralik ishi (2 yilliklar)</h3>
                                <span className="bg-purple-500/20 text-purple-200 text-xs px-3 py-1 rounded-full font-extrabold border border-purple-400/30 backdrop-blur-md">
                                    {hamshiralik2.length} guruh
                                </span>
                            </div>
                            <div className="space-y-3">
                                {hamshiralik2.length > 0 ? (
                                    hamshiralik2.map((g: any) => (
                                        <div key={g.id} className="flex items-center gap-2">
                                            <Link
                                                href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                                className="flex-1 flex items-center justify-between p-3.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20 hover:border-purple-400/40 rounded-2xl font-bold text-sm transition-all duration-200 text-white hover:text-purple-300 shadow-sm hover:shadow group backdrop-blur-md"
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <Users className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                                                    {g.name}
                                                </span>
                                                <span className="text-xs text-purple-200/70 group-hover:text-purple-300 transition-colors">→</span>
                                            </Link>
                                            <SemesterManager groupId={g.id} groupName={g.name} accentColor="indigo" />
                                            <EditGroup group={g} accentColor="indigo" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-purple-100/60 text-center py-4 font-medium">Guruhlar topilmadi</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-purple-400/20">
                            <CreateGroup
                                defaultDirection="2 yillik"
                                techSchool={techSchool}
                                buttonText="Guruh qo'shish"
                                buttonClassName="w-full py-3 bg-purple-500/15 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md backdrop-blur-md cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Column 3: Farmatsiya (Mint Emerald Glass Theme) */}
                    <div className="bg-emerald-950/20 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-emerald-400/30 hover:border-emerald-400/60 hover:shadow-[0_25px_60px_rgba(16,185,129,0.25)] transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-emerald-400/20 pb-4 mb-5">
                                <h3 className="font-extrabold text-emerald-300 text-base">Farmatsiya</h3>
                                <span className="bg-emerald-500/20 text-emerald-200 text-xs px-3 py-1 rounded-full font-extrabold border border-emerald-400/30 backdrop-blur-md">
                                    {farmatsiya.length} guruh
                                </span>
                            </div>
                            <div className="space-y-3">
                                {farmatsiya.length > 0 ? (
                                    farmatsiya.map((g: any) => (
                                        <div key={g.id} className="flex items-center gap-2">
                                            <Link
                                                href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                                className="flex-1 flex items-center justify-between p-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 hover:border-emerald-400/40 rounded-2xl font-bold text-sm transition-all duration-200 text-white hover:text-emerald-300 shadow-sm hover:shadow group backdrop-blur-md"
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <Users className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                                                    {g.name}
                                                </span>
                                                <span className="text-xs text-emerald-200/70 group-hover:text-emerald-300 transition-colors">→</span>
                                            </Link>
                                            <SemesterManager groupId={g.id} groupName={g.name} accentColor="emerald" />
                                            <EditGroup group={g} accentColor="emerald" />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-emerald-100/60 text-center py-4 font-medium">Guruhlar topilmadi</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-emerald-400/20">
                            <CreateGroup
                                defaultDirection="farmatsiya"
                                techSchool={techSchool}
                                buttonText="Guruh qo'shish"
                                buttonClassName="w-full py-3 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-2xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md backdrop-blur-md cursor-pointer"
                            />
                        </div>
                    </div>

                </div>

                {/* Maxsus bo'limlar (Rose & Amber Themes) */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-6 w-1.5 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(251,113,133,0.8)]"></div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Maxsus bo'limlar</h2>
                    </div>

                    {maxsusGroups.length === 0 ? (
                        <div className="text-center py-10 text-cyan-100/60 text-sm font-medium bg-white/10 rounded-3xl border border-white/15 backdrop-blur-xl">
                            Maxsus guruhlar mavjud emas. "Yangi guruh qo'shish" tugmasidan foydalaning.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {maxsusGroups.map((g: any) => {
                                const id = Number(g.id);
                                const n = g.name?.toLowerCase() || '';
                                const isChetlat = id === 6 || n.includes('chetlat');
                                return (
                                    <div
                                        key={g.id}
                                        className={`backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border transition-all duration-300 ${isChetlat
                                            ? 'bg-rose-950/25 border-rose-400/30 hover:border-rose-400/60 hover:shadow-[0_25px_60px_rgba(244,63,94,0.25)]'
                                            : 'bg-amber-950/25 border-amber-400/30 hover:border-amber-400/60 hover:shadow-[0_25px_60px_rgba(245,158,11,0.25)]'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isChetlat ? 'border-rose-400/20' : 'border-amber-400/20'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <span>{isChetlat ? <Ban className="w-5 h-5 text-rose-400" /> : <BookOpen className="w-5 h-5 text-amber-400" />}</span>
                                                <h3 className={`font-extrabold text-base ${isChetlat ? 'text-rose-300' : 'text-amber-300'
                                                    }`}>{g.name}</h3>
                                            </div>
                                            <span className={`text-xs px-3 py-1 rounded-full font-extrabold border backdrop-blur-md ${isChetlat
                                                ? 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                                                : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                                                }`}>
                                                {isChetlat ? "Chetlatilganlar" : "Akademik ta'til"}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                                    className={`flex-1 flex items-center justify-between p-3.5 border rounded-2xl font-bold text-sm transition-all duration-200 shadow-sm hover:shadow group backdrop-blur-md ${isChetlat
                                                        ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-400/20 hover:border-rose-400/40 text-white hover:text-rose-300'
                                                        : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/20 hover:border-amber-400/40 text-white hover:text-amber-300'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Users className={`w-4 h-4 group-hover:scale-110 transition-transform ${isChetlat ? 'text-rose-300' : 'text-amber-300'}`} />
                                                        Talabalar ro'yxatini ko'rish
                                                    </span>
                                                    <span className={`text-xs transition-colors ${isChetlat ? 'text-rose-300' : 'text-amber-300'
                                                        }`}>→</span>
                                                </Link>
                                                <SemesterManager groupId={g.id} groupName={g.name} accentColor={isChetlat ? 'rose' : 'amber'} />
                                                <EditGroup group={g} accentColor={isChetlat ? 'rose' : 'amber'} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {techSchool && (
                    <DashboardClient />
                )}

            </div>
            
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    let deferredPrompt;
                    const installContainer = document.getElementById('pwa-install-container');
                    const installBtn = document.getElementById('pwa-install-btn');

                    window.addEventListener('beforeinstallprompt', (e) => {
                      e.preventDefault();
                      deferredPrompt = e;
                      if (installContainer) {
                        installContainer.classList.remove('hidden');
                      }
                    });

                    if (installBtn) {
                      installBtn.addEventListener('click', async () => {
                        if (!deferredPrompt) return;
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        console.log('PWA installation outcome:', outcome);
                        deferredPrompt = null;
                        if (installContainer) {
                          installContainer.classList.add('hidden');
                        }
                      });
                    }

                    window.addEventListener('appinstalled', () => {
                      console.log('App was successfully installed');
                      if (installContainer) {
                        installContainer.classList.add('hidden');
                      }
                    });
                  })();
                `
              }}
            />
        </div>
    );
}