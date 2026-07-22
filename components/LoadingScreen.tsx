"use client";

import React, { useState, useEffect } from "react";

interface LoadingScreenProps {
    message?: string;
    subMessage?: string;
}

export default function LoadingScreen({
    message = "Ma'lumotlar yuklanmoqda...",
    subMessage = "Tizim ma'lumotlari va sozlamalar tayyorlanmoqda"
}: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) {
                    clearInterval(interval);
                    return 98;
                }
                const increment = Math.floor(Math.random() * 12) + 5;
                return Math.min(98, prev + increment);
            });
        }, 120);

        return () => clearInterval(interval);
    }, []);

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="min-h-screen bg-[#050a16] flex items-center justify-center p-4 relative overflow-hidden text-white font-sans">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none delay-500 animate-pulse"></div>

            {/* Glassmorphic Container Card */}
            <div className="relative w-full max-w-sm bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-black/90 flex flex-col items-center text-center">
                
                {/* Circular Progress Ring */}
                <div className="relative mb-6 flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className="text-slate-800/80"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                        />
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className="text-blue-500 transition-all duration-300 ease-out"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="url(#progress-gradient)"
                            fill="transparent"
                        />
                        <defs>
                            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="50%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Percentage Number */}
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-2xl font-black tracking-tight text-white flex items-baseline">
                            {progress}<span className="text-xs font-bold text-blue-400 ml-0.5">%</span>
                        </span>
                    </div>
                </div>

                {/* Loading Title & Message */}
                <h3 className="text-base sm:text-lg font-extrabold text-white mb-1 tracking-wide">
                    {message}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-5 max-w-xs leading-relaxed">
                    {subMessage}
                </p>

                {/* Linear Progress Bar */}
                <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Animated Status Indicator */}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-extrabold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="uppercase tracking-widest text-[10px] text-emerald-400 font-black">Yuklanmoqda...</span>
                </div>

            </div>
        </div>
    );
}
