"use client";
import React from "react";

type P = { className?: string; strokeWidth?: number };

const i = (d: React.ReactNode) =>
    ({ className = "w-4 h-4", strokeWidth = 2 }: P) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    );

// Navigation
export const ArrowLeft    = i(<><path d="M19 12H5M12 5l-7 7 7 7"/></>);
export const ArrowRight   = i(<><path d="M5 12h14M12 5l7 7-7 7"/></>);
export const ChevronDown  = i(<><polyline points="6 9 12 15 18 9"/></>);
export const ChevronRight = i(<><polyline points="9 18 15 12 9 6"/></>);
export const ChevronLeft  = i(<><polyline points="15 18 9 12 15 6"/></>);
export const PanelLeftClose = i(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M14 9l-3 3 3 3"/></>);
export const PanelLeftOpen  = i(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M12 15l3-3-3-3"/></>);

// Core actions
export const Save    = i(<><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>);
export const Lock    = i(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>);
export const Unlock  = i(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></>);
export const Edit    = i(<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>);
export const Trash   = i(<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>);
export const Plus    = i(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>);
export const X       = i(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>);
export const Check   = i(<><polyline points="20 6 9 17 4 12"/></>);
export const Search  = i(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>);
export const Copy    = i(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>);
export const RefreshCw= i(<><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>);
export const Undo     = i(<><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></>);
export const Redo     = i(<><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></>);
export const Download= i(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>);
export const Upload  = i(<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>);
export const Printer = i(<><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>);
export const Share   = i(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>);
export const Filter  = i(<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>);

// Status
export const AlertTriangle = i(<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>);
export const AlertCircle   = i(<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>);
export const Info          = i(<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>);
export const CheckCircle   = i(<><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>);
export const XCircle       = i(<><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>);
export const Bell          = i(<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>);

// Education / Journal
export const BookOpen = i(<><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>);
export const Book     = i(<><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>);
export const GraduationCap = i(<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>);
export const Clipboard= i(<><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>);
export const FileText = i(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>);
export const Pen      = i(<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></>);

// Users
export const User     = i(<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>);
export const Users    = i(<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>);
export const UserCheck= i(<><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></>);
export const UserX    = i(<><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="23" y2="14"/><line x1="23" y1="8" x2="17" y2="14"/></>);
export const UserMinus= i(<><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" y1="11" x2="16" y2="11"/></>);
export const UserPlus = i(<><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></>);

// Analytics
export const BarChart = i(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></>);
export const TrendingUp = i(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>);
export const PieChart = i(<><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></>);
export const Activity = i(<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>);

// Calendar / Time
export const Calendar = i(<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>);
export const Clock    = i(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>);

// Settings
export const Settings = i(<><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>);
export const Monitor  = i(<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>);

// Misc
export const Star    = i(<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>);
export const Award   = i(<><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>);
export const Zap     = i(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>);
export const Gift    = i(<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></>);
export const LogOut  = i(<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>);
export const Table   = i(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></>);
export const List    = i(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>);
export const Menu    = i(<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>);
export const MapPin  = i(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>);
export const Layers  = i(<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>);
export const ExternalLink = i(<><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>);
export const MoreHorizontal = i(<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>);

// Custom Domain / Medical / Tech / Holiday icons
export const Stethoscope = i(<><path d="M4.8 2.3A.3.3 0 004.5 2h-1a.5.5 0 00-.5.5v5a6 6 0 006 6h0a6 6 0 006-6v-5a.5.5 0 00-.5-.5h-1a.3.3 0 00-.3.3v4.7a4 4 0 01-8 0V2.3z"/><path d="M9 13v3a3 3 0 003 3h1a3 3 0 003-3v-3"/><circle cx="18" cy="12" r="2"/></>);
export const Laptop = i(<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 20h20"/></>);
export const Ban = i(<><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>);
export const Sparkles = i(<><path d="M12 3l1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9zM5 3l.9 1.9L7.8 5.8 5.9 6.7 5 8.6 4.1 6.7 2.2 5.8 4.1 4.9zM19 16l.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9z"/></>);
export const Flag = i(<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>);
export const Flower = i(<><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 014 4c0 2-4 6-4 6s-4-4-4-6a4 4 0 014-4z"/><path d="M12 22a4 4 0 01-4-4c0-2 4-6 4-6s4 4 4 6a4 4 0 01-4 4z"/><path d="M2 12a4 4 0 014-4c2 0 6 4 6 4s-4 4-6 4a4 4 0 01-4-4z"/><path d="M22 12a4 4 0 01-4 4c-2 0-6-4-6-4s4-4 6-4a4 4 0 014 4z"/></>);
export const Feather = i(<><path d="M20.24 12.24a6 6 0 00-8.49-8.49L3 13.5V21h7.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></>);
export const Scroll = i(<><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.7 0 3-1.3 3-3z"/><path d="M15 22h2c1.1 0 2-.9 2-2v-3"/></>);
export const Apple = i(<><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0017 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 00-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/><path d="M10 2c1 .5 2 2 2 3.5"/></>);
export const Coffee = i(<><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>);
export const FileSpreadsheet = i(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8M8 17h8M10 9h4"/></>);
export const MedalGold = i(<><circle cx="12" cy="14" r="6" fill="#EAB308" stroke="#CA8A04"/><path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" stroke="#CA8A04"/><path d="M12 2l-3 6h6l-3-6z" fill="#EAB308"/></>);
export const MedalSilver = i(<><circle cx="12" cy="14" r="6" fill="#94A3B8" stroke="#64748B"/><path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" stroke="#64748B"/><path d="M12 2l-3 6h6l-3-6z" fill="#94A3B8"/></>);
export const MedalBronze = i(<><circle cx="12" cy="14" r="6" fill="#D97706" stroke="#B45309"/><path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" stroke="#B45309"/><path d="M12 2l-3 6h6l-3-6z" fill="#D97706"/></>);