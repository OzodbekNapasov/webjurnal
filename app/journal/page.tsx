"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

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

    // Tahrirlash rejimi (Lock/Unlock)
    const [isEditable, setIsEditable] = useState(false);

    // Baholarning ranglarini aniqlash funksiyasi
    const getGradeStyle = (grade: string) => {
        switch (grade) {
            case "5":
                return "bg-emerald-950/40 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10";
            case "4":
                return "bg-blue-950/40 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-500/10";
            case "3":
                return "bg-amber-950/40 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/10";
            case "2":
                return "bg-rose-950/40 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/10";
            case "+":
                return "bg-indigo-950/40 text-indigo-400 border-indigo-500/40 shadow-sm shadow-indigo-500/10";
            case "-":
                return "bg-slate-900/50 text-slate-400 border-slate-750";
            default:
                return "bg-slate-900/40 text-slate-300 border-slate-800";
        }
    };

    // Baholash modalidagi faol tugma ranglari
    const getGradeButtonActiveStyle = (g: string) => {
        switch (g) {
            case "5": return "bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-500/30";
            case "4": return "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/30";
            case "3": return "bg-amber-600 text-white border-transparent shadow-lg shadow-amber-500/30";
            case "2": return "bg-rose-600 text-white border-transparent shadow-lg shadow-rose-500/30";
            case "+": return "bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-500/30";
            case "-": return "bg-slate-600 text-white border-transparent shadow-lg shadow-slate-500/30";
            default: return "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/30";
        }
    };

    // Vazifa rejimi (Davomat yoki Baholash)
    const [journalMode, setJournalMode] = useState<"davomat" | "baholash">("davomat");

    // Yangi talaba qo'shish modal holati
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");

    // Hujayra (Cell) tahrirlash modal holati
    const [isEditCellOpen, setIsEditCellOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<{
        studentId: string | number;
        studentName: string;
        lessonId: number;
        lessonDate: string;
    } | null>(null);
    const [editingState, setEditingState] = useState<RecordState>({ is_present: true, grade: "" });

    // Darsni tahrirlash modal holati
    const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    // Talabani boshqa guruhga o'tkazish modal holati
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [transferringStudent, setTransferringStudent] = useState<Student | null>(null);
    const [allGroups, setAllGroups] = useState<{ id: number; name: string }[]>([]);
    const [targetGroupId, setTargetGroupId] = useState<number | string>("");

    // Yangi dars qo'shish modal holati
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [newLessonDate, setNewLessonDate] = useState("");
    const [newLessonTopic, setNewLessonTopic] = useState("");
    const [newLessonHours, setNewLessonHours] = useState(2);

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
            const lessonIds = lessonsData?.map(l => l.id) || [];
            let recordsData: any[] = [];
            if (lessonIds.length > 0) {
                const { data, error: recordsError } = await supabase
                    .from("journal_records")
                    .select("id, student_id, lesson_id, is_present, grade")
                    .in("lesson_id", lessonIds);

                if (recordsError) {
                    if (recordsError.message.includes("lesson_id")) {
                        setFetchError('journal_records_schema_outdated');
                    } else {
                        setFetchError(`Jurnal yozuvlarini yuklashda xatolik: ${recordsError.message}`);
                    }
                    setLoading(false);
                    return;
                }
                recordsData = data || [];
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
                const key = `${rec.student_id}-${rec.lesson_id}`;
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

    useEffect(() => {
        if (isTransferModalOpen) {
            const fetchGroups = async () => {
                if (!supabase) return;
                const { data, error } = await supabase
                    .from('groups')
                    .select('id, name')
                    .order('name', { ascending: true });
                if (!error && data) {
                    setAllGroups(data);
                    const otherGroups = data.filter(g => g.id.toString() !== groupId);
                    if (otherGroups.length > 0) {
                        setTargetGroupId(otherGroups[0].id);
                    }
                }
            };
            fetchGroups();
        }
    }, [isTransferModalOpen]);

    // Ma'lumotlarni Supabase-ga saqlash (Upsert)
    async function handleSaveToSupabase(studentId: string | number, lessonId: number, isPresent: boolean, gradeValue: string) {
        if (!supabase) return;
        try {
            await supabase.from("journal_records").upsert(
                {
                    student_id: studentId.toString(),
                    lesson_id: lessonId,
                    is_present: isPresent,
                    grade: gradeValue || null,
                },
                { onConflict: "student_id,lesson_id" }
            );
        } catch (error) {
            console.error("Supabase-ga yozishda xatolik:", error);
        }
    }

    // Jurnal jadvalini Excel-ga eksport qilish
    const handleExportJournal = () => {
        const headers = ["T/r", "Talaba ismi-sharifi", ...lessons.map((l, idx) => `${l.lesson_date || 'Sana kiritilmagan'} (${idx + 1}-dars)`)];
        
        const rows = students.map((student, sIdx) => {
            const studentRow: (string | number)[] = [
                sIdx + 1,
                student.fullName
            ];
            lessons.forEach(lesson => {
                const key = `${student.id}-${lesson.id}`;
                const record = journalRecords[key];
                if (record) {
                    if (!record.is_present) {
                        studentRow.push("NB");
                    } else {
                        studentRow.push(record.grade || "—");
                    }
                } else {
                    studentRow.push("—");
                }
            });
            return studentRow;
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Jurnal Jadvali");
        XLSX.writeFile(workbook, `${groupName.replace(/[\/\\?%*:|"<>]/g, '_')}_Jurnal.xlsx`);
    };

    // O'tilgan mavzularni Excel-ga eksport qilish
    const handleExportLessons = () => {
        const headers = ["T/r", "Sana", "Mashg'ulot soati", "Mashg'ulot mavzusi"];
        
        const rows = lessons.map((lesson, idx) => [
            idx + 1,
            lesson.lesson_date || "—",
            `${lesson.hours} soat`,
            lesson.topic || "—"
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "O'tilgan Mavzular");
        XLSX.writeFile(workbook, `${groupName.replace(/[\/\\?%*:|"<>]/g, '_')}_O'tilgan_Mavzular.xlsx`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-100">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="font-extrabold text-slate-400 text-sm tracking-wide">Onlayn bazadan ma'lumotlar yuklanmoqda...</div>
            </div>
        );
    }

    // "journal_records" jadvali sxemasi eski bo'lsa ko'rsatiladigan oyna
    if (fetchError === 'journal_records_schema_outdated') {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center text-slate-100">
                <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-lg font-black text-rose-400 mb-3 flex items-center gap-2">
                        ⚠️ Ma'lumotlar bazasini yangilash zarur
                    </h3>
                    <p className="text-sm text-slate-300 font-semibold mb-4 leading-relaxed">
                        Supabase ma'lumotlar bazangizda `journal_records` jadvali sxemasini yangilashingiz kerak. Yangi tizim darslarni xavfsiz ID bog'lanishi orqali saqlaydi va bir xil baho takrorlanishi muammosini to'liq bartaraf etadi.
                    </p>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
                        <span className="text-xs font-bold text-slate-500 block mb-2 uppercase">Bajariladigan SQL Kod</span>
                        <code className="text-xs font-mono text-emerald-400 block break-all whitespace-pre bg-slate-950 p-2 rounded-xl mt-1 select-all">
{`DROP TABLE IF EXISTS journal_records;

CREATE TABLE journal_records (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    is_present BOOLEAN NOT NULL DEFAULT true,
    grade TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_student_lesson UNIQUE (student_id, lesson_id)
);

ALTER TABLE journal_records DISABLE ROW LEVEL SECURITY;`}
                        </code>
                    </div>
                    <p className="text-xs text-slate-400 mb-6 font-medium">
                        **Ko'rsatma:** Ushbu kodni nusxalab oling, Supabase Dashboard-dagi **SQL Editor** bo'limiga o'ting, kodni joylab **Run** tugmasini bosing va sahifani qayta yangilang.
                    </p>
                    <button
                        onClick={loadData}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20"
                    >
                        ✓ Bazani yangiladim, sahifani yangilash
                    </button>
                </div>
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

                        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setNewStudentName("");
                                    setIsAddStudentOpen(true);
                                }}
                                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-900/40 hover:border-blue-500/50 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                            >
                                <span>👥</span> Yangi talaba qo'shish
                            </button>
                            <button
                                onClick={() => {
                                    setNewLessonDate(getTodayFormatted());
                                    setNewLessonTopic("");
                                    setNewLessonHours(2);
                                    setIsAddLessonOpen(true);
                                }}
                                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            >
                                <span>📅</span> Yangi dars qo'shish
                            </button>
                        </div>
                    </div>

                    {activeTab === "jurnal" ? (
                        /* TAB 1: JURNAL GRIDA JADVALI */
                        <div>
                            {/* Mode Selector */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/40">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">⚙️</span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs sm:text-sm font-extrabold text-white">Vazifani tanlang:</h4>
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                                isEditable 
                                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
                                                    : "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                                            }`}>
                                                {isEditable ? "🔓 Tahrirlash ochiq" : "🔒 Qulflangan"}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-semibold">Tegishli katakchani bosish orqali amal bajariladi</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto bg-slate-900/65 p-1 rounded-xl border border-slate-800/60">
                                    <button
                                        onClick={() => setJournalMode("davomat")}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                            journalMode === "davomat"
                                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/35 shadow-sm"
                                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                                        }`}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                        🔵 Davomat (NB belgilash)
                                    </button>
                                    <button
                                        onClick={() => setJournalMode("baholash")}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                            journalMode === "baholash"
                                                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/35 shadow-sm"
                                                : "text-slate-400 hover:text-slate-200 border border-transparent"
                                        }`}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        🟢 Baholash (Baho qo'yish)
                                    </button>
                                </div>
                            </div>

                            {/* Darslar va talabalar ikkalasi ham kiritilmagan bo'lsa */}
                            {lessons.length === 0 && students.length === 0 ? (
                                <div className="text-center py-16 bg-slate-950/20 rounded-2xl border border-slate-800/40">
                                    <span className="text-4xl block mb-3">📅</span>
                                    <h4 className="text-base font-bold text-slate-300">Guruhda talabalar va darslar mavjud emas</h4>
                                    <p className="text-xs text-slate-500 font-semibold mt-1 mb-6 max-w-md mx-auto">
                                        Tahrirlash rejimini yoqib yangi talaba qo'shing yoki yuqoridagi "Yangi dars qo'shish" tugmasi orqali dars qo'shing.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {/* Darslar mavjud bo'lmasa, lekin talabalar bo'lsa ko'rsatiladigan ma'lumot banneri */}
                                    {lessons.length === 0 && (
                                        <div className="mb-6 p-4 bg-blue-950/20 border border-blue-900/40 rounded-2xl text-blue-300 text-xs font-semibold flex items-center gap-2">
                                            <span>ℹ️</span>
                                            <span>Ushbu guruh uchun hali darslar kiritilmagan. Davomat olish va baholashni boshlash uchun "Yangi dars qo'shish" tugmasidan foydalaning.</span>
                                        </div>
                                    )}
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
                                                    {lessons.map((lesson, index) => {
                                                        const isToday = lesson.lesson_date === getTodayFormatted();
                                                        return (
                                                            <th 
                                                                key={lesson.id} 
                                                                onClick={() => {
                                                                    setEditingLesson(lesson);
                                                                    setIsEditLessonOpen(true);
                                                                }}
                                                                className={`p-2 sm:p-4 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-center w-20 min-w-[80px] sm:w-24 sm:min-w-[96px] border-l border-slate-800/40 cursor-pointer hover:bg-slate-950/80 transition-colors ${
                                                                    isToday 
                                                                        ? "bg-blue-500/15 text-blue-300 border-x border-blue-500/30" 
                                                                        : "text-slate-400"
                                                                }`}
                                                                title={`${index + 1}-dars: ${lesson.topic || 'Mavzu kiritilmagan'} (${lesson.hours} soat, Tahrirlash/O'chirish)`}
                                                            >
                                                                <div className="flex flex-col items-center relative">
                                                                    {isToday && (
                                                                        <span className="absolute -top-3.5 px-1.5 py-0.2 text-[7px] sm:text-[8px] font-black tracking-wider bg-blue-600 text-white rounded uppercase animate-pulse shadow-sm shadow-blue-500/20">
                                                                            Bugun
                                                                        </span>
                                                                    )}
                                                                    <span className="hover:underline tracking-tight block text-[11px] sm:text-xs mt-1">{lesson.lesson_date || "Sana?"}</span>
                                                                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold mt-0.5">{index + 1}-dars</span>
                                                                </div>
                                                            </th>
                                                        );
                                                    })}
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
                                                                <div className="flex items-center justify-between gap-1 w-full">
                                                                    <span className="truncate">{student.fullName}</span>
                                                                    {isEditable && (
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setTransferringStudent(student);
                                                                                setIsTransferModalOpen(true);
                                                                            }}
                                                                            className="p-1 sm:p-1.5 text-[10px] bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-opacity"
                                                                            title="Guruhdan boshqa guruhga o'tkazish"
                                                                        >
                                                                            🔄
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            {lessons.map((lesson) => {
                                                                const key = `${student.id}-${lesson.id}`;
                                                                const record = journalRecords[key] || { is_present: true, grade: "" };
                                                                const isToday = lesson.lesson_date === getTodayFormatted();

                                                                return (
                                                                    <td 
                                                                        key={lesson.id} 
                                                                        onClick={async () => {
                                                                            if (!isEditable) {
                                                                                alert("O'zgartirish kiritish uchun iltimos tahrirlash rejimini yoqing (pastdagi 'Tahrirlash' tugmasini bosing).");
                                                                                return;
                                                                            }
                                                                            if (journalMode === "davomat") {
                                                                                const newIsPresent = !record.is_present;
                                                                                setJournalRecords(prev => ({
                                                                                    ...prev,
                                                                                    [`${student.id}-${lesson.id}`]: {
                                                                                        is_present: newIsPresent,
                                                                                        grade: ""
                                                                                    }
                                                                                }));
                                                                                await handleSaveToSupabase(student.id, lesson.id, newIsPresent, "");
                                                                            } else {
                                                                                setEditingCell({
                                                                                    studentId: student.id,
                                                                                    studentName: student.fullName,
                                                                                    lessonId: lesson.id,
                                                                                    lessonDate: lesson.lesson_date || `Dars #${lesson.id}`
                                                                                });
                                                                                setEditingState({
                                                                                    is_present: record.is_present,
                                                                                    grade: record.grade || ""
                                                                                });
                                                                                setIsEditCellOpen(true);
                                                                            }
                                                                        }}
                                                                        className={`p-2 sm:p-3 text-center border-l border-slate-800/30 transition-colors w-20 min-w-[80px] sm:w-24 sm:min-w-[96px] ${
                                                                            isEditable 
                                                                                ? "cursor-pointer hover:bg-blue-950/10" 
                                                                                : "cursor-not-allowed opacity-85"
                                                                        } ${
                                                                            isToday 
                                                                                ? "bg-blue-500/5 border-x border-blue-500/20" 
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {!record.is_present ? (
                                                                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-black rounded bg-rose-950/40 text-rose-400 border border-rose-900/40 shadow-sm">
                                                                                NB
                                                                            </span>
                                                                        ) : record.grade ? (
                                                                            <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-black text-xs sm:text-sm border ${getGradeStyle(record.grade)}`}>
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
                                    {/* Actions & Excel Export Row */}
                                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-800/40">
                                        {/* Lock / Unlock Actions */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    setIsEditable(true);
                                                }}
                                                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                                                    isEditable
                                                        ? "bg-slate-950/60 text-slate-500 border border-slate-850 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
                                                }`}
                                                disabled={isEditable}
                                            >
                                                ✍️ Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditable(false);
                                                    alert("Muvaffaqiyatli saqlandi va tahrirlashdan qulflandi!");
                                                }}
                                                className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                                                    !isEditable
                                                        ? "bg-slate-950/60 text-slate-500 border border-slate-850 cursor-not-allowed"
                                                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
                                                }`}
                                                disabled={!isEditable}
                                            >
                                                💾 Saqlash
                                            </button>
                                        </div>

                                        {/* Excel Button */}
                                        <button
                                            onClick={handleExportJournal}
                                            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            📥 Excelga eksport qilish
                                        </button>
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
                                    lessons.map((lesson, index) => {
                                        const isToday = lesson.lesson_date === getTodayFormatted();
                                        return (
                                            <div 
                                                key={lesson.id} 
                                                className={`p-4 border rounded-2xl space-y-2 shadow-lg animate-fadeIn transition-all ${
                                                    isToday
                                                        ? "bg-blue-950/20 border-blue-500/40 ring-1 ring-blue-500/10 shadow-blue-500/5"
                                                        : "bg-slate-950/40 border-slate-800/60"
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                                                        isToday
                                                            ? "bg-blue-600 text-white border-transparent"
                                                            : "text-blue-400 bg-blue-950/60 border-blue-900/40"
                                                    }`}>
                                                        {index + 1}-dars {isToday && "(Bugun)"}
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
                                        );
                                    })
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
                                            lessons.map((lesson, index) => {
                                                const isToday = lesson.lesson_date === getTodayFormatted();
                                                return (
                                                    <tr 
                                                        key={lesson.id} 
                                                        className={`transition-colors ${
                                                            isToday
                                                                ? "bg-blue-950/20 hover:bg-blue-950/30 border-y border-blue-500/25"
                                                                : "hover:bg-slate-950/20"
                                                        }`}
                                                    >
                                                        <td className="p-4 text-sm font-bold text-slate-500 text-center">
                                                            {index + 1}
                                                            {isToday && (
                                                                <span className="ml-1.5 px-1 py-0.5 text-[8px] font-extrabold bg-blue-600 text-white rounded">Bugun</span>
                                                            )}
                                                        </td>
                                                        <td className={`p-4 text-sm font-bold text-center ${isToday ? "text-blue-300" : "text-slate-300"}`}>{lesson.lesson_date || "—"}</td>
                                                        <td className={`p-4 text-sm font-bold text-center ${isToday ? "text-blue-400/90" : "text-slate-400"}`}>{lesson.hours} soat</td>
                                                        <td className={`p-4 text-sm font-semibold leading-relaxed ${isToday ? "text-blue-100" : "text-slate-200"}`}>{lesson.topic}</td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingLesson(lesson);
                                                                    setIsEditLessonOpen(true);
                                                                }}
                                                                className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors ${
                                                                    isToday
                                                                        ? "bg-blue-600 hover:bg-blue-500 border-transparent text-white shadow-md shadow-blue-500/10"
                                                                        : "bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                                                                }`}
                                                            >
                                                                Tahrirlash
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
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
                            {/* Excel Export Button */}
                            {lessons.length > 0 && (
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleExportLessons}
                                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 transform hover:-translate-y-0.5"
                                    >
                                        📥 Excelga eksport qilish
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* MODAL 1: YANGI TALABA QO'SHISH */}
            {isAddStudentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">➕ Yangi talaba qo'shish</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            Guruhga yangi talaba ismini qo'shish
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Talabalar ro'yxati (F.I.Sh.)</label>
                                <textarea
                                    placeholder="Har bir talabani alohida yangi qatordan yozing. Masalan:&#10;ALIMOV VALI OLIM O'G'LI&#10;KARIMOV HASAN HUSAN O'G'LI"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    rows={6}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner resize-none font-mono"
                                />
                                <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Har bir ismdan keyin Enter tugmasini bosing</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsAddStudentOpen(false)}
                                className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    const names = newStudentName.split('\n').map(n => n.trim()).filter(n => n.length > 0);
                                    if (names.length === 0) {
                                        alert("Iltimos, kamida bitta talaba ismini kiriting!");
                                        return;
                                    }
                                    try {
                                        // 1. Fetch current students to compute starting ID
                                        const { data: currentStudents, error: fetchErr } = await supabase!
                                            .from('students')
                                            .select('id');
                                        
                                        if (fetchErr) {
                                            alert(`Talabalarni olishda xatolik: ${fetchErr.message}`);
                                            return;
                                        }

                                        let startId = 1;
                                        if (currentStudents && currentStudents.length > 0) {
                                            const numericIds = currentStudents.map(s => parseInt(s.id)).filter(n => !isNaN(n));
                                            if (numericIds.length > 0) {
                                                startId = Math.max(...numericIds) + 1;
                                            }
                                        }

                                        const recordsToInsert = names.map((name, index) => ({
                                            id: (startId + index).toString(),
                                            fullName: name.toUpperCase(),
                                            group_id: parseInt(groupId!)
                                        }));

                                        // 2. Batch insert
                                        const { error: insertErr } = await supabase!
                                            .from('students')
                                            .insert(recordsToInsert);
                                        
                                        if (insertErr) {
                                            alert(`Talabalarni qo'shishda xatolik: ${insertErr.message}`);
                                        } else {
                                            setIsAddStudentOpen(false);
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

            {/* MODAL 2: HUJAYRA (CELL) TAHRIRLASH (Quick Grades & Autosave) */}
            {isEditCellOpen && editingCell && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">🟢 Baho qo'yish</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            {editingCell.studentName} — {editingCell.lessonDate}
                        </p>
                        
                        <div className="space-y-4">
                            {/* Baholar to'plami */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Baholardan birini tanlang:</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["5", "4", "3", "2"].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={async () => {
                                                setJournalRecords(prev => ({
                                                    ...prev,
                                                    [`${editingCell.studentId}-${editingCell.lessonId}`]: {
                                                        is_present: true,
                                                        grade: g
                                                    }
                                                }));
                                                setIsEditCellOpen(false);
                                                await handleSaveToSupabase(editingCell.studentId, editingCell.lessonId, true, g);
                                            }}
                                            className={`py-3 rounded-xl font-black text-sm transition-all border flex items-center justify-center ${
                                                editingState.grade === g
                                                    ? getGradeButtonActiveStyle(g)
                                                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-950/60 hover:border-slate-700"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                    {["+", "-"].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={async () => {
                                                setJournalRecords(prev => ({
                                                    ...prev,
                                                    [`${editingCell.studentId}-${editingCell.lessonId}`]: {
                                                        is_present: true,
                                                        grade: g
                                                    }
                                                }));
                                                setIsEditCellOpen(false);
                                                await handleSaveToSupabase(editingCell.studentId, editingCell.lessonId, true, g);
                                            }}
                                            className={`py-3 rounded-xl font-black text-sm transition-all border flex items-center justify-center ${
                                                editingState.grade === g
                                                    ? getGradeButtonActiveStyle(g)
                                                    : "bg-slate-950/40 text-slate-300 border-slate-800 hover:bg-slate-950/60 hover:border-slate-700"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Boshqa belgilar */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Boshqa belgi (Kiriting va bosing):</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Masalan: 4/5"
                                        value={editingState.grade}
                                        onChange={(e) => setEditingState(prev => ({ ...prev, grade: e.target.value.slice(0, 5) }))}
                                        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const trimGrade = editingState.grade.trim();
                                            setJournalRecords(prev => ({
                                                ...prev,
                                                [`${editingCell.studentId}-${editingCell.lessonId}`]: {
                                                    is_present: true,
                                                    grade: trimGrade
                                                }
                                            }));
                                            setIsEditCellOpen(false);
                                            await handleSaveToSupabase(editingCell.studentId, editingCell.lessonId, true, trimGrade);
                                        }}
                                        className="px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors"
                                    >
                                        Qo'yish
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-slate-800/60">
                            <button
                                type="button"
                                onClick={async () => {
                                    setJournalRecords(prev => ({
                                        ...prev,
                                        [`${editingCell.studentId}-${editingCell.lessonId}`]: {
                                            is_present: true,
                                            grade: ""
                                        }
                                    }));
                                    setIsEditCellOpen(false);
                                    await handleSaveToSupabase(editingCell.studentId, editingCell.lessonId, true, "");
                                }}
                                className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/35 border border-rose-900/50 text-rose-400 hover:text-rose-300 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                            >
                                🗑️ Bahoni olib tashlash (O'chirish)
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setIsEditCellOpen(false)}
                                className="w-full py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-300 rounded-xl font-bold text-xs transition-all"
                            >
                                Bekor qilish
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
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Kun.Oy.Yil (Masalan: 27.06.2026)"
                                        value={editingLesson.lesson_date}
                                        onChange={(e) => setEditingLesson(prev => prev ? ({ ...prev, lesson_date: e.target.value }) : null)}
                                        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm("Bugungi sanani qo'yasizmi?")) {
                                                setEditingLesson(prev => prev ? ({ ...prev, lesson_date: getTodayFormatted() }) : null);
                                            }
                                        }}
                                        className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                                    >
                                        📅 Bugun
                                    </button>
                                </div>
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
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 4: TALABANI BOSHQA GURUHGA O'TKAZISH */}
            {isTransferModalOpen && transferringStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">🔄 Talabani boshqa guruhga o'tkazish</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            Talaba: <span className="text-blue-400">{transferringStudent.fullName}</span>
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1.5">Yangi guruhni tanlang:</label>
                                <select
                                    value={targetGroupId}
                                    onChange={(e) => setTargetGroupId(e.target.value)}
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500 shadow-inner"
                                >
                                    {allGroups
                                        .filter(g => g.id.toString() !== groupId)
                                        .map(g => (
                                            <option key={g.id} value={g.id} className="bg-slate-950 text-white font-semibold">
                                                {g.name.trim()}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsTransferModalOpen(false)}
                                className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!targetGroupId) {
                                        alert("Iltimos, guruhni tanlang!");
                                        return;
                                    }
                                    try {
                                        const { error } = await supabase!
                                            .from('students')
                                            .update({ group_id: parseInt(targetGroupId.toString()) })
                                            .eq('id', transferringStudent.id);
                                        
                                        if (error) {
                                            alert(`O'tkazishda xatolik: ${error.message}`);
                                        } else {
                                            setIsTransferModalOpen(false);
                                            alert("Talaba muvaffaqiyatli boshqa guruhga o'tkazildi!");
                                            loadData();
                                        }
                                    } catch (err: any) {
                                        alert(`Xatolik: ${err.message}`);
                                    }
                                }}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                            >
                                O'tkazish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 5: YANGI DARS QO'SHISH */}
            {isAddLessonOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[95%] sm:w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-2">📅 Yangi dars qo'shish</h3>
                        <p className="text-xs text-slate-400 font-bold mb-4">
                            Guruh jurnaliga yangi dars mavzusi va sanasini qo'shish
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Dars sanasi</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Kun.Oy.Yil (Masalan: 27.06.2026)"
                                        value={newLessonDate}
                                        onChange={(e) => setNewLessonDate(e.target.value)}
                                        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNewLessonDate(getTodayFormatted())}
                                        className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                                    >
                                        📅 Bugun
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Mavzu</label>
                                <textarea
                                    value={newLessonTopic}
                                    onChange={(e) => setNewLessonTopic(e.target.value)}
                                    rows={3}
                                    placeholder="Dars mavzusini kiriting..."
                                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-semibold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1">Dars soati</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={newLessonHours}
                                    onChange={(e) => setNewLessonHours(parseInt(e.target.value) || 2)}
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
                                    if (!newLessonDate.trim() || !newLessonTopic.trim()) {
                                        alert("Iltimos, barcha maydonlarni to'ldiring!");
                                        return;
                                    }
                                    try {
                                        const { error } = await supabase!
                                            .from('lessons')
                                            .insert({
                                                group_id: parseInt(groupId!),
                                                lesson_date: newLessonDate.trim(),
                                                topic: newLessonTopic.trim(),
                                                hours: newLessonHours,
                                                subject_name: 'Tibbiyotda Axborot Texnologiyalari'
                                            });
                                        
                                        if (error) {
                                            alert(`Qo'shishda xatolik: ${error.message}`);
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