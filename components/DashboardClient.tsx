'use client';

import React, { useState, useEffect } from 'react';
import { Pen, Trash, Settings, Upload, Download, AlertTriangle } from './Icon';


interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

export default function DashboardClient() {
    // --- Backup & Restore States ---
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreStatus, setRestoreStatus] = useState('');

    // --- Todo/Memo Board States ---
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodoText, setNewTodoText] = useState('');

    // Load todos on mount
    useEffect(() => {
        const saved = localStorage.getItem('teacher_todos');
        if (saved) {
            try {
                setTodos(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Save todos helper
    const saveTodos = (newTodos: TodoItem[]) => {
        setTodos(newTodos);
        localStorage.setItem('teacher_todos', JSON.stringify(newTodos));
    };

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoText.trim()) return;

        const newItem: TodoItem = {
            id: Date.now().toString(),
            text: newTodoText.trim(),
            completed: false
        };

        saveTodos([...todos, newItem]);
        setNewTodoText('');
    };

    const handleToggleTodo = (id: string) => {
        const updated = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos(updated);
    };

    const handleDeleteTodo = (id: string) => {
        const updated = todos.filter(todo => todo.id !== id);
        saveTodos(updated);
    };

    // --- Backup & Restore Handlers ---
    const handleBackup = () => {
        window.location.href = '/api/backup';
    };

    const handleRestoreFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                
                // Simple validation
                if (!json.groups || !json.students || !json.semesters || !json.lessons || !json.journal_records) {
                    alert("Xatolik! Yuklangan fayl bazaning to'g'ri zaxira nusxasi emas.");
                    return;
                }

                const confirmed = window.confirm(
                    "DIQQAT! Ushbu zaxira faylidan ma'lumotlarni qayta tiklashni xohlaysizmi?\n" +
                    "Hozirgi barcha guruhlar, talabalar va baholaringiz o'chib ketadi va fayldagi ma'lumotlar bilan almashtiriladi."
                );

                if (!confirmed) return;

                setIsRestoring(true);
                setRestoreStatus('Ma\'lumotlar bazasi qayta tiklanmoqda...');

                const res = await fetch('/api/restore', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(json)
                });

                const result = await res.json();
                setIsRestoring(false);

                if (res.ok && result.status === 'success') {
                    alert(
                        "Muvaffaqiyatli tiklandi!\n\n" +
                        `• Guruhlar: ${result.restored.groups} ta\n` +
                        `• Semestrlar: ${result.restored.semesters} ta\n` +
                        `• Talabalar: ${result.restored.students} ta\n` +
                        `• Darslar: ${result.restored.lessons} ta\n` +
                        `• Baholar/NBlar: ${result.restored.journal_records} ta`
                    );
                    window.location.reload();
                } else {
                    alert("Tiklashda xatolik yuz berdi: " + (result.error || 'Noma\'lum xato'));
                }
            } catch (err: any) {
                setIsRestoring(false);
                alert("JSON faylini o'qishda xatolik yuz berdi: " + err.message);
            }
        };
        reader.readAsText(file);
        
        // Reset file input so same file can be selected again
        event.target.value = '';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* 1. To-Do Checklist Card (Span 2 for wider workspace) */}
            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800/60 shadow-xl flex flex-col justify-between min-h-[300px]">
                <div>
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-400"><Pen className="w-5 h-5" /></span>
                            <h3 className="font-extrabold text-base text-slate-100">Shaxsiy eslatmalar va vazifalar</h3>
                        </div>
                        <span className="text-[10px] bg-slate-800/80 text-slate-400 font-extrabold px-2.5 py-1 rounded-full border border-slate-700/40">
                            {todos.filter(t => !t.completed).length} ta reja qoldi
                        </span>
                    </div>

                    <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Yangi vazifa yoki eslatma yozing..."
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                            className="flex-1 bg-slate-950/50 border border-slate-800/60 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-600"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
                        >
                            Qo'shish
                        </button>
                    </form>

                    {todos.length === 0 ? (
                        <div className="text-center py-8 text-xs font-semibold text-slate-500 italic">
                            Eslatmalar yo'q. Bugun bajariladigan vazifalar bormi?
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                            {todos.map(todo => (
                                <div
                                    key={todo.id}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        todo.completed 
                                            ? 'bg-slate-950/20 border-slate-900/60 opacity-60' 
                                            : 'bg-slate-950/30 border-slate-800/40 hover:border-slate-850'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => handleToggleTodo(todo.id)}
                                            className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-blue-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer"
                                        />
                                        <span className={`text-xs sm:text-sm font-bold text-slate-200 truncate ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                                            {todo.text}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="p-1 text-xs hover:bg-rose-950/30 hover:text-rose-400 rounded-lg text-slate-650 transition-colors cursor-pointer"
                                        title="O'chirish"
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Backup & Restore Management Card */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-slate-800/60 shadow-xl flex flex-col justify-between min-h-[300px]">
                <div>
                    <div className="flex items-center gap-2 border-b border-slate-800/60 pb-3 mb-4">
                        <span className="text-blue-400"><Settings className="w-5 h-5" /></span>
                        <h3 className="font-extrabold text-base text-slate-100">Ma'lumotlar zaxirasi (Database)</h3>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mb-6">
                        Talabalar, baholar va guruhlarni to'liq xavfsiz saqlash uchun zaxira nusxasini kompyuterga yuklab oling yoki avvalgi nusxani qayta tiklang.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleBackup}
                        disabled={isRestoring}
                        className="w-full py-3 bg-emerald-600/10 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-900/40 hover:border-emerald-500/50 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        <Upload className="w-4 h-4 shrink-0" /> Zaxira faylini yuklab olish (.json)
                    </button>

                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleRestoreFile}
                            disabled={isRestoring}
                            className="hidden"
                            id="restore-file-input"
                        />
                        <label
                            htmlFor="restore-file-input"
                            className={`w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer text-center ${
                                isRestoring ? 'opacity-50 pointer-events-none' : ''
                            }`}
                        >
                            <Download className="w-4 h-4 shrink-0" /> Zaxira faylidan qayta tiklash
                        </label>
                    </div>

                    {isRestoring && (
                        <div className="text-center text-[11px] font-extrabold text-yellow-500 animate-pulse mt-2 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-4 h-4 shrink-0" /> {restoreStatus}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
