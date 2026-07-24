#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
14 ta HTML darslik fayllarini google_darslik.html uslubida qayta yaratish.
Faqat kontent o'zgaradi — CSS, JS, dizayn to'liq bir xil.
"""
import os, json

OUT_DIR = r"d:\01. Antigravity\HTML darsliklar\pages"

# ─────────────────────────────────────────────
# SHARED CSS  (google_darslik.html dan olingan)
# ─────────────────────────────────────────────
CSS = """\
    :root{--bg-main:#060b18;--bg-card:rgba(15,23,42,.78);--bg-card-hover:rgba(30,41,59,.92);--border-color:rgba(255,255,255,.12);--border-glow:rgba(14,165,233,.45);--text-primary:#f8fafc;--text-secondary:#cbd5e1;--text-muted:#94a3b8;--med-blue:#0ea5e9;--med-blue-dark:#0284c7;--med-green:#10b981;--med-green-dark:#059669;--med-cyan:#06b6d4;--g-blue:#4285f4;--g-red:#ea4335;--g-yellow:#fbbc05;--g-green:#34a853;--g-purple:#a855f7;--shadow-sm:0 4px 12px rgba(0,0,0,.25);--shadow-lg:0 20px 40px rgba(0,0,0,.45);--shadow-glow:0 0 25px rgba(14,165,233,.35);--radius-sm:8px;--radius-md:14px;--radius-lg:24px;--transition:all .3s cubic-bezier(.4,0,.2,1)}
    [data-theme="light"]{--bg-main:#f0f4f9;--bg-card:rgba(255,255,255,.92);--bg-card-hover:#fff;--border-color:rgba(14,165,233,.2);--border-glow:rgba(2,132,199,.5);--text-primary:#0f172a;--text-secondary:#334155;--text-muted:#64748b;--med-blue:#0284c7;--med-blue-dark:#1e40af;--med-green:#059669;--med-green-dark:#047857;--shadow-sm:0 4px 12px rgba(0,0,0,.06);--shadow-lg:0 20px 40px rgba(0,0,0,.12);--shadow-glow:0 0 25px rgba(2,132,199,.2)}
    *{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
    html{scroll-behavior:smooth}
    body{width:100%;min-height:100vh;background-color:var(--bg-main);color:var(--text-primary);background:radial-gradient(circle at 15% 15%,rgba(14,165,233,.12) 0%,transparent 50%),radial-gradient(circle at 85% 85%,rgba(16,185,129,.12) 0%,transparent 50%),var(--bg-main);transition:background .4s ease,color .4s ease;line-height:1.6}
    ::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:var(--bg-main)}::-webkit-scrollbar-thumb{background:rgba(14,165,233,.4);border-radius:4px}::-webkit-scrollbar-thumb:hover{background:var(--med-blue)}
    .app-header{position:sticky;top:0;height:66px;padding:0 2rem;display:flex;align-items:center;justify-content:space-between;background:var(--bg-card);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--border-color);z-index:1000}
    .reading-progress{position:absolute;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--med-blue),var(--med-green));width:0%;transition:width .1s ease}
    .brand-area{display:flex;align-items:center;gap:12px;cursor:pointer}
    .brand-logo{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--med-blue),var(--med-green));border-radius:12px;box-shadow:0 4px 14px rgba(14,165,233,.35)}
    .brand-logo svg{width:24px;height:24px;fill:#fff}
    .brand-title{font-size:1.05rem;font-weight:800;background:linear-gradient(90deg,var(--text-primary),var(--med-blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .nav-links{display:flex;align-items:center;gap:16px;list-style:none}
    .nav-links a{color:var(--text-secondary);text-decoration:none;font-size:.88rem;font-weight:600;transition:var(--transition);padding:6px 12px;border-radius:8px}
    .nav-links a:hover,.nav-links a.active{color:var(--med-blue);background:rgba(14,165,233,.12)}
    .header-actions{display:flex;align-items:center;gap:10px}
    .btn-icon{width:40px;height:40px;border-radius:11px;border:1px solid var(--border-color);background:rgba(255,255,255,.05);color:var(--text-primary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--transition)}
    .btn-icon:hover{background:var(--med-blue);color:#fff;border-color:var(--med-blue);transform:translateY(-2px);box-shadow:0 4px 14px rgba(14,165,233,.35)}
    .btn-icon svg{width:19px;height:19px;stroke-width:2;stroke:currentColor;fill:none}
    .landing-container{max-width:1240px;margin:0 auto;padding:2rem 1.5rem 6rem 1.5rem;display:flex;flex-direction:column;gap:4rem}
    .section-block{scroll-margin-top:90px;display:flex;flex-direction:column;gap:1.5rem}
    .section-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:20px;background:linear-gradient(135deg,rgba(14,165,233,.18),rgba(16,185,129,.15));border:1px solid var(--med-blue);color:var(--med-blue);font-size:.8rem;font-weight:800;text-transform:uppercase;letter-spacing:.6px;width:fit-content}
    .section-badge svg{width:15px;height:15px;fill:currentColor}
    .section-title{font-size:2.1rem;font-weight:800;color:var(--text-primary);display:flex;align-items:center;gap:14px;line-height:1.25}
    .section-title svg{width:36px;height:36px;flex-shrink:0}
    .hero-section{padding:4rem 2rem;background:var(--bg-card);backdrop-filter:blur(20px);border:1px solid var(--border-color);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);display:flex;flex-direction:column;align-items:center;text-align:center;gap:1.8rem;position:relative;overflow:hidden}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:7px 20px;border-radius:30px;background:rgba(14,165,233,.15);border:1px solid var(--med-blue);color:var(--med-blue);font-size:.9rem;font-weight:800}
    .hero-title{font-size:3.2rem;font-weight:900;line-height:1.15;background:linear-gradient(135deg,#fff 30%,var(--med-blue) 70%,var(--med-green) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;max-width:960px}
    .hero-subtitle{font-size:1.25rem;color:var(--text-secondary);max-width:780px}
    .hero-logo-box{width:110px;height:110px;border-radius:28px;background:rgba(255,255,255,.05);border:1px solid var(--border-color);display:flex;align-items:center;justify-content:center;box-shadow:0 0 50px rgba(14,165,233,.4);animation:floatGlow 3.5s ease-in-out infinite alternate}
    @keyframes floatGlow{0%{transform:translateY(0) scale(1);box-shadow:0 0 30px rgba(14,165,233,.3)}100%{transform:translateY(-12px) scale(1.04);box-shadow:0 0 60px rgba(16,185,129,.45)}}
    .hero-cta-group{display:flex;align-items:center;gap:15px;flex-wrap:wrap;justify-content:center}
    .btn-primary{padding:.95rem 2.4rem;border-radius:30px;border:none;background:linear-gradient(135deg,var(--med-blue),var(--med-green));color:#fff;font-size:1.05rem;font-weight:800;cursor:pointer;box-shadow:0 10px 28px rgba(14,165,233,.4);transition:var(--transition);display:inline-flex;align-items:center;gap:10px;text-decoration:none}
    .btn-primary:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 16px 38px rgba(16,185,129,.5)}
    .btn-secondary{padding:.95rem 2rem;border-radius:30px;border:1px solid var(--border-color);background:rgba(255,255,255,.05);color:var(--text-primary);font-size:1rem;font-weight:700;cursor:pointer;transition:var(--transition);display:inline-flex;align-items:center;gap:8px;text-decoration:none}
    .btn-secondary:hover{background:rgba(255,255,255,.12);border-color:var(--med-blue);transform:translateY(-2px)}
    .stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;width:100%;margin-top:1rem}
    .stat-card{padding:1.2rem;background:rgba(255,255,255,.03);border:1px solid var(--border-color);border-radius:var(--radius-md);text-align:center}
    .stat-num{font-size:1.8rem;font-weight:900;color:var(--med-blue)}
    .stat-label{font-size:.82rem;color:var(--text-secondary)}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
    .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
    .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem}
    .glass-card{background:var(--bg-card);backdrop-filter:blur(20px);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.5rem;transition:var(--transition);display:flex;flex-direction:column;gap:12px;position:relative}
    .glass-card:hover{background:var(--bg-card-hover);border-color:var(--border-glow);transform:translateY(-5px);box-shadow:var(--shadow-glow)}
    .card-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(14,165,233,.15);color:var(--med-blue);flex-shrink:0}
    .card-icon svg{width:26px;height:26px;fill:currentColor}
    .card-title{font-size:1.15rem;font-weight:800;color:var(--text-primary)}
    .card-desc{font-size:.92rem;color:var(--text-secondary);line-height:1.6}
    .med-tag{display:inline-flex;align-items:center;gap:6px;font-size:.78rem;font-weight:700;color:var(--med-green);background:rgba(16,185,129,.12);padding:4px 10px;border-radius:8px;width:fit-content;margin-top:auto;border:1px solid rgba(16,185,129,.2)}
    .med-tag svg{width:14px;height:14px;fill:currentColor}
    .analog-badge{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;font-weight:700;color:var(--g-blue);background:rgba(66,133,244,.12);padding:5px 12px;border-radius:8px;border:1px solid rgba(66,133,244,.25)}
    .custom-list{list-style:none;display:flex;flex-direction:column;gap:12px}
    .custom-list li{display:flex;align-items:flex-start;gap:12px;font-size:.96rem;color:var(--text-secondary);line-height:1.6}
    .custom-list li::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--med-blue);margin-top:8px;flex-shrink:0;box-shadow:0 0 8px var(--med-blue)}
    .timeline-container{display:flex;flex-direction:column;gap:14px;position:relative;padding-left:22px;border-left:2px solid var(--border-color);margin:8px 0}
    .timeline-item{position:relative;padding:1rem 1.2rem;background:rgba(255,255,255,.03);border:1px solid var(--border-color);border-radius:var(--radius-sm);transition:var(--transition)}
    .timeline-item:hover{background:var(--bg-card-hover);border-color:var(--med-blue);transform:translateX(6px)}
    .timeline-item::before{content:"";position:absolute;left:-29px;top:20px;width:12px;height:12px;border-radius:50%;background:var(--med-blue);border:2px solid var(--bg-main);box-shadow:0 0 10px var(--med-blue)}
    .timeline-year{font-size:.85rem;font-weight:800;color:var(--med-green)}
    .timeline-text{font-size:.95rem;color:var(--text-primary);font-weight:600}
    .custom-table-container{width:100%;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border-color)}
    .custom-table{width:100%;border-collapse:collapse;text-align:left}
    .custom-table th,.custom-table td{padding:1rem 1.3rem;border-bottom:1px solid var(--border-color)}
    .custom-table th{background:rgba(14,165,233,.15);color:var(--med-blue);font-size:.95rem;font-weight:700}
    .custom-table td{font-size:.92rem;color:var(--text-secondary)}
    .custom-table tr:hover td{background:rgba(255,255,255,.05);color:var(--text-primary)}
    .accordion-item{border:1px solid var(--border-color);border-radius:var(--radius-sm);overflow:hidden;background:rgba(255,255,255,.03);transition:var(--transition)}
    .accordion-header{padding:1rem 1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:.98rem;color:var(--text-primary)}
    .accordion-header:hover{background:rgba(14,165,233,.12)}
    .accordion-body{padding:1rem 1.3rem;border-top:1px solid var(--border-color);font-size:.92rem;color:var(--text-secondary);line-height:1.65;display:none;background:rgba(0,0,0,.25)}
    .accordion-item.active .accordion-body{display:block}
    .quiz-card{background:rgba(255,255,255,.035);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.4rem;display:flex;flex-direction:column;gap:14px}
    .quiz-question{font-size:1.02rem;font-weight:800;color:var(--text-primary)}
    .quiz-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .quiz-opt{padding:11px 15px;border-radius:10px;border:1px solid var(--border-color);background:rgba(255,255,255,.05);color:var(--text-secondary);font-size:.9rem;cursor:pointer;text-align:left;transition:var(--transition);font-weight:500}
    .quiz-opt:hover{background:rgba(14,165,233,.22);border-color:var(--med-blue);color:var(--text-primary)}
    .quiz-opt.correct{background:rgba(16,185,129,.35)!important;border-color:var(--med-green)!important;color:#fff!important;font-weight:700}
    .quiz-opt.incorrect{background:rgba(239,68,68,.35)!important;border-color:#ef4444!important;color:#fff!important}
    .checklist-item{display:flex;align-items:center;gap:14px;padding:1rem 1.2rem;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid var(--border-color);cursor:pointer;transition:var(--transition)}
    .checklist-item:hover{background:rgba(255,255,255,.07);border-color:var(--med-blue)}
    .checklist-item input[type="checkbox"]{width:20px;height:20px;accent-color:var(--med-green);cursor:pointer}
    .back-to-top{position:fixed;bottom:25px;right:25px;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--med-blue),var(--med-green));color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(14,165,233,.4);opacity:0;visibility:hidden;transition:var(--transition);z-index:900}
    .back-to-top.show{opacity:1;visibility:visible}
    .back-to-top:hover{transform:translateY(-4px) scale(1.06)}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(12px);z-index:2000;display:none;align-items:center;justify-content:center;padding:1.5rem}
    .modal-overlay.open{display:flex;animation:fadeIn .25s ease forwards}
    @keyframes fadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    .modal-box{width:100%;max-width:620px;background:var(--bg-main);border:1px solid var(--border-glow);border-radius:var(--radius-lg);padding:1.6rem;box-shadow:var(--shadow-lg);display:flex;flex-direction:column;gap:1.1rem}
    .search-input{width:100%;padding:.95rem 1.3rem;border-radius:var(--radius-md);border:1px solid var(--border-color);background:rgba(255,255,255,.05);color:var(--text-primary);font-size:1.02rem;outline:none}
    .search-input:focus{border-color:var(--med-blue);box-shadow:0 0 18px rgba(14,165,233,.35)}
    .search-results{max-height:330px;overflow-y:auto;display:flex;flex-direction:column;gap:8px}
    .search-item{padding:.85rem 1.1rem;border-radius:10px;background:rgba(255,255,255,.035);cursor:pointer;font-size:.92rem;color:var(--text-secondary);transition:var(--transition)}
    .search-item:hover{background:var(--med-blue);color:#fff}
    @media(max-width:992px){.grid-3,.grid-4{grid-template-columns:repeat(2,1fr)}.grid-2{grid-template-columns:1fr}.hero-title{font-size:2.3rem}.section-title{font-size:1.65rem}.nav-links{display:none}.stats-strip{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:640px){.grid-3,.grid-4,.quiz-options,.stats-strip{grid-template-columns:1fr}.hero-title{font-size:1.8rem}.app-header{padding:0 1rem}.landing-container{padding:1.5rem 1rem 4rem 1rem}}
    @media print{body{background:#fff!important;color:#000!important}.app-header,.btn-icon,.modal-overlay,.back-to-top{display:none!important}.landing-container{padding:0!important;gap:2rem!important}.glass-card,.hero-section{background:#fff!important;border:1px solid #ccc!important;box-shadow:none!important;color:#000!important}.card-desc,.custom-list li,.timeline-text{color:#333!important}}
"""

JS_FN = """
    document.addEventListener("DOMContentLoaded",()=>{renderQuiz();setupEventListeners();setupScrollHandler();});
    function setupScrollHandler(){const rp=document.getElementById("readingProgress"),btn=document.getElementById("backToTopBtn"),links=document.querySelectorAll(".nav-link");window.addEventListener("scroll",()=>{const t=document.documentElement.scrollHeight-window.innerHeight,p=(window.scrollY/t)*100;rp.style.width=p+"%";btn.classList.toggle("show",window.scrollY>400);let cur="";sections.forEach(s=>{const el=document.getElementById(s.id);if(el&&window.scrollY>=el.offsetTop-120)cur=s.id;});links.forEach(l=>{l.classList.toggle("active",l.getAttribute("href")==="#"+cur);});});}
    function renderQuiz(){const c=document.getElementById("quizContainer");c.innerHTML="";quizQuestions.forEach((q,qi)=>{const card=document.createElement("div");card.className="quiz-card";let o="";q.options.forEach((opt,oi)=>{let cls="";if(quizAnswers[qi]!==null){if(oi===q.correct)cls="correct";else if(quizAnswers[qi]===oi)cls="incorrect";}o+=`<button class="quiz-opt ${cls}" onclick="selectAnswer(${qi},${oi})">${opt}</button>`;});card.innerHTML=`<div class="quiz-question">${q.q}</div><div class="quiz-options">${o}</div>`;c.appendChild(card);});calcScore();}
    function selectAnswer(qi,oi){if(quizAnswers[qi]!==null)return;quizAnswers[qi]=oi;renderQuiz();}
    function calcScore(){let s=0;quizAnswers.forEach((a,i)=>{if(a===quizQuestions[i].correct)s++;});document.getElementById("quizScoreBadge").innerText=`Ball: ${s} / ${quizQuestions.length}`;}
    function resetQuiz(){quizAnswers=new Array(quizQuestions.length).fill(null);renderQuiz();}
    function toggleAccordion(h){const it=h.parentElement;it.classList.toggle("active");h.querySelector("span").innerText=it.classList.contains("active")?"−":"+";}
    function updateTaskProgress(){const cbs=document.querySelectorAll('.checklist-item input[type="checkbox"]');const all=[...cbs].every(c=>c.checked);document.getElementById("taskStatusText").style.display=all?"flex":"none";}
    function toggleTheme(){const h=document.documentElement,c=h.getAttribute("data-theme");h.setAttribute("data-theme",c==="dark"?"light":"dark");}
    function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen().catch(e=>console.log(e));else if(document.exitFullscreen)document.exitFullscreen();}
    function openSearchModal(){document.getElementById("searchModal").classList.add("open");document.getElementById("searchInput").focus();handleSearch();}
    function closeSearchModal(){document.getElementById("searchModal").classList.remove("open");}
    function handleSearch(){const q=document.getElementById("searchInput").value.toLowerCase(),r=document.getElementById("searchResults");r.innerHTML="";const f=sections.filter(s=>s.title.toLowerCase().includes(q));if(!f.length){r.innerHTML='<div style="color:var(--text-muted);font-size:.88rem;">Hech narsa topilmadi</div>';return;}f.forEach(s=>{const it=document.createElement("div");it.className="search-item";it.innerHTML=`<strong>${s.title}</strong>`;it.onclick=()=>{document.getElementById(s.id)?.scrollIntoView({behavior:"smooth"});closeSearchModal();};r.appendChild(it);});}
    function setupEventListeners(){document.getElementById("themeToggleBtn").onclick=toggleTheme;document.getElementById("fullscreenBtn").onclick=toggleFullscreen;document.getElementById("printBtn").onclick=()=>window.print();document.getElementById("searchBtn").onclick=openSearchModal;document.addEventListener("keydown",e=>{if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;if(e.key==="k"&&(e.ctrlKey||e.metaKey)){e.preventDefault();openSearchModal();}else if(e.key==="Escape")closeSearchModal();});}
"""

SVG_ICONS = {
    "computer": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    "windows": '<svg width="65" height="65" viewBox="0 0 24 24"><path fill="#00adef" d="M3 5.5L10 4.5V11H3V5.5z"/><path fill="#00adef" d="M11 4.3L21 3V11H11V4.3z"/><path fill="#00adef" d="M3 12H10V18.5L3 17.5V12z"/><path fill="#00adef" d="M11 12H21V21L11 19.7V12z"/></svg>',
    "internet": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    "shield": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    "info": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    "medical": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-red)" stroke-width="1.5"><path d="M8 2h8l2 4H6L8 2z"/><path d="M6 6l-4 16h20L18 6H6z"/><path d="M12 10v6M9 13h6"/></svg>',
    "office": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-blue)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',
    "pdf": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-red)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>',
    "telegram": '<svg width="65" height="65" viewBox="0 0 24 24" fill="#2CA5E0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64-6.8c-.18.06-8.58 3.31-12.14 4.68-.58.22-.57.53.02.7 1.46.44 3.34 1.05 3.34 1.05s.88 2.68 1.35 4.02c.18.52.48.58.78.34l1.86-1.76 3.64 2.68c.67.37 1.15.18 1.32-.62l2.4-11.3c.22-1.03-.39-1.49-1.57-1.79z"/></svg>',
    "text": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    "browser": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-blue)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="8" x2="22" y2="8"/><path d="M12 2a15 15 0 0 1 4 6H8a15 15 0 0 1 4-6z"/></svg>',
    "hardware": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-purple)" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>',
    "excel": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-green)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    "word": '<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="var(--g-blue)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13l2 6 2-4 2 4 2-6"/></svg>',
}

def acc(q, a):
    return f"""<div class="accordion-item"><div class="accordion-header" onclick="toggleAccordion(this)">{q}<span>+</span></div><div class="accordion-body">{a}</div></div>"""

def fact_card(n, text):
    return f'<div class="glass-card"><strong>{n}.</strong> {text}</div>'

def gloss_card(term, defn):
    return f'<div class="glass-card"><strong>{term}:</strong> {defn}</div>'

def stat(num, lbl):
    return f'<div class="stat-card"><div class="stat-num">{num}</div><div class="stat-label">{lbl}</div></div>'

def li(text):
    return f'<li>{text}</li>'

def build_html(d):
    # Nav links
    nav_html = "".join(f'<li><a href="#{nl[0]}" class="nav-link">{nl[1]}</a></li>' for nl in d["nav_links"])
    # Stats
    stats_html = "".join(stat(s[0], s[1]) for s in d["stats"])
    # Accordion (mustahkamlash)
    acc_html = "".join(acc(q, a) for q, a in d["accordion"])
    # Facts
    facts_html = "".join(fact_card(i+1, f) for i, f in enumerate(d["facts"]))
    # Glossary
    gloss_html = "".join(gloss_card(t, defn) for t, defn in d["glossary"])
    # Checklist
    checks_html = "".join(f'<label class="checklist-item"><input type="checkbox" onchange="updateTaskProgress()"><span>{c}</span></label>' for c in d["checklist"])
    # Conclusion items
    concl_items = "".join(li(item) for item in d["conclusion_items"])
    # Quiz JS data
    quiz_js = json.dumps(d["quiz_questions"], ensure_ascii=False, indent=2)
    sections_js = json.dumps([{"id": s[0], "title": s[1]} for s in d["sections"]], ensure_ascii=False, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="uz" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{d['meta_desc']}">
  <meta name="keywords" content="{d['meta_keys']}">
  <meta name="author" content="Tibbiyotda Axborot Texnologiyalari Metodisti">
  <title>{d['page_title']}</title>
  <style>
{CSS}
  </style>
</head>
<body>

  <!-- STICKY HEADER -->
  <header class="app-header">
    <div class="reading-progress" id="readingProgress"></div>
    <div class="brand-area" onclick="window.scrollTo({{top:0,behavior:'smooth'}})">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div class="brand-title">{d['brand_title']}</div>
    </div>
    <ul class="nav-links">{nav_html}</ul>
    <div class="header-actions">
      <button class="btn-icon" id="searchBtn" title="Qidiruv (Ctrl+K)">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
      <button class="btn-icon" id="themeToggleBtn" title="Mavzuni O'zgartirish">
        <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="btn-icon" id="fullscreenBtn" title="To'liq Ekran">
        <svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
      </button>
      <button class="btn-icon" id="printBtn" title="Chop Etish">
        <svg viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      </button>
    </div>
  </header>

  <main class="landing-container">

    <!-- HERO -->
    <section class="hero-section" id="kirish">
      <div class="hero-badge">Tibbiyotda Axborot Texnologiyalari Fani</div>
      <h1 class="hero-title">{d['hero_title']}</h1>
      <p class="hero-subtitle">{d['hero_subtitle']}</p>
      <div class="hero-logo-box">{d['hero_icon']}</div>
      <div class="hero-cta-group">
        <a href="#maqsad" class="btn-primary">
          Darsni boshlash
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </a>
        <a href="#test" class="btn-secondary">Interaktiv Test (15 ta)</a>
      </div>
      <div class="stats-strip">{stats_html}</div>
    </section>

    <!-- 1. DARSNING MAQSADI -->
    <section class="section-block" id="maqsad">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        1-Bo'lim: Maqsad &amp; Reja
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        Darsning Maqsadi va Vazifalari
      </h2>
      {d['maqsad_html']}
    </section>

    <!-- 2. ASOSIY NAZARIYA -->
    {d['theory_html']}

    <!-- PROS & CONS -->
    <section class="section-block" id="tahlil">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
        Afzallik &amp; Kamchilik Bo'limi
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
        {d['pros_cons_title']}
      </h2>
      <div class="grid-2">
        <div class="glass-card" style="border-color:var(--med-green);">
          <div class="card-title" style="color:var(--med-green);display:flex;align-items:center;gap:8px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            Afzalliklari
          </div>
          <ul class="custom-list">{"".join(li(p) for p in d['pros'])}</ul>
        </div>
        <div class="glass-card" style="border-color:var(--g-red);">
          <div class="card-title" style="color:var(--g-red);display:flex;align-items:center;gap:8px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
            Kamchiliklari
          </div>
          <ul class="custom-list">{"".join(li(c) for c in d['cons'])}</ul>
        </div>
      </div>
    </section>

    <!-- AMALIYOT -->
    <section class="section-block" id="amaliyot">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Amaliy Mashg'ulot
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Amaliy Mashq (Talabalar uchun)
      </h2>
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">Quyidagi topshiriqlarni bajaring va belgilang:</div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:10px;">
          {checks_html}
        </div>
        <div id="taskStatusText" style="font-weight:700;color:var(--med-green);margin-top:10px;display:none;align-items:center;gap:8px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Barcha amaliy topshiriqlar muvaffaqiyatli bajarildi!
        </div>
      </div>
    </section>

    <!-- MUSTAHKAMLASH SAVOLLARI -->
    <section class="section-block" id="savollar">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Mustahkamlash Savollari
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Mustahkamlash Savollari (10 ta)
      </h2>
      <div style="display:flex;flex-direction:column;gap:10px;">{acc_html}</div>
    </section>

    <!-- INTERAKTIV TEST -->
    <section class="section-block" id="test">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        Sinov Testi
      </div>
      <h2 class="section-title" style="justify-content:space-between;">
        <span style="display:flex;align-items:center;gap:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Interaktiv Test (15 ta Savol)
        </span>
        <span id="quizScoreBadge" style="font-size:1.05rem;font-weight:800;color:var(--med-green);">Ball: 0 / 15</span>
      </h2>
      <div class="glass-card">
        <div id="quizContainer" style="display:flex;flex-direction:column;gap:14px;"></div>
        <div style="display:flex;justify-content:flex-end;margin-top:15px;">
          <button class="btn-primary" onclick="resetQuiz()" style="font-size:.95rem;padding:.7rem 1.8rem;">Qayta Ishlash (Reset)</button>
        </div>
      </div>
    </section>

    <!-- QIZIQARLI FAKTLAR -->
    <section class="section-block" id="faktlar">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Qiziqarli Faktlar
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-yellow)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        {d['facts_title']}
      </h2>
      <div class="grid-2">{facts_html}</div>
    </section>

    <!-- ATAMALAR LUG'ATI -->
    <section class="section-block" id="lugat">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Atamalar Lug'ati
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Atamalar Lug'ati (12 ta)
      </h2>
      <div class="grid-3">{gloss_html}</div>
    </section>

    <!-- XULOSA -->
    <section class="section-block" id="xulosa">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        Yakun
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        Xulosa
      </h2>
      <div class="grid-2">
        <div class="glass-card" style="border-color:var(--med-blue);">
          <div class="card-title" style="color:var(--med-blue);">Asosiy Xulosalar</div>
          <ul class="custom-list">{concl_items}</ul>
        </div>
        <div class="glass-card" style="border-color:var(--med-green);text-align:center;align-items:center;justify-content:center;">
          <div style="width:60px;height:60px;border-radius:50%;background:rgba(16,185,129,.15);display:flex;align-items:center;justify-content:center;color:var(--med-green);margin-bottom:10px;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <div class="card-title" style="color:var(--med-green);">Mavzu Yakunlandi!</div>
          <div class="card-desc">{d['conclusion_desc']}</div>
          <button class="btn-primary" onclick="window.scrollTo({{top:0,behavior:'smooth'}})" style="margin-top:15px;font-size:.9rem;padding:.7rem 1.6rem;">
            Yuqoriga Qaytish
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
        </div>
      </div>
    </section>

  </main>

  <!-- BACK TO TOP -->
  <button class="back-to-top" id="backToTopBtn" onclick="window.scrollTo({{top:0,behavior:'smooth'}})" title="Yuqoriga">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 15l-6-6-6 6"/></svg>
  </button>

  <!-- SEARCH MODAL -->
  <div class="modal-overlay" id="searchModal">
    <div class="modal-box">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="font-size:1.1rem;color:var(--med-blue);">Mavzularni Izlash</h3>
        <button class="btn-icon" onclick="closeSearchModal()" style="width:30px;height:30px;"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <input type="text" class="search-input" id="searchInput" placeholder="{d['search_placeholder']}" onkeyup="handleSearch()">
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>

  <script>
    const quizQuestions = {quiz_js};
    let quizAnswers = new Array(quizQuestions.length).fill(null);
    const sections = {sections_js};
{JS_FN}
  </script>
</body>
</html>"""
    return html


# ═══════════════════════════════════════════════════════════════
#  TOPIC DATA — 14 ta mavzu
# ═══════════════════════════════════════════════════════════════

TOPICS = []

# ──────────────────────────────────────────
# 1. COMPUTER BASICS
# ──────────────────────────────────────────
TOPICS.append({
    "filename": "computer_basics_darslik.html",
    "page_title": "Kompyuterni Yoqish va O'chirish | Tibbiyotda IT",
    "meta_desc": "Tibbiyotda IT fani. Kompyuterni to'g'ri yoqish, o'chirish, sichqoncha va klaviatura bilan ishlash darsligi.",
    "meta_keys": "kompyuter, yoqish, o'chirish, sichqoncha, klaviatura, tibbiyot, IT",
    "brand_title": "Kompyuter Asoslari — Tibbiyotda IT",
    "hero_title": "Kompyuterni Yoqish, O'chirish va Asosiy Qurilmalar bilan Ishlash",
    "hero_subtitle": "Kompyuterni to'g'ri ishga tushirish va o'chirish tartibi, sichqoncha (mouse) va klaviatura (keyboard) bilan ishlash ko'nikmalari — tibbiyot texnikumi talabalari uchun.",
    "hero_icon": SVG_ICONS["computer"],
    "stats": [("3", "Asosiy qurilma"), ("12", "Klaviatura tugmasi guruhi"), ("5", "Sichqoncha harakati"), ("100%", "Amaliy ko'nikma")],
    "nav_links": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Nazariya"),("amaliyot","Amaliyot"),("test","Test"),("lugat","Lug'at")],
    "maqsad_html": """<div class="grid-2">
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">O'quv Maqsadlari</div>
        <ul class="custom-list">
          <li><strong>Kompyuterni yoqishni bilish:</strong> Power tugmasi va BIOS yuklanish tartibini tushunish.</li>
          <li><strong>To'g'ri o'chirish:</strong> Start menyusi orqali xavfsiz o'chirish (Shutdown) usullarini o'rganish.</li>
          <li><strong>Sichqoncha bilan ishlash:</strong> Bir marta bosish, ikki marta bosish, siljitish va o'ng tugma amallarini o'zlashtirish.</li>
          <li><strong>Klaviatura ko'nikmalari:</strong> Asosiy tugmalar guruhlarini va tezkor kombinatsiyalarni bilish.</li>
        </ul>
      </div>
      <div class="glass-card" style="align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(16,185,129,.1));">
        <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:340px;">
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-blue);border-radius:12px;font-weight:700;">1. Nazariy Bilim</div>
          <div style="color:var(--med-blue);font-weight:900;">↓</div>
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-green);border-radius:12px;font-weight:700;">2. Amaliy Ko'nikma</div>
          <div style="color:var(--med-green);font-weight:900;">↓</div>
          <div style="padding:14px;background:linear-gradient(90deg,var(--med-blue),var(--med-green));color:#fff;border-radius:12px;font-weight:700;">3. Mustaqil Ishlash</div>
        </div>
      </div>
    </div>""",
    "theory_html": """
    <section class="section-block" id="nazariya">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        2-Bo'lim: Asosiy Nazariya
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        Kompyuterni Yoqish va O'chirish Tartibi
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-blue);">Kompyuterni Yoqish Bosqichlari</div>
          <div class="timeline-container">
            <div class="timeline-item"><div class="timeline-year">1-qadam</div><div class="timeline-text">Elektr tarmog'i (rozetka) va uzluksiz quvvat manbaini (UPS) ulash.</div></div>
            <div class="timeline-item"><div class="timeline-year">2-qadam</div><div class="timeline-text">Monitor, printer va boshqa tashqi qurilmalarni yoqish.</div></div>
            <div class="timeline-item"><div class="timeline-year">3-qadam</div><div class="timeline-text">Tizim blokidagi (system unit) Power tugmasini bosish.</div></div>
            <div class="timeline-item"><div class="timeline-year">4-qadam</div><div class="timeline-text">BIOS POST (Power On Self Test) tekshiruvi va Windows yuklanishini kutish.</div></div>
            <div class="timeline-item"><div class="timeline-year">5-qadam</div><div class="timeline-text">Ish stoli (Desktop) ko'rinishi — kompyuter ishga tayyor.</div></div>
          </div>
        </div>
        <div class="glass-card">
          <div class="card-title" style="color:var(--g-red);">Kompyuterni To'g'ri O'chirish</div>
          <ul class="custom-list">
            <li><strong>Shutdown (O'chirish):</strong> Start → Power → Shut down — barcha dasturlar yopiladi va qurilma o'chadi.</li>
            <li><strong>Restart (Qayta yuklash):</strong> Start → Power → Restart — yangilanishlar o'rnatilganda ishlatiladi.</li>
            <li><strong>Sleep (Uyqu rejimi):</strong> Quvvat tejash uchun. RAM saqlanadi, lekin ekran o'chadi.</li>
            <li><strong>Hibernate (Qish uyqusi):</strong> RAM holati diskka yoziladi, butunlay o'chadi. Uzoq to'xtash uchun.</li>
            <li><strong>OGOH!:</strong> Power tugmasini 5 soniya bosib o'chirish — faqat muzlab qolgan hollarda!</li>
          </ul>
        </div>
      </div>
      <div class="grid-2" style="margin-top:1rem;">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-green);">Sichqoncha (Mouse) Bilan Ishlash</div>
          <div class="custom-table-container">
            <table class="custom-table">
              <thead><tr><th>Harakat</th><th>Nomi</th><th>Vazifasi</th></tr></thead>
              <tbody>
                <tr><td>1 marta chap bosish</td><td>Click</td><td>Ob'yektni tanlash</td></tr>
                <tr><td>2 marta chap bosish</td><td>Double Click</td><td>Faylni ochish, dasturni ishga tushirish</td></tr>
                <tr><td>O'ng tugma bosish</td><td>Right Click</td><td>Kontekst menyu chiqarish</td></tr>
                <tr><td>Ushlab siljitish</td><td>Drag & Drop</td><td>Fayllarni ko'chirish yoki nusxalash</td></tr>
                <tr><td>G'ildirak aylantirish</td><td>Scroll</td><td>Sahifani tepaga/pastga siljitish</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="glass-card">
          <div class="card-title" style="color:var(--g-purple);">Klaviatura Asosiy Tugmalar Guruhlari</div>
          <ul class="custom-list">
            <li><strong>Alfanumerik tugmalar:</strong> A–Z harflar va 0–9 raqamlar — matn yozish uchun.</li>
            <li><strong>Funksional tugmalar (F1–F12):</strong> F1 — yordam, F5 — yangilash, F11 — to'liq ekran.</li>
            <li><strong>Boshqaruv tugmalari:</strong> Ctrl, Alt, Shift, Win, Caps Lock, Tab, Enter, Backspace.</li>
            <li><strong>Navigatsiya tugmalari:</strong> ↑↓←→ (yo'nalish), Home, End, Page Up, Page Down.</li>
            <li><strong>Raqamlar paneli (Numpad):</strong> Tez raqam kiritish uchun, Num Lock bilan faollashtirish.</li>
          </ul>
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <span class="analog-badge">Ctrl+C — Nusxalash</span>
            <span class="analog-badge">Ctrl+V — Joylashtirish</span>
            <span class="analog-badge">Ctrl+Z — Bekor qilish</span>
            <span class="analog-badge">Alt+F4 — Yopish</span>
          </div>
        </div>
      </div>
      <div class="glass-card" style="border-left:4px solid var(--med-green);">
        <div class="card-title" style="color:var(--med-green);">Tibbiyotda Amaliy Qo'llanilishi</div>
        <div class="grid-3">
          <div><div class="card-desc"><strong>Hamshira ish joyi:</strong> Kompyuterni navbat boshida yoqib, tibbiy axborot tizimiga (TIS) kirish va navbat oxirida to'g'ri o'chirish.</div></div>
          <div><div class="card-desc"><strong>Laboratoriya texniki:</strong> Analizator natijalarini klaviatura yordamida tizimga kiritish va sichqoncha bilan hisobotni chop etish.</div></div>
          <div><div class="card-desc"><strong>Shifoxona registraturasi:</strong> Bemorlarni qabul qilishda tezkor terish (10 barmoq bilan) va sichqoncha orqali bemor kartasini tanlash.</div></div>
        </div>
      </div>
    </section>""",
    "pros_cons_title": "Kompyuter Bilan Ishlashning Afzalliklari va Ehtiyot Choralari",
    "pros": [
        "<strong>Tezlik va Aniqlik:</strong> Qo'lda yozishga nisbatan 5-10 barobar tezroq ma'lumot kiritish.",
        "<strong>Xato Tuzatish:</strong> Backspace va Ctrl+Z bilan xatolarni darhol tuzatish.",
        "<strong>Ko'p vazifalilik:</strong> Bir vaqtning o'zida bir nechta dastur bilan ishlash imkoniyati.",
        "<strong>Saqlash va Arxivlash:</strong> Bemorlar ma'lumotlari raqamli formatda xavfsiz saqlanadi.",
    ],
    "cons": [
        "<strong>Quvvat uzilishi xavfi:</strong> UPS bo'lmasa saqlanmagan ma'lumotlar yo'qolishi mumkin.",
        "<strong>Viruslar:</strong> Noma'lum flesh-disklar kasallik tarixlarini yuqtirishi mumkin.",
        "<strong>Ko'z charchashi:</strong> Uzoq vaqt monitor qarash ko'rish qobiliyatini zaiflashtirib qo'yishi mumkin.",
    ],
    "checklist": [
        "Kompyuterni to'g'ri ketma-ketlikda yoqish (UPS → monitor → tizim bloki).",
        "Windows ishga tushgach, Ctrl+Alt+Del bilan parolni kiritish va tizimga kirish.",
        "Sichqoncha yordamida ish stolida papka yaratish va nomini o'zgartirish.",
        "Klaviatura yordamida Ctrl+C va Ctrl+V kombinatsiyalari bilan matn nusxalash.",
    ],
    "accordion": [
        ("Kompyuter yoqilganda birinchi nima yuklanadi?", "BIOS (Basic Input/Output System) — kompyuter aparatini tekshiruvchi va operatsion tizimni yuklashni boshlovchi dastlabki dasturiy ta'minot yuklanadi."),
        ("Shutdown va Restart farqi nima?", "Shutdown — kompyuterni to'liq o'chiradi. Restart esa o'chirib qayta yoqadi — yangilanishlar yoki muammo tuzatilganda ishlatiladi."),
        ("Sleep va Hibernate rejimlarining farqi qanday?", "Sleep — RAM o'chmasdan ekranni o'chiradi, quvvat ishlatadi. Hibernate — RAM holatini diskka yozib butunlay o'chiradi, batareyani tejaydi."),
        ("Sichqoncha o'ng tugmasi qanday vazifa bajaradi?", "Kontekst menyusini (Context Menu) chiqaradi — tanlangan ob'yektga mos amallar: nusxalash, ko'chirish, xususiyatlar va boshqalar ko'rinadi."),
        ("Double Click va Single Click farqi nima?", "Single Click — ob'yektni tanlaydi (highlight qiladi). Double Click — faylni ochadi yoki dasturni ishga tushiradi."),
        ("Ctrl+Alt+Delete kombinatsiyasi nima uchun?", "Vazifalar menejerini (Task Manager) yoki Windows xavfsizlik ekranini chiqaradi — muzlab qolgan dasturlarni majburan yopish uchun ishlatiladi."),
        ("Klaviaturaning Caps Lock tugmasi nima vazifa bajaradi?", "Katta harf (Upper Case) rejimini yoqadi — barcha harflar katta bo'lib yoziladi. Qaytadan bosish o'chiradi."),
        ("Kompyuterni noto'g'ri o'chirsak nima bo'lishi mumkin?", "Saqlanmagan ma'lumotlar yo'qolishi, fayl tizimi shikastlanishi va keyingi yuklanishda Windows tekshiruv o'tkazishi mumkin."),
        ("Power tugmasini 5 soniya bosish nima qiladi?", "Kompyuterni majburan o'chiradi (Force Shutdown) — faqat muzlab qolgan va boshqa yo'l bilan o'chirib bo'lmagan hollarda foydalaniladi."),
        ("Tab tugmasi nima uchun ishlatiladi?", "Tab — keyingi maydon (field)ga o'tish uchun, ya'ni shaklda bir katakdan ikkinchisiga o'tish. Fayl nomlarini to'ldirish (autocomplete) uchun ham ishlatiladi."),
    ],
    "quiz_questions": [
        {"q":"1. Kompyuterni yoqishda birinchi qaysi qurilma yoqilishi kerak?","options":["A) Tizim bloki","B) UPS yoki rozetka","C) Monitor","D) Printer"],"correct":1},
        {"q":"2. BIOS nima?","options":["A) Operatsion tizim","B) Apparat tekshiruvchi va yuklovchi dastur","C) Antivirus dasturi","D) Fayl menejeri"],"correct":1},
        {"q":"3. 'Shutdown' buyrug'i nima qiladi?","options":["A) Ekranni o'chiradi","B) Kompyuterni qayta yoqadi","C) Kompyuterni to'liq o'chiradi","D) Uyqu rejimiga o'tkazadi"],"correct":2},
        {"q":"4. Sichqonchaning o'ng tugmasini bosish nima chiqaradi?","options":["A) Fayl ochadi","B) Kontekst menyusi","C) Kompyuterni o'chiradi","D) Yangi hujjat yaratadi"],"correct":1},
        {"q":"5. Double Click (ikki marta bosish) nima qiladi?","options":["A) Ob'yektni tanlaydi","B) Ob'yektni o'chiradi","C) Faylni yoki dasturni ochadi","D) Nusxa oladi"],"correct":2},
        {"q":"6. Ctrl+C kombinatsiyasi nima vazifani bajaradi?","options":["A) Yopish","B) Nusxalash (Copy)","C) Kesib olish (Cut)","D) Joylashtirish (Paste)"],"correct":1},
        {"q":"7. Ctrl+Z tugmasi nima qiladi?","options":["A) Yopish","B) Saqlash","C) Oxirgi amalni bekor qilish","D) Yangi fayl yaratish"],"correct":2},
        {"q":"8. Caps Lock tugmasi nima vazifa bajaradi?","options":["A) Raqamlarni kiritadi","B) Katta harf yozish rejimini yoqadi/o'chiradi","C) Sahifani aylantiradi","D) Alt tugmasining vazifasini bajaradi"],"correct":1},
        {"q":"9. 'Sleep' (Uyqu) rejimida nima bo'ladi?","options":["A) Kompyuter butunlay o'chadi","B) RAM diskka yoziladi","C) RAM o'chmasdan ekran o'chadi","D) Barcha dasturlar yopiladi"],"correct":2},
        {"q":"10. Klaviatura F1 tugmasi odatda qanday vazifani bajaradi?","options":["A) Faylni saqlash","B) Yordam (Help) sahifasini ochish","C) Kompyuterni o'chirish","D) Ekranni yangilash"],"correct":1},
        {"q":"11. Drag and Drop nima?","options":["A) Sichqonchaning o'ng tugmasini bosish","B) Ob'yektni ushlab siljitish va qo'yib yuborish","C) Klaviatura yordamida nusxalash","D) Faylni o'chirish"],"correct":1},
        {"q":"12. Numpad (raqamlar paneli) ni faollashtirish uchun qaysi tugma bosiladi?","options":["A) Caps Lock","B) Scroll Lock","C) Num Lock","D) Pause"],"correct":2},
        {"q":"13. Tibbiyotda kompyuterni to'g'ri o'chirmaslik qanday oqibat keltirib chiqarishi mumkin?","options":["A) Hech qanday oqibat yo'q","B) Ma'lumotlar yo'qolishi va fayl tizimi shikastlanishi","C) Monitor o'chishi","D) Yangi dastur o'rnatilishi"],"correct":1},
        {"q":"14. Alt+F4 kombinatsiyasi nima qiladi?","options":["A) Yangi oyna ochadi","B) Joriy dastur yoki oynani yopadi","C) Faylni saqlaydi","D) Dasturni yuklab oladi"],"correct":1},
        {"q":"15. Hibernate (Qish uyqusi) va Sleep farqi nima?","options":["A) Hibernate tezroq ishlaydi","B) Sleep quvvat sarflamaydi","C) Hibernate RAMni diskka yozib butunlay o'chiradi","D) Farq yo'q"],"correct":2},
    ],
    "facts": [
        "Birinchi kompyuter klaviaturasi 1960-yillarda typewriter (yozuv mashinasi) klaviaturasi asosida ishlab chiqilgan.",
        "QWERTY klaviatura tartibi 1870-yillarda tezkor yozuvda qo'shni tugmalar to'qnashuvini kamaytirish uchun yaratilgan.",
        "Dunyodagi birinchi kompyuter sichqonchasi 1964-yilda Douglas Engelbart tomonidan yog'och va metall g'ildirakdan yasalgan.",
        "Zamonaviy klaviaturada o'rtacha 104 tugma mavjud, ammo tibbiy maxsus klaviaturalarda 120 dan ortiq tugma bo'lishi mumkin.",
        "Kompyuter so'zi inglizcha 'compute' (hisoblash) so'zidan olingan va dastlab hisob-kitob qiluvchi odamni anglatgan.",
        "BIOS o'rni keyinchalik UEFI (Unified Extensible Firmware Interface) bilan almashtirilmoqda — u 2.2 TB dan katta disklar bilan ishlaydi.",
        "Tibbiyot kasalxonalarida ishlatiluvchi maxsus klaviaturalar kauchuk qoplamali bo'lib, dezinfeksiya suyuqliklariga chidamlidir.",
        "Bitta klaviaturaga o'rtacha sutkasida 3 million bakteriya to'planadi — shuning uchun tibbiyotda alohida steril klaviaturalar qo'llaniladi.",
        "Windows operatsion tizimida bir vaqtda 50 000 gacha fayl nomi saqlanishi mumkin.",
        "Zamonaviy UPS (uzluksiz quvvat manbai) elektr uzilganda kompyuterni 10-30 daqiqa ishlashda ushlab turadi.",
    ],
    "glossary": [
        ("BIOS", "Basic Input/Output System — kompyuter yoqilganda apparat qurilmalarini tekshiruvchi va OS ni yuklovchi dastur."),
        ("Power Button", "Kompyuterni yoqish va o'chirish tugmasi — tizim blokida joylashgan asosiy boshqaruv tugmasi."),
        ("Shutdown", "Kompyuterni xavfsiz to'liq o'chirish jarayoni — barcha dasturlar va fayllar saqlanib yopiladi."),
        ("Restart", "Kompyuterni o'chirib qayta yoqish — yangilanishlar o'rnatilganda yoki xatoliklar tuzatilganda ishlatiladi."),
        ("Sleep Mode", "Uyqu rejimi — RAM o'chmasdan ekranni o'chiruvchi quvvat tejash holati."),
        ("Hibernate", "Qish uyqusi — RAM holatini diskka yozib kompyuterni butunlay o'chiradigan rejim."),
        ("Mouse (Sichqoncha)", "Kompyuter ekranidagi kursorni boshqaruvchi kiritish qurilmasi."),
        ("Keyboard (Klaviatura)", "Belgilar, raqamlar va buyruqlarni kompyuterga kirituvchi asosiy qurilma."),
        ("Double Click", "Sichqoncha tugmasini tez ketma-ket ikki marta bosish — faylni ochish uchun."),
        ("Drag & Drop", "Ob'yektni ushlab bir joydan ikkinchi joyga sichqoncha bilan ko'chirish amali."),
        ("Shortcut (Tezkor tugma)", "Bir yoki bir nechta tugmalar kombinatsiyasi — tezkor buyruq berish uchun (masalan Ctrl+C)."),
        ("UPS", "Uzluksiz Quvvat Manbai — elektr uzilganda kompyuterni qisqa muddat ishlashda ushlab turadigan batareyali qurilma."),
    ],
    "conclusion_items": [
        "Kompyuterni to'g'ri yoqish va o'chirish qurilma umrini uzaytiradi va ma'lumotlar yo'qolishining oldini oladi.",
        "Tibbiyotda kompyuter bilan ishlovchi xodim sichqoncha va klaviatura ko'nikmalarini puxta egallashi shart.",
        "Tezkor klaviatura kombinatsiyalarini (Ctrl+C, Ctrl+V, Alt+F4) bilish ish samaradorligini oshiradi.",
    ],
    "conclusion_desc": "Kompyuterning asosiy boshqaruv qurilmalari bo'yicha darslikni muvaffaqiyatli yakunladingiz.",
    "search_placeholder": "Qidiruv so'zini kiriting (klaviatura, sichqoncha, shutdown)...",
    "facts_title": "Kompyuter Qurilmalari Haqida Qiziqarli Faktlar",
    "sections": [("kirish","Kirish va Sarlavha"),("maqsad","Darsning Maqsadi"),("nazariya","Asosiy Nazariya"),("tahlil","Afzallik va Kamchiliklar"),("amaliyot","Amaliy Mashq"),("savollar","Mustahkamlash Savollari"),("test","Interaktiv Test"),("faktlar","Qiziqarli Faktlar"),("lugat","Atamalar Lug'ati"),("xulosa","Xulosa")],
})

# ──────────────────────────────────────────
# 2. HARDWARE & SOFTWARE
# ──────────────────────────────────────────
TOPICS.append({
    "filename": "hardware_software_darslik.html",
    "page_title": "Hardware va Software: Apparat va Dasturiy Ta'minot | Tibbiyotda IT",
    "meta_desc": "Kompyuter apparat va dasturiy ta'minoti asoslari. Tibbiyot texnikumi talabalari uchun interaktiv darslik.",
    "meta_keys": "hardware, software, CPU, RAM, HDD, operatsion tizim, tibbiyot IT",
    "brand_title": "Hardware va Software — Tibbiyotda IT",
    "hero_title": "Hardware va Software: Kompyuter Apparat va Dasturiy Ta'minoti",
    "hero_subtitle": "Kompyuterning ichki qismlari (protsessor, operativ xotira, qattiq disk), ularning vazifalari va dasturiy ta'minot turlari — tibbiy muassasalarda qo'llanilishi bilan.",
    "hero_icon": SVG_ICONS["hardware"],
    "stats": [("5+", "Asosiy apparat qismlari"), ("3", "Dasturiy ta'minot turi"), ("64-bit", "Zamonaviy protsessor"), ("100%", "Amaliy bilim")],
    "nav_links": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Nazariya"),("amaliyot","Amaliyot"),("test","Test"),("lugat","Lug'at")],
    "maqsad_html": """<div class="grid-2">
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">O'quv Maqsadlari</div>
        <ul class="custom-list">
          <li><strong>Hardware tushunchasi:</strong> Kompyuterning fizik qismlari va ularning vazifalari.</li>
          <li><strong>Software tushunchasi:</strong> Operatsion tizim, amaliy dasturlar va tizim dasturlari farqi.</li>
          <li><strong>Apparat xususiyatlari:</strong> Tibbiy jihozlar uchun tavsiya etiladigan kompyuter konfiguratsiyasi.</li>
          <li><strong>Tibbiy qo'llanilish:</strong> MRI, CT skanerlari va laboratoriya analizatorlaridagi kompyuter tizimlar.</li>
        </ul>
      </div>
      <div class="glass-card" style="align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(168,85,247,.1));">
        <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:340px;">
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--g-purple);border-radius:12px;font-weight:700;">1. Hardware (Apparat)</div>
          <div style="color:var(--g-purple);font-weight:900;">+</div>
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-blue);border-radius:12px;font-weight:700;">2. Software (Dastur)</div>
          <div style="color:var(--med-blue);font-weight:900;">=</div>
          <div style="padding:14px;background:linear-gradient(90deg,var(--g-purple),var(--med-blue));color:#fff;border-radius:12px;font-weight:700;">3. Ishlayotgan Kompyuter</div>
        </div>
      </div>
    </div>""",
    "theory_html": """
    <section class="section-block" id="nazariya">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
        2-Bo'lim: Asosiy Nazariya
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-purple)" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
        Kompyuter Apparat Qismlari (Hardware)
      </h2>
      <div class="grid-4">
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(66,133,244,.15);color:var(--g-blue);">
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>
          </div>
          <div class="card-title">CPU (Protsessor)</div>
          <div class="card-desc">Kompyuterning "miyasi". Barcha hisob-kitob va mantiqiy amallarni bajaradi. Intel Core, AMD Ryzen.</div>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Analizatorlarda</div>
        </div>
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(16,185,129,.15);color:var(--med-green);">
            <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/></svg>
          </div>
          <div class="card-title">RAM (Operativ Xotira)</div>
          <div class="card-desc">Joriy ishlaydigan dasturlar uchun vaqtinchalik xotira. Ko'p RAM — tezroq ishlash. 8–32 GB.</div>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>PACS tizimida</div>
        </div>
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(251,188,5,.15);color:var(--g-yellow);">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="card-title">HDD / SSD (Disk)</div>
          <div class="card-desc">Doimiy ma'lumot saqlash qurilmasi. SSD — tezroq, HDD — arzonroq. 500 GB – 4 TB.</div>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Bemorlar arxivi</div>
        </div>
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(234,67,53,.15);color:var(--g-red);">
            <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </div>
          <div class="card-title">Monitor (Ekran)</div>
          <div class="card-desc">Natijalarni ko'rsatuvchi chiqish qurilmasi. Tibbiyotda Full HD yoki 4K monitorlar ishlatiladi.</div>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>MRT tasvirlari</div>
        </div>
      </div>
      <h2 class="section-title" style="margin-top:1rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
        Dasturiy Ta'minot (Software) Turlari
      </h2>
      <div class="grid-3">
        <div class="glass-card" style="border-left:4px solid var(--g-blue);">
          <div class="card-title" style="color:var(--g-blue);">Tizim Dasturlari</div>
          <div class="card-desc">Kompyuter apparat va boshqa dasturlarni boshqaruvchi asosiy dastur qatlami.</div>
          <ul class="custom-list"><li>Windows 10/11, macOS, Linux</li><li>BIOS / UEFI</li><li>Drayvlar (Device Drivers)</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Barcha tibbiy kompyuterlar</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--med-green);">
          <div class="card-title" style="color:var(--med-green);">Amaliy Dasturlar</div>
          <div class="card-desc">Foydalanuvchining aniq muammolarini hal etuvchi dasturlar.</div>
          <ul class="custom-list"><li>MS Office (Word, Excel)</li><li>Adobe Acrobat (PDF)</li><li>HIS (Tibbiy Axborot Tizimi)</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Shifokor ish stoli</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--g-purple);">
          <div class="card-title" style="color:var(--g-purple);">Tizim Yordamchi Dasturlar</div>
          <div class="card-desc">Kompyuterni sozlash, himoya va optimallashtirish uchun ishlatiluvchi dasturlar.</div>
          <ul class="custom-list"><li>Antivirus (Kaspersky, ESET)</li><li>WinRAR / 7-Zip</li><li>CCleaner</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>IT administrator</div>
        </div>
      </div>
      <div class="glass-card" style="border-left:4px solid var(--med-green);margin-top:1rem;">
        <div class="card-title" style="color:var(--med-green);">Tibbiyot Muassasasida Hardware Talablari</div>
        <div class="custom-table-container">
          <table class="custom-table">
            <thead><tr><th>Qurilma</th><th>Minimum Talab</th><th>Tavsiya Etilgan</th><th>Qo'llanilishi</th></tr></thead>
            <tbody>
              <tr><td>CPU</td><td>Intel Core i3</td><td>Intel Core i7/i9</td><td>MRI/CT tasvir tahlili</td></tr>
              <tr><td>RAM</td><td>8 GB</td><td>32–64 GB</td><td>PACS, RIS tizimlari</td></tr>
              <tr><td>Disk</td><td>HDD 500 GB</td><td>SSD 1–4 TB</td><td>DICOM fayllari arxivi</td></tr>
              <tr><td>Monitor</td><td>Full HD 24"</td><td>4K 27" (meditsina)</td><td>Rentgen va MRT ko'rish</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>""",
    "pros_cons_title": "Hardware va Software Bilimlarining Tibbiyotdagi Ahamiyati",
    "pros": [
        "<strong>To'g'ri apparat tanlash:</strong> Shifoxona uchun to'g'ri spetsifikatsiyali kompyuter xarid qilish imkoniyati.",
        "<strong>Nosozliklarni aniqlash:</strong> Sekinlik, muzlash sabablarini aniqlash — RAM yetarliligini tekshirish.",
        "<strong>Xarajatlarni kamaytirish:</strong> Kerak bo'lmagan dasturlarni o'chirish qurilma resurslarini bo'shatadi.",
        "<strong>Litsenziya nazorati:</strong> Tibbiy muassasada faqat litsenziyalangan dasturlar ishlatilishini ta'minlash.",
    ],
    "cons": [
        "<strong>Eskirish muammosi:</strong> Tibbiy jihozlar dasturlari yangi OTda ishlamasligi mumkin.",
        "<strong>Drayvlar muammosi:</strong> Yangi hardware drayvlarsiz ishlamaydi — IT mutaxassisi kerak.",
        "<strong>Narx:</strong> Tibbiy standartdagi kompyuter (ishonchliligi yuqori) oddiy kompyuterdan qimmat.",
    ],
    "checklist": [
        "Kompyuteringizning RAM (operativ xotira) hajmini Task Manager (Ctrl+Shift+Esc) orqali aniqlang.",
        "Disk hajmini 'Mening kompyuterim' → Xususiyatlar orqali ko'ring va erkin joy foizini hisoblang.",
        "Kompyuterdagi o'rnatilgan dasturlar ro'yxatini Sozlamalar → Ilovalar bo'limida ko'rib chiqing.",
        "Windows Defender antivirus holatini tekshirib, so'nggi yangilanish sanasini aniqlang.",
    ],
    "accordion": [
        ("Hardware va Software farqi nima?", "Hardware — siz qo'lingiz bilan ushlab turadigan fizik qurilmalar (monitor, klaviatura, protsessor). Software — kompyuterda ishlaydigan dasturlar (Windows, Word, antivirus)."),
        ("CPU qanday ishlaydi?", "CPU (Central Processing Unit) — protsessor manba kodlarini bajaradigan, barcha hisob-kitob va mantiqiy amallarni nanosaniyalar ichida amalga oshiradigan asosiy chip."),
        ("RAM va HDD (disk) farqi nima?", "RAM — vaqtinchalik, tez, kompyuter o'chirilganda ma'lumot yo'qoladi. HDD/SSD — doimiy, kompyuter o'chirilganda ma'lumot saqlanib qoladi."),
        ("SSD HDD'dan qanday farq qiladi?", "SSD (Solid State Drive) — harakatlanuvchi qismsiz chip asosidagi disk, 5–10 marta tezroq. HDD — mexanik, arzonroq, lekin sekinroq va zarb ursa shikastlanadi."),
        ("Operatsion tizim (OT) nima?", "Hardware bilan amaliy dasturlar orasidagi 'tarjimon' dastur. Windows, macOS, Linux — eng mashhur OTlar. Kompyuter OTsiz ishlay olmaydi."),
        ("Drayvlar (Device Drivers) nima?", "Operatsion tizimga apparat qurilma bilan gaplashishga imkon beruvchi kichik dasturlar. Printer, kamera, sichqoncha uchun alohida drayvlar bo'ladi."),
        ("32-bit va 64-bit protsessor farqi nima?", "64-bit protsessor bir vaqtda ko'proq ma'lumot qayta ishlay oladi va 4 GB dan ko'p RAM dan foydalanishi mumkin. Zamonaviy tibbiy dasturlar 64-bit talab qiladi."),
        ("Tibbiyotda qaysi operatsion tizim ko'proq ishlatiladi?", "Windows (ayniqsa Windows 10 Pro va Enterprise) tibbiy muassasalarda eng ko'p ishlatiladi — HIS, PACS va laboratoriya dasturlari asosan Windows uchun yaratilgan."),
        ("Antivirus dasturi nima uchun kerak?", "Tibbiy ma'lumotlar kiberhujumlarga nishon. Antivirus viruslar, troyanlar va ransomwareni aniqlaydi va yo'q qiladi — bemor ma'lumotlarini himoya qiladi."),
        ("Tibbiyotda nima uchun litsenziyalangan dasturlar shart?", "Litsenziyasiz dasturlar zararli kodlar eltib kelishi mumkin. Rasmiy dasturlar xavfsizlik yangilanishlari oladi — GDPR va tibbiy ma'lumot himoyasi talablari bu holni majbur qiladi."),
    ],
    "quiz_questions": [
        {"q":"1. Hardware deganda nima tushuniladi?","options":["A) Kompyuter dasturlari","B) Fizik qurilmalar (monitor, klaviatura, protsessor)","C) Internet tarmog'i","D) Operatsion tizim"],"correct":1},
        {"q":"2. CPU qisqartmasi nimani anglatadi?","options":["A) Central Power Unit","B) Computer Processing Utility","C) Central Processing Unit","D) Core Program Unit"],"correct":2},
        {"q":"3. RAM nima uchun kerak?","options":["A) Fayllarni doimiy saqlash","B) Joriy ishlaydigan dasturlar uchun vaqtinchalik xotira","C) Internetga ulanish","D) Tasvirlarni chizish"],"correct":1},
        {"q":"4. SSD va HDD o'rtasidagi asosiy farq nima?","options":["A) SSD arzonroq","B) HDD tezroq","C) SSD tezroq va ishonchliroq, HDD arzonroq","D) Farq yo'q"],"correct":2},
        {"q":"5. Operatsion tizim (OT) qanday vazifani bajaradi?","options":["A) Faqat video o'yinlar uchun","B) Hardware va amaliy dasturlar o'rtasida vositachi","C) Faqat internet uchun","D) Faqat printer uchun"],"correct":1},
        {"q":"6. Tibbiyotda MRT va CT tasvirlari uchun qaysi dastur tipi ishlatiladi?","options":["A) PACS (Picture Archiving and Communication System)","B) WinRAR","C) Antivirus","D) Media player"],"correct":0},
        {"q":"7. Drayvlar (Device Drivers) nima?","options":["A) Apparat qurilmalarini OT bilan bog'lovchi kichik dasturlar","B) Fayllarni siqish dasturlari","C) Internet brauzerlar","D) Matn muharrirlari"],"correct":0},
        {"q":"8. 64-bit protsessorning 32-bit dan ustunligi nima?","options":["A) Arzonroq","B) Kichikroq","C) Ko'proq RAM ishlatish va tezroq ishlash","D) Ko'proq quvvat sarflash"],"correct":2},
        {"q":"9. Tibbiy muassasada foydalanilgan kompyuter necha GB RAMga ega bo'lishi tavsiya etiladi?","options":["A) 1-2 GB","B) 4 GB","C) 8-32 GB","D) 0.5 GB"],"correct":2},
        {"q":"10. Antivirus dasturlari nima uchun kerak?","options":["A) Kompyuterni tezlashtirish","B) Viruslar, troyanlar va zararli dasturlardan himoya","C) Fayllarni saqlash","D) Internet tezligini oshirish"],"correct":1},
        {"q":"11. Litsenziyalangan dasturlar nima afzallikka ega?","options":["A) Bepul","B) Xavfsizlik yangilanishlarini va texnik yordamni oladi","C) Tezroq ishlaydi","D) Ko'proq funksiyaga ega"],"correct":1},
        {"q":"12. Tibbiy tasvir (MRT/CT) qayta ishlash uchun qanday monitor tavsiya etiladi?","options":["A) 15' SD monitor","B) 4K yoki Full HD tibbiy monitor","C) Televízor","D) Proyektor"],"correct":1},
        {"q":"13. Task Manager dasturi nima vazifani bajaradi?","options":["A) Fayllarni o'chirish","B) Ishlaydigan dasturlar va resurslarni ko'rish va boshqarish","C) Internet tezligini oshirish","D) Printer sozlash"],"correct":1},
        {"q":"14. HDD ning kamchiligi nima?","options":["A) Juda qimmat","B) Mexanik qismlari zarb urilsa shikastlanishi va shovqin chiqarishi","C) Kichik hajmda","D) Drayvlarni talab qilmasligi"],"correct":1},
        {"q":"15. Windows operatsion tizimi tibbiyotda keng tarqalganining asosiy sababi nima?","options":["A) Bepulligi","B) Ko'plab tibbiy dasturlar Windows uchun yaratilganligi","C) Linux'dan sekinligi","D) macOS bilan bir xilligi"],"correct":1},
    ],
    "facts": [
        "Birinchi mikroprotsessor — Intel 4004 — 1971-yilda yaratilgan va faqat 2300 tranzistordan iborat edi.",
        "Zamonaviy Intel Core i9 protsessori 1 mm² maydonda 100 million tranzistorni joylashtiradi.",
        "RAM so'zi 'Random Access Memory' — tasodifiy kirish xotirasi — so'zidan olingan bo'lib, istalgan katakka bir xil tezlikda kirish mumkinligini anglatadi.",
        "Birinchi SSD (Solid State Drive) 1991-yilda IBM tomonidan 20 MB hajmda va 1000 dollar narxida ishlab chiqilgan.",
        "Tibbiy DICOM fayli (digital X-ray) o'rtacha 30–150 MB hajmni egallaydi — 1000 ta bemor uchun 30–150 GB disk kerak.",
        "Windows operatsion tizimi birinchi marta 1985-yilda chiqarilgan va 1.0 versiyasi faqat 1 MB xotira ishlatgan.",
        "Zamonaviy shifoxonadagi MRI apparati o'zi bir qancha kompyuterli tizimga ega va jami 50–100 GB dastur yuklanadi.",
        "Dunyoda eng ko'p ishlatiladigan OT — Windows — global bozorning 72% ni egallaydi.",
        "Kompyuter viruslari nomini birinchi bo'lib 1983-yilda Fred Cohen qo'llagan — u kompyuter dasturlarining o'z-o'zidan tarqalishini isbotlagan.",
        "Tibbiy ma'lumotlar (EHR) dunyodagi eng qimmat kiberxujum nishonlaridan biri — 1 ta bemor kartasi qora bozorda 250 dollargacha sotiladi.",
    ],
    "glossary": [
        ("Hardware", "Kompyuterning fizik, qo'l bilan ushlab turiladigan qismlari: monitor, protsessor, RAM, disk, klaviatura."),
        ("Software", "Kompyuterda ishlaydigan dasturlar va operatsion tizimlar — ko'rinmas, lekin kompyuterni boshqaradi."),
        ("CPU", "Central Processing Unit — kompyuterning asosiy hisoblash chipi, barcha amallarni bajaradi."),
        ("RAM", "Random Access Memory — kompyuter yoqiqligida ishlaydigan dasturlar va ma'lumotlar uchun tez, vaqtinchalik xotira."),
        ("HDD", "Hard Disk Drive — mexanik aylanuvchi disk, doimiy va katta hajmda ma'lumot saqlaydi."),
        ("SSD", "Solid State Drive — chip asosidagi tez va ishonchli doimiy xotira qurilmasi, HDD o'rnida ishlatiladi."),
        ("Operatsion Tizim", "Hardware va dasturlar orasidagi vositachi dastur (Windows, Linux, macOS)."),
        ("Drayvlar", "Device Drivers — apparat qurilmalarini operatsion tizimga ulash uchun mo'ljallangan kichik dasturlar."),
        ("PACS", "Picture Archiving and Communication System — tibbiy tasvirlarni saqlash va uzatish tizimi."),
        ("DICOM", "Digital Imaging and Communications in Medicine — tibbiy tasvirlar uchun standart format."),
        ("Antivirus", "Kompyuterni zararli dasturlardan (virus, troyan, ransomware) himoya qiluvchi xavfsizlik dasturi."),
        ("Litsenziya", "Dasturdan foydalanish huquqini beruvchi rasmiy ruxsatnoma — tibbiyotda qonuniy shart."),
    ],
    "conclusion_items": [
        "Hardware — kompyuterning jismoniy qismlari, Software — uning aqli; ikkalasi birgalikda tibbiy tizimlarni ta'minlaydi.",
        "Tibbiy muassasa uchun to'g'ri hardware tanlash — tez diagnostika va ishonchli ma'lumot saqlashning kaliti.",
        "Litsenziyalangan dasturlar va muntazam yangilanishlar tibbiy ma'lumotlar xavfsizligini kafolatlaydi.",
    ],
    "conclusion_desc": "Hardware va Software mavzusini muvaffaqiyatli yakunladingiz.",
    "search_placeholder": "Qidiruv so'zini kiriting (CPU, RAM, SSD, antivirus)...",
    "facts_title": "Hardware va Software Haqida Qiziqarli Faktlar",
    "sections": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Asosiy Nazariya"),("tahlil","Tahlil"),("amaliyot","Amaliyot"),("savollar","Savollar"),("test","Test"),("faktlar","Faktlar"),("lugat","Lug'at"),("xulosa","Xulosa")],
})

# ──────────────────────────────────────────
# 3. INFORMATION BASICS
# ──────────────────────────────────────────
TOPICS.append({
    "filename": "information_basics_darslik.html",
    "page_title": "Axborot va Axborot Texnologiyalari Asoslari | Tibbiyotda IT",
    "meta_desc": "Axborot tushunchasi, turlari, xususiyatlari va tibbiyotdagi ahamiyati. Interaktiv elektron darslik.",
    "meta_keys": "axborot, ma'lumot, axborot texnologiyalari, tibbiyot, IT asoslari",
    "brand_title": "Axborot Asoslari — Tibbiyotda IT",
    "hero_title": "Axborot va Axborot Texnologiyalari Asoslari",
    "hero_subtitle": "Axborot nima, uning turlari, xususiyatlari va tibbiyotda ma'lumotlarni to'g'ri boshqarish — zamonaviy tibbiyot xodimi uchun muhim bilimlar.",
    "hero_icon": SVG_ICONS["info"],
    "stats": [("5", "Axborot turi"), ("7", "Axborot xususiyati"), ("100%", "Raqamli tibbiyot"), ("2x", "Samaradorlik oshishi")],
    "nav_links": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Nazariya"),("amaliyot","Amaliyot"),("test","Test"),("lugat","Lug'at")],
    "maqsad_html": """<div class="grid-2">
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">O'quv Maqsadlari</div>
        <ul class="custom-list">
          <li><strong>Axborot tushunchasi:</strong> Axborot va ma'lumot o'rtasidagi farqni tushunish.</li>
          <li><strong>Axborot turlari:</strong> Matnli, grafik, ovozli, raqamli va ko'p ommaviy axborotlarni ajrata bilish.</li>
          <li><strong>Axborot xususiyatlari:</strong> To'liqlik, aniqlik, dolzarblik, ishonchlilik mezonlarini bilish.</li>
          <li><strong>Tibbiyotda axborot:</strong> Bemor ma'lumotlari, tibbiy hujjatlar va EHR tizimining ahamiyatini anglash.</li>
        </ul>
      </div>
      <div class="glass-card" style="align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(16,185,129,.1));">
        <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:340px;">
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-blue);border-radius:12px;font-weight:700;">1. Ma'lumot (Data)</div>
          <div style="color:var(--med-blue);font-weight:900;">↓ qayta ishlash</div>
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-green);border-radius:12px;font-weight:700;">2. Axborot (Information)</div>
          <div style="color:var(--med-green);font-weight:900;">↓ tahlil</div>
          <div style="padding:14px;background:linear-gradient(90deg,var(--med-blue),var(--med-green));color:#fff;border-radius:12px;font-weight:700;">3. Bilim (Knowledge)</div>
        </div>
      </div>
    </div>""",
    "theory_html": """
    <section class="section-block" id="nazariya">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        2-Bo'lim: Asosiy Nazariya
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        Axborot Tushunchasi va Turlari
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-blue);">Axborot va Ma'lumot Farqi</div>
          <div class="card-desc" style="margin-bottom:10px;">Ma'lumot (Data) — bu xom, qayta ishlanmagan faktlar. Axborot (Information) — bu ma'lumot qayta ishlanib, ma'no kasb etgandan keyingi holat.</div>
          <div class="custom-table-container">
            <table class="custom-table">
              <thead><tr><th>Mezon</th><th>Ma'lumot (Data)</th><th>Axborot (Information)</th></tr></thead>
              <tbody>
                <tr><td>Holati</td><td>Xom, qayta ishlanmagan</td><td>Qayta ishlangan, ma'noli</td></tr>
                <tr><td>Misol</td><td>36.8, 120/80, 98</td><td>Harorat normal, bosim me'yorida</td></tr>
                <tr><td>Tibbiyotda</td><td>Laboratoriya raqamlari</td><td>Diagnoz va xulosa</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-green);">Axborot Turlari</div>
          <ul class="custom-list">
            <li><strong>Matnli (Textual):</strong> Kitoblar, hujjatlar, kasallik tarixlari, retseptlar.</li>
            <li><strong>Grafik (Visual):</strong> Rentgen, MRT, ultratovush tasvirlari, sxemalar.</li>
            <li><strong>Ovozli (Audio):</strong> Yurak urishi toni, o'pka nafas tovushi yozuvi.</li>
            <li><strong>Raqamli (Numeric):</strong> Qon bosimi, temperatura, glyukoza darajasi.</li>
            <li><strong>Ko'p ommaviy (Multimedia):</strong> Laparoskopik operatsiya video yozuvi.</li>
          </ul>
        </div>
      </div>
      <h2 class="section-title" style="margin-top:1rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        Axborotning 7 ta Asosiy Xususiyati
      </h2>
      <div class="grid-4">
        <div class="glass-card"><div class="card-title" style="color:var(--med-blue);">To'liqlik</div><div class="card-desc">Axborot o'z vazifasini bajarishga yetarli va to'liq bo'lishi kerak.</div></div>
        <div class="glass-card"><div class="card-title" style="color:var(--med-green);">Aniqlik</div><div class="card-desc">Axborot haqiqatga mos va noaniq bo'lmasligi kerak.</div></div>
        <div class="glass-card"><div class="card-title" style="color:var(--g-yellow);">Dolzarblik</div><div class="card-desc">Axborot o'z vaqtida taqdim etilishi kerak.</div></div>
        <div class="glass-card"><div class="card-title" style="color:var(--g-purple);">Ishonchlilik</div><div class="card-desc">Axborot ishonchli manbaadan olingan bo'lishi kerak.</div></div>
        <div class="glass-card"><div class="card-title" style="color:var(--g-red);">Tushunarlilik</div><div class="card-desc">Axborot qabul qiluvchi uchun tushunarli shaklda bo'lishi kerak.</div></div>
        <div class="glass-card"><div class="card-title" style="color:var(--med-cyan);">Qisqalik</div><div class="card-desc">Keraksiz ma'lumotlarsiz, ixcham holda taqdim etilishi kerak.</div></div>
        <div class="glass-card"><div class="card-title" style="color:var(--med-blue);">Xavfsizlik</div><div class="card-desc">Axborot ruxsatsiz kirishdan himoyalangan bo'lishi kerak.</div></div>
        <div class="glass-card" style="background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(16,185,129,.1));"><div class="card-title" style="color:var(--med-green);">Tibbiy Axborot</div><div class="card-desc">Yuqoridagi 7 xususiyat bemor hayoti uchun hal qiluvchi ahamiyatga ega.</div></div>
      </div>
    </section>""",
    "pros_cons_title": "Axborot Texnologiyalarining Tibbiyotdagi Afzalliklari va Muammolari",
    "pros": [
        "<strong>Tez qarorlar:</strong> To'g'ri va dolzarb axborot shifokorning diagnostika vaqtini 40-60% qisqartiradi.",
        "<strong>Xatoliklarni kamaytirish:</strong> Raqamli tibbiy yozuvlar qo'lda yozilgan retseptlardagi xatolarni yo'q qiladi.",
        "<strong>Ma'lumotlar almashinuvi:</strong> Bir shifokordan boshqasiga bemor tarixi bir soniyada uzatiladi.",
        "<strong>Statistika va tahlil:</strong> Kasallanish darajasi, epidemiologik trend hisobotlari avtomatik tayyorlanadi.",
    ],
    "cons": [
        "<strong>Ma'lumotlar oshib ketishi:</strong> Juda ko'p axborot shifokorni charchatishi va muhim narsani ko'zdan qoldirishi mumkin.",
        "<strong>Noto'g'ri axborot:</strong> Internet'dagi tibbiy ma'lumotlar ko'pincha noto'g'ri — bu o'z-o'zini davolashga olib keladi.",
        "<strong>Maxfiylik xavfi:</strong> Raqamli bemor ma'lumotlari hackerlarga nishon bo'lishi mumkin.",
    ],
    "checklist": [
        "Axborot va ma'lumot (data) o'rtasidagi farqni yozma ravishda tushuntiring va 2 ta tibbiy misol keltiring.",
        "Axborotning 7 ta xususiyatini yoddan aytib bering va har biriga tibbiyotdan misol keltiring.",
        "Bemor kasallik tarixini axborot sifatida ko'rib chiqing: u qaysi xususiyatlarga ega va qaysilari etishmaydi?",
        "Internetdan qon bosimi haqida ma'lumot toping va uning ishonchliligini manbaa asosida baholang.",
    ],
    "accordion": [
        ("Axborot va ma'lumot farqi nima?", "Ma'lumot — xom faktlar (36.8°C). Axborot — ma'no kasb etgan ma'lumot ('bemor harorati me'yor doirasida'). Ma'lumot qayta ishlanib, kontekstga qo'yilganda axborotga aylanadi."),
        ("Axborotning dolzarbligi nima degani?", "Axborot o'z vaqtida taqdim etilishi kerak. Masalan, qon bosimi o'lchovi o'tgan oydan emas, hozirgi paytdan olingan bo'lishi kerak — eski ma'lumot noto'g'ri qarorga olib kelishi mumkin."),
        ("Tibbiyotda axborotning ishonchliligi nega muhim?", "Noto'g'ri axborot noto'g'ri diagnoz va davolashga olib keladi. Shu sababli EHR (Electronic Health Records) tizimlari tasdiqlangan va auditlangan ma'lumotlarni saqlaydi."),
        ("EHR nima va qanday ishlaydi?", "Electronic Health Records — elektron bemor yozuvi. Bemorning barcha tibbiy tarixini (diagnoz, dori, laboratoriya) bitta raqamli tizimda saqlaydi va shifokorlar unga internetdan kirishi mumkin."),
        ("Qanday axborot turlari tibbiyotda eng ko'p ishlatiladi?", "Grafik (MRT, CT, ultratovush tasvirlari), raqamli (laboratoriya ko'rsatkichlari), matnli (kasallik tarixi, epikriz), ovozli (yurak ritmi yozuvi) — barchasini PACS va HIS tizimlari boshqaradi."),
        ("Axborot xavfsizligi tibbiyotda qanday ta'minlanadi?", "Parollar, ikki bosqichli autentifikatsiya, shifrlash (encryption), foydalanuvchi huquqlari (access rights) va doimiy audit yozuvlari orqali himoyalanadi."),
        ("Big Data tibbiyotda nima?", "Millionlab bemorlarning tibbiy ma'lumotlarini tahlil qilib, kasallik tendensiyalari, dori samaradorligi va epidemiologik bashoratlarni aniqlash uchun ishlatiladi."),
        ("Axborot o'lchov birliklari qanday?", "Axborot bit va baytlar bilan o'lchanadi: 1 Bayt = 8 bit, 1 KB = 1024 B, 1 MB = 1024 KB, 1 GB = 1024 MB. MRT tasviri ≈ 30-150 MB, yillik bemor tarixi ≈ 1-5 GB."),
        ("Axborot texnologiyalari (AT) nima?", "Ma'lumotlarni yig'ish, saqlash, qayta ishlash, uzatish va taqdim etish uchun kompyuter, dasturlar va tarmoqlardan foydalanish."),
        ("Tibbiyotda axborot maxfiyligi qanday tartibga solinadi?", "Dunyo bo'yicha HIPAA (AQSh), GDPR (Yevropa) kabi qonunlar tibbiy axborot maxfiyligini kafolatlaydi. O'zbekistonda 'Shaxsiy ma'lumotlar to'g'risida' qonun mavjud."),
    ],
    "quiz_questions": [
        {"q":"1. Ma'lumot (Data) va Axborot (Information) orasidagi asosiy farq nima?","options":["A) Ma'lumot tezroq","B) Ma'lumot xom, axborot qayta ishlangan va ma'noli","C) Farq yo'q","D) Axborot xom, ma'lumot qayta ishlangan"],"correct":1},
        {"q":"2. Tibbiyotda qaysi axborot turi MRI va X-ray tasvirlari uchun ishlatiladi?","options":["A) Matnli","B) Raqamli","C) Grafik (Visual)","D) Ovozli"],"correct":2},
        {"q":"3. Axborotning qaysi xususiyati 'o'z vaqtida taqdim etilishi' ni anglatadi?","options":["A) To'liqlik","B) Aniqlik","C) Dolzarblik","D) Qisqalik"],"correct":2},
        {"q":"4. EHR qisqartmasi nimani anglatadi?","options":["A) Electronic Health Records","B) Electronic Hospital Report","C) Emergency Health Resource","D) Encrypted Health Records"],"correct":0},
        {"q":"5. Axborotning ishonchliligi tibbiyotda nima uchun eng muhim?","options":["A) Noto'g'ri axborot noto'g'ri diagnoz va davolashga olib keladi","B) Axborot saqlanishiga ta'sir qiladi","C) Internet tezligiga ta'sir qiladi","D" :"Kompyuter ishiga ta'sir qiladi"],"correct":0},
        {"q":"6. 1 Gigabayt (GB) necha Megabayt (MB) ga teng?","options":["A) 100 MB","B) 512 MB","C) 1000 MB","D) 1024 MB"],"correct":3},
        {"q":"7. Quyidagilardan qaysi biri axborotning xususiyati emas?","options":["A) To'liqlik","B) Rangi","C) Aniqlik","D) Ishonchlilik"],"correct":1},
        {"q":"8. PACS tizimi tibbiyotda qanday vazifani bajaradi?","options":["A) Bemorlarni ro'yxatga olish","B) Tibbiy tasvirlarni saqlash va uzatish","C) Dori retseptlarini yozish","D) Hisoblar to'lash"],"correct":1},
        {"q":"9. Internet'dan olingan tibbiy ma'lumot qaysi xususiyati jihatdan eng ko'p muammoga ega?","options":["A) To'liqlik","B) Rangliligi","C) Ishonchlilik (noto'g'ri manbalar)","D) Tezligi"],"correct":2},
        {"q":"10. Big Data tibbiyotda qanday ishlatiladi?","options":["A) Faqat to'lov uchun","B) Millionlab bemor ma'lumotlarini tahlil qilib bashorat va tendensiyalar aniqlash","C) Faqat adminlar uchun","D" :"Printer boshqarish"],"correct":1},
        {"q":"11. Bemor ma'lumotlari maxfiyligini kafolatlashda qaysi xalqaro qonun ishlatiladi?","options":["A) GPL litsenziyasi","B) HIPAA va GDPR","C) ISO 9001","D" :"Creative Commons"],"correct":1},
        {"q":"12. Axborotning 'tushunarlilik' xususiyati nimani anglatadi?","options":["A) Faqat ingliz tilida yozilishi","B) Qabul qiluvchi uchun aniq va tushunarli shaklda bo'lishi","C) Qisqa bo'lishi","D" :"Faqat raqamli bo'lishi"],"correct":1},
        {"q":"13. Qaysi axborot turi laparoskopik operatsiya video yozuvi uchun mos?","options":["A) Matnli","B) Raqamli","C) Ko'p ommaviy (Multimedia)","D" :"Ovozli"],"correct":2},
        {"q":"14. Axborot xavfsizligida 'shifrlash' (encryption) nima?","options":["A) Ma'lumotni o'chirish","B) Ma'lumotni ruxsatsiz kirishdan himoya qilish uchun kodlash","C) Ma'lumotni kompressiya qilish","D" :"Ma'lumotni tarjima qilish"],"correct":1},
        {"q":"15. Tibbiyotda axborot samarali boshqarilganda qanday natija kutiladi?","options":["A) Xarajatlar oshadi","B) Diagnostika vaqti uzayadi","C) Shifokor xatolari kamayadi, samaradorlik oshadi","D" :"Bemorlar ko'payadi"],"correct":2},
    ],
    "facts": [
        "Har kuni dunyoda 2.5 kvintilyon (2.5 × 10^18) bayt yangi ma'lumot yaratiladi.",
        "Tibbiy ma'lumotlar global ma'lumotlar hajmining taxminan 30% ni tashkil etadi va har yili 36% o'sib boradi.",
        "Bitta inson genomini raqamlashtirish taxminan 200 GB joy egallaydi.",
        "Birinchi elektron bemor yozuvi (EHR) tizimi 1960-yillarda AQShning Massachusetts General Hospitalida joriy etilgan.",
        "Axborot so'zi lotincha 'informatio' so'zidan olingan — 'shakl berish', 'tushuntirish' ma'nosini anglatadi.",
        "Tibbiyot sohasida noto'g'ri ma'lumotga asoslangan xato diagnozlar AQShda yiliga 40 000 bemorning vafotiga sabab bo'ladi.",
        "WHO (Jahon Sog'liqni Saqlash Tashkiloti) 2023-yildan barcha a'zo davlatlardan raqamli sog'liqni saqlash tizimiga o'tishni talab qilib chiqdi.",
        "Internet'dagi tibbiy ma'lumotlarning 50% dan ko'prog'i noto'g'ri yoki chalg'ituvchi ekanligi tadqiqotlar bilan isbotlangan.",
        "Yurak urishi (EKG) bir daqiqalik yozuvi taxminan 1 MB hajmdagi ma'lumot hosil qiladi.",
        "O'zbekistonda 2021-yildan boshlab barcha davlat shifoxonalarini bitta axborot tizimiga (EMIAS) ulash boshlandi.",
    ],
    "glossary": [
        ("Ma'lumot (Data)", "Qayta ishlanmagan xom faktlar — raqamlar, belgilar, o'lchov natijalari."),
        ("Axborot (Information)", "Qayta ishlangan, ma'no kasb etgan ma'lumot — tahlil va qaror qabul qilish asosi."),
        ("Bilim (Knowledge)", "Axborot asosida shakllantirilgan tajriba va tushuncha."),
        ("EHR", "Electronic Health Records — elektron bemor yozuvi tizimi."),
        ("PACS", "Picture Archiving and Communication System — tibbiy tasvirlarni saqlash tizimi."),
        ("Bit", "Axborotning eng kichik o'lchov birligi — 0 yoki 1 qiymati."),
        ("Bayt", "8 ta bitdan iborat axborot o'lchov birligi — bitta belgi saqlanadi."),
        ("Shifrlash (Encryption)", "Ma'lumotni ruxsatsiz kirishdan himoya qilish uchun maxsus kodlash usuli."),
        ("Big Data", "Juda katta hajmdagi ma'lumotlar to'plamini tahlil qilish texnologiyasi."),
        ("HIPAA", "Health Insurance Portability and Accountability Act — AQShda tibbiy ma'lumotlar maxfiyligini tartibga soluvchi qonun."),
        ("GDPR", "General Data Protection Regulation — Yevropada shaxsiy ma'lumotlarni himoya qiluvchi qonun."),
        ("Axborot Xavfsizligi", "Axborotni ruxsatsiz kirish, o'zgartirish va yo'q qilishdan himoya qilish choralari tizimi."),
    ],
    "conclusion_items": [
        "Axborot — zamonaviy tibbiyotning asosi; aniq va dolzarb axborot to'g'ri diagnoz va davolash kafolatidir.",
        "EHR va PACS tizimlari tibbiy axborotni samarali boshqarib, xatoliklarni minimallashtiradi.",
        "Tibbiy axborot maxfiyligi — qonuniy va axloqiy mas'uliyat; har bir tibbiyot xodimi buni bilishi shart.",
    ],
    "conclusion_desc": "Axborot va Axborot Texnologiyalari Asoslari mavzusini muvaffaqiyatli yakunladingiz.",
    "search_placeholder": "Qidiruv so'zini kiriting (axborot, EHR, ma'lumot, PACS)...",
    "facts_title": "Axborot va Tibbiyot Haqida Qiziqarli Faktlar",
    "sections": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Asosiy Nazariya"),("tahlil","Tahlil"),("amaliyot","Amaliyot"),("savollar","Savollar"),("test","Test"),("faktlar","Faktlar"),("lugat","Lug'at"),("xulosa","Xulosa")],
})

# ──────────────────────────────────────────
# 4. INTERNET CONNECTION
# ──────────────────────────────────────────
TOPICS.append({
    "filename": "internet_connection_darslik.html",
    "page_title": "Internet va Kompyuter Tarmoqlari | Tibbiyotda IT",
    "meta_desc": "Internet, Wi-Fi, LAN tarmoqlari va tibbiy muassasalarda ulanish asoslari. Interaktiv darslik.",
    "meta_keys": "internet, tarmoq, Wi-Fi, LAN, IP manzil, tibbiyot, xavfsiz ulanish",
    "brand_title": "Internet va Tarmoqlar — Tibbiyotda IT",
    "hero_title": "Internet va Kompyuter Tarmoqlari: Ulanish Asoslari",
    "hero_subtitle": "Internet nima, Wi-Fi va LAN tarmoqlar, IP manzillar, xavfsiz ulanish — tibbiy muassasalarda axborot almashish va telemedisinaning texnik asoslari.",
    "hero_icon": SVG_ICONS["internet"],
    "stats": [("5G", "Hozirgi standart"), ("IPv6", "Yangi protokol"), ("100%", "Shifrlash kerak"), ("3+", "Tarmoq turi")],
    "nav_links": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Nazariya"),("amaliyot","Amaliyot"),("test","Test"),("lugat","Lug'at")],
    "maqsad_html": """<div class="grid-2">
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">O'quv Maqsadlari</div>
        <ul class="custom-list">
          <li><strong>Internet tushunchasi:</strong> Global tarmoq tuzilishi va uning tibbiyotdagi roli.</li>
          <li><strong>Tarmoq turlari:</strong> LAN, WAN, Wi-Fi va ularning shifoxonadagi qo'llanilishi.</li>
          <li><strong>IP manzil:</strong> Har bir qurilmaning tarmoqdagi o'ziga xos manzilini tushunish.</li>
          <li><strong>Xavfsiz ulanish:</strong> Tibbiy ma'lumotlar shifrlash va VPN texnologiyalarini bilish.</li>
        </ul>
      </div>
      <div class="glass-card" style="align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(14,165,233,.1),rgba(6,182,212,.1));">
        <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:340px;">
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-cyan);border-radius:12px;font-weight:700;">1. LAN (Shifoxona Tarmog'i)</div>
          <div style="color:var(--med-cyan);font-weight:900;">↕</div>
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-blue);border-radius:12px;font-weight:700;">2. Internet (Global Tarmoq)</div>
          <div style="color:var(--med-blue);font-weight:900;">↕</div>
          <div style="padding:14px;background:linear-gradient(90deg,var(--med-cyan),var(--med-blue));color:#fff;border-radius:12px;font-weight:700;">3. Telemeditsina va Bulut</div>
        </div>
      </div>
    </div>""",
    "theory_html": """
    <section class="section-block" id="nazariya">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="8" x2="22" y2="8"/></svg>
        2-Bo'lim: Asosiy Nazariya
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Internet va Tarmoq Turlari
      </h2>
      <div class="grid-3">
        <div class="glass-card" style="border-left:4px solid var(--med-blue);">
          <div class="card-title" style="color:var(--med-blue);">LAN (Local Area Network)</div>
          <div class="card-desc">Mahalliy tarmoq — bitta bino yoki bir nechta binodan iborat tarmoq. Shifoxona ichidagi barcha kompyuterlar birlashadi.</div>
          <ul class="custom-list"><li>Tezlik: 100 Mbps – 1 Gbps</li><li>Kabel yoki Wi-Fi orqali</li><li>HIS, PACS birlashtirish</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Ichki tibbiy tarmoq</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--med-green);">
          <div class="card-title" style="color:var(--med-green);">WAN (Wide Area Network)</div>
          <div class="card-desc">Keng tarmoq — shahar, viloyat yoki mamlakatlar orasidagi tarmoq. Internet — eng katta WAN.</div>
          <ul class="custom-list"><li>Tezlik: 1 Mbps – 100 Mbps+</li><li>Fiber optik, satellit</li><li>Viloyatlar orasida ma'lumot</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Mintaqaviy tibbiyot</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--g-yellow);">
          <div class="card-title" style="color:var(--g-yellow);">Wi-Fi (Simsiz Tarmoq)</div>
          <div class="card-desc">Simsiz aloqa — radio to'lqinlar orqali qurilmalarni tarmoqqa ulash. Shifoxona palatalarida qulay.</div>
          <ul class="custom-list"><li>Wi-Fi 6 (802.11ax) — eng yangi</li><li>Masofa: 30–100 metr</li><li>Tibbiy qurilmalar bilan ishlaydi</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Mobil hamshiralar</div>
        </div>
      </div>
      <h2 class="section-title" style="margin-top:1rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-purple)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Xavfsiz Internet Ulanish va IP Manzillar
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--g-purple);">IP Manzil Nima?</div>
          <div class="card-desc">Internet Protocol Address — tarmoqdagi har bir qurilmaning o'ziga xos manzili. Xat pochta manziliga o'xshaydi.</div>
          <div class="custom-table-container" style="margin-top:10px;">
            <table class="custom-table">
              <thead><tr><th>Tur</th><th>Format</th><th>Misol</th></tr></thead>
              <tbody>
                <tr><td>IPv4</td><td>4 raqam guruhi</td><td>192.168.1.100</td></tr>
                <tr><td>IPv6</td><td>6 ta 16-lik son</td><td>2001:db8::1</td></tr>
                <tr><td>Lokal</td><td>192.168.x.x</td><td>Shifoxona ichida</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-green);">Tibbiyotda Xavfsiz Ulanish Choralari</div>
          <ul class="custom-list">
            <li><strong>VPN (Virtual Private Network):</strong> Masofaviy shifrlangan xavfsiz ulanish — masofadan ishlayotgan shifokorlar uchun.</li>
            <li><strong>HTTPS protokoli:</strong> Tibbiy ma'lumotlar shifrlangan kanalda uzatiladi.</li>
            <li><strong>Firewall:</strong> Ruxsatsiz kirish urinishlarini bloklaydi.</li>
            <li><strong>Wi-Fi parollar:</strong> WPA3 shifrlash — shifoxona tarmog'ini himoya qiladi.</li>
            <li><strong>MAC filtrlash:</strong> Faqat ro'yxatga olingan qurilmalar tarmoqqa ulana oladi.</li>
          </ul>
        </div>
      </div>
    </section>""",
    "pros_cons_title": "Internet Tarmoqlarining Tibbiyotdagi Afzalliklari va Xatarlari",
    "pros": [
        "<strong>Telemeditsina:</strong> Internet orqali masofaviy konsultatsiya — qishloq bemorlariga shahar mutaxassisi yordami.",
        "<strong>Tez ma'lumot almashish:</strong> Rentgen va MRT tasvirlari sekundlar ichida boshqa shifoxonaga uzatiladi.",
        "<strong>Bulut xotira:</strong> Shifoxona ma'lumotlari yo'qolmasdan bulutda saqlanadi.",
        "<strong>Yangi bilimlar:</strong> PubMed, UpToDate kabi tibbiy bazalarga kirish va zamonaviy usullarni o'rganish.",
    ],
    "cons": [
        "<strong>Kiberxavfsizlik xavfi:</strong> Tibbiy ma'lumotlar 2015-2024 yillarda eng ko'p hacklangan ma'lumot turi bo'ldi.",
        "<strong>Internet uzilishi:</strong> Tarmoq uzilganda bulutdagi EHR tizimiga kirish imkonsiz bo'lib qoladi.",
        "<strong>Tezlik muammosi:</strong> DICOM tasvirlarini (30-150 MB) o'tkazish sekin internet bilan og'irlik qiladi.",
    ],
    "checklist": [
        "Shifoxona Wi-Fi tarmog'iga ulaning va IP manzilingizni (ipconfig buyrug'i yoki tarmoq sozlamalari orqali) aniqlang.",
        "Brauzer orqali istalgan tibbiy saytga kiring — manzil satrida HTTPS (qulf belgisi) borligini tekshiring.",
        "Kompyuteringizda VPN ilovasi bor-yo'qligini aniqlang va IT administratoringizdan VPN haqida so'rang.",
        "Internetdagi biror tibbiy axborot manbaa sifatiga baho bering: WHO yoki PubMed ma'lumotlarini oddiy sayt bilan solishtiring.",
    ],
    "accordion": [
        ("Internet qanday ishlaydi?", "Internet — global tarmoq. Ma'lumotlar paket (packet) shaklida, turli yo'llar orqali uzatiladi. DNS serverlar domen nomlarini IP manzilga aylantiradi, so'rov va javob millisaniyalarda o'tadi."),
        ("LAN va Wi-Fi farqi nima?", "LAN — kabel orqali, juda tez va ishonchli. Wi-Fi — simsiz, qulay, lekin signal uchish sifati va xavfsizligi kabelga nisbatan past. Tibbiyotda muhim tizimlar kabel LAN'ga ulanishi tavsiya etiladi."),
        ("IP manzil nima uchun kerak?", "Xuddi pochta manzili kabi — har bir qurilmani tarmoqda noyob identifikatsiya qilish uchun. Tarmoqdagi ma'lumot paketlari to'g'ri manzilga yetib borishi uchun IP shart."),
        ("Firewall (Brandmauer) nima?", "Tarmoqqa kiruvchi va chiquvchi ma'lumotlar oqimini nazorat qiluvchi xavfsizlik to'sig'i. Tibbiy tarmoqlarda ruxsatsiz kirish urinishlarini bloklaydi."),
        ("VPN nima va tibbiyotda qanday ishlatiladi?", "Virtual Private Network — shifrlangan xavfsiz tunnel. Masofadan ishlaydigan shifokorlar VPN orqali shifoxona EHR tizimiga xavfsiz kirishadi."),
        ("DNS nima?", "Domain Name System — 'google.com' kabi domen nomlarini '142.250.185.14' kabi IP manzilga aylantiruvchi tarmoq tizimi. Internetdagi telefon kitobi kabi ishlaydi."),
        ("HTTPS va HTTP farqi nima?", "HTTP — oddiy, shifrlanmagan aloqa. HTTPS — SSL/TLS shifrlash bilan himoyalangan. Tibbiy saytlar va EHR tizimlar faqat HTTPS ishlatishi shart."),
        ("Wi-Fi WPA3 shifrlash nima?", "Wi-Fi Protected Access 3 — eng yangi va kuchli simsiz tarmoq himoyasi. WPA2 ga nisbatan parolni taxmin qilishga (brute force) ancha chidamli."),
        ("Ping nima?", "Tarmoq orqali boshqa qurilmaga signal yuborib, javob vaqtini o'lchovchi buyruq. Masalan 'ping 192.168.1.1' — tarmoq aloqa sifatini tekshiradi."),
        ("5G tarmoq tibbiyotda qanday imkoniyatlar beradi?", "5G — millisaniya latentligi va gigabit tezlik. Robot jarroh qo'lining masofaviy boshqaruvi, real vaqtda 4K UHD telemeditsina va IoMT (Tibbiy Narsalar Interneti) qurilmalarini ulash uchun."),
    ],
    "quiz_questions": [
        {"q":"1. LAN qisqartmasi nimani anglatadi?","options":["A) Large Area Network","B) Local Area Network","C) Linear Access Node","D) Local Access Node"],"correct":1},
        {"q":"2. IP manzil qanday vazifani bajaradi?","options":["A) Kompyuterni himoya qilish","B) Tarmoqdagi qurilmani noyob identifikatsiya qilish","C) Internet tezligini oshirish","D" :"Antivirusni yangilash"],"correct":1},
        {"q":"3. HTTPS protokoli nima uchun muhim?","options":["A) Sahifani tezroq yuklash","B) Ma'lumotlarni shifrlash va xavfsiz uzatish","C) Reklama ko'rsatish","D" :"Fayllarni saqlash"],"correct":1},
        {"q":"4. VPN nima?","options":["A) Virus Protection Network","B) Virtual Private Network — shifrlangan xavfsiz ulanish","C) Very Private Notification","D" :"Video Play Network"],"correct":1},
        {"q":"5. Wi-Fi ning eng yangi xavfsizlik standarti qaysi?","options":["A) WEP","B) WPA","C) WPA2","D" :"WPA3"],"correct":3},
        {"q":"6. Tibbiyotda Internet asosan qaysi maqsadda ishlatiladi?","options":["A) Faqat o'yin uchun","B) Telemeditsina, ma'lumot almashish va bulut tizimlar","C) Faqat xabar yuborish uchun","D" :"Faqat video ko'rish"],"correct":1},
        {"q":"7. Firewall nima?","options":["A) Qizdirgich qurilma","B) Ruxsatsiz kirish urinishlarini bloklashga mo'ljallangan xavfsizlik tizimi","C) Internet brauzer","D" :"Antivirus dasturi"],"correct":1},
        {"q":"8. DNS tizimi qanday ishlaydi?","options":["A) Tarmoqni oshiradigan qurilma","B) Domen nomlarini IP manzilga aylantiradi","C) Parollarni saqlaydi","D" :"Elektron pochta yuboradi"],"correct":1},
        {"q":"9. WAN nima?","options":["A) Wireless Access Node","B) Wide Area Network — shahar yoki mamlakatlar orasidagi keng tarmoq","C) Web Access Network","D" :"Wired Area Node"],"correct":1},
        {"q":"10. IPv4 manzilining formati qanday?","options":["A) 6 ta 16-lik son guruhi","B) 4 ta o'nli son guruhi, masalan 192.168.1.1","C) 8 ta harfdan iborat","D" :"Faqat raqamlar"],"correct":1},
        {"q":"11. 5G tarmoqning tibbiyotdagi eng katta afzalligi nima?","options":["A) Arzonroq","B) Millisaniya latentligi — robot jarroh va real vaqt telemeditsina","C) Kabeldan kuchliroq","D" :"Ko'proq qurilmani ulash"],"correct":1},
        {"q":"12. Tibbiy ma'lumotlar uzatishda nima shart?","options":["A) Oddiy HTTP","B) Shifrlash (HTTPS, VPN) va xavfsiz kanal","C) Tezkor Wi-Fi","D" :"Kabel LAN"],"correct":1},
        {"q":"13. Ping buyrug'i nima uchun ishlatiladi?","options":["A) Fayllarni o'chirish","B) Tarmoq aloqa sifatini va kechikishini tekshirish","C) Parolni o'zgartirish","D" :"Dastur o'rnatish"],"correct":1},
        {"q":"14. MAC filtrlash qanday xavfsizlik usuli?","options":["A) Faqat ro'yxatga olingan qurilmalarning tarmoqqa ulanishiga ruxsat berish","B) Parolni almashtirib turish","C) Antivirus yangilash","D" :"Firewall o'chirish"],"correct":0},
        {"q":"15. DICOM fayllari (tibbiy tasvirlar) uchun qanday tarmoq tezligi tavsiya etiladi?","options":["A) 56 kbps","B) 512 kbps","C) Kamida 10-100 Mbps","D" :"1 Mbps"],"correct":2},
    ],
    "facts": [
        "Internet 1969-yilda ARPANET nomi bilan faqat 4 ta universitetni ulash uchun yaratilgan.",
        "2024-yilda dunyoda 5.4 milliarddan ortiq internet foydalanuvchisi bor — bu yer aholisining 67% ini tashkil etadi.",
        "Wi-Fi nomi 'Wireless Fidelity' so'zlarining qisqartmasi emas — bu marketing nomidan iborat va aslida hech qanday ma'nosi yo'q.",
        "Dunyodagi eng tez internet — 2020-yilda Yaponiyada o'lchangan 319 terabit/soniya.",
        "Tibbiy ma'lumotlar (EHR) 2015-2020 yillarda kiberjinoyatchilar uchun eng qimmat va ko'p o'g'irlangan ma'lumot turi bo'ldi.",
        "IPv4 manzillar 2011-yilda rasman tugab, barcha yangi qurilmalar IPv6 ga o'tmoqda.",
        "Google dunyodagi eng katta DNS provider bo'lib, har kuni 1 trilliondan ortiq DNS so'rovini qayta ishlaydi.",
        "Telemeditsina bozori 2030-yilga kelib 460 milliard dollargacha o'sishi kutilmoqda.",
        "O'zbekistonda 2024-yilda internet tezligi 5 barobar oshdi va fiber optik tarmoq 350 dan ortiq shahar va qishloqqa yetkazildi.",
        "Shifoxonalar 2021-2023 yillarda eng ko'p ransomware hujumiga uchragan soha bo'lib, o'rtacha zarar 1.27 million dollarni tashkil etgan.",
    ],
    "glossary": [
        ("Internet", "Global kompyuter tarmog'i — milliardlab qurilmalarni bir-biriga ulaydi."),
        ("LAN", "Local Area Network — mahalliy tarmoq, bitta bino yoki kompleks ichidagi qurilmalar tarmog'i."),
        ("WAN", "Wide Area Network — keng tarmoq, shahar, mamlakat yoki global miqyos."),
        ("Wi-Fi", "Wireless Fidelity — radio to'lqinlar orqali simsiz internet ulanish texnologiyasi."),
        ("IP Manzil", "Internet Protocol Address — tarmoqdagi har bir qurilmaning noyob raqamli manzili."),
        ("DNS", "Domain Name System — domen nomini IP manzilga aylantiruvchi tarmoq tizimi."),
        ("HTTPS", "HyperText Transfer Protocol Secure — shifrlangan xavfsiz web aloqa protokoli."),
        ("VPN", "Virtual Private Network — shifrlangan xavfsiz masofaviy ulanish tunneli."),
        ("Firewall", "Tarmoqqa ruxsatsiz kirishni bloklashga mo'ljallangan xavfsizlik tizimi."),
        ("WPA3", "Wi-Fi Protected Access 3 — eng yangi va kuchli simsiz tarmoq shifrlash standarti."),
        ("Ping", "Tarmoq orqali signal yuborib aloqa sifati va kechikishini o'lchovchi buyruq."),
        ("5G", "Beshinchi avlod mobil aloqa tarmog'i — gigabit tezlik va millisaniya kechikish."),
    ],
    "conclusion_items": [
        "Internet va tarmoq texnologiyalari zamonaviy tibbiyotda telemeditsina va EHR tizimlarining asosini tashkil etadi.",
        "Xavfsiz ulanish (HTTPS, VPN, Firewall) tibbiy ma'lumotlarni kiberhujumlardan himoya qiladi.",
        "LAN va Wi-Fi tarmoqlar shifoxona ichidagi barcha tibbiy qurilmalarni birlashtirib, samarali ishlashni ta'minlaydi.",
    ],
    "conclusion_desc": "Internet va Kompyuter Tarmoqlari mavzusini muvaffaqiyatli yakunladingiz.",
    "search_placeholder": "Qidiruv so'zini kiriting (internet, Wi-Fi, VPN, IP)...",
    "facts_title": "Internet va Tarmoqlar Haqida Qiziqarli Faktlar",
    "sections": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Asosiy Nazariya"),("tahlil","Tahlil"),("amaliyot","Amaliyot"),("savollar","Savollar"),("test","Test"),("faktlar","Faktlar"),("lugat","Lug'at"),("xulosa","Xulosa")],
})

# ──────────────────────────────────────────
# 5. INFO SYSTEMS SAFETY
# ──────────────────────────────────────────
TOPICS.append({
    "filename": "info_systems_safety_darslik.html",
    "page_title": "Axborot Tizimlari Xavfsizligi | Tibbiyotda IT",
    "meta_desc": "Kiberxavfsizlik, parollar, viruslar va tibbiy ma'lumotlarni himoya qilish. Interaktiv elektron darslik.",
    "meta_keys": "kiberxavfsizlik, antivirus, parol, shifrlash, tibbiy ma'lumot himoyasi, HIPAA",
    "brand_title": "Axborot Xavfsizligi — Tibbiyotda IT",
    "hero_title": "Axborot Tizimlari Xavfsizligi va Kiberxavfsizlik Asoslari",
    "hero_subtitle": "Parollar, viruslar, fishing hujumlar, ma'lumotlarni shifrlash va tibbiy muassasalarda axborot xavfsizligini ta'minlash — zamonaviy tibbiyot xodimi uchun zaruriy bilim.",
    "hero_icon": SVG_ICONS["shield"],
    "stats": [("300%", "Tibbiy hujumlar o'sishi"), ("1.27M$", "O'rtacha zarar"), ("3", "Xavfsizlik darajasi"), ("100%", "Himoya kerak")],
    "nav_links": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Nazariya"),("amaliyot","Amaliyot"),("test","Test"),("lugat","Lug'at")],
    "maqsad_html": """<div class="grid-2">
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">O'quv Maqsadlari</div>
        <ul class="custom-list">
          <li><strong>Tahdid turlarini bilish:</strong> Virus, troyan, fishing, ransomware va social engineering.</li>
          <li><strong>Himoya choralari:</strong> Kuchli parol, antivirus, 2FA, shifrlash usullarini o'zlashtirish.</li>
          <li><strong>Tibbiy ma'lumot himoyasi:</strong> HIPAA, GDPR va mahalliy qonunlar talablarini tushunish.</li>
          <li><strong>Xavfsiz odatlar:</strong> Kundalik ish jarayonida kiberxavfsizlikni ta'minlash ko'nikmalari.</li>
        </ul>
      </div>
      <div class="glass-card" style="align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(16,185,129,.1),rgba(239,68,68,.1));">
        <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:340px;">
          <div style="padding:14px;background:rgba(239,68,68,.1);border:1px solid var(--g-red);border-radius:12px;font-weight:700;">Tahdid (Threat)</div>
          <div style="color:var(--g-red);font-weight:900;">↓ qarshi kurash</div>
          <div style="padding:14px;background:rgba(255,255,255,.05);border:1px solid var(--med-blue);border-radius:12px;font-weight:700;">Himoya Choralari</div>
          <div style="color:var(--med-green);font-weight:900;">↓ natija</div>
          <div style="padding:14px;background:linear-gradient(90deg,var(--med-blue),var(--med-green));color:#fff;border-radius:12px;font-weight:700;">Xavfsiz Tizim</div>
        </div>
      </div>
    </div>""",
    "theory_html": """
    <section class="section-block" id="nazariya">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        2-Bo'lim: Asosiy Nazariya
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Kibertahdid Turlari va Himoya Choralari
      </h2>
      <div class="grid-3">
        <div class="glass-card" style="border-left:4px solid var(--g-red);">
          <div class="card-title" style="color:var(--g-red);">Virus va Zararli Dasturlar</div>
          <div class="card-desc">O'z-o'zidan tarqaluvchi va kompyuter tizimini buzuvchi zararli kod.</div>
          <ul class="custom-list"><li>Troyan (Trojan) — yashirin zarar</li><li>Ransomware — ma'lumot qulflab pul talab qiladi</li><li>Spyware — ma'lumot o'g'irlaydi</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Tibbiy tizim xatari</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--g-yellow);">
          <div class="card-title" style="color:var(--g-yellow);">Fishing (Phishing)</div>
          <div class="card-desc">Aldamchi elektron xatlar yoki saytlar orqali parol va ma'lumotlarni o'g'irlash.</div>
          <ul class="custom-list"><li>Soxta login sahifalar</li><li>Shoshiltirib yuborilgan xatlar</li><li>Rasmiy tashkilot nomidan aldash</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Email xujumlari</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--g-purple);">
          <div class="card-title" style="color:var(--g-purple);">Social Engineering</div>
          <div class="card-desc">Insonga psixologik ta'sir o'tkazib, maxfiy ma'lumotni olish — eng xavfli hujum turi.</div>
          <ul class="custom-list"><li>Telefon orqali aldash (Vishing)</li><li>IT xodim nomidan so'rov</li><li>Shoshiltirib parol so'rash</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Eng ko'p hujum turi</div>
        </div>
      </div>
      <h2 class="section-title" style="margin-top:1rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        Kuchli Himoya Choralari
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-green);">Kuchli Parol Qoidalari</div>
          <div class="custom-table-container">
            <table class="custom-table">
              <thead><tr><th>Qoida</th><th>Yaxshi</th><th>Yomon</th></tr></thead>
              <tbody>
                <tr><td>Uzunlik</td><td>12+ belgi</td><td>qisqa</td></tr>
                <tr><td>Tarkib</td><td>Harf+raqam+belgi</td><td>faqat so'z</td></tr>
                <tr><td>Misol</td><td>T1bb!y0t_2024#</td><td>tibbiyot</td></tr>
                <tr><td>Yangilash</td><td>Har 90 kunda</td><td>Hech qachon</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-blue);">Ikki Bosqichli Autentifikatsiya (2FA)</div>
          <div class="card-desc" style="margin-bottom:10px;">Paroldan tashqari qo'shimcha tasdiqlash — SMS kod, autentifikator ilovasi yoki biometrika.</div>
          <ul class="custom-list">
            <li><strong>SMS OTP:</strong> Telefonga yuborilgan bir martalik kod.</li>
            <li><strong>Authenticator App:</strong> Google Authenticator, Microsoft Authenticator.</li>
            <li><strong>Biometrika:</strong> Barmoq izi, yuz tanish — shifoxona tizimlarida keng tarqalmoqda.</li>
            <li><strong>Apparat kalit:</strong> YubiKey — eng ishonchli 2FA usuli.</li>
          </ul>
        </div>
      </div>
    </section>""",
    "pros_cons_title": "Kiberxavfsizlik Choralarining Tibbiyotdagi Ahamiyati",
    "pros": [
        "<strong>Bemor ma'lumotlari himoyasi:</strong> To'g'ri himoya bemorlar maxfiyligini ta'minlaydi va qonun talablarini bajaradi.",
        "<strong>Tizim ishlashini ta'minlash:</strong> Ransomware hujumlari oldini olish shifoxona faoliyatini to'xtatmaydi.",
        "<strong>Ishonch va obro':</strong> Xavfsiz tizim bemorlar va hamkorlar ishonchini oshiradi.",
        "<strong>Jarima oldini olish:</strong> HIPAA/GDPR talablarini bajarish millionlik jarimalardan qutqaradi.",
    ],
    "cons": [
        "<strong>Murakkablik:</strong> Kuchli xavfsizlik tizimi murakkab va xodimlar uchun qo'shimcha o'rganish talab etadi.",
        "<strong>Xarajat:</strong> Kiberxavfsizlik yechimlari (antivirus, VPN, firewall) mablag' talab qiladi.",
        "<strong>Inson omili:</strong> Eng yaxshi texnik yechim ham noto'g'ri xatti-harakat tufayli buzilishi mumkin.",
    ],
    "checklist": [
        "Kompyuteringizdagi barcha hisoblaringiz parolini tekshiring: 12+ belgi, harf+raqam+maxsus belgi borligini ta'minlang.",
        "Windows Defender yoki boshqa antivirus to'liq skan (Full Scan) ni ishga tushiring.",
        "Elektron pochtangizga kelgan oxirgi 5 xatni ko'rib chiqing va phishing belgilarini aniqlang (jo'natuvchi, havola).",
        "Muhim fayllaringizning zaxira nusxasi (backup) bor-yo'qligini tekshiring — bulut yoki tashqi diskda.",
    ],
    "accordion": [
        ("Ransomware nima va tibbiyotda qanday xatar tug'diradi?", "Ransomware — fayllarni qulflab, pul undiruvchi zararli dastur. 2020-yilda Universal Health Services tarmog'iga hujum shifoxona tizimlarini 400 ta muassasada bir necha kunga to'xtatib qo'ydi."),
        ("Fishing hujumini qanday aniqlash mumkin?", "Shoshiltiruv, noto'g'ri jo'natuvchi manzil, shubhali havolalar, so'ralgan maxfiy ma'lumotlar. Hech qachon fishing xatidagi havolani bosmang — bevosita sayt manziliga boring."),
        ("Kuchli parol qanday bo'lishi kerak?", "Kamida 12 ta belgi, katta va kichik harflar, raqamlar va maxsus belgilar (!@#$%) aralashmasi. Har bir sayt uchun alohida parol. Parol menejer (LastPass, Bitwarden) ishlatish tavsiya etiladi."),
        ("2FA nima va nima uchun kerak?", "Ikki bosqichli autentifikatsiya — paroldan tashqari qo'shimcha tasdiqlash (SMS, app, barmoq izi). Parolingiz o'g'irlansa ham, hisob himoyalangan qoladi."),
        ("Antivirus dasturini qanday tanlash kerak?", "Tibbiy muassasalar uchun korporativ litsenziyali antivirus (Kaspersky Endpoint Security, ESET, Sophos) tavsiya etiladi. Bepul antiviruslar tibbiy standart uchun yetarli emas."),
        ("HIPAA va GDPR qonunlari nima?", "HIPAA (AQSh) va GDPR (Yevropa) tibbiy va shaxsiy ma'lumotlar maxfiyligini tartibga soluvchi qonunlar. Buzilish holatlarda millionlik jarimalar belgilangan."),
        ("Social Engineering dan qanday himoyalanish mumkin?", "Hech qachon telefon orqali parolni aytmang. IT xodim siz bilan bog'lansa, qayta qo'ng'iroq qilib aniqlang. 'Shoshilinch holat' deb so'ralgan ma'lumot fishing belgisi."),
        ("Zaxira nusxa (Backup) nima uchun kerak?", "Ransomware, disk xatoligi yoki baxtsiz hodisada ma'lumotlar tiklanishi uchun. 3-2-1 qoidasi: 3 nusxa, 2 xil muhit, 1 ta internet ulangandan tashqarida."),
        ("Shifrlash (Encryption) tibbiyotda qanday ishlaydi?", "Tibbiy ma'lumotlar AES-256 algoritmida shifrlangan saqlanadi va uzatiladi. Shifrlangan ma'lumot kalitsiz o'qib bo'lmaydi — xato qo'llarga tushsa ham ahamiyatsiz."),
        ("Zero Trust arxitekturasi nima?", "'Hech kimga ishonma, hammani tekshir' tamoyili. Har bir kirish so'rovi autentifikatsiyalanadi — ichki tarmoqdagi qurilmalar ham. Zamonaviy tibbiy IT xavfsizligining asosi."),
    ],
    "quiz_questions": [
        {"q":"1. Ransomware nima?","options":["A) Fayllarni tezlashtiruvchi dastur","B) Fayllarni qulflab pul talab qiluvchi zararli dastur","C) Antivirus dasturi","D" :"Zaxira nusxa dasturi"],"correct":1},
        {"q":"2. Fishing (Phishing) hujumi qanday amalga oshiriladi?","options":["A) Bevosita kompyuterga kirib","B) Aldamchi elektron xatlar yoki saytlar orqali parol o'g'irlash","C) Tarmoqni o'chirish orqali","D" :"Fizik hujum orqali"],"correct":1},
        {"q":"3. Kuchli parol uchun minimal qancha belgi tavsiya etiladi?","options":["A) 4 belgi","B) 6 belgi","C) 8 belgi","D" :"12+ belgi"],"correct":3},
        {"q":"4. 2FA (ikki bosqichli autentifikatsiya) nima?","options":["A) Ikki xil antivirus","B) Paroldan tashqari qo'shimcha tasdiqlash usuli","C) Ikki kompyuterda ishlash","D" :"Ikki xil brauzer"],"correct":1},
        {"q":"5. Social Engineering nima?","options":["A) Texnik hujum usuli","B) Insonga psixologik ta'sir o'tkazib maxfiy ma'lumot olish","C) Dasturiy ta'minot xatosi","D" :"Tarmoq hujumi"],"correct":1},
        {"q":"6. HIPAA qonuni qaysi mamlakatda tibbiy ma'lumotlarni tartibga soladi?","options":["A) Buyuk Britaniya","B) Germaniya","C) AQSh","D" :"Fransiya"],"correct":2},
        {"q":"7. 3-2-1 zaxira qoidasi nima?","options":["A) 3 antivirus, 2 firewall, 1 VPN","B) 3 nusxa, 2 xil muhit, 1 offline nusxa","C) 3 parol, 2 hisob, 1 admin","D" :"3 disk, 2 bulut, 1 flesh"],"correct":1},
        {"q":"8. AES-256 nima?","options":["A) Antivirus dasturi","B) Shifrlash algoritmi — 256 bitli maxfiy kalit","C) Tarmoq protokoli","D" :"Operatsion tizim"],"correct":1},
        {"q":"9. Qaysi parol kuchliroq?","options":["A) tibbiyot2024","B) 12345678","C) T1bb!y0t_2024#Az","D" :"password"],"correct":2},
        {"q":"10. Zero Trust arxitekturasi nimani anglatadi?","options":["A) Hech kim ishonchsiz","B) Hech kimga ishonma, hammani tekshir tamoyili","C) Foydalanuvchi parolsiz kirishi","D" :"Internet tezligi"],"correct":1},
        {"q":"11. Antivirus dasturini qanday saqlash kerak?","options":["A) Bir marta o'rnatilsa yetarli","B) Faqat yangi kompyuterda kerak","C) Doimiy yangilanib va muntazam skan o'tkazib turilishi kerak","D" :"Kerak emas"],"correct":2},
        {"q":"12. Fishing xatini qanday aniqlash mumkin?","options":["A) Xat rangi bilan","B) Shoshiltiruv, noto'g'ri jo'natuvchi, shubhali havola belgilari","C) Xat hajmi bilan","D" :"Hech qachon aniqlab bo'lmaydi"],"correct":1},
        {"q":"13. Tibbiy ma'lumotlarda shifrlash nega muhim?","options":["A) Fayllarni kichraytirish uchun","B) Ruxsatsiz kirganlar ma'lumotni o'qiy olmasligi uchun","C) Internetni tezlashtirish uchun","D" :"Zaxira nusxa uchun"],"correct":1},
        {"q":"14. Spyware nima qiladi?","options":["A) Kompyuterni tezlashtiradi","B) Foydalanuvchi ma'lumotlarini yashirin tarzda o'g'irlaydi","C) Fayllarni qulflaydi","D" :"Antivirusni o'chiradi"],"correct":1},
        {"q":"15. GDPR qonuni qaysi sohada kuchli jarimalar belgilagan?","options":["A) Dasturiy ta'minot litsenziyasi","B) Shaxsiy ma'lumotlarni ruxsatsiz qayta ishlash va oshkor etish","C) Internet tezligi","D" :"Tarmoq konfiguratsiyasi"],"correct":1},
    ],
    "facts": [
        "2017-yilgi WannaCry ransomware hujumi 150 mamlakatta 300 000 kompyuterni zararladi, shu jumladan Britaniya NHS shifoxonalarini.",
        "Tibbiy ma'lumotlar qora bozorda kredit karta ma'lumotlaridan 10-50 marta qimmat sotiladi.",
        "Xodimlarning 95% kiberxavfsizlik hodisalari insoniy xato sababli yuzaga keladi — texnik hujum emas.",
        "Eng kuchli parol menejeri hozirda Bitwarden, LastPass va 1Password hisoblanadi — ular parollarni shifrlangan holda saqlaydi.",
        "Fishing xatlarini aniqlash uchun o'tkazilgan korporativ testlarda o'rtacha xodimlarning 30% aldamchi xatdagi havolani bosadi.",
        "Biometrik autentifikatsiya (barmoq izi, yuz tanish) parol o'g'irlash hujumlarini 99% ga kamaytiradi.",
        "O'zbekistonda 'Kiberxavfsizlik to'g'risida' qonun 2022-yilda qabul qilingan va davlat tizimlariga qo'shimcha himoya talablari joriy etilgan.",
        "Universal Health Services (AQSh) 2020-yilgi hujumida 400 shifoxona 3 hafta qog'oz yozuvga qaytishga majbur bo'ldi.",
        "SHA-256 algoritmi bilan shifrlangan 1 ta parolni buzish uchun zamonaviy kompyuter milliardlar yil talab qiladi.",
        "Dunyodagi kiberxavfsizlik mutaxassislari taqchilligi 2024-yilda 4 million kishiga yetgan.",
    ],
    "glossary": [
        ("Kiberxavfsizlik", "Raqamli tizimlar, tarmoqlar va ma'lumotlarni hujumlar, zararlar va ruxsatsiz kirishdan himoya qilish fani."),
        ("Virus", "O'z-o'zidan tarqaluvchi va kompyuter tizimini buzuvchi zararli dasturiy kod."),
        ("Ransomware", "Fayllarni qulflab ularni qaytarish evaziga to'lov talab qiluvchi zararli dastur."),
        ("Fishing (Phishing)", "Aldamchi xatlar yoki saytlar orqali foydalanuvchi ma'lumotlarini o'g'irlash."),
        ("2FA", "Two-Factor Authentication — ikki bosqichli autentifikatsiya, qo'shimcha xavfsizlik qatlami."),
        ("Shifrlash (Encryption)", "Ma'lumotlarni maxsus algoritm yordamida faqat kalitli o'qiladigan shaklga keltirish."),
        ("Firewall", "Tarmoqqa ruxsatsiz kirishni bloklashga mo'ljallangan dasturiy yoki apparat himoya tizimi."),
        ("Antivirus", "Kompyuterni zararli dasturlardan himoya qiluvchi xavfsizlik dasturi."),
        ("Social Engineering", "Insonga psixologik ta'sir o'tkazib, maxfiy ma'lumotni olishga qaratilgan hujum turi."),
        ("Zaxira nusxa (Backup)", "Ma'lumotlar yo'qolganda tiklash imkonini beruvchi nusxalar."),
        ("VPN", "Virtual Private Network — shifrlangan xavfsiz internet ulanish tunneli."),
        ("Zero Trust", "Hech kimga avtomatik ishonmaslik tamoyili asosidagi xavfsizlik arxitekturasi."),
    ],
    "conclusion_items": [
        "Kiberxavfsizlik — texnik vosita emas, balki madaniyat; har bir tibbiyot xodimi xavfsiz odatlarni shakllantirishi shart.",
        "Kuchli parol, 2FA va antivirus — tibbiy ma'lumotlar himoyasining uch ustuni.",
        "Fishing va social engineering hujumlari faqat texnik bilim emas, tanqidiy fikrlash orqali bartaraf etiladi.",
    ],
    "conclusion_desc": "Axborot Tizimlari Xavfsizligi mavzusini muvaffaqiyatli yakunladingiz.",
    "search_placeholder": "Qidiruv so'zini kiriting (virus, parol, fishing, antivirus)...",
    "facts_title": "Kiberxavfsizlik Haqida Qiziqarli Faktlar",
    "sections": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Asosiy Nazariya"),("tahlil","Tahlil"),("amaliyot","Amaliyot"),("savollar","Savollar"),("test","Test"),("faktlar","Faktlar"),("lugat","Lug'at"),("xulosa","Xulosa")],
})

# ──────────────────────────────────────────
# 6. MEDICAL COMPUTER IMPORTANCE
# ──────────────────────────────────────────
TOPICS.append({
    "filename": "medical_computer_importance_darslik.html",
    "page_title": "Tibbiyotda Kompyuterning Ahamiyati | Tibbiyotda IT",
    "meta_desc": "Tibbiyotda kompyuterning ahamiyati, HIS tizimi, EHR, telemeditsina va diagnostikada IT. Interaktiv darslik.",
    "meta_keys": "tibbiyot IT, HIS, EHR, telemeditsina, diagnostika, tibbiy kompyuter",
    "brand_title": "Tibbiyotda IT — Kompyuterning Ahamiyati",
    "hero_title": "Tibbiyotda Kompyuterning Ahamiyati va Axborot Tizimlari",
    "hero_subtitle": "Kompyuter tibbiyot sohasini qanday o'zgartirdi: HIS, EHR, diagnostik tasvir tizimlari, telemeditsina va AI diagnostikasi — zamonaviy shifokor uchun zaruriy bilimlar.",
    "hero_icon": SVG_ICONS["medical"],
    "stats": [("50%", "Xato diagnostika kamayishi"), ("4x", "Ish samaradorligi"), ("100+", "Tibbiy AT turi"), ("2030", "Raqamli tibbiyot")],
    "nav_links": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Nazariya"),("amaliyot","Amaliyot"),("test","Test"),("lugat","Lug'at")],
    "maqsad_html": """<div class="grid-2">
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">O'quv Maqsadlari</div>
        <ul class="custom-list">
          <li><strong>Tibbiy IT ahamiyati:</strong> Kompyuterning diagnostika, davolash va boshqaruvdagi rolini tushunish.</li>
          <li><strong>HIS va EHR:</strong> Shifoxona axborot tizimlarining tuzilishi va vazifalari.</li>
          <li><strong>Tibbiy tasvir tizimlari:</strong> PACS, DICOM formatlar va radioterapevtik diagnostika.</li>
          <li><strong>Telemeditsina:</strong> Masofaviy tibbiy xizmat ko'rsatish texnologiyalari va standartlari.</li>
        </ul>
      </div>
      <div class="glass-card" style="align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,rgba(234,67,53,.1),rgba(14,165,233,.1));">
        <div style="display:flex;flex-direction:column;gap:14px;width:100%;">
          <div style="padding:12px;background:rgba(234,67,53,.1);border:1px solid var(--g-red);border-radius:12px;font-weight:700;">Ananaviy Tibbiyot</div>
          <div style="color:var(--med-blue);font-weight:900;">+ Kompyuter Texnologiyasi</div>
          <div style="padding:12px;background:linear-gradient(90deg,var(--g-red),var(--med-blue));color:#fff;border-radius:12px;font-weight:700;">Zamonaviy Raqamli Tibbiyot</div>
        </div>
      </div>
    </div>""",
    "theory_html": """
    <section class="section-block" id="nazariya">
      <div class="section-badge">
        <svg viewBox="0 0 24 24"><path d="M8 2h8l2 4H6L8 2z"/><path d="M6 6l-4 16h20L18 6H6z"/><path d="M12 10v6M9 13h6"/></svg>
        2-Bo'lim: Asosiy Nazariya
      </div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-red)" stroke-width="2"><path d="M8 2h8l2 4H6L8 2z"/><path d="M6 6l-4 16h20L18 6H6z"/><path d="M12 10v6M9 13h6"/></svg>
        Tibbiyotda Kompyuterning Asosiy Qo'llanish Sohalari
      </h2>
      <div class="grid-3">
        <div class="glass-card" style="border-left:4px solid var(--g-blue);">
          <div class="card-title" style="color:var(--g-blue);">HIS (Shifoxona Axborot Tizimi)</div>
          <div class="card-desc">Hospital Information System — bemorlar ro'yxatidan tortib buxgalteriygacha barcha jarayonni avtomatlashtiruvchi tizim.</div>
          <ul class="custom-list"><li>Bemor ro'yxatga olish (Registration)</li><li>Qabul va chiqish boshqaruvi</li><li>Dori va laboratoriya buyurtmalari</li><li>To'lov va sug'urta hisob-kitobi</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Barcha shifoxonalar</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--med-green);">
          <div class="card-title" style="color:var(--med-green);">EHR / EMR Tizimlari</div>
          <div class="card-desc">Electronic Health Records — bemor butun hayoti davomidagi tibbiy tarixini saqlash va ulashish tizimi.</div>
          <ul class="custom-list"><li>Diagnozlar va davolash tarixi</li><li>Dori retseptlari va allergiyalar</li><li>Laboratoriya natijalari arxivi</li><li>Shifokorlar o'rtasida ulashish</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Bemor tarixi</div>
        </div>
        <div class="glass-card" style="border-left:4px solid var(--g-yellow);">
          <div class="card-title" style="color:var(--g-yellow);">PACS — Tibbiy Tasvir Tizimi</div>
          <div class="card-desc">Picture Archiving and Communication System — rentgen, MRT, KT va ultratovush tasvirlarini raqamli saqlash tizimi.</div>
          <ul class="custom-list"><li>DICOM format — tibbiy tasvir standarti</li><li>Masofadan ko'rish (radiologiya)</li><li>AI tasvir tahlili</li><li>Bulutda arxivlash</li></ul>
          <div class="med-tag"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>Rentgen, MRT, KT</div>
        </div>
      </div>
      <h2 class="section-title" style="margin-top:1rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        Telemeditsina va AI Diagnostikasi
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-blue);">Telemeditsina Imkoniyatlari</div>
          <div class="card-desc" style="margin-bottom:8px;">Internet orqali masofaviy tibbiy xizmat ko'rsatish — qishloqlardan shahar mutaxassislariga kirish imkoni.</div>
          <div class="timeline-container">
            <div class="timeline-item"><div class="timeline-year">Video Konsultatsiya</div><div class="timeline-text">Bemor uyida o'tirib Google Meet, Zoom yoki maxsus app orqali shifokor bilan ko'rishadi.</div></div>
            <div class="timeline-item"><div class="timeline-year">Masofaviy Monitoring</div><div class="timeline-text">IoT qurilmalar (smart soatlar, glukometrlar) bemorning real vaqt ko'rsatkichlarini shifokorga uzatadi.</div></div>
            <div class="timeline-item"><div class="timeline-year">AI Diagnostika</div><div class="timeline-text">Google DeepMind ko'z to'r pardasi skaneridagi kasalliklarni shifokor aniqligida aniqlaydi.</div></div>
          </div>
        </div>
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-green);">Kompyuterning Tibbiyotdagi Tarixiy Roli</div>
          <div class="timeline-container">
            <div class="timeline-item"><div class="timeline-year">1960-yillar</div><div class="timeline-text">Dastlabki tibbiy kompyuter tizimlari — laboratoriya natijalari hisoblash.</div></div>
            <div class="timeline-item"><div class="timeline-year">1972-yil</div><div class="timeline-text">CT (Kompyuter Tomografiyasi) kashfiyoti — Hounsfield Nobel mukofotiga sazovor bo'ldi.</div></div>
            <div class="timeline-item"><div class="timeline-year">1990-yillar</div><div class="timeline-text">Birinchi EHR tizimlari va DICOM standarti joriy etildi.</div></div>
            <div class="timeline-item"><div class="timeline-year">2020-yillar</div><div class="timeline-text">AI diagnostika, robot jarrohlik va masofaviy monitoring sifatida keng joriy etildi.</div></div>
          </div>
        </div>
      </div>
    </section>""",
    "pros_cons_title": "Tibbiyotda Kompyuterning Afzalliklari va Cheklovlari",
    "pros": [
        "<strong>Diagnostika aniqligi:</strong> AI va kompyuter tahlili xata diagnostika holatlarini 50% ga kamaytiradi.",
        "<strong>Tez qarash:</strong> Bemor tarixini 1 soniyada ko'rish — qo'lda arxiv saatlar o'rniga.",
        "<strong>Telemeditsina:</strong> Qishloq bemorlariga shahar mutaxassisi yordamini yetkazish.",
        "<strong>Xarajat kamayishi:</strong> Raqamli hujjatlar qog'oz, printer va saqlash xarajatlarini kamaytiradi.",
    ],
    "cons": [
        "<strong>Texnik nosozlik xavfi:</strong> Tizim ishdan chiqqanda bemorga yordam ko'rsatish qiyinlashadi.",
        "<strong>Internet bog'liqligi:</strong> Bulutli EHR internet yo'qligida ishlamaydi.",
        "<strong>O'rganish vaqti:</strong> Yangi HIS/EHR tizimlarini o'rganish xodimlarga vaqt talab qiladi.",
    ],
    "checklist": [
        "HIS (Shifoxona Axborot Tizimi) ning uchta asosiy modulini (registratura, laboratoriya, dori-darmon) yozing.",
        "EHR va HIS o'rtasidagi farqni tushintirib bering va ikkalasiga bir misoldan keltiring.",
        "Telemeditsina xizmatidan foydalanish uchun minimal texnik talablarni (qurilma, internet) aniqlang.",
        "O'zbrekistonda qaysi HIS tizimlari (EMIAS, MedLog va boshqalar) joriy etilganini internetdan toping.",
    ],
    "accordion": [
        ("HIS va EHR o'rtasidagi farq nima?", "HIS (Hospital Information System) — butun shifoxona boshqaruvini: registratura, laboratoriya, farmatsevtika, to'lovlarni avtomatlashtiradi. EHR — faqat bemor tibbiy tarixini saqlash va ulashishga ixtisoslashgan."),
        ("PACS tizimi qanday ishlaydi?", "Rentgen, MRT va CT apparatlari tasvirlarni DICOM formatida yaratadi. PACS bu tasvirlarni server va bulutda saqlaydi. Radiolog, shifokor va jarroh uni istalgan kompyuterdan ko'rishi mumkin."),
        ("DICOM format nima?", "Digital Imaging and Communications in Medicine — tibbiy tasvirlash qurilmalari uchun dunyo standarti. Tasvir ma'lumotlari (bemor ismi, sana, qurilma turi) bilan birgalikda saqlanadi."),
        ("Telemeditsina qanday ishlaydi?", "Bemor va shifokor internet orqali video-ko'rik o'tkazadi. Tibbiy qurilmalar (tonometr, glukometr) ko'rsatkichlarni real vaqtda shifokorga uzatadi. Retsept elektron shaklda beriladi."),
        ("IoMT (Internet of Medical Things) nima?", "Tibbiy Narsalar Interneti — smart soat, ECG monitor, glukometr kabi qurilmalar internet orqali shifokor tizimiga ma'lumot yuboradi. Surunkali kasallar uchun masofaviy monitoring imkoni."),
        ("AI tibbiyotda qanday qo'llaniladi?", "Ko'z kasalliklari, saraton diagnostikasi, MRT tahlili, og'riq prognozi uchun AI ishlaydi. Google DeepMind's AlphaFold oqsil tuzilishini bashorat qildi — dori yaratishda inqilob."),
        ("Robot jarrohlik nima?", "Da Vinci roboti jarrohga masofadan mikroqirqim bajarishga imkon beradi. Jarroh konsol orqali robotni boshqaradi, robot esa tremorsiz (qo'l titramay) millimet aniqlikda operatsiya qiladi."),
        ("Elektron retsept nima afzallikka ega?", "Qo'l yozuvini o'qib bo'lmay noto'g'ri dori berilish xatari bartaraf etiladi. Apteka elektron retseptni tizimdan oladi, soxta retsept yasab bo'lmaydi."),
        ("O'zbekistonda tibbiy IT hozirgi holati qanday?", "2021-yildan EMIAS tizimi joriy etilmoqda. 2023-yilga kelib 700+ muassasa ulanigan. Bemorlar my.gov.uz orqali elektron navbat, natijalar va retseptlarini ko'rishi mumkin."),
        ("Kompyuter hech qachon shifokorni almashtiradimi?", "Yo'q — kompyuter shifokorni yo'riqnoma va ma'lumot bilan ta'minlaydi, lekin klinik fikrlash, empatiya va murakkab qarorlarni inson shifokor qabul qiladi. AI — yordamchi vosita."),
    ],
    "quiz_questions": [
        {"q":"1. HIS qisqartmasi nimani anglatadi?","options":["A) Health Insurance System","B) Hospital Information System","C) Hybrid IT Service","D" :"Health Index Software"],"correct":1},
        {"q":"2. EHR nima?","options":["A) Emergency Health Rescue","B) Electronic Hospital Records","C) Electronic Health Records — elektron bemor yozuvi","D" :"External Health Resource"],"correct":2},
        {"q":"3. PACS tizimi nimani ta'minlaydi?","options":["A) Dori buyurtmalarini","B) Tibbiy tasvirlarni raqamli saqlash va uzatishni","C) To'lov tizimini","D" :"Laboratoriya natijalari"],"correct":1},
        {"q":"4. DICOM format nima uchun ishlatiladi?","options":["A) Matnli hujjatlar uchun","B) Moliyaviy hisobotlar uchun","C) Tibbiy tasvirlash qurilmalari uchun standart format","D" :"Video ko'rish uchun"],"correct":2},
        {"q":"5. Telemeditsina qanday xizmat?","options":["A) Faqat masofaviy dori buyurtma","B) Internet orqali masofaviy tibbiy xizmat ko'rsatish","C) Tibbiy ma'lumotlarni saqlash","D" :"Laboratoriya tahlili"],"correct":1},
        {"q":"6. IoMT nima?","options":["A) Internet of Mobile Technology","B) Internet of Medical Things — tibbiy qurilmalar interneti","C) Information of Medical Teams","D" :"International Office of Medicine"],"correct":1},
        {"q":"7. 1972-yilgi tibbiy kompyuter kashfiyoti qaysi edi?","options":["A) MRT kashfiyoti","B) EHR tizimi","C) Kompyuter Tomografiyasi (CT)","D" :"Ultrasonografiya"],"correct":2},
        {"q":"8. Google DeepMind AlphaFold nimani bashorat qildi?","options":["A) Ob-havo","B) Oqsil molekulalar tuzilishini","C) Kasallik tarqalishini","D" :"Dori narxlarini"],"correct":1},
        {"q":"9. Da Vinci roboti tibbiyotda nima uchun ishlatiladi?","options":["A) Ma'lumotlarni saqlash","B) Masofaviy va mikroaniqlik bilan jarrohlik operatsiyalari","C) EHR tizimi","D" :"Elektron retsept"],"correct":1},
        {"q":"10. Elektron retseptning asosiy afzalligi nima?","options":["A) Arzonroq","B) Tezroq","C) Qo'l yozuvi xatosi va soxta retsept xatarini yo'q qiladi","D" :"Ko'proq dori berish"],"correct":2},
        {"q":"11. O'zbekistonda qaysi tibbiy IT tizimi joriy etilmoqda?","options":["A) SAP Healthcare","B) Epic Systems","C) EMIAS","D" :"Oracle Health"],"correct":2},
        {"q":"12. Tibbiyotda AI diagnostikasi qanday ishlaydi?","options":["A) Shifokorni almashtiradi","B) Tasvirlarni tahlil qilib shifokorga yordamchi ma'lumot beradi","C) Dori yozadi","D" :"Operatsiya qiladi"],"correct":1},
        {"q":"13. Masofaviy monitoring qanday ishlaydi?","options":["A) Shifokor bemorga boradi","B) IoT qurilmalar real vaqt ko'rsatkichlarni shifokorga uzatadi","C) Bemor shifoxonada yotadi","D" :"Laboratoriya tahlili"],"correct":1},
        {"q":"14. Kompyuter tibbiyotdagi qaysi sohadagi xatolarni eng ko'p kamaytirdi?","options":["A) Operatsiya xonasi","B) Dori retsepti va qo'l yozuvi noto'g'ri o'qilishi","C) Sterilizatsiya","D" :"Ko'rik vaqti"],"correct":1},
        {"q":"15. Tibbiyotda kompyuter shifokorni almashtiradimi?","options":["A) Ha, to'liq","B) Yo'q — AI yordamchi vosita, klinik qarorni inson shifokor qabul qiladi","C) 2030-yilda to'liq almashtiradi","D" :"Faqat umumiy amaliyotda"],"correct":1},
    ],
    "facts": [
        "Birinchi kompyuter tomografiyasi (CT) 1971-yilda Angliyada o'tkazilgan va bu tibbiyot tarixida inqilob yaratgan.",
        "Google DeepMind's AlphaFold 2021-yilda 200 million oqsil strukturasini bashorat qildi — ilgari 50 yil zarur bo'lardi.",
        "Dunyodagi birinchi robot operatsiya 2001-yilda AQShda o'tkazilgan — jarroh Nyu-Yorkda, bemor Frantsiyadagi operatsiya stolidagi robotni boshqargan.",
        "Raqamli EHR tizimlari joriy etilgandan so'ng klinik xatolar 80% gacha kamaygan.",
        "Dunyoda har yili tibbiy tasvirlash natijasida 3.6 billion DICOM fayl yaratiladi.",
        "WHO 2023-yildan barcha a'zo mamlakatlardan raqamli sog'liqni saqlash tizimiga o'tishni rasmiy tavsiya qildi.",
        "O'zbekistonda 2022-2024 yillarda telemeditsina xizmatidan 1 milliondan ortiq bemor foydalangan.",
        "Yaponiyadagi Fujita Health University kasalxonasi oshqozon saratonini aniqlovchi AI tizimini joriy etib, aniqligi 99% ga yetkazilgan.",
        "Tibbiy rasmga o'xshash deep learning modeli ko'z to'r pardasi skaner orqali bemor yoshini, jinsini va yurak kasalligi xatarini aniqlaydi.",
        "2030-yilga kelib global tibbiy AT bozori 974 milliard dollarga yetishi kutilmoqda.",
    ],
    "glossary": [
        ("HIS", "Hospital Information System — shifoxona jarayonlarini to'liq avtomatlashtiradigan kompleks tizim."),
        ("EHR", "Electronic Health Records — bemorning barcha tibbiy tarixini saqlashga mo'ljallangan elektron tizim."),
        ("PACS", "Picture Archiving and Communication System — tibbiy tasvirlarni saqlash va uzatish tizimi."),
        ("DICOM", "Digital Imaging and Communications in Medicine — tibbiy tasvirlar uchun xalqaro standart format."),
        ("Telemeditsina", "Internet orqali masofaviy tibbiy xizmat ko'rsatish — konsultatsiya, monitoring, retsept."),
        ("IoMT", "Internet of Medical Things — tibbiy qurilmalarning internetga ulanib ma'lumot uzatishi."),
        ("AI Diagnostika", "Sun'iy intellekt yordamida tibbiy tasvirlar va ma'lumotlarni tahlil qilib kasallik aniqlash."),
        ("Robot Jarrohlik", "Jarroh masofadan robotni boshqarib mikroaniqlikda operatsiya bajarish texnologiyasi."),
        ("Elektron Retsept", "Shifokor tomonidan raqamli imzolangan va elektronik yetkazilgan dori buyurtmasi."),
        ("CT (Kompyuter Tomografiyasi)", "X-ray va kompyuter tahlili yordamida 3D kesma tasvirlar yaratuvchi diagnostika usuli."),
        ("MRI (Magnit-Rezonans Tasvirlash)", "Magnit maydon va radio to'lqinlar yordamida yumshoq to'qimalar tasvirini yaratuvchi usul."),
        ("EMIAS", "O'zbekistonda joriy etilayotgan yagona tibbiy axborot tizimi — shifoxonalar va bemorlarni birlashtiradi."),
    ],
    "conclusion_items": [
        "Kompyuter tibbiyotda diagnostika aniqligini oshirib, kasalliklarni erta aniqlash va davolashni yaxshiladi.",
        "HIS, EHR va PACS tizimlari shifokorlarni qog'oz ishidan ozod qilib, bemorga vaqt ajratishga imkon beradi.",
        "Telemeditsina va IoMT qishloq aholisiga shahar darajasidagi tibbiy xizmatni yetkazmoqda.",
    ],
    "conclusion_desc": "Tibbiyotda Kompyuterning Ahamiyati mavzusini muvaffaqiyatli yakunladingiz.",
    "search_placeholder": "Qidiruv so'zini kiriting (HIS, EHR, PACS, telemeditsina)...",
    "facts_title": "Tibbiy Kompyuter Texnologiyalari Haqida Qiziqarli Faktlar",
    "sections": [("kirish","Kirish"),("maqsad","Maqsad"),("nazariya","Asosiy Nazariya"),("tahlil","Tahlil"),("amaliyot","Amaliyot"),("savollar","Savollar"),("test","Test"),("faktlar","Faktlar"),("lugat","Lug'at"),("xulosa","Xulosa")],
})

print(f"Hozircha {len(TOPICS)} ta mavzu aniqlandi. Fayllar generatsiya qilinmoqda...")
for t in TOPICS:
    html = build_html(t)
    fpath = os.path.join(OUT_DIR, t["filename"])
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  ✓ {t['filename']} ({len(html)//1024} KB)")

print("\nBarcha fayllar muvaffaqiyatli yaratildi!")
