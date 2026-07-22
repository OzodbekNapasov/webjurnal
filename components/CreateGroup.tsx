'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Monitor, AlertTriangle, X } from './Icon';
import CustomSelect from './CustomSelect';

import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    
    const chosen = directions.find(d => d.value === direction);
    const fullName = `${groupName.trim()} (${chosen?.label.includes('Farmatsiya') ? 'farmatsiya' : chosen?.value})`;

    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('groups')
        .insert([{ name: fullName, direction: direction, tech_school: techSchool }]);

      if (insertError) {
        setError(`Qo'shishda xatolik: ${insertError.message}`);
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
      <button
        onClick={handleOpen}
        className={buttonClassName}
      >
        <Plus className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>

      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[999] p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-rose-400 hover:text-white hover:bg-rose-600 rounded-xl w-8 h-8 flex items-center justify-center font-bold transition-all cursor-pointer z-10"
              title="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
              <span className="text-blue-400"><Monitor className="w-6 h-6" /></span>
              <div>
                <h2 className="text-lg font-black text-white">Yangi guruh yaratish</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tizimga yangi guruh qo'shish</p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-rose-300 text-xs font-semibold mb-4 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
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
                <CustomSelect
                  options={directions.map(d => ({ label: d.label, value: d.value }))}
                  value={direction}
                  onChange={val => setDirection(val)}
                />
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800/60 pt-4">
              <button
                onClick={handleCreate}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
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
        </div>,
        document.body
      )}
    </>
  );
}
