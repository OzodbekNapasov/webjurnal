import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import CreateGroup from '../components/CreateGroup';
import EditGroup from '../components/EditGroup';
import SemesterManager from '../components/SemesterManager';
import MonthlyReport from '../components/MonthlyReport';

export const dynamic = 'force-dynamic';

// .env o'zgaruvchilarini o'qish (bo'shliq va carriage return belgilaridan tozalash)
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

    // .env ulanish holatini tekshirish
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
            fetchError = `Ulanish xatoligi (Failed to fetch). Tarmoq o'chirilgan yoki Supabase domeni bloklangan bo'lishi mumkin. Batafsil xato: ${err.message || String(err)}`;
            console.error(fetchError);
        }
    } else if (!isClientCreated && techSchool === 'shahrisabz') {
        fetchError = "Supabase sozlamalari (.env/Vercel) topilmadi. Iltimos, NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY kalitlarini tekshiring.";
    }

    // Guruhlarni nomi bo'yicha ajratish (chetlat va akadem guruhlar maxsus bo'limga)
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
            <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-950 py-16 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased flex flex-col justify-center items-center">
                <div className="max-w-4xl w-full">
                    {/* Hero Header */}
                    <div className="text-center mb-16 relative">
                        <div className="absolute inset-0 -top-12 flex justify-center -z-10 opacity-10">
                            <div className="w-[500px] h-[250px] bg-gradient-to-r from-blue-500 to-indigo-500 blur-3xl rounded-full"></div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
                            Tibbiyot Texnikumlari
                        </h1>
                        <p className="text-md sm:text-lg font-medium text-slate-400 uppercase tracking-widest mb-6">
                            Elektron Dars Jurnali Platformasi
                        </p>

                        <div className="inline-flex items-center gap-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-900/40 px-6 py-3 rounded-2xl font-bold transition-all duration-300">
                            <span className="text-xl">🩺</span>
                            <span>Tibbiyotda Axborot Texnologiyalari fani jurnallari</span>
                        </div>
                    </div>

                    {/* School Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

                        {/* Shahrisabz Card */}
                        <Link
                            href="/?techSchool=shahrisabz"
                            className="group relative bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-slate-800/60 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col justify-between items-center text-center h-[340px]"
                        >
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10"></div>

                            <div className="w-16 h-16 rounded-2xl bg-blue-950/50 border border-blue-900/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                🏛️
                            </div>

                            <div className="my-4">
                                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-400 transition-colors duration-200">
                                    Shahrisabz Tibbiyot Texnikumi
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-2.5 leading-relaxed">
                                    Shahrisabz filiali guruhlari, talabalar ro'yxati va dars jurnali platformasi.
                                </p>
                            </div>

                            <span className="w-full py-3 bg-blue-600 group-hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/10 text-center">
                                Kirish →
                            </span>
                        </Link>

                        {/* Ibn Sino Card */}
                        <Link
                            href="/?techSchool=ibn_sino"
                            className="group relative bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-slate-800/60 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between items-center text-center h-[340px]"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10"></div>

                            <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-900/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                🌿
                            </div>

                            <div className="my-4">
                                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors duration-200">
                                    IBN SINO Tibbiyot Texnikumi
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-2.5 leading-relaxed">
                                    Ibn Sino filiali guruhlari, talabalar ro'yxati va dars jurnali platformasi.
                                </p>
                            </div>

                            <span className="w-full py-3 bg-emerald-600 group-hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm transition-colors shadow-lg shadow-emerald-500/10 text-center">
                                Kirish →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Define dynamic properties based on the selected school
    const isIbnSino = techSchool === 'ibn_sino';
    const schoolTitle = isIbnSino ? "Ibn Sino Tibbiyot Texnikumi" : "Shahrisabz Tibbiyot Texnikumi";
    const headerBgGradient = isIbnSino ? "from-emerald-500 to-teal-500" : "from-blue-500 to-indigo-500";
    const titleTextGradient = isIbnSino ? "from-white via-slate-200 to-emerald-400" : "from-white via-slate-200 to-blue-400";
    const themeBtnClass = isIbnSino ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20";
    const themeBtnIcon = isIbnSino ? "🌿" : "💻";

    // 2. UNIFIED DYNAMIC DASHBOARD
    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased">
            <div className="max-w-6xl mx-auto">

                {/* Hero Header */}
                <div className="text-center mb-12 relative flex flex-col items-center">
                    <div className="absolute inset-0 -top-12 flex justify-center -z-10 opacity-10">
                        <div className={`w-[500px] h-[250px] bg-gradient-to-r ${headerBgGradient} blur-3xl rounded-full`}></div>
                    </div>

                    {/* Logo */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src="/images/Logo.png"
                            alt="Logo"
                            className="h-48 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <h1 className={`text-4xl sm:text-5xl font-black tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r ${titleTextGradient}`}>
                        {schoolTitle}
                    </h1>
                    <p className="text-md sm:text-lg font-medium text-slate-400 uppercase tracking-widest mb-6">
                        Elektron Dars Jurnali Platformasi
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <div className={`inline-flex items-center gap-2.5 text-white px-5 h-[46px] rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] ${themeBtnClass}`}>
                            <span className="text-xl">{themeBtnIcon}</span>
                            <span>Fan: Tibbiyotda Axborot Texnologiyalari</span>
                        </div>
                        <MonthlyReport techSchool={techSchool} />
                    </div>

                    {/* Custom PWA Install Button */}
                    <div id="pwa-install-container" className="hidden mt-4">
                        <button 
                            id="pwa-install-btn"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
                        >
                            <span>📥</span>
                            <span>Dastur sifatda o'rnatish</span>
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {fetchError && (
                    <div className="mb-10 p-6 bg-rose-950/20 border border-rose-900/50 rounded-3xl text-rose-200 text-sm shadow-sm">
                        <h3 className="font-extrabold text-rose-300 text-base mb-1 flex items-center gap-1.5">
                            ⚠️ Ma'lumotlar bazasidan guruhlarni yuklab bo'lmadi
                        </h3>
                        <p className="font-semibold text-rose-400/90 mb-4">{fetchError}</p>

                        <div className="bg-slate-950/40 p-4 rounded-2xl border border-rose-900/30 space-y-2 text-xs text-rose-300 leading-relaxed font-semibold">
                            <p className="text-rose-200 font-bold">Diagnostika bo'yicha tavsiyalar:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    Server tomonida ma'lumotlarni olishda xatolik yuz berdi. Supabase loyihangiz faol holatdaligini va ulanish kalitlari to'g'riligini tekshiring.
                                </li>
                                <li>
                                    Loyiha terminalini butunlay o'chirib, <code className="bg-slate-900 px-1 py-0.5 rounded font-mono font-bold text-slate-200 text-[10px]">npm run dev</code> ni qaytadan ishga tushiring.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Guruhlar ro'yxati sarlavhasi */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-6 w-1.5 bg-blue-500 rounded-full"></div>
                    <h2 className="text-xl font-extrabold text-white">Guruhlar ro'yxati</h2>
                </div>

                {/* 3 Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Column 1: Hamshiralik 3 yillik */}
                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800/60 hover:border-blue-500/40 hover:shadow-blue-500/5 transition-all duration-300">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-5">
                            <h3 className="font-extrabold text-blue-400 text-base">Hamshiralik ishi (3 yilliklar)</h3>
                            <span className="bg-blue-950/40 text-blue-300 text-xs px-2.5 py-1 rounded-full font-bold border border-blue-900/40">
                                {hamshiralik3.length} guruh
                            </span>
                        </div>
                        <div className="space-y-3">
                            {hamshiralik3.length > 0 ? (
                                hamshiralik3.map((g: any) => (
                                    <div key={g.id} className="flex items-center gap-1.5">
                                        <Link
                                            href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                            className="flex-1 flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-blue-950/20 border border-slate-800/60 hover:border-blue-900/50 rounded-2xl font-bold text-sm transition-all duration-200 text-slate-300 hover:text-blue-400 shadow-sm hover:shadow group"
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                                {g.name}
                                            </span>
                                            <span className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors">→</span>
                                        </Link>
                                        <SemesterManager groupId={g.id} groupName={g.name} accentColor="blue" />
                                        <EditGroup group={g} accentColor="blue" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 font-medium">Guruhlar topilmadi</p>
                            )}
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-800/40">
                            <CreateGroup
                                defaultDirection="3 yillik"
                                techSchool={techSchool}
                                buttonText="Guruh qo'shish"
                                buttonClassName="w-full py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-900/40 hover:border-blue-500/50 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                            />
                        </div>
                    </div>

                    {/* Column 2: Hamshiralik 2 yillik */}
                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800/60 hover:border-indigo-500/40 hover:shadow-indigo-500/5 transition-all duration-300">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-5">
                            <h3 className="font-extrabold text-indigo-400 text-base">Hamshiralik ishi (2 yilliklar)</h3>
                            <span className="bg-indigo-950/40 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-bold border border-indigo-900/40">
                                {hamshiralik2.length} guruh
                            </span>
                        </div>
                        <div className="space-y-3">
                            {hamshiralik2.length > 0 ? (
                                hamshiralik2.map((g: any) => (
                                    <div key={g.id} className="flex items-center gap-1.5">
                                        <Link
                                            href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                            className="flex-1 flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-indigo-950/20 border border-slate-800/60 hover:border-indigo-900/50 rounded-2xl font-bold text-sm transition-all duration-200 text-slate-300 hover:text-indigo-400 shadow-sm hover:shadow group"
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                                {g.name}
                                            </span>
                                            <span className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">→</span>
                                        </Link>
                                        <SemesterManager groupId={g.id} groupName={g.name} accentColor="indigo" />
                                        <EditGroup group={g} accentColor="indigo" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 font-medium">Guruhlar topilmadi</p>
                            )}
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-800/40">
                            <CreateGroup
                                defaultDirection="2 yillik"
                                techSchool={techSchool}
                                buttonText="Guruh qo'shish"
                                buttonClassName="w-full py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 border border-indigo-900/40 hover:border-indigo-500/50 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                            />
                        </div>
                    </div>

                    {/* Column 3: Farmatsiya */}
                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-800/60 hover:border-emerald-500/40 hover:shadow-emerald-500/5 transition-all duration-300">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-5">
                            <h3 className="font-extrabold text-emerald-400 text-base">Farmatsiya</h3>
                            <span className="bg-emerald-950/40 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-900/40">
                                {farmatsiya.length} guruh
                            </span>
                        </div>
                        <div className="space-y-3">
                            {farmatsiya.length > 0 ? (
                                farmatsiya.map((g: any) => (
                                    <div key={g.id} className="flex items-center gap-1.5">
                                        <Link
                                            href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                            className="flex-1 flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-emerald-950/20 border border-slate-800/60 hover:border-emerald-900/50 rounded-2xl font-bold text-sm transition-all duration-200 text-slate-300 hover:text-emerald-400 shadow-sm hover:shadow group"
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                                {g.name}
                                            </span>
                                            <span className="text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">→</span>
                                        </Link>
                                        <SemesterManager groupId={g.id} groupName={g.name} accentColor="emerald" />
                                        <EditGroup group={g} accentColor="emerald" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 font-medium">Guruhlar topilmadi</p>
                            )}
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-800/40">
                            <CreateGroup
                                defaultDirection="farmatsiya"
                                techSchool={techSchool}
                                buttonText="Guruh qo'shish"
                                buttonClassName="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                            />
                        </div>
                    </div>

                </div>

                {/* Maxsus bo'limlar */}
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-6 w-1.5 bg-rose-500 rounded-full"></div>
                        <h2 className="text-xl font-extrabold text-white">Maxsus bo'limlar</h2>
                    </div>

                    {maxsusGroups.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm font-medium bg-slate-900/30 rounded-3xl border border-slate-800/40">
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
                                        className={`backdrop-blur-md p-6 rounded-3xl shadow-xl border transition-all duration-300 ${isChetlat
                                            ? 'bg-rose-950/10 border-rose-900/40 hover:border-rose-500/50 hover:shadow-rose-500/5'
                                            : 'bg-amber-950/10 border-amber-900/40 hover:border-amber-500/50 hover:shadow-amber-500/5'
                                            }`}
                                    >
                                        {/* Karta sarlavhasi */}
                                        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${isChetlat ? 'border-rose-900/40' : 'border-amber-900/40'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{isChetlat ? '🚫' : '📚'}</span>
                                                <h3 className={`font-extrabold text-base ${isChetlat ? 'text-rose-400' : 'text-amber-400'
                                                    }`}>{g.name}</h3>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${isChetlat
                                                ? 'bg-rose-950/40 text-rose-300 border-rose-900/40'
                                                : 'bg-amber-950/40 text-amber-300 border-amber-900/40'
                                                }`}>
                                                {isChetlat ? "Chetlatilganlar" : "Akademik ta'til"}
                                            </span>
                                        </div>

                                        {/* Guruhga kirish tugmasi */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-1.5">
                                                <Link
                                                    href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                                    className={`flex-1 flex items-center justify-between p-3.5 border rounded-2xl font-bold text-sm transition-all duration-200 shadow-sm hover:shadow group ${isChetlat
                                                        ? 'bg-slate-950/40 hover:bg-rose-950/20 border-slate-800/60 hover:border-rose-900/50 text-slate-300 hover:text-rose-400'
                                                        : 'bg-slate-950/40 hover:bg-amber-950/20 border-slate-800/60 hover:border-amber-900/50 text-slate-300 hover:text-amber-400'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                                        Talabalar ro'yxatini ko'rish
                                                    </span>
                                                    <span className={`text-xs transition-colors ${isChetlat ? 'text-slate-500 group-hover:text-rose-400' : 'text-slate-500 group-hover:text-amber-400'
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