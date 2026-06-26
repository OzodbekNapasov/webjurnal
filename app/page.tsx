import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// .env o'zgaruvchilarini o'qish (bo'shliq va carriage return belgilaridan tozalash)
const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const envKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export default async function HomePage() {
    let groups: any[] = [];
    let fetchError: string | null = null;

    // .env ulanish holatini tekshirish
    const hasUrl = !!envUrl;
    const hasKey = !!envKey;
    const isClientCreated = hasUrl && hasKey;

    if (isClientCreated) {
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
    } else {
        fetchError = "Supabase sozlamalari (.env/Vercel) topilmadi. Iltimos, NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY kalitlarini tekshiring.";
    }

    // Guruhlarni nomi bo'yicha ajratish
    const hamshiralik3 = groups.filter(g => g.name?.toLowerCase().includes('3 yillik'));
    const hamshiralik2 = groups.filter(g => g.name?.toLowerCase().includes('2 yillik'));
    const farmatsiya = groups.filter(g => g.name?.toLowerCase().includes('farmatsiya'));

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

                {/* SUPABASE DIAGNOSTIKA PANELI (Ekrandagi xavfsiz nazorat) */}
                <div className="mb-10 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                    <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2 border-b border-slate-800/60 pb-3">
                        ⚙️ Supabase Ulanish Diagnostikasi (Faqat O'qituvchi/Admin uchun)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* URL Check */}
                        <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
                            <span className="text-xs font-bold text-slate-400 block uppercase mb-1">NEXT_PUBLIC_SUPABASE_URL</span>
                            {hasUrl ? (
                                <code className="text-xs font-mono font-bold text-slate-300 block break-all bg-slate-950/80 p-2 rounded-xl mt-1 border border-slate-800/80">
                                    "{envUrl}"
                                </code>
                            ) : (
                                <span className="text-xs font-bold text-rose-400 bg-rose-950/30 px-2 py-1 rounded mt-1 inline-block border border-rose-900/50">
                                    ❌ TOPILMADI (undefined yoki bo'sh)
                                </span>
                            )}
                        </div>

                        {/* KEY Check */}
                        <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
                            <span className="text-xs font-bold text-slate-400 block uppercase mb-1">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</span>
                            {hasKey ? (
                                <div className="mt-1">
                                    <code className="text-xs font-mono font-bold text-slate-300 block break-all bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
                                        "{envKey.slice(0, 15)}...{envKey.slice(-10)}"
                                    </code>
                                    <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                                        Uzunligi: {envKey.length} ta belgi (to'g'ri o'qildi)
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs font-bold text-rose-400 bg-rose-950/30 px-2 py-1 rounded mt-1 inline-block border border-rose-900/50">
                                    ❌ TOPILMADI (undefined yoki bo'sh)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Ulanish Xulosasi */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 text-xs">
                        <div>
                            <span className="font-bold text-slate-400">Ulanish holati:</span>
                            {isClientCreated ? (
                                <span className="text-emerald-400 font-extrabold ml-1.5 bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-900/40">
                                    ✓ Sozlamalar mavjud
                                </span>
                            ) : (
                                <span className="text-rose-400 font-extrabold ml-1.5 bg-rose-950/30 px-2.5 py-1 rounded-full border border-rose-900/40">
                                    ✗ Sozlamalar yetishmayapti (.env faylini to'ldiring)
                                </span>
                            )}
                        </div>
                        <div className="text-slate-500 font-semibold">
                            Next.js Muhiti: {process.env.NODE_ENV} (Server Component)
                        </div>
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
            </div>
        </div>
    );
}