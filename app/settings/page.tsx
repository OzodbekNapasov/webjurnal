"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Plus, Calendar, CheckCircle, XCircle, Info, Sparkles, Flag, Flower, Feather, Scroll, Apple, Trash } from "../../components/Icon";

interface Holiday {
    date: string;
    name: string;
    emoji: string;
    custom?: boolean;
}

const CUSTOM_HOLIDAYS_KEY = "custom_holidays";

const renderHolidayIcon = (key: string) => {
    switch (key) {
        case "YY": return <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />;
        case "UZ": return <Flag className="w-5 h-5 text-cyan-300 shrink-0" />;
        case "FL": return <Flower className="w-5 h-5 text-rose-300 shrink-0" />;
        case "SP": return <Flower className="w-5 h-5 text-pink-300 shrink-0" />;
        case "PG": return <Feather className="w-5 h-5 text-emerald-300 shrink-0" />;
        case "CL": return <Sparkles className="w-5 h-5 text-purple-300 shrink-0" />;
        case "AP": return <Apple className="w-5 h-5 text-red-300 shrink-0" />;
        case "SC": return <Scroll className="w-5 h-5 text-yellow-300 shrink-0" />;
        default: return <Calendar className="w-5 h-5 text-cyan-300 shrink-0" />;
    }
};

export default function SettingsPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
    const [newDate, setNewDate] = useState("");
    const [newName, setNewName] = useState("");
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetch("/holidays.json").then(r => r.json()).then((data: any) => {
            setHolidays(data.holidays || []);
        });
        try {
            const stored = localStorage.getItem(CUSTOM_HOLIDAYS_KEY);
            if (stored) setCustomHolidays(JSON.parse(stored));
        } catch { }
    }, []);

    const saveCustom = (list: Holiday[]) => {
        setCustomHolidays(list);
        localStorage.setItem(CUSTOM_HOLIDAYS_KEY, JSON.stringify(list));
    };

    const handleAdd = () => {
        if (!newDate || !newName.trim()) {
            setMsg({ type: "error", text: "Sana va bayram nomini kiriting!" });
            setTimeout(() => setMsg(null), 3000);
            return;
        }
        const parts = newDate.split(".");
        if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
            setMsg({ type: "error", text: "Sana formatini to'g'ri kiriting: KK.OO (masalan: 15.06)" });
            setTimeout(() => setMsg(null), 3000);
            return;
        }
        const updated = [...customHolidays, { date: newDate, name: newName.trim(), emoji: "CUSTOM", custom: true }];
        saveCustom(updated);
        setNewDate(""); setNewName("");
        setMsg({ type: "success", text: "Bayram kuni muvaffaqiyatli qo'shildi!" });
        setTimeout(() => setMsg(null), 3000);
    };

    const handleDelete = (idx: number) => {
        const cIdx = customHolidays.findIndex((c, i) => i === idx);
        if (cIdx >= 0) saveCustom(customHolidays.filter((_, i) => i !== cIdx));
    };

    const allHolidays = [...holidays, ...customHolidays].sort((a, b) => {
        const [ad, am] = a.date.split(".").map(Number);
        const [bd, bm] = b.date.split(".").map(Number);
        return am !== bm ? am - bm : ad - bd;
    });

    const today = new Date();
    const todayDDMM = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}`;

    return (
        <div 
            className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-white font-sans antialiased relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #020617 0%, #0a1628 35%, #041030 65%, #060a1a 100%)',
            }}
        >
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Logo Back Link */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-3 p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 group cursor-pointer"
                        title="Bosh sahifaga qaytish"
                    >
                        <img src="/images/Logo.png" alt="Logo" className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]" />
                        <span className="text-xs font-black text-white group-hover:text-cyan-300 pr-2">Tibbiyot Texnikumi</span>
                    </Link>
                </div>

                {/* Page Title */}
                <div className="flex items-center gap-3.5 mb-2">
                    <span className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shadow-inner shrink-0">
                        <Settings className="w-6 h-6" />
                    </span>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Tizim Sozlamalari</h1>
                        <p className="text-xs sm:text-sm text-cyan-200/80 font-medium">Bayram va dam olish kunlarini boshqaring</p>
                    </div>
                </div>

                {/* Status Alert */}
                {msg && (
                    <div className={`mt-6 mb-6 p-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 border backdrop-blur-xl ${
                        msg.type === "success" 
                            ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-900/20" 
                            : "bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-900/20"
                    }`}>
                        {msg.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />} 
                        <span>{msg.text}</span>
                    </div>
                )}

                {/* Add Custom Holiday Card */}
                <div className="mt-8 bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] mb-8">
                    <h2 className="text-base font-extrabold text-white mb-4 flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                            <Plus className="w-4 h-4" />
                        </span>
                        <span>Maxsus bayram kuni qo'shish</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Sana (KK.OO)</label>
                            <input 
                                type="text" 
                                placeholder="18.07" 
                                value={newDate} 
                                onChange={e => setNewDate(e.target.value)} 
                                maxLength={5}
                                className="w-full sm:w-32 bg-slate-950/70 border border-slate-800 focus:border-cyan-400 text-white text-sm font-bold rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-500" 
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Bayram nomi</label>
                            <input 
                                type="text" 
                                placeholder="Bayram nomini kiriting..." 
                                value={newName} 
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-slate-950/70 border border-slate-800 focus:border-cyan-400 text-white text-sm font-bold rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-500"
                                onKeyDown={e => { if (e.key === "Enter") handleAdd(); }} 
                            />
                        </div>
                        <div className="flex flex-col justify-end pt-1 sm:pt-0">
                            <button 
                                onClick={handleAdd} 
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Qo'shish</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Holiday List Card */}
                <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                    <h2 className="text-base font-extrabold text-white mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4" />
                            </span>
                            <span>Bayram va Dam Olish Kunlari</span>
                        </div>
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                            {allHolidays.length} ta
                        </span>
                    </h2>

                    <div className="space-y-2.5">
                        {allHolidays.map((h, i) => {
                            const isTodayH = h.date === todayDDMM;
                            const customIdx = customHolidays.findIndex(c => c.date === h.date && c.name === h.name);
                            return (
                                <div 
                                    key={i} 
                                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                                        isTodayH 
                                            ? "bg-amber-500/20 border-amber-400/50 text-white shadow-lg shadow-amber-500/10" 
                                            : h.custom 
                                            ? "bg-indigo-500/15 border-indigo-400/40 text-white" 
                                            : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/60 text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                                            {renderHolidayIcon(h.emoji)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-extrabold text-white">{h.name}</span>
                                                {isTodayH && <span className="text-[9px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase shadow">BUGUN</span>}
                                                {h.custom && <span className="text-[9px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full uppercase">Maxsus</span>}
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">{h.date}</span>
                                        </div>
                                    </div>
                                    {h.custom && customIdx >= 0 && (
                                        <button 
                                            onClick={() => handleDelete(customIdx)} 
                                            title="O'chirish" 
                                            className="w-8 h-8 flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-500/80 rounded-xl transition-all cursor-pointer border border-rose-500/30 hover:border-rose-400"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Information Banner */}
                <div className="mt-6 p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 font-semibold flex items-start gap-3 backdrop-blur-xl">
                    <Info className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                    <span>Rasmiy bayram kunlari tizim faylidan o'qiladi. Maxsus qo'shilgan bayramlar brauzer xotirasida (localStorage) saqlanadi.</span>
                </div>
            </div>
        </div>
    );
}