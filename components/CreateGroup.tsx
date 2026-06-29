'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface CreateGroupProps {
  defaultDirection?: string;
  buttonText?: string;
  buttonClassName?: string;
  techSchool?: string;
}

export default function CreateGroup({
  defaultDirection = '3 yillik',
  buttonText = 'Yangi guruh qo‘shish',
  buttonClassName = 'inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors',
  techSchool = 'shahrisabz'
}: CreateGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [direction, setDirection] = useState(defaultDirection);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const directions = [
    { label: 'Hamshiralik 3 yillik', value: '3 yillik' },
    { label: 'Hamshiralik 2 yillik', value: '2 yillik' },
    { label: 'Farmatsiya', value: 'farmatsiya' },
  ];

  const handleOpen = () => {
    setGroupName('');
    setDirection(defaultDirection);
    setError(null);
    setIsOpen(true);
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Guruh nomi bo'sh bo'lishi mumkin emas");
      return;
    }
    if (!supabase) {
      setError('Supabasega ulanish amalga oshirilmadi (.env faylini tekshiring)');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const fullName = `${groupName.trim()} (${direction === 'farmatsiya' ? 'Farmatsiya' : direction === '2 yillik' ? '2 yillik' : '3 yillik'})`;
      const { data, error: insertError } = await supabase.from('groups').insert({
        name: fullName,
        tech_school: techSchool
      }).select();
      if (insertError) {
        setError(`Yaratishda xatolik: ${insertError.message}`);
        return;
      }
      // Refresh the page to show new group
      window.location.reload();
    } catch (err: any) {
      setError(`Tizim xatoligi: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={handleOpen}
        className={buttonClassName}
      >
        <span>➕</span>
        <span>{buttonText}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
              <span className="text-2xl">🏫</span>
              <div>
                <h2 className="text-lg font-black text-white">Yangi guruh yaratish</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tizimga yangi guruh qo'shish</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-rose-300 text-xs font-semibold mb-4">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Guruh Nomi / Raqami</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                  placeholder="Masalan: 25-19 yoki 205"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Yo‘nalish / Bo'lim</label>
                <select
                  value={direction}
                  onChange={e => setDirection(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500 shadow-inner"
                >
                  {directions.map(d => (
                    <option key={d.value} value={d.value} className="bg-slate-950 text-white font-semibold">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6 border-t border-slate-800/60 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-300 rounded-xl font-bold text-sm transition-all"
                disabled={loading}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Yaratish</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
