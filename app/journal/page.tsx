"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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

function JournalContent() {
    const searchParams = useSearchParams();
    const groupId = searchParams.get("groupId");
    const groupName = searchParams.get("groupName") || "Tanlanmagan guruh";

    const [students, setStudents] = useState<Student[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [journalRecords, setJournalRecords] = useState<Record<string, RecordState>>({});
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Tablar boshqaruvi
    const [activeTab, setActiveTab] = useState<"jurnal" | "mavzular">("jurnal");

    // Yangi dars qo'shish modal holati
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [newLesson, setNewLesson] = useState({ date: "", topic: "", hours: 2 });

    // Hujayra (Cell) tahrirlash modal holati
    const [isEditCellOpen, setIsEditCellOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<{
        studentId: string | number;
        studentName: string;
        lessonDate: string;
    } | null>(null);
    const [editingState, setEditingState] = useState<RecordState>({ is_present: true, grade: "" });

    // Darsni tahrirlash modal holati
    const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    // Bugungi sanani formatlash funksiyasi
    const getTodayFormatted = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Ma'lumotlarni yuklash
    const loadData = async () => {
        if (!groupId) return;
        setLoading(true);
        setFetchError(null);

        if (!supabase) {
            setFetchError("Supabase ulanish ma'lumotlari (.env faylida) topilmadi. NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY o'zgaruvchilarini tekshiring.");
            setLoading(false);
            return;
        }

        try {
            // 1. Talabalar ro'yxatini yuklash
            const { data: studentsData, error: studentsError } = await supabase
                .from("students")
                .select("id, fullName")
                .eq("group_id", groupId);

            if (studentsError) {
                setFetchError(`Talabalarni yuklashda xatolik: ${studentsError.message}`);
                setLoading(false);
                return;
            }

            // 2. Darslar ro'yxatini yuklash
            const { data: lessonsData, error: lessonsError } = await supabase
                .from("lessons")
                .select("*")
                .eq("group_id", groupId)
                .order("id", { ascending: true });

            if (lessonsError) {
                if (lessonsError.message.includes('relation "lessons" does not exist') || lessonsError.message.includes('public.lessons') || lessonsError.message.includes('schema cache')) {
                    setFetchError('lessons_table_missing');
                } else {
                    setFetchError(`Darslarni yuklashda xatolik: ${lessonsError.message}`);
                }
                setLoading(false);
                return;
            }

            // 3. Jurnal yozuvlarini yuklash
            const { data: recordsData, error: recordsError } = await supabase
                .from("journal_records")
                .select("*");

            if (recordsError) {
                setFetchError(`Jurnal yozuvlarini yuklashda xatolik: ${recordsError.message}`);
                setLoading(false);
                return;
            }

            if (studentsData) {
                const sortedStudents = [...studentsData].sort((a, b) => 
                    (a.fullName || "").localeCompare(b.fullName || "", "uz")
                );
                setStudents(sortedStudents);
            }

            setLessons(lessonsData || []);

            const recordsMap: Record<string, RecordState> = {};
            recordsData?.forEach((rec) => {
                const key = `${rec.student_id}-${rec.lesson_date}`;
                recordsMap[key] = {
                    is_present: rec.is_present,
                    grade: rec.grade || "",
                };
            });
            setJournalRecords(recordsMap);
        } catch (err: any) {
            setFetchError(`Tarmoq yoki tizim xatoligi: ${err.message || String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [groupId]);

    // Ma'lumotlarni Supabase-ga saqlash (Upsert)
    async function handleSaveToSupabase(studentId: string | number, date: string, isPresent: boolean, gradeValue: string) {
        if (!date) return;
        try {
            await supabase!.from("journal_records").upsert(
                {
                    student_id: studentId.toString(),
                    subject_name: "Tibbiyotda Axborot Texnologiyalari",
                    lesson_date: date,
                    is_present: isPresent,
                    grade: gradeValue || null,
                },
                { onConflict: "student_id,lesson_date" }
            );
        } catch (error) {
            console.error("Supabase-ga yozishda xatolik:", error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-100">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="font-extrabold text-slate-400 text-sm tracking-wide">Onlayn bazadan ma'lumotlar yuklanmoqda...</div>
            </div>
        );
    }

    // "lessons" jadvali bazada mavjud bo'lmasa ko'rsatiladigan oyna
    if (fetchError === 'lessons_table_missing') {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center text-slate-100">
                <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-lg font-black text-rose-400 mb-3 flex items-center gap-2">
                        ⚠️ Ma'lumotlar bazasi to'liq emas
                    </h3>
                    <p className="text-sm text-slate-300 font-semibold mb-4 leading-relaxed">
                        Supabase bazangizda darslarni saqlash uchun mo'ljallangan `lessons` jadvali topilmadi. Tizim to'liq ishlashi uchun ushbu jadvalni yaratishingiz shart.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
                        <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">Bajariladigan SQL Kod</span>
                        <code className="text-xs font-mono text-emerald-400 block break-all whitespace-pre bg-slate-950 p-2 rounded-xl mt-1 select-all">
{`CREATE TABLE lessons (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL DEFAULT 'Tibbiyotda Axborot Texnologiyalari',
    lesson_date TEXT NOT NULL,
    hours INTEGER NOT NULL DEFAULT 2,
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_group_date UNIQUE (group_id, lesson_date)
);

ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;`}
                        </code>
                    </div>
                    <p className="text-xs text-slate-400 mb-6 font-medium">
                        **Ko'rsatma:** Ushbu kodni nusxalab oling, Supabase Dashboard-dagi **SQL Editor** bo'limiga o'ting, kodni joylab **Run** tugmasini bosing va sahifani qayta yangilang.
                    </p>
                    <button
                        onClick={loadData}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                    >
                        ✓ Jadval yaratildi, sahifani yangilash
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-950 p-1 sm:p-4 lg:p-6 text-slate-100 antialiased">
            <div className="w-full max-w-full mx-auto px-1 sm:px-2 md:px-4">
                
                {/* Back Link & Mode Toggler Container */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 md:mb-8 bg-slate-900/40 p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-slate-800/60">
                    <a href="/" className="group inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-800/40">
                        <span className="group-hover:-translate-x-0.5 transition-transform">⬅️</span> 
                        Guruhlar ro'yxatiga qaytish
                    </a>

                    <div className="flex w-full md:w-auto bg-slate-950/60 p-1 rounded-xl border border-slate-800/40">
                        <button
                            onClick={() => setActiveTab("jurnal")}
                            className={`flex-1 md:flex-none px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-200 text-center ${
                                activeTab === "jurnal" 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            📋 Jurnal Jadvali (Chap bet)
                        </button>
                        <button
                            onClick={() => setActiveTab("mavzular")}
                            className={`flex-1 md:flex-none px-3 sm:px-5 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-200 text-center ${
                                activeTab === "mavzular" 
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            📖 O'tilgan Mavzular (O'ng bet)
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {fetchError && fetchError !== 'lessons_table_missing' && (
                    <div className="mb-8 p-6 bg-rose-950/20 border border-rose-900/50 rounded-3xl text-rose-200 text-sm shadow-sm">
                        <h3 className="font-extrabold text-rose-300 text-base mb-1">⚠️ Ma'lumotlarni yuklashda xatolik yuz berdi</h3>
                        <p className="font-semibold text-rose-700/90 mb-3">{fetchError}</p>
                        <p className="text-xs text-rose-500 font-medium">
                            Iltimos, Supabase ulanishi, internet aloqasi yoki loyihaning <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-slate-200">.env</code> faylidagi konfiguratsiya to'g'riligini tekshiring.
                        </p>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-slate-900/40 backdrop-blur-md p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800/60">
                    
                    {/* Header Info & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/60 pb-4 mb-4 md:mb-8">
                        <div>
                            <span className="text-[10px] sm:text-xs font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-900/40">
                                Elektron Jurnal
                            </span>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1.5">{groupName}</h1>
                            <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Fan: Tibbiyotda Axborot Texnologiyalari
                            </p>
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => {
                                    setNewLesson({ date: getTodayFormatted(), topic: "", hours: 2 });
                                    setIsAddLessonOpen(true);
                                }}
                                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <span>➕</span> Yangi dars qo'shish
                            </button>
                        </div>
                    </div>

                    {activeTab === "jurnal" ? (
                        /* TAB 1: JURNAL GRIDA JADVALI */
                        <div>
                            {/* Darslar kiritilmagan bo'lsa */}
                            {lessons.length === 0 ? (
                                <div className="text-center py-16 bg-slate-950/20 rounded-2xl border border-slate-800/40">
                                    <span className="text-4xl block mb-3">📅</span>
                                    <h4 className="text-base font-bold text-slate-300">Jurnalda darslar mavjud emas</h4>
                                    <p className="text-xs text-slate-500 font-semibold mt-1 mb-6 max-w-md mx-auto">
                                        Davomat olish va baholashni boshlash uchun o'ng burchakdagi "Yangi dars qo'shish" tugmasi orqali dars qo'shing.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {/* Mobile Scroll Assist Hint */}
                                    <div className="flex lg:hidden items-center justify-center gap-1.5 mb-2.5 text-[10px] sm:text-xs font-bold text-slate-500 animate-pulse bg-slate-950/40 py-1.5 px-3 rounded-xl border border-slate-800/40 w-fit mx-auto">
                                        <span>↔️ Jurnalni ko'rish uchun o'ngga suring</span>
                                    </div>

                                    <div className="overflow-x-auto border border-slate-800/60 rounded-2xl shadow-xl custom-scrollbar scroll-smooth">
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-950/80 border-b border-slate-800/80 text-left">
                                                    <th className="p-2 sm:p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-12 min-w-[48px] max-w-[48px] text-center sticky left-0 bg-[#0c1222] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">T/r</th>
                                                    <th className="p-2 sm:p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-[140px] min-w-[140px] max-w-[140px] sm:w-[220px] sm:min-w-[220px] sm:max-w-[220px] sticky left-12 bg-[#0c1222] z-20 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.6)] border-r border-slate-700/60 truncate">Talaba ismi-sharifi</th>
                                                    {lessons.map((lesson, index) => (
                                                        <th 
                                                            key={lesson.id} 
                                                            onClick={() => {
                                                                setEditingLesson(lesson);
                                                                setIsEditLessonOpen(true);
                                                            }}
                                                            className="p-2 sm:p-4 text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center w-20 min-w-[80px] sm:w-24 sm:min-w-[96px] border-l border-slate-800/40 cursor-pointer hover:bg-slate-950/80 transition-colors"
                                                            title={`${index + 1}-dars: ${lesson.topic || 'Mavzu kiritilmagan'} (${lesson.hours} soat, Tahrirlash/O'chirish)`}
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <span className="hover:underline tracking-tight block text-[11px] sm:text-xs">{lesson.lesson_date || "Sana?"}</span>
                                                                <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold mt-0.5">{index + 1}-dars</span>
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/60">
                                                {students.length > 0 ? (
                                                    students.map((student, index) => (
                                                        <tr key={student.id} className="hover:bg-slate-950/20 transition-colors group">
                                                            <td className="p-2 sm:p-4 text-xs sm:text-sm font-bold text-slate-500 text-center sticky left-0 bg-[#0a0f1d] group-hover:bg-slate-900 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] w-12 min-w-[48px] max-w-[48px]">
                                                                {index + 1}
                                                            </td>
                                                            <td className="p-2 sm:p-4 text-xs sm:text-sm font-extrabold text-slate-200 sticky left-12 bg-[#0a0f1d] group-hover:bg-slate-900 z-10 transition-colors shadow-[4px_0_8px_-3px_rgba(0,0,0,0.6)] border-r border-slate-700/60 w-[140px] min-w-[140px] max-w-[140px] sm:w-[220px] sm:min-w-[220px] sm:max-w-[220px] truncate" title={student.fullName}>
                                                                {student.fullName}
                                                            </td>
                                                            {lessons.map((lesson) => {
                                                                const key = `${student.id}-${lesson.lesson_date}`;
                                                                const record = journalRecords[key] || { is_present: true, grade: "" };

                                                                return (
                                                                    <td 
                                                                        key={lesson.id} 
                                                                        onClick={() => {
                                                                            setEditingCell({
                                                                                studentId: student.id,
                                                                                studentName: student.fullName,
                                                                                lessonDate: lesson.lesson_date
                                                                            });
                                                                            setEditingState({
                                                                                is_present: record.is_present,
                                                                                grade: record.grade || ""
                                                                            });
                                                                            setIsEditCellOpen(true);
                                                                        }}
                                                                        className="p-2 sm:p-3 text-center border-l border-slate-800/30 cursor-pointer hover:bg-blue-950/10 transition-colors w-20 min-w-[80px] sm:w-24 sm:min-w-[96px]"
                                                                    >
                                                                        {!record.is_present ? (
                                                                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-black rounded bg-rose-950/40 text-rose-400 border border-rose-900/40 shadow-sm">
                                                                                NB
                                                                            </span>
                                                                        ) : record.grade ? (
                                                                            <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-950/30 text-emerald-400 font-black text-xs sm:text-sm border border-emerald-900/40">
                                                                                {record.grade}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-slate-700 text-xs font-bold">—</span>
                                                                        )}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2 + lessons.length} className="text-center py-12 text-sm text-slate-500 font-bold bg-slate-950/20">
                                                            👥 Bu guruhda hozircha talabalar mavjud emas.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* TAB 2: O'TILGAN MAVZULAR RO'YXATI */
                        <div>
                            {/* Mobile View: Cards */}
                            <div className="block sm:hidden space-y-3">
                                {lessons.length > 0 ? (
                                    lessons.map((lesson, index) => (
                                        <div key={lesson.id} className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl space-y-2 shadow-lg animate-fadeIn">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/40">
                                                    {index + 1}-dars
                                                </span>
                                                <span className="text-[11px] font-bold text-slate-400">{lesson.lesson_date || "Sana kiritilmagan"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase tracking-wider">Mashg'ulot mavzusi:</span>
                                                <p className="text-xs font-semibold text-slate-200 leading-relaxed">{lesson.topic}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-800/50">
                                                <span className="text-[11px] font-bold text-slate-400">⏱️ {lesson.hours} soat</span>
                                                <button
                                                    onClick={() => {
                                                        setEditingLesson(lesson);
                                                        setIsEditLessonOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 text-[11px] font-bold bg-slate-900 hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                                                >
                                                    Tahrirlash
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-sm text-slate-500 font-bold bg-slate-950/20 rounded-2xl border border-slate-800/40">
                                        📖 Hozircha o'tilgan mashg'ulotlar mavzulari kiritilmagan.
                                    </div>
                                )}
                            </div>

                            {/* Desktop View: Table */}
                            <div className="hidden sm:block overflow-hidden border border-slate-800/60 rounded-2xl shadow-xl">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-950/60 border-b border-slate-800/80 text-left">
                                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-16 text-center">T/r</th>
                                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-32 text-center">Sana</th>
                                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-24 text-center">Soat</th>
                                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Mashg'ulot mavzusi</th>
                                            <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-32 text-center">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {lessons.length > 0 ? (
                                            lessons.map((lesson, index) => (
                                                <tr key={lesson.id} className="hover:bg-slate-950/20 transition-colors">
                                                    <td className="p-4 text-sm font-bold text-slate-500 text-center">{index + 1}</td>
                                                    <td className="p-4 text-sm font-bold text-slate-300 text-center">{lesson.lesson_date || "—"}</td>
                                                    <td className="p-4 text-sm font-bold text-slate-400 text-center">{lesson.hours} soat</td>
                                                    <td className="p-4 text-sm font-semibold text-slate-200 leading-relaxed">{lesson.topic}</td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setEditingLesson(lesson);
                                                                setIsEditLessonOpen(true);
                                                            }}
                                                            className="px-3 py-1.5 text-xs font-bold bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                                                        >
                                                            Tahrirlash
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-sm text-slate-500 font-bold bg-slate-950/20">
                                                    📖 Hozircha o'tilgan mashg'ulotlar mavzulari kiritilmagan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* MODAL 1: YANGI DARS QO'SHISH */}
            {isAddLessonOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">➕ Yangi dars qo'shish</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            Sinf jurnaliga yangi dars ustunini qo'shish
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Dars sanasi</label>
                                <input
                                    type="text"
                                    placeholder="Masalan: 07.XI yoki 26.06.2026"
                                    value={newLesson.date}
                                    onChange={(e) => setNewLesson(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Mavzu</label>
                                <textarea
                                    placeholder="Mashg'ulot mavzusini kiriting..."
                                    value={newLesson.topic}
                                    onChange={(e) => setNewLesson(prev => ({ ...prev, topic: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-semibold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Dars soati</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={newLesson.hours}
                                    onChange={(e) => setNewLesson(prev => ({ ...prev, hours: parseInt(e.target.value) || 2 }))}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsAddLessonOpen(false)}
                                className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!newLesson.date.trim() || !newLesson.topic.trim()) {
                                        alert("Iltimos, barcha maydonlarni to'ldiring!");
                                        return;
                                    }
                                    try {
                                        const { error } = await supabase!.from('lessons').insert({
                                            group_id: parseInt(groupId!),
                                            lesson_date: newLesson.date.trim(),
                                            topic: newLesson.topic.trim(),
                                            hours: newLesson.hours
                                        });
                                        
                                        if (error) {
                                            if (error.message.includes('duplicate key value violates unique constraint')) {
                                                alert(`Bu guruhda ${newLesson.date} sanasidagi dars allaqachon mavjud!`);
                                            } else {
                                                alert(`Dars qo'shishda xatolik: ${error.message}`);
                                            }
                                        } else {
                                            setIsAddLessonOpen(false);
                                            loadData();
                                        }
                                    } catch (err: any) {
                                        alert(`Xatolik: ${err.message}`);
                                    }
                                }}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                            >
                                Qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: HUJAYRA (CELL) TAHRIRLASH (Attendance & Grades) */}
            {isEditCellOpen && editingCell && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">Davomat va Baholash</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            {editingCell.studentName} — {editingCell.lessonDate} darsi
                        </p>
                        
                        <div className="space-y-4">
                            {/* Ishtirok */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">Ishtirok holati</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditingState(prev => ({ ...prev, is_present: true }))}
                                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                                            editingState.is_present
                                                ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50 shadow-lg shadow-emerald-950/20"
                                                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-300"
                                        }`}
                                    >
                                        Bor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingState(prev => ({ ...prev, is_present: false, grade: "" }))}
                                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                                            !editingState.is_present
                                                ? "bg-rose-950/40 text-rose-400 border-rose-900/50 shadow-lg shadow-rose-950/20"
                                                : "bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-300"
                                        }`}
                                    >
                                        NB (Kelmadi)
                                    </button>
                                </div>
                            </div>

                            {/* Baholash */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-2">Baho (faqat ishtirok etgan bo'lsa)</label>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                                    {["5", "4", "3", "2"].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            disabled={!editingState.is_present}
                                            onClick={() => setEditingState(prev => ({ ...prev, grade: g }))}
                                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-sm transition-all border flex items-center justify-center ${
                                                !editingState.is_present
                                                    ? "bg-slate-950/20 border-slate-950 text-slate-600 cursor-not-allowed"
                                                    : editingState.grade === g
                                                        ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20"
                                                        : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-950/60"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                    <button
                                        key="clear"
                                        type="button"
                                        disabled={!editingState.is_present}
                                        onClick={() => setEditingState(prev => ({ ...prev, grade: "" }))}
                                        className={`flex-1 h-9 sm:h-10 rounded-xl font-bold text-xs transition-all border flex items-center justify-center ${
                                            !editingState.is_present
                                                ? "bg-slate-950/20 border-slate-950 text-slate-600 cursor-not-allowed"
                                                : editingState.grade === ""
                                                    ? "bg-blue-600 text-white border-transparent"
                                                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-950/60"
                                        }`}
                                    >
                                        O'chirish
                                    </button>
                                </div>
                                {editingState.is_present && (
                                    <input
                                        type="text"
                                        placeholder="Boshqa baho (Masalan: + yoki -)"
                                        value={editingState.grade}
                                        onChange={(e) => setEditingState(prev => ({ ...prev, grade: e.target.value.slice(0, 3) }))}
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditCellOpen(false)}
                                className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    await handleSaveToSupabase(
                                        editingCell.studentId,
                                        editingCell.lessonDate,
                                        editingState.is_present,
                                        editingState.grade
                                    );
                                    setJournalRecords(prev => ({
                                        ...prev,
                                        [`${editingCell.studentId}-${editingCell.lessonDate}`]: {
                                            is_present: editingState.is_present,
                                            grade: editingState.grade
                                        }
                                    }));
                                    setIsEditCellOpen(false);
                                }}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 3: DARS TAHRIRLASH / O'CHIRISH */}
            {isEditLessonOpen && editingLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">⚙️ Darsni tahrirlash</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            Dars sozlamalarini o'zgartirish yoki darsni o'chirish
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Dars sanasi</label>
                                <input
                                    type="text"
                                    value={editingLesson.lesson_date}
                                    onChange={(e) => setEditingLesson(prev => prev ? ({ ...prev, lesson_date: e.target.value }) : null)}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Mavzu</label>
                                <textarea
                                    value={editingLesson.topic}
                                    onChange={(e) => setEditingLesson(prev => prev ? ({ ...prev, topic: e.target.value }) : null)}
                                    rows={3}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-semibold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Dars soati</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={editingLesson.hours}
                                    onChange={(e) => setEditingLesson(prev => prev ? ({ ...prev, hours: parseInt(e.target.value) || 2 }) : null)}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-6">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditLessonOpen(false)}
                                    className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!editingLesson.lesson_date.trim() || !editingLesson.topic.trim()) {
                                            alert("Iltimos, barcha maydonlarni to'ldiring!");
                                            return;
                                        }
                                        try {
                                            const { error } = await supabase!
                                                .from('lessons')
                                                .update({
                                                    lesson_date: editingLesson.lesson_date.trim(),
                                                    topic: editingLesson.topic.trim(),
                                                    hours: editingLesson.hours
                                                })
                                                .eq('id', editingLesson.id);
                                            
                                            if (error) {
                                                alert(`Saqlashda xatolik: ${error.message}`);
                                            } else {
                                                setIsEditLessonOpen(false);
                                                loadData();
                                            }
                                        } catch (err: any) {
                                            alert(`Xatolik: ${err.message}`);
                                        }
                                    }}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Saqlash
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!confirm("Haqiqatan ham ushbu darsni o'chirib tashlamoqchimisiz? (Shu darsdagi barcha davomat va baholar ham o'chib ketadi!)")) {
                                        return;
                                    }
                                    try {
                                        const { error } = await supabase!
                                            .from('lessons')
                                            .delete()
                                            .eq('id', editingLesson.id);
                                        
                                        if (error) {
                                            alert(`O'chirishda xatolik: ${error.message}`);
                                        } else {
                                            setIsEditLessonOpen(false);
                                            loadData();
                                        }
                                    } catch (err: any) {
                                        alert(`Xatolik: ${err.message}`);
                                    }
                                }}
                                className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/50 text-rose-400 rounded-xl font-bold text-sm transition-all mt-2"
                            >
                                🗑️ Darsni butunlay o'chirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function JournalPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-100">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="font-extrabold text-slate-400 text-sm tracking-wide">Sahifa yuklanmoqda...</div>
            </div>
        }>
            <JournalContent />
        </Suspense>
    );
}