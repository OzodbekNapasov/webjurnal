'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const envKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

interface MonthlyReportProps {
    techSchool: string;
}

interface ReportRow {
    index: number;
    groupName: string;
    date: string;
    topic: string;
    hours: number;
}

interface GroupSummary {
    groupName: string;
    totalHours: number;
    totalLessons: number;
}

interface GroupRow {
    groupId: number;
    groupName: string;
    dayHours: Record<number, string>; // day -> "2", "2 2", etc.
    totalHours: number;
}

export default function MonthlyReport({ techSchool }: MonthlyReportProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('05');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<ReportRow[]>([]);
    const [summaryData, setSummaryData] = useState<GroupSummary[]>([]);
    const [groupRows, setGroupRows] = useState<GroupRow[]>([]);
    const [daysCount, setDaysCount] = useState(31);
    const [sundays, setSundays] = useState<number[]>([]);
    const [activeSubTab, setActiveSubTab] = useState<'details' | 'form2'>('details');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const months = [
        { code: '01', name: 'YANVAR' },
        { code: '02', name: 'FEVRAL' },
        { code: '03', name: 'MART' },
        { code: '04', name: 'APREL' },
        { code: '05', name: 'MAY' },
        { code: '06', name: 'IYUN' },
        { code: '07', name: 'IYUL' },
        { code: '08', name: 'AVGUST' },
        { code: '09', name: 'SENTYABR' },
        { code: '10', name: 'OKTYABR' },
        { code: '11', name: 'NOYABR' },
        { code: '12', name: 'DEKABR' }
    ];

    const handleGenerateReport = async () => {
        if (!envUrl || !envKey) {
            setErrorMessage("Supabase sozlamalari topilmadi.");
            return;
        }
        setLoading(true);
        setErrorMessage('');
        setHasLoaded(false);

        try {
            const supabase = createClient(envUrl, envKey, { auth: { persistSession: false } });

            // Calculate days count and sundays
            const monthInt = parseInt(selectedMonth);
            const yearInt = parseInt(selectedYear);
            const totalDays = new Date(yearInt, monthInt, 0).getDate();
            setDaysCount(totalDays);

            const sunList: number[] = [];
            for (let d = 1; d <= totalDays; d++) {
                const dateObj = new Date(yearInt, monthInt - 1, d);
                if (dateObj.getDay() === 0) {
                    sunList.push(d);
                }
            }
            setSundays(sunList);

            // 1. Fetch groups for this techSchool
            const { data: allGroups, error: groupsError } = await supabase
                .from('groups')
                .select('id, name');

            if (groupsError) throw groupsError;

            const groups = (allGroups || []).filter((g: any) => {
                const school = g.tech_school || 'shahrisabz';
                return school === techSchool;
            });

            if (!groups || groups.length === 0) {
                setReportData([]);
                setSummaryData([]);
                setGroupRows([]);
                setHasLoaded(true);
                setLoading(false);
                return;
            }

            const groupIds = groups.map(g => g.id);
            const groupMap = new Map<number, string>();
            groups.forEach(g => groupMap.set(g.id, g.name));

            // 2. Fetch all lessons for these groups
            const { data: lessons, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .in('group_id', groupIds);

            if (lessonsError) throw lessonsError;

            // 3. Filter and map lessons in the selected month & year
            const filteredRows: ReportRow[] = [];
            const summaryMap = new Map<string, { hours: number; lessons: number }>();

            if (lessons) {
                // Sort by date
                const sortedLessons = [...lessons].sort((a, b) => {
                    const parseDate = (dStr: string) => {
                        if (!dStr) return 0;
                        const parts = dStr.split('.');
                        if (parts.length === 3) {
                            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
                        }
                        return 0;
                    };
                    return parseDate(a.lesson_date) - parseDate(b.lesson_date);
                });

                let idx = 1;
                for (const lesson of sortedLessons) {
                    if (!lesson.lesson_date) continue;
                    const parts = lesson.lesson_date.split('.');
                    if (parts.length === 3) {
                        const lMonth = parts[1];
                        const lYear = parts[2];

                        if (lMonth === selectedMonth && lYear === selectedYear) {
                            const groupName = groupMap.get(lesson.group_id) || `Guruh #${lesson.group_id}`;
                            const hours = lesson.hours || 2;

                            filteredRows.push({
                                index: idx++,
                                groupName,
                                date: lesson.lesson_date,
                                topic: lesson.topic || 'Mavzu kiritilmagan',
                                hours
                            });

                            const currentSum = summaryMap.get(groupName) || { hours: 0, lessons: 0 };
                            summaryMap.set(groupName, {
                                hours: currentSum.hours + hours,
                                lessons: currentSum.lessons + 1
                            });
                        }
                    }
                }
            }

            const summaries: GroupSummary[] = Array.from(summaryMap.entries()).map(([groupName, val]) => ({
                groupName,
                totalHours: val.hours,
                totalLessons: val.lessons
            })).sort((a, b) => a.groupName.localeCompare(b.groupName));

            // Form-2 mapping (Only groups that had lessons, totalHours > 0)
            const rows: GroupRow[] = groups.map(g => {
                const groupLessons = (lessons || []).filter(l => l.group_id === g.id);
                const dayHours: Record<number, string> = {};
                let totalHours = 0;

                for (let d = 1; d <= totalDays; d++) {
                    const dStr = d < 10 ? `0${d}` : `${d}`;
                    const targetDateStr = `${dStr}.${selectedMonth}.${selectedYear}`;
                    const matches = groupLessons.filter(l => l.lesson_date === targetDateStr);
                    
                    if (matches.length > 0) {
                        const hoursVal = matches.map(m => m.hours || 2);
                        dayHours[d] = hoursVal.join(' ');
                        totalHours += hoursVal.reduce((acc, h) => acc + h, 0);
                    } else {
                        dayHours[d] = '';
                    }
                }

                return {
                    groupId: g.id,
                    groupName: g.name.replace(/\([^)]*\)/, '').trim(),
                    dayHours,
                    totalHours
                };
            }).filter(row => row.totalHours > 0); // EXCLUDE groups with 0 hours!

            setReportData(filteredRows);
            setSummaryData(summaries);
            setGroupRows(rows);
            setHasLoaded(true);
        } catch (err: any) {
            setErrorMessage(`Hisobotni shakllantirishda xatolik: ${err.message || String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const handleExportToExcel = () => {
        if (reportData.length === 0) return;

        const excelRows = reportData.map(row => ({
            "T/r": row.index,
            "Guruh nomi": row.groupName,
            "Dars sanasi": row.date,
            "Mashg'ulot mavzusi": row.topic,
            "Dars soati (akademik)": row.hours
        }));

        const ws = XLSX.utils.json_to_sheet(excelRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Oylik Dars Hisoboti");

        ws['!cols'] = [
            { wch: 6 },
            { wch: 20 },
            { wch: 15 },
            { wch: 50 },
            { wch: 22 }
        ];

        const monthName = months.find(m => m.code === selectedMonth)?.name || selectedMonth;
        XLSX.writeFile(wb, `Dars_Hisoboti_${techSchool}_${monthName}_${selectedYear}.xlsx`);
    };

    const handleExportForm2Excel = () => {
        if (groupRows.length === 0) return;

        const workbook = XLSX.utils.book_new();
        const monthName = months.find(m => m.code === selectedMonth)?.name || selectedMonth;
        const schoolLabel = techSchool === 'ibn_sino' ? "Ibn Sino Tibbiyot Texnikumi" : "Shahrisabz Tibbiyot Texnikumi";
        
        const rawData: any[][] = [
            [`"${schoolLabel}"ning Tibbiyotda axborot texnalogiyalari fani o'qituvchisi`],
            [`Ozodbek Napasov ning ${monthName} oyida o'tgan dars soatlari`],
            [],
            ["№", "O'tilgan fan", "Guruh"]
        ];

        for (let d = 1; d <= daysCount; d++) {
            rawData[3].push(d);
        }
        rawData[3].push("Jami soat");

        groupRows.forEach((row, index) => {
            const rowData: any[] = [
                index + 1,
                index === 0 ? "Tibbiyotda axborot texnologiyalari" : "",
                row.groupName
            ];
            for (let d = 1; d <= daysCount; d++) {
                rowData.push(row.dayHours[d] || "");
            }
            rowData.push(row.totalHours);
            rawData.push(rowData);
            rawData.pop();
            rawData.push(rowData);
        });

        const totalRow: any[] = ["", "Jami", ""];
        let totalAll = 0;
        for (let d = 1; d <= daysCount; d++) {
            let daySum = 0;
            groupRows.forEach(row => {
                const vals = (row.dayHours[d] || '').split(' ').map(v => parseInt(v) || 0);
                daySum += vals.reduce((a, b) => a + b, 0);
            });
            totalRow.push(daySum || "");
            totalAll += daySum;
        }
        totalRow.push(totalAll);
        rawData.push(totalRow);

        rawData.push([]);
        rawData.push(["O'qituvchi:", "", "O.Z.Napasov"]);
        rawData.push(["O'TBDO':", "", "B.B.Eshnayev"]);

        const worksheet = XLSX.utils.aoa_to_sheet(rawData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Forma-2");
        XLSX.writeFile(workbook, `Forma2_${techSchool}_${monthName}_${selectedYear}.xlsx`);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true);
                    setHasLoaded(false);
                    setReportData([]);
                    setSummaryData([]);
                    setGroupRows([]);
                    setActiveSubTab('details');
                }}
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 h-[46px] rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
                <span>📊</span> Oylik hisobot
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn print:static print:bg-transparent print:p-0 print:backdrop-blur-none">
                    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-2xl text-left print:border-none print:bg-white print:text-black print:max-h-full print:overflow-visible print:shadow-none print:p-0">
                        
                        {/* Close button - hidden in print */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-all cursor-pointer print:hidden"
                            title="Yopish"
                        >
                            ✕
                        </button>

                        <div className="print:hidden">
                            <h3 className="text-lg sm:text-xl font-black text-white mb-2 flex items-center gap-2">
                                <span>📊</span> Oylik hisobot va Forma-2
                            </h3>
                            <p className="text-xs text-slate-400 font-bold mb-6">
                                Guruhlar bo'yicha oylik o'tilgan darslar hisoboti va Excel fayllarga eksport qilish
                            </p>

                            {/* Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/40">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1.5">Hisobot oyi</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        {months.map(m => (
                                            <option key={m.code} value={m.code} className="bg-slate-950 text-white font-semibold">
                                                {m.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1.5">Hisobot yili</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="2025" className="bg-slate-950 text-white font-semibold">2025</option>
                                        <option value="2026" className="bg-slate-950 text-white font-semibold">2026</option>
                                        <option value="2027" className="bg-slate-950 text-white font-semibold">2027</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleGenerateReport}
                                        disabled={loading}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer h-[38px] flex items-center justify-center gap-1.5"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Yuklanmoqda...
                                            </>
                                        ) : (
                                            "Hisobotni shakllantirish"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-300 font-semibold text-xs sm:text-sm mb-4">
                                    {errorMessage}
                                </div>
                            )}

                            {/* View selector tabs */}
                            {hasLoaded && (
                                <div className="flex bg-slate-950/45 p-1 rounded-xl border border-slate-800/60 mb-6 max-w-sm">
                                    <button
                                        onClick={() => setActiveSubTab('details')}
                                        className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all text-center ${activeSubTab === 'details'
                                                ? "bg-blue-600 text-white shadow"
                                                : "text-slate-400 hover:text-slate-200"
                                            }`}
                                    >
                                        📋 Batafsil ro'yxat
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab('form2')}
                                        className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all text-center ${activeSubTab === 'form2'
                                                ? "bg-violet-600 text-white shadow"
                                                : "text-slate-400 hover:text-slate-200"
                                            }`}
                                    >
                                        📄 Forma-2 (Tabel)
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Report Results */}
                        {hasLoaded && (
                            <div className="space-y-6">
                                
                                {activeSubTab === 'details' && (
                                    <div className="space-y-6 print:hidden">
                                        {/* Summary stats */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-950/30 border border-slate-800/80 p-4 rounded-2xl">
                                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Jami o'tilgan darslar</span>
                                                <span className="text-xl sm:text-2xl font-black text-blue-400 mt-1 block">
                                                    {reportData.length} ta
                                                </span>
                                            </div>
                                            <div className="bg-slate-950/30 border border-slate-800/80 p-4 rounded-2xl">
                                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Jami akademik soat</span>
                                                <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                                                    {reportData.reduce((acc, row) => acc + row.hours, 0)} soat
                                                </span>
                                            </div>
                                            {reportData.length > 0 && (
                                                <div className="bg-slate-950/30 border border-slate-800/80 p-3 rounded-2xl sm:col-span-2 md:col-span-1 flex items-center justify-center">
                                                    <button
                                                        onClick={handleExportToExcel}
                                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        <span>📥</span> Excel yuklab olish
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Group Summaries */}
                                        {summaryData.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Guruhlar kesimida jami soatlar:</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {summaryData.map((sum, i) => (
                                                        <div key={i} className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 flex justify-between items-center text-xs">
                                                            <span className="font-extrabold text-slate-200">{sum.groupName}</span>
                                                            <span className="font-black text-emerald-400">{sum.totalHours} soat ({sum.totalLessons} dars)</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Main Data Table */}
                                        <div>
                                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Dars o'tilgan kunlar va mavzular tafsiloti:</h4>
                                            <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/20">
                                                <div className="max-h-[350px] overflow-y-auto">
                                                    <table className="w-full border-collapse text-left text-xs sm:text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-extrabold">
                                                                <th className="p-3 w-12 text-center">T/r</th>
                                                                <th className="p-3 w-28">Guruh nomi</th>
                                                                <th className="p-3 w-24 text-center">Sana</th>
                                                                <th className="p-3">Mashg'ulot mavzusi</th>
                                                                <th className="p-3 w-20 text-center">Soat</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-800/60">
                                                            {reportData.length > 0 ? (
                                                                reportData.map((row) => (
                                                                    <tr key={row.index} className="hover:bg-slate-900/40 text-slate-300 font-semibold">
                                                                        <td className="p-3 text-center text-slate-500">{row.index}</td>
                                                                        <td className="p-3 font-extrabold text-slate-200">{row.groupName}</td>
                                                                        <td className="p-3 text-center text-slate-400">{row.date}</td>
                                                                        <td className="p-3 text-slate-100 font-medium leading-relaxed">{row.topic}</td>
                                                                        <td className="p-3 text-center font-bold text-emerald-400">{row.hours} soat</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                                                                        Ushbu oyda darslar topilmadi.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'form2' && (
                                    <div className="space-y-4 print:space-y-6">
                                        {/* Action buttons - hidden in print */}
                                        <div className="flex gap-3 print:hidden">
                                            <button
                                                onClick={handlePrint}
                                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>🖨️</span> Chop etish / PDF saqlash
                                            </button>
                                            <button
                                                onClick={handleExportForm2Excel}
                                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>📥</span> Excel yuklab olish
                                            </button>
                                        </div>

                                        {/* Grid Table */}
                                        <div className="bg-white text-black p-4 sm:p-8 rounded-xl border border-slate-200 overflow-x-auto shadow-inner print:border-none print:p-0 print:shadow-none font-sans select-text">
                                            <div className="min-w-[950px] text-center">
                                                <div className="mb-4">
                                                    <p className="text-xs sm:text-sm font-bold tracking-wide">
                                                        "{techSchool === 'ibn_sino' ? 'Ibn Sino Tibbiyot Texnikumi' : 'Shahrisabz Tibbiyot Texnikumi'}"ning <span className="underline underline-offset-4 decoration-1 font-bold">Tibbiyotda axborot texnologiyalari</span> fani o'qituvchisi
                                                    </p>
                                                    <p className="text-xs sm:text-sm font-bold mt-2">
                                                        <span className="underline underline-offset-4 decoration-1 font-extrabold font-serif">Ozodbek Napasov</span>ning <span className="underline underline-offset-4 decoration-1 font-extrabold uppercase">{months.find(m => m.code === selectedMonth)?.name}</span> oyida o'tgan dars soatlari
                                                    </p>
                                                </div>

                                                <table className="w-full border-collapse border border-black text-[10px] leading-tight select-text">
                                                    <thead>
                                                        <tr>
                                                            <th className="border border-black p-1 text-center w-8" rowSpan={2}>№</th>
                                                            <th className="border border-black p-1 text-center w-48" rowSpan={2}>O'tilgan fan</th>
                                                            <th className="border border-black p-1 text-center w-16" rowSpan={2}>Guruh</th>
                                                            <th className="border border-black p-0.5 text-center" colSpan={daysCount}>Kunlar</th>
                                                            <th className="border border-black p-1 text-center w-16" rowSpan={2}>Jami soat</th>
                                                        </tr>
                                                        <tr>
                                                            {Array.from({ length: daysCount }).map((_, i) => {
                                                                const d = i + 1;
                                                                const isSun = sundays.includes(d);
                                                                return (
                                                                    <th
                                                                        key={d}
                                                                        className={`border border-black p-0.5 text-center w-6 text-[9px] font-extrabold ${isSun ? 'bg-slate-400 print:bg-gray-400' : ''}`}
                                                                    >
                                                                        {d}
                                                                    </th>
                                                                );
                                                            })}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groupRows.length > 0 ? (
                                                            groupRows.map((row, idx) => (
                                                                <tr key={row.groupId}>
                                                                    <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                                                                    {idx === 0 ? (
                                                                        <td className="border border-black p-1 font-bold text-center leading-normal" rowSpan={groupRows.length}>
                                                                            Tibbiyotda axborot texnologiyalari
                                                                        </td>
                                                                    ) : null}
                                                                    <td className="border border-black p-1 font-bold text-center">{row.groupName}</td>
                                                                    {Array.from({ length: daysCount }).map((_, i) => {
                                                                        const d = i + 1;
                                                                        const isSun = sundays.includes(d);
                                                                        return (
                                                                            <td
                                                                                key={d}
                                                                                className={`border border-black p-0.5 text-center font-bold text-[9px] h-6 ${isSun ? 'bg-slate-400 print:bg-gray-400' : ''}`}
                                                                            >
                                                                                {row.dayHours[d] || ""}
                                                                            </td>
                                                                        );
                                                                    })}
                                                                    <td className="border border-black p-1 text-center font-black">{row.totalHours}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={daysCount + 4} className="border border-black p-8 text-center font-bold text-slate-500">
                                                                    Hisobot oyi uchun darslar topilmadi.
                                                                </td>
                                                            </tr>
                                                        )}

                                                        {/* Total Row */}
                                                        {groupRows.length > 0 && (
                                                            <tr className="bg-slate-50 print:bg-transparent font-black">
                                                                <td className="border border-black p-1 text-center"></td>
                                                                <td className="border border-black p-1 text-center uppercase" colSpan={2}>Jami</td>
                                                                {Array.from({ length: daysCount }).map((_, i) => {
                                                                    const d = i + 1;
                                                                    const isSun = sundays.includes(d);
                                                                    let daySum = 0;
                                                                    groupRows.forEach(row => {
                                                                        const vals = (row.dayHours[d] || '').split(' ').map(v => parseInt(v) || 0);
                                                                        daySum += vals.reduce((a, b) => a + b, 0);
                                                                    });
                                                                    return (
                                                                        <td
                                                                            key={d}
                                                                            className={`border border-black p-0.5 text-center text-[9px] ${isSun ? 'bg-slate-400 print:bg-gray-400' : ''}`}
                                                                        >
                                                                            {daySum || ""}
                                                                        </td>
                                                                    );
                                                                })}
                                                                <td className="border border-black p-1 text-center">
                                                                    {groupRows.reduce((acc, r) => acc + r.totalHours, 0)}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>

                                                {/* Footer Signatures */}
                                                <div className="mt-8 grid grid-cols-2 text-left font-bold text-xs sm:text-sm pl-4">
                                                    <div className="space-y-2">
                                                        <p>O'qituvchi: <span className="inline-block ml-8 border-b border-black w-24 text-center"></span> O.Z.Napasov</p>
                                                        <p>O'TBDO': <span className="inline-block ml-10 border-b border-black w-24 text-center"></span> B.B.Eshnayev</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
