'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function CreateGroup() {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [direction, setDirection] = useState('3 yillik');
  const [error, setError] = useState<string | null>(null);

  const directions = [
    { label: 'Hamshiralik 3 yillik', value: '3 yillik' },
    { label: 'Hamshiralik 2 yillik', value: '2 yillik' },
    { label: 'Farmatsiya', value: 'farmatsiya' },
  ];

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Guruh nomi bo'sh bo'lishi mumkin emas");
      return;
    }
    if (!supabase) {
      setError('Supabasega ulanish yapılamadi');
      return;
    }
    const fullName = `${groupName.trim()} (${direction})`;
    const { data, error: insertError } = await supabase.from('groups').insert({ name: fullName }).select();
    if (insertError) {
      setError(`Yaratishda xatolik: ${insertError.message}`);
      return;
    }
    // Refresh the page to show new group
    window.location.reload();
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors"
      >
        <span className="text-sm">Yangi guruh qo‘shish</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-slate-900/90 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Yangi guruh yaratish</h2>
            {error && (
              <p className="text-red-400 text-sm mb-3">{error}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-1">Guruh nomi</label>
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Masalan: 3‑yillik 1‑gruppa"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-1">Yo‘nalish</label>
              <select
                value={direction}
                onChange={e => setDirection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded focus:outline-none"
              >
                {directions.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
              >
                Yaratish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
