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

interface RecordState {
    is_present: boolean;
    grade: string;
}

function JournalContent() {
    const searchParams = useSearchParams();
    const groupId = searchParams.get("groupId");
    const groupName = searchParams.get("groupName") || "Tanlanmagan guruh";

    const [students, setStudents] = useState<Student[]>([]);
    const [mode, setMode] = useState<"davomat" | "baholash">("davomat");
    const [dateInput, setDateInput] = useState("");
    const [journalRecords, setJournalRecords] = useState<Record<string, RecordState>>({});
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadData() {
            if (!groupId) return;
            setLoading(true);
            setFetchError(null);

            if (!supabase) {
                setFetchError("Supabase ulanish ma'lumotlari (.env faylida) topilmadi. NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY o'zgaruvchilarini tekshiring.");
                setLoading(false);
                return;
            }

            try {
                // Talabalar ro'yxatini yuklash
                const { data: studentsData, error: studentsError } = await supabase
                    .from("students")
                    .select("id, fullName")
                    .eq("group_id", groupId);

                if (studentsError) {
                    setFetchError(`Talabalarni yuklashda xatolik: ${studentsError.message}`);
                    setLoading(false);
                    return;
                }

                // Jurnal yozuvlarini yuklash
                const { data: recordsData, error: recordsError } = await supabase
                    .from("journal_records")
                    .select("*");

                if (recordsError) {
                    setFetchError(`Jurnal yozuvlarini yuklashda xatolik: ${recordsError.message}`);
                    setLoading(false);
                    return;
                }

                if (studentsData) {
                    // Talabalarni alfavit bo'yicha saralash (null safe)
                    const sortedStudents = [...studentsData].sort((a, b) => 
                        (a.fullName || "").localeCompare(b.fullName || "", "uz")
                    );
                    setStudents(sortedStudents);
                }

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
        }
        loadData();
    }, [groupId]);

    // Shift + : klaviatura kombinatsiyasini tinglash
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ":" || (e.shiftKey && e.key === ";")) {
                e.preventDefault();
                const today = new Date();
                const day = String(today.getDate()).padStart(2, "0");
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const year = today.getFullYear();
                const formattedDate = `${day}.${month}.${year}`;
                
                setDateInput(formattedDate);
                setTimeout(() => {
                    dateInputRef.current?.focus();
                }, 10);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Ma'lumotlarni Supabase-ga saqlash (Upsert)
    async function handleSaveToSupabase(studentId: string | number, date: string, isPresent: boolean, gradeValue: string) {
        if (!date) return;
        try {
            await supabase.from("journal_records").upsert(
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

    const toggleAttendance = async (studentId: string | number) => {
        if (!dateInput) {
            alert("Iltimos, avval dars sanasini kiriting (yoki Shift + : bosing)!");
            dateInputRef.current?.focus();
            return;
        }
        const key = `${studentId}-${dateInput}`;
        const current = journalRecords[key] || { is_present: true, grade: "" };
        const nextIsPresent = !current.is_present;

        const updatedState = {
            ...journalRecords,
            [key]: { 
                ...current, 
                is_present: nextIsPresent,
                // Agar NB bo'lsa, bahoni o'chiramiz
                grade: nextIsPresent ? current.grade : ""
            },
        };
        setJournalRecords(updatedState);
        await handleSaveToSupabase(studentId, dateInput, nextIsPresent, nextIsPresent ? current.grade : "");
    };

    const handleGradeChange = async (studentId: string | number, value: string) => {
        if (!dateInput) {
            alert("Iltimos, avval dars sanasini kiriting (yoki Shift + : bosing)!");
            dateInputRef.current?.focus();
            return;
        }
        const key = `${studentId}-${dateInput}`;
        const current = journalRecords[key] || { is_present: true, grade: "" };

        // Max length 2 characters
        const cleanValue = value.slice(0, 2);

        const updatedState = {
            ...journalRecords,
            [key]: { ...current, grade: cleanValue },
        };
        setJournalRecords(updatedState);
        await handleSaveToSupabase(studentId, dateInput, current.is_present, cleanValue);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-100">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="font-extrabold text-slate-400 text-sm tracking-wide">Onlayn bazadan ma'lumotlar yuklanmoqda...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-zinc-950 p-4 sm:p-6 lg:p-8 text-slate-100 antialiased">
            <div className="max-w-5xl mx-auto">
                
                {/* Back Link & Mode Toggler Container */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/40 p-3 rounded-2xl backdrop-blur-sm border border-slate-800/60">
                    <a href="/" className="group inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-800/40">
                        <span className="group-hover:-translate-x-0.5 transition-transform">⬅️</span> 
                        Guruhlar ro'yxatiga qaytish
                    </a>

                    <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800/40">
                        <button
                            onClick={() => setMode("davomat")}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                                mode === "davomat" 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            📋 Davomat rejimi
                        </button>
                        <button
                            onClick={() => setMode("baholash")}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                                mode === "baholash" 
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" 
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            ⭐ Baholash rejimi
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {fetchError && (
                    <div className="mb-8 p-6 bg-rose-950/20 border border-rose-900/50 rounded-3xl text-rose-200 text-sm shadow-sm">
                        <h3 className="font-extrabold text-rose-300 text-base mb-1">⚠️ Ma'lumotlarni yuklashda xatolik yuz berdi</h3>
                        <p className="font-semibold text-rose-400/90 mb-3">{fetchError}</p>
                        <p className="text-xs text-rose-500 font-medium">
                            Iltimos, Supabase ulanishi, internet aloqasi yoki loyihaning <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold text-slate-200">.env</code> faylidagi konfiguratsiya to'g'riligini tekshiring.
                        </p>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800/60">
                    
                    {/* Header Info & Date Input */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/60 pb-6 mb-8">
                        <div>
                            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-900/40">
                                Elektron Jurnal
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">{groupName}</h1>
                            <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Fan: Tibbiyotda Axborot Texnologiyalari
                            </p>
                        </div>

                        <div className="w-full md:w-auto">
                            <div className="bg-slate-950/40 border border-slate-800/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex flex-col">
                                    <label className="text-xs font-extrabold text-slate-400">Dars sanasi</label>
                                    <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">Tezkor: Shift + :</span>
                                </div>
                                <input
                                    ref={dateInputRef}
                                    type="text"
                                    placeholder="Kun.Oy.Yil (Masalan: 26.06.2026)"
                                    value={dateInput}
                                    onChange={(e) => setDateInput(e.target.value)}
                                    className="border border-slate-800 px-4 py-2.5 rounded-xl text-sm w-full sm:w-56 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-center placeholder-slate-500 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Keyboard Shortcut Banner */}
                    {!dateInput && (
                        <div className="mb-6 p-3 bg-blue-950/20 border border-blue-900/30 text-xs font-semibold text-blue-300 rounded-2xl flex items-center gap-2">
                            <span className="text-sm">💡</span>
                            <span>Dars sanasini tezkor kiritish uchun klaviaturada <strong>Shift + :</strong> (ikki nuqta) tugmalarini bosing.</span>
                        </div>
                    )}

                    {/* Table Container */}
                    <div className="overflow-hidden border border-slate-800/60 rounded-2xl shadow-xl">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-950/60 border-b border-slate-800/80 text-left">
                                    <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider w-12 text-center">T/r</th>
                                    <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Talaba ismi-sharifi</th>
                                    <th className="p-4 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center w-40">
                                        {dateInput ? `Sana: ${dateInput}` : "Holat / Baho"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {students.length > 0 ? (
                                    students.map((student, index) => {
                                        const key = `${student.id}-${dateInput}`;
                                        const record = journalRecords[key] || { is_present: true, grade: "" };

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-950/20 transition-colors">
                                                <td className="p-4 text-sm font-bold text-slate-500 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="p-4 text-sm font-extrabold text-slate-200">
                                                    {student.fullName}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {mode === "davomat" ? (
                                                        <button
                                                            onClick={() => toggleAttendance(student.id)}
                                                            className={`px-4 py-1.5 text-xs font-black rounded-xl border transition-all duration-200 min-w-[70px] shadow-sm transform active:scale-95 ${
                                                                record.is_present
                                                                    ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/50 hover:bg-emerald-950/50"
                                                                    : "bg-rose-600 text-white border-transparent hover:bg-rose-500 shadow-md shadow-rose-900/20"
                                                            }`}
                                                        >
                                                            {record.is_present ? "Bor" : "NB"}
                                                        </button>
                                                    ) : (
                                                        <div className="inline-block relative">
                                                            <input
                                                                type="text"
                                                                disabled={!record.is_present}
                                                                value={record.is_present ? record.grade : ""}
                                                                onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                                className={`w-16 text-center border p-2 rounded-xl font-black text-sm transition-all focus:outline-none focus:ring-2 ${
                                                                    record.is_present
                                                                        ? "bg-slate-950 border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-500 text-white shadow-inner"
                                                                        : "bg-slate-900/60 border-slate-950 text-slate-600 cursor-not-allowed"
                                                                }`}
                                                                placeholder={record.is_present ? "-" : "NB"}
                                                                maxLength={2}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-12 text-sm text-slate-500 font-bold bg-slate-950/20">
                                            👥 Bu guruhda hozircha talabalar mavjud emas.
                                        </td>
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