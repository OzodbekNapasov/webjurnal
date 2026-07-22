import React from "react";
import { Printer, AlertTriangle, X, Check } from "./Icon";

interface Student {
    id: string | number;
    fullName: string;
}

interface Lesson {
    id: number;
    lesson_date: string;
    hours: number;
    topic: string;
}

interface RecordState {
    is_present: boolean;
    grade: string;
}

interface Props {
    student: Student;
    lessons: Lesson[];
    journalRecords: Record<string, RecordState>;
    onClose: () => void;
    groupName: string;
}

export default function StudentReport({ student, lessons, journalRecords, onClose, groupName }: Props) {
    const grades: number[] = [];
    let nbCount = 0;
    let presentCount = 0;

    lessons.forEach(lesson => {
        const key = `${student.id}-${lesson.id}`;
        const record = journalRecords[key];
        if (record) {
            if (!record.is_present) {
                nbCount++;
            } else {
                presentCount++;
                const g = parseFloat(record.grade);
                if (!isNaN(g) && g >= 2 && g <= 5) {
                    grades.push(g);
                }
            }
        }
    });

    const totalLessons = lessons.length;
    const attendancePercent = totalLessons > 0
        ? Math.round((presentCount / totalLessons) * 100)
        : 100;
    const gpa = grades.length > 0
        ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
        : null;

    const getGpaColor = (g: number) => {
        if (g >= 4.5) return "text-emerald-400";
        if (g >= 3.5) return "text-blue-400";
        if (g >= 3.0) return "text-amber-400";
        return "text-rose-400";
    };

    const handlePrint = () => {
        const printContent = document.getElementById("student-report-print");
        if (!printContent) return;
        const printWin = window.open("", "_blank", "width=800,height=900");
        if (!printWin) return;
        printWin.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${student.fullName} - Hisobot</title>
                <style>
                    body { font-family: Arial, sans-serif; background: white; color: #1a1a2e; margin: 24px; }
                    h1 { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
                    .sub { font-size: 12px; color: #555; margin-bottom: 16px; }
                    .stats { display: flex; gap: 16px; margin-bottom: 16px; }
                    .stat-box { border: 1px solid #ddd; border-radius: 8px; padding: 10px 16px; min-width: 100px; }
                    .stat-label { font-size: 10px; text-transform: uppercase; color: #777; font-weight: 700; }
                    .stat-value { font-size: 20px; font-weight: 900; }
                    table { width: 100%; border-collapse: collapse; font-size: 11px; }
                    th { background: #f0f0f0; padding: 6px 8px; text-align: left; font-weight: 800; border: 1px solid #ddd; }
                    td { padding: 5px 8px; border: 1px solid #eee; }
                    tr:nth-child(even) { background: #f9f9f9; }
                    .nb { color: #dc2626; font-weight: 800; }
                    .grade-5 { color: #059669; font-weight: 800; }
                    .grade-4 { color: #2563eb; font-weight: 800; }
                    .grade-3 { color: #d97706; font-weight: 800; }
                    .grade-2 { color: #dc2626; font-weight: 800; }
                    .footer { margin-top: 24px; font-size: 10px; color: #aaa; }
                </style>
            </head>
            <body>${printContent.innerHTML}
                <div class="footer">Hisobot tizim tomonidan avtomatik tuzildi. Shahrisabz Tibbiyot Texnikumi — TAT Journal.</div>
            </body>
            </html>
        `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => { printWin.print(); printWin.close(); }, 400);
    };

    const gpaNum = gpa ? parseFloat(gpa) : null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative bg-slate-900 border border-slate-700/60 rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-800/60 bg-slate-950/40">
                    <div>
                        <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-900/40">
                            {groupName}
                        </span>
                        <h2 className="text-lg sm:text-xl font-black text-white mt-1">{student.fullName}</h2>
                        <p className="text-[11px] text-slate-400 font-semibold">Shaxsiy Natijalar Hisoboti</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                        >
                            <Printer className="w-4 h-4" /> Print / PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl transition-all cursor-pointer font-bold text-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Printable content */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-6 custom-scrollbar" id="student-report-print">
                    {/* Stats row */}
                    <h1 style={{ display: "none" }}>{student.fullName} — Shaxsiy Hisobot</h1>
                    <div className="sub" style={{ display: "none" }}>Guruh: {groupName} | Fan: Tibbiyotda Axborot Texnologiyalari</div>

                    <div className="grid grid-cols-3 gap-3 mb-6 stats">
                        {/* Attendance */}
                        <div className="stat-box bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-3 text-center">
                            <div className="stat-label text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider mb-1">Davomat</div>
                            <div className={`stat-value text-2xl font-black ${attendancePercent >= 80 ? "text-emerald-400" : attendancePercent >= 60 ? "text-amber-400" : "text-rose-400"}`}>
                                {attendancePercent}%
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold mt-1">{presentCount}/{totalLessons} dars</div>
                        </div>
                        {/* GPA */}
                        <div className="stat-box bg-blue-950/20 border border-blue-900/40 rounded-2xl p-3 text-center">
                            <div className="stat-label text-[10px] font-extrabold text-blue-400 uppercase tracking-wider mb-1">O&apos;rtacha GPA</div>
                            <div className={`stat-value text-2xl font-black ${gpaNum ? getGpaColor(gpaNum) : "text-slate-400"}`}>
                                {gpa || "—"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold mt-1">{grades.length} ta baho</div>
                        </div>
                        {/* NBs */}
                        <div className={`stat-box rounded-2xl p-3 text-center border ${nbCount >= 3 ? "bg-rose-950/20 border-rose-900/40" : "bg-slate-950/30 border-slate-800/40"}`}>
                            <div className="stat-label text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Jami NB</div>
                            <div className={`stat-value text-2xl font-black ${nbCount >= 3 ? "text-rose-400" : "text-slate-300"}`}>
                                {nbCount}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold mt-1">qoldirilgan dars</div>
                        </div>
                    </div>

                    {/* NB warning */}
                    {nbCount >= 3 && (
                        <div className="mb-4 p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" /> Talabada {nbCount} ta dars qoldirish qayd etilgan. Bu akademik ogohlantirish darajasida!
                        </div>
                    )}

                    {/* Lessons table */}
                    <div className="bg-slate-950/40 rounded-2xl border border-slate-800/60 overflow-hidden">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-950/60 border-b border-slate-800/60">
                                    <th className="p-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center w-10">T/r</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Sana</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Mavzu</th>
                                    <th className="p-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center w-20">Natija</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40">
                                {lessons.map((lesson, idx) => {
                                    const key = `${student.id}-${lesson.id}`;
                                    const record = journalRecords[key];
                                    let resultEl: React.ReactNode = <span className="text-slate-600 text-xs font-bold">—</span>;
                                    if (record) {
                                        if (!record.is_present) {
                                            resultEl = <span className="nb text-rose-400 text-xs font-black">NB</span>;
                                        } else if (record.grade) {
                                            const gradeClass =
                                                record.grade === "5" ? "grade-5 text-emerald-400" :
                                                record.grade === "4" ? "grade-4 text-blue-400" :
                                                record.grade === "3" ? "grade-3 text-amber-400" :
                                                record.grade === "2" ? "grade-2 text-rose-400" :
                                                "text-slate-300";
                                            resultEl = <span className={`${gradeClass} text-sm font-black`}>{record.grade}</span>;
                                        } else {
                                            resultEl = <Check className="w-4 h-4 text-emerald-500 font-bold mx-auto" />;
                                        }
                                    }
                                    return (
                                        <tr key={lesson.id} className="hover:bg-slate-950/30 transition-colors">
                                            <td className="p-3 text-xs font-bold text-slate-500 text-center">{idx + 1}</td>
                                            <td className="p-3 text-xs font-bold text-slate-300">{lesson.lesson_date || "—"}</td>
                                            <td className="p-3 text-xs font-semibold text-slate-400 truncate max-w-[200px]">{lesson.topic || "—"}</td>
                                            <td className="p-3 text-center">{resultEl}</td>
                                        </tr>
                                    );
                                })}
                                {lessons.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-500 text-sm font-bold">Darslar hali kiritilmagan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}