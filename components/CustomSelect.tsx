"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "./Icon";

export interface SelectOption {
    label: string;
    value: string | number;
    badge?: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string | number;
    onChange: (value: any) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Tanlang...",
    className = "",
    disabled = false
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number; placeAbove: boolean }>({ top: 0, left: 0, width: 0, placeAbove: false });
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(value));

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const placeAbove = spaceBelow < 220 && rect.top > 220;
            setCoords({
                top: placeAbove ? rect.top - 6 : rect.bottom + 6,
                left: rect.left,
                width: Math.max(rect.width, 160),
                placeAbove
            });
        }
    };

    const toggleOpen = () => {
        if (disabled) return;
        if (!isOpen) {
            updateCoords();
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                const target = e.target as HTMLElement;
                if (!target.closest?.('.custom-select-dropdown-portal')) {
                    setIsOpen(false);
                }
            }
        };

        const handleScrollOrResize = () => {
            updateCoords();
        };

        document.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [isOpen]);

    const handleSelect = (optValue: string | number) => {
        onChange(optValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-block w-full ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={toggleOpen}
                className={`w-full flex items-center justify-between bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-white transition-all shadow-md active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <span className="truncate flex items-center gap-2">
                    {selectedOption ? selectedOption.label : <span className="text-slate-500">{placeholder}</span>}
                    {selectedOption?.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 uppercase">
                            {selectedOption.badge}
                        </span>
                    )}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-400" : ""}`} />
            </button>

            {isOpen && mounted && createPortal(
                <div
                    className="custom-select-dropdown-portal fixed z-[999999] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden py-1 max-h-60 overflow-y-auto custom-scrollbar animate-fadeIn"
                    style={{
                        top: coords.placeAbove ? 'auto' : `${coords.top}px`,
                        bottom: coords.placeAbove ? `${window.innerHeight - coords.top}px` : 'auto',
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                    }}
                >
                    {options.map((opt) => {
                        const isSelected = String(opt.value) === String(value);
                        return (
                            <div
                                key={String(opt.value)}
                                onClick={() => handleSelect(opt.value)}
                                className={`px-3.5 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                                    isSelected
                                        ? "bg-blue-600/25 text-blue-300 font-extrabold border-l-4 border-blue-500"
                                        : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
                                }`}
                            >
                                <span className="truncate flex items-center gap-2">
                                    {opt.label}
                                    {opt.badge && (
                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30 uppercase">
                                            {opt.badge}
                                        </span>
                                    )}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
                            </div>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
}
