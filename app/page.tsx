import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

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

    if (isClientCreated && techSchool === 'shahrisabz') {
        try {
            // Supabase SDK orqali ma'lumotlarni tortish (Server Side)
            const supabase = createClient(envUrl, envKey);
            const { data, error } = await supabase.from('groups').select('*');
            if (error) {
                fetchError = `Supabase xatoligi: ${error.message} (Kod: ${error.code})`;
                console.error(fetchError);
            } else {
                groups = data || [];
            }
        } catch (err: any) {
            fetchError = `Ulanish xatoligi (Failed to fetch). Tarmoq o'chirilgan yoki Supabase domeni bloklangan bo'lishi mumkin. Batafsil xato: ${err.message || String(err)}`;
            console.error(fetchError);
        }
    } else if (!isClientCreated && techSchool === 'shahrisabz') {
        fetchError = "Supabase sozlamalari (.env/Vercel) topilmadi. Iltimos, NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY kalitlarini tekshiring.";
    }

    // Guruhlarni nomi bo'yicha ajratish (chetlat va akadem guruhlar maxsus bo'limga)
    function isSpecial(name: string) {
        const n = name?.toLowerCase() || '';
        return n.includes('chetlat') || n.includes('akadem');
    }
    const hamshiralik3 = groups.filter(g => g.name?.toLowerCase().includes('3 yillik') && !isSpecial(g.name));
    const hamshiralik2 = groups.filter(g => g.name?.toLowerCase().includes('2 yillik') && !isSpecial(g.name));
    const farmatsiya = groups.filter(g => g.name?.toLowerCase().includes('farmatsiya') && !isSpecial(g.name));
    const maxsusGroups = groups.filter(g => !hamshiralik3.includes(g) && !hamshiralik2.includes(g) && !farmatsiya.includes(g));

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

    // 2. IBN SINO DASHBOARD (Placeholder)
    if (techSchool === 'ibn_sino') {
        return (
            <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-950 py-16 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased flex flex-col justify-center items-center">
                <div className="max-w-xl w-full">
                    {/* Back Link */}
                    <div className="text-left mb-6">
                        <Link href="/" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-3 rounded-xl bg-slate-900/40 border border-slate-800/60 shadow-sm">
                            <span className="group-hover:-translate-x-0.5 transition-transform">⬅️</span>
                            Bosh sahifaga qaytish
                        </Link>
                    </div>

                    {/* Placeholder Content */}
                    <div className="text-center py-16 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/60 shadow-2xl p-8">
                        <span className="text-5xl block mb-4">🌿</span>
                        <h2 className="text-2xl font-black text-white mb-2">IBN SINO Tibbiyot Texnikumi</h2>
                        <p className="text-xs sm:text-sm text-slate-400 font-semibold mb-8 px-4 leading-relaxed">
                            Ushbu texnikum bo'yicha guruhlar ro'yxati tez kunda taqdim etiladi. Ma'lumotlar bazasi guruhlarini sozlash ishlari olib borilmoqda.
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-950/40 px-3 py-1.5 rounded-full border border-slate-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Yangi ma'lumotlar kutilmoqda
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. SHAHRISABZ DASHBOARD (Bor bo'lgan guruhlar)
    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100 antialiased">
            <div className="max-w-6xl mx-auto">


                {/* Hero Header */}
                <div className="text-center mb-12 relative">
                    <div className="absolute inset-0 -top-12 flex justify-center -z-10 opacity-10">
                        <div className="w-[500px] h-[250px] bg-gradient-to-r from-blue-500 to-indigo-500 blur-3xl rounded-full"></div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
                        Shahrisabz Tibbiyot Texnikumi
                    </h1>
                    <p className="text-md sm:text-lg font-medium text-slate-400 uppercase tracking-widest mb-6">
                        Elektron Dars Jurnali Platformasi
                    </p>

                    <div className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                        <span className="text-xl">💻</span>
                        <span>Tanlangan fan: Tibbiyotda Axborot Texnologiyalari</span>
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
                                    <Link
                                        key={g.id}
                                        href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                        className="flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-blue-950/20 border border-slate-800/60 hover:border-blue-900/50 rounded-2xl font-bold text-sm transition-all duration-200 text-slate-300 hover:text-blue-400 shadow-sm hover:shadow group"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                            {g.name}
                                        </span>
                                        <span className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors">→</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 font-medium">Guruhlar topilmadi</p>
                            )}
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
                                    <Link
                                        key={g.id}
                                        href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                        className="flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-indigo-950/20 border border-slate-800/60 hover:border-indigo-900/50 rounded-2xl font-bold text-sm transition-all duration-200 text-slate-300 hover:text-indigo-400 shadow-sm hover:shadow group"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                            {g.name}
                                        </span>
                                        <span className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">→</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 font-medium">Guruhlar topilmadi</p>
                            )}
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
                                    <Link
                                        key={g.id}
                                        href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                        className="flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-emerald-950/20 border border-slate-800/60 hover:border-emerald-900/50 rounded-2xl font-bold text-sm transition-all duration-200 text-slate-300 hover:text-emerald-400 shadow-sm hover:shadow group"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                            {g.name}
                                        </span>
                                        <span className="text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">→</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500 text-center py-4 font-medium">Guruhlar topilmadi</p>
                            )}
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
                                const n = g.name?.toLowerCase() || '';
                                const isChetlat = n.includes('chetlat');
                                return (
                                    <div
                                        key={g.id}
                                        className={`backdrop-blur-md p-6 rounded-3xl shadow-xl border transition-all duration-300 ${
                                            isChetlat
                                                ? 'bg-rose-950/10 border-rose-900/40 hover:border-rose-500/50 hover:shadow-rose-500/5'
                                                : 'bg-amber-950/10 border-amber-900/40 hover:border-amber-500/50 hover:shadow-amber-500/5'
                                        }`}
                                    >
                                        {/* Karta sarlavhasi */}
                                        <div className={`flex items-center justify-between border-b pb-4 mb-5 ${
                                            isChetlat ? 'border-rose-900/40' : 'border-amber-900/40'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{isChetlat ? '🚫' : '📚'}</span>
                                                <h3 className={`font-extrabold text-base ${
                                                    isChetlat ? 'text-rose-400' : 'text-amber-400'
                                                }`}>{g.name}</h3>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                                                isChetlat
                                                    ? 'bg-rose-950/40 text-rose-300 border-rose-900/40'
                                                    : 'bg-amber-950/40 text-amber-300 border-amber-900/40'
                                            }`}>
                                                {isChetlat ? "Chetlatilganlar" : "Akademik ta'til"}
                                            </span>
                                        </div>

                                        {/* Guruhga kirish tugmasi */}
                                        <div className="space-y-3">
                                            <Link
                                                href={`/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`}
                                                className={`flex items-center justify-between p-3.5 border rounded-2xl font-bold text-sm transition-all duration-200 shadow-sm hover:shadow group ${
                                                    isChetlat
                                                        ? 'bg-slate-950/40 hover:bg-rose-950/20 border-slate-800/60 hover:border-rose-900/50 text-slate-300 hover:text-rose-400'
                                                        : 'bg-slate-950/40 hover:bg-amber-950/20 border-slate-800/60 hover:border-amber-900/50 text-slate-300 hover:text-amber-400'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <span className="text-base group-hover:scale-110 transition-transform">👥</span>
                                                    Talabalar ro'yxatini ko'rish
                                                </span>
                                                <span className={`text-xs transition-colors ${
                                                    isChetlat ? 'text-slate-500 group-hover:text-rose-400' : 'text-slate-500 group-hover:text-amber-400'
                                                }`}>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}