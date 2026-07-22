'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, X, Check } from './Icon';

import { createPortal } from 'react-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface Semester {
  id: number;
  name: string;
  status: 'active' | 'passive';
  group_id: number;
}

interface SemesterManagerProps {
  groupId: number | string;
  groupName: string;
  accentColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber';
}

const accentMap = {
  blue:    { icon: 'text-slate-400 hover:text-blue-300',    bg: 'bg-blue-600',    hover: 'hover:bg-blue-500',    border: 'hover:border-blue-900/50', shadow: 'shadow-blue-500/20' },
  indigo:  { icon: 'text-slate-400 hover:text-indigo-300',  bg: 'bg-indigo-600',  hover: 'hover:bg-indigo-500',  border: 'hover:border-indigo-900/50', shadow: 'shadow-indigo-500/20' },
  emerald: { icon: 'text-slate-400 hover:text-emerald-300', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', border: 'hover:border-emerald-900/50', shadow: 'shadow-emerald-500/20' },
  rose:    { icon: 'text-slate-400 hover:text-rose-300',    bg: 'bg-rose-600',    hover: 'hover:bg-rose-500',    border: 'hover:border-rose-900/50', shadow: 'shadow-rose-500/20' },
  amber:   { icon: 'text-slate-400 hover:text-amber-300',   bg: 'bg-amber-600',   hover: 'hover:bg-amber-500',   border: 'hover:border-amber-900/50', shadow: 'shadow-amber-500/20' },
};

export default function SemesterManager({ groupId, groupName, accentColor = 'blue' }: SemesterManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accent = accentMap[accentColor];

  const fetchSemesters = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from('semesters')
      .select('id, name, status, group_id')
      .eq('group_id', groupId)
      .order('id', { ascending: true });
    if (!err && data) setSemesters(data as Semester[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchSemesters();
  }, [isOpen]);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(false);
    setIsAddOpen(false);
    setNewName('');
    setError(null);
  };

  const handleSetActive = async (semesterId: number) => {
    if (!supabase) return;
    setSaving(true);
    setError(null);
    try {
      // Avval barchasini passive
      await supabase.from('semesters').update({ status: 'passive' }).eq('group_id', groupId);
      // Keyin tanlanganni active
      const { error: err } = await supabase.from('semesters').update({ status: 'active' }).eq('id', semesterId);
      if (err) { setError(err.message); return; }
      await fetchSemesters();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (semesterId: number) => {
    if (!supabase) return;
    if (!window.confirm("Bu semestrni o'chirishni tasdiqlaysizmi?")) return;
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase.from('semesters').delete().eq('id', semesterId);
      if (err) { setError(err.message); return; }
      await fetchSemesters();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) { setError("Semestr nomi bo'sh bo'lishi mumkin emas"); return; }
    if (!supabase) return;
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase.from('semesters').insert({
        name: newName.trim(),
        status: 'passive',
        group_id: groupId,
      });
      if (err) { setError(err.message); return; }
      setNewName('');
      setIsAddOpen(false);
      await fetchSemesters();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Trigger button — kichik kalendar ikona */}
      <button
        onClick={handleOpen}
        title="Semestrlarni boshqarish"
        className={`flex-shrink-0 p-1.5 rounded-lg border border-transparent transition-all duration-200 ${accent.icon} ${accent.border}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>      {/* Modal */}
      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[999] p-4"
          onClick={handleClose}
        >
          <div
            className="relative bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Windows style Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl w-8 h-8 flex items-center justify-center font-bold transition-all cursor-pointer z-10"
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
             {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
              <span className="text-blue-400"><Calendar className="w-6 h-6" /></span>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-black text-white">Semestr boshqaruvi</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{groupName}</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-xl text-rose-300 text-xs font-semibold mb-4 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* Semestrlar ro'yxati */}
            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : semesters.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6 font-semibold">
                  Hozircha semestrlar mavjud emas
                </p>
              ) : (
                semesters.map(sem => (
                  <div
                    key={sem.id}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${
                      sem.status === 'active'
                        ? 'bg-emerald-950/20 border-emerald-900/40'
                        : 'bg-slate-950/40 border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`flex-shrink-0 w-2 h-2 rounded-full ${sem.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className={`text-xs font-bold truncate ${sem.status === 'active' ? 'text-white' : 'text-slate-400'}`}>
                        {sem.name}
                      </span>
                      {sem.status === 'active' && (
                        <span className="flex-shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-600 text-white uppercase">Faol</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {sem.status !== 'active' && (
                        <>
                          <button
                            onClick={() => handleSetActive(sem.id)}
                            disabled={saving}
                            className="px-2.5 py-1 text-[10px] font-bold bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-900/40 rounded-lg transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Faol qilish</span>
                          </button>
                          <button
                            onClick={() => handleDelete(sem.id)}
                            disabled={saving}
                            className="p-1 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg transition-all disabled:opacity-50"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Yangi semestr qo'shish */}
            {isAddOpen ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Masalan: 2-semestr"
                  className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500 shadow-inner"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className={`px-3 py-2 text-[11px] font-bold text-white rounded-xl transition-all ${accent.bg} ${accent.hover} disabled:opacity-50`}
                >
                  {saving
                    ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : "Qo'sh"}
                </button>
                <button
                  onClick={() => { setIsAddOpen(false); setNewName(''); setError(null); }}
                  className="px-3 py-2 text-[11px] font-bold text-slate-400 bg-slate-950/60 border border-slate-800 rounded-xl hover:bg-slate-950 transition-all"
                >
                  Bekor
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddOpen(true)}
                className="w-full py-2.5 text-xs font-bold text-slate-400 border border-dashed border-slate-700 hover:border-slate-500 hover:text-slate-300 rounded-xl transition-all hover:bg-slate-800/20 flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yangi semestr qo'shish
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
