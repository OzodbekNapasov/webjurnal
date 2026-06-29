'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface GroupData {
  id: number | string;
  name: string;
  tech_school?: string;
}

interface EditGroupProps {
  group: GroupData;
  accentColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber';
}

const accentMap = {
  blue: {
    btn: 'hover:bg-blue-950/30 hover:text-blue-300 hover:border-blue-900/50',
    icon: 'text-slate-400 hover:text-blue-300',
  },
  indigo: {
    btn: 'hover:bg-indigo-950/30 hover:text-indigo-300 hover:border-indigo-900/50',
    icon: 'text-slate-400 hover:text-indigo-300',
  },
  emerald: {
    btn: 'hover:bg-emerald-950/30 hover:text-emerald-300 hover:border-emerald-900/50',
    icon: 'text-slate-400 hover:text-emerald-300',
  },
  rose: {
    btn: 'hover:bg-rose-950/30 hover:text-rose-300 hover:border-rose-900/50',
    icon: 'text-slate-400 hover:text-rose-300',
  },
  amber: {
    btn: 'hover:bg-amber-950/30 hover:text-amber-300 hover:border-amber-900/50',
    icon: 'text-slate-400 hover:text-amber-300',
  },
};

const directions = [
  { label: "Hamshiralik 3 yillik", value: '3 yillik', suffix: '3 yillik' },
  { label: "Hamshiralik 2 yillik", value: '2 yillik', suffix: '2 yillik' },
  { label: "Farmatsiya",           value: 'farmatsiya', suffix: 'Farmatsiya' },
  { label: "Chetlatilganlar",      value: 'chetlat',    suffix: 'Chetlatilganlar' },
  { label: "Akademik ta'til",      value: 'akadem',     suffix: "Akademik ta'til" },
];

function parseName(raw: string): { base: string; dir: string } {
  const lower = raw.toLowerCase();
  for (const d of directions) {
    if (lower.includes(d.value.toLowerCase()) || lower.includes(d.suffix.toLowerCase())) {
      const base = raw
        .replace(new RegExp(`\\(${d.suffix}\\)`, 'gi'), '')
        .replace(new RegExp(`\\(?${d.value}\\)?`, 'gi'), '')
        .replace(new RegExp(`\\(?${d.suffix}\\)?`, 'gi'), '')
        .trim();
      return { base, dir: d.value };
    }
  }
  return { base: raw, dir: '3 yillik' };
}

export default function EditGroup({ group, accentColor = 'blue' }: EditGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [direction, setDirection] = useState('3 yillik');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const accent = accentMap[accentColor];

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { base, dir } = parseName(group.name || '');
    setGroupName(base);
    setDirection(dir);
    setError(null);
    setIsOpen(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Guruh nomi bo'sh bo'lishi mumkin emas");
      return;
    }
    if (!supabase) {
      setError('Supabase ulanishi mavjud emas (.env faylini tekshiring)');
      return;
    }

    const chosen = directions.find(d => d.value === direction);
    const suffix = chosen?.suffix || '3 yillik';
    const fullName = `${groupName.trim()} (${suffix})`;

    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('groups')
        .update({ name: fullName })
        .eq('id', group.id);

      if (updateError) {
        setError(`Saqlashda xatolik: ${updateError.message}`);
        return;
      }
      window.location.reload();
    } catch (err: any) {
      setError(`Tizim xatoligi: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Pencil edit button */}
      <button
        onClick={handleOpen}
        title="Tahrirlash"
        className={`flex-shrink-0 p-1.5 rounded-lg border border-transparent transition-all duration-200 ${accent.icon} ${accent.btn}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[999] p-4"
          onClick={handleClose}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
              <span className="text-2xl">✏️</span>
              <div>
                <h2 className="text-lg font-black text-white">Guruhni tahrirlash</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Nom yoki yo'nalishni o'zgartirish
                </p>
              </div>
              <button
                onClick={handleClose}
                className="ml-auto p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-rose-300 text-xs font-semibold mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Guruh Nomi / Raqami
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
                  placeholder="Masalan: 25-19 yoki 205"
                  autoFocus
                />
              </div>

              {/* Direction */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Yo'nalish / Bo'lim
                </label>
                <select
                  value={direction}
                  onChange={e => setDirection(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
                >
                  {directions.map(d => (
                    <option key={d.value} value={d.value} className="bg-slate-950 text-white font-semibold">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-400 font-semibold">
                <span className="text-slate-500 mr-1">Ko'rinishi:</span>
                <span className="text-slate-200">
                  {groupName.trim()
                    ? `${groupName.trim()} (${directions.find(d => d.value === direction)?.suffix})`
                    : '—'}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-slate-800/60 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-300 rounded-xl font-bold text-sm transition-all"
                  disabled={loading}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saqlash
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
