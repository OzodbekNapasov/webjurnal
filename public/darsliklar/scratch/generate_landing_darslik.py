import os

landing_html = '''<!DOCTYPE html>
<html lang="uz" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Tibbiyotda Axborot Texnologiyalari fani bo'yicha 'Google tomonidan ishlab chiqarilgan dasturlar' interaktiv elektron darsligi (Landing Page).">
  <meta name="keywords" content="Google, Tibbiyotda IT, Google Workspace, Google Docs, Google Sheets, Google Drive, Telemeditsina, Elektron Darslik">
  <meta name="author" content="Tibbiyotda Axborot Texnologiyalari Metodisti">
  <title>Google Dasturlari - Tibbiyotda Axborot Texnologiyalari</title>

  <style>
    /* ==========================================
       1. DESIGN TOKENS & STYLES (THEME VARIABLES)
       ========================================== */
    :root {
      /* Dark Theme (Default) */
      --bg-main: #060b18;
      --bg-card: rgba(15, 23, 42, 0.75);
      --bg-card-hover: rgba(30, 41, 59, 0.9);
      --border-color: rgba(255, 255, 255, 0.12);
      --border-glow: rgba(14, 165, 233, 0.45);
      
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;
      
      /* Medical & Brand Colors */
      --med-blue: #0ea5e9;
      --med-blue-dark: #0284c7;
      --med-green: #10b981;
      --med-green-dark: #059669;
      --med-cyan: #06b6d4;
      
      /* Google Brand Colors */
      --g-blue: #4285f4;
      --g-red: #ea4335;
      --g-yellow: #fbbc05;
      --g-green: #34a853;
      --g-purple: #a855f7;
      
      /* UI Elements */
      --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.25);
      --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.45);
      --shadow-glow: 0 0 25px rgba(14, 165, 233, 0.35);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 24px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    [data-theme="light"] {
      --bg-main: #f0f4f9;
      --bg-card: rgba(255, 255, 255, 0.9);
      --bg-card-hover: #ffffff;
      --border-color: rgba(14, 165, 233, 0.2);
      --border-glow: rgba(2, 132, 199, 0.5);
      
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      
      --med-blue: #0284c7;
      --med-blue-dark: #1e40af;
      --med-green: #059669;
      --med-green-dark: #047857;
      
      --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.12);
      --shadow-glow: 0 0 25px rgba(2, 132, 199, 0.2);
    }

    /* ==========================================
       2. RESET & BASE STYLES
       ========================================== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      width: 100%;
      min-height: 100vh;
      background-color: var(--bg-main);
      color: var(--text-primary);
      background: radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.12) 0%, transparent 50%),
                  radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                  var(--bg-main);
      transition: background 0.4s ease, color 0.4s ease;
      line-height: 1.6;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-main);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(14, 165, 233, 0.4);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--med-blue);
    }

    /* ==========================================
       3. STICKY HEADER & NAVBAR
       ========================================== */
    .app-header {
      position: sticky;
      top: 0;
      height: 66px;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
    }

    .reading-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--med-blue), var(--med-green));
      width: 0%;
      transition: width 0.1s ease;
    }

    .brand-area {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--med-blue), var(--med-green));
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
    }

    .brand-logo svg {
      width: 24px;
      height: 24px;
      fill: #ffffff;
    }

    .brand-title {
      font-size: 1.05rem;
      font-weight: 800;
      background: linear-gradient(90deg, var(--text-primary), var(--med-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: var(--transition);
      padding: 6px 12px;
      border-radius: 8px;
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--med-blue);
      background: rgba(14, 165, 233, 0.12);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: 11px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .btn-icon:hover {
      background: var(--med-blue);
      color: #ffffff;
      border-color: var(--med-blue);
      transform: translateY(-2px);
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
    }

    .btn-icon svg {
      width: 19px;
      height: 19px;
      stroke-width: 2;
      stroke: currentColor;
      fill: none;
    }

    /* ==========================================
       4. CONTAINER & LANDING SECTIONS
       ========================================== */
    .landing-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2rem 1.5rem 6rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }

    .section-block {
      scroll-margin-top: 90px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 14px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(16, 185, 129, 0.15));
      border: 1px solid var(--med-blue);
      color: var(--med-blue);
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      width: fit-content;
    }

    .section-title {
      font-size: 2.1rem;
      font-weight: 800;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 14px;
      line-height: 1.25;
    }

    .section-title svg {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
    }

    /* ==========================================
       5. HERO SECTION (HERO BANNER)
       ========================================== */
    .hero-section {
      padding: 4rem 2rem;
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.8rem;
      position: relative;
      overflow: hidden;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 20px;
      border-radius: 30px;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid var(--med-blue);
      color: var(--med-blue);
      font-size: 0.9rem;
      font-weight: 800;
    }

    .hero-title {
      font-size: 3.2rem;
      font-weight: 900;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 30%, var(--med-blue) 70%, var(--med-green) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      max-width: 960px;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 780px;
    }

    .hero-logo-box {
      width: 110px;
      height: 110px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 50px rgba(14, 165, 233, 0.4);
      animation: floatGlow 3.5s ease-in-out infinite alternate;
    }

    @keyframes floatGlow {
      0% { transform: translateY(0) scale(1); box-shadow: 0 0 30px rgba(14, 165, 233, 0.3); }
      100% { transform: translateY(-12px) scale(1.04); box-shadow: 0 0 60px rgba(16, 185, 129, 0.45); }
    }

    .hero-cta-group {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-primary {
      padding: 0.95rem 2.4rem;
      border-radius: 30px;
      border: none;
      background: linear-gradient(135deg, var(--med-blue), var(--med-green));
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 28px rgba(14, 165, 233, 0.4);
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .btn-primary:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 16px 38px rgba(16, 185, 129, 0.5);
    }

    .btn-secondary {
      padding: 0.95rem 2rem;
      border-radius: 30px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--med-blue);
      transform: translateY(-2px);
    }

    .stats-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.2rem;
      width: 100%;
      margin-top: 1rem;
    }

    .stat-card {
      padding: 1.2rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      text-align: center;
    }

    .stat-num {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--med-blue);
    }

    .stat-label {
      font-size: 0.82rem;
      color: var(--text-secondary);
    }

    /* ==========================================
       6. GRIDS & CARDS
       ========================================== */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.4rem;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.2rem;
    }

    .glass-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
    }

    .glass-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-glow);
      transform: translateY(-5px);
      box-shadow: var(--shadow-glow);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(14, 165, 233, 0.15);
      color: var(--med-blue);
      flex-shrink: 0;
    }

    .card-icon svg {
      width: 26px;
      height: 26px;
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .card-desc {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .med-tag {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--med-green);
      background: rgba(16, 185, 129, 0.12);
      padding: 4px 10px;
      border-radius: 8px;
      width: fit-content;
      margin-top: auto;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    /* Bullet List Component */
    .custom-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .custom-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.96rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .custom-list li::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--med-blue);
      margin-top: 8px;
      flex-shrink: 0;
      box-shadow: 0 0 8px var(--med-blue);
    }

    /* Timeline Component */
    .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
      padding-left: 22px;
      border-left: 2px solid var(--border-color);
      margin: 8px 0;
    }

    .timeline-item {
      position: relative;
      padding: 1rem 1.2rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .timeline-item:hover {
      background: var(--bg-card-hover);
      border-color: var(--med-blue);
      transform: translateX(6px);
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: -29px;
      top: 20px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--med-blue);
      border: 2px solid var(--bg-main);
      box-shadow: 0 0 10px var(--med-blue);
    }

    .timeline-year {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--med-green);
    }

    .timeline-text {
      font-size: 0.95rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Table Component */
    .custom-table-container {
      width: 100%;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .custom-table th, .custom-table td {
      padding: 1rem 1.3rem;
      border-bottom: 1px solid var(--border-color);
    }

    .custom-table th {
      background: rgba(14, 165, 233, 0.15);
      color: var(--med-blue);
      font-size: 0.95rem;
      font-weight: 700;
    }

    .custom-table td {
      font-size: 0.92rem;
      color: var(--text-secondary);
    }

    .custom-table tr:hover td {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }

    /* Accordion Component */
    .accordion-item {
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      overflow: hidden;
      background: rgba(255, 255, 255, 0.03);
      transition: var(--transition);
    }

    .accordion-header {
      padding: 1rem 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 700;
      font-size: 0.98rem;
      color: var(--text-primary);
    }

    .accordion-header:hover {
      background: rgba(14, 165, 233, 0.12);
    }

    .accordion-body {
      padding: 1rem 1.3rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.65;
      display: none;
      background: rgba(0, 0, 0, 0.25);
    }

    .accordion-item.active .accordion-body {
      display: block;
    }

    /* Interactive Quiz */
    .quiz-card {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .quiz-question {
      font-size: 1.02rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .quiz-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .quiz-opt {
      padding: 11px 15px;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
      font-size: 0.9rem;
      cursor: pointer;
      text-align: left;
      transition: var(--transition);
      font-weight: 500;
    }

    .quiz-opt:hover {
      background: rgba(14, 165, 233, 0.22);
      border-color: var(--med-blue);
      color: var(--text-primary);
    }

    .quiz-opt.correct {
      background: rgba(16, 185, 129, 0.35) !important;
      border-color: var(--med-green) !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .quiz-opt.incorrect {
      background: rgba(239, 68, 68, 0.35) !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
    }

    /* Checklist Component */
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 1rem 1.2rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: var(--transition);
    }

    .checklist-item:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: var(--med-blue);
    }

    .checklist-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: var(--med-green);
      cursor: pointer;
    }

    /* Back To Top Button */
    .back-to-top {
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--med-blue), var(--med-green));
      color: #ffffff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
      opacity: 0;
      visibility: hidden;
      transition: var(--transition);
      z-index: 900;
    }

    .back-to-top.show {
      opacity: 1;
      visibility: visible;
    }

    .back-to-top:hover {
      transform: translateY(-4px) scale(1.06);
    }

    /* ==========================================
       7. MODAL (SEARCH)
       ========================================== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-overlay.open {
      display: flex;
      animation: fadeIn 0.25s ease forwards;
    }

    .modal-box {
      width: 100%;
      max-width: 620px;
      background: var(--bg-main);
      border: 1px solid var(--border-glow);
      border-radius: var(--radius-lg);
      padding: 1.6rem;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.95rem 1.3rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 1.02rem;
      outline: none;
    }

    .search-input:focus {
      border-color: var(--med-blue);
      box-shadow: 0 0 18px rgba(14, 165, 233, 0.35);
    }

    .search-results {
      max-height: 330px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .search-item {
      padding: 0.85rem 1.1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.035);
      cursor: pointer;
      font-size: 0.92rem;
      color: var(--text-secondary);
      transition: var(--transition);
    }

    .search-item:hover {
      background: var(--med-blue);
      color: #ffffff;
    }

    /* ==========================================
       8. RESPONSIVE DESIGN & PRINT
       ========================================== */
    @media (max-width: 992px) {
      .grid-3, .grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
      .grid-2 {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 2.3rem;
      }
      .section-title {
        font-size: 1.65rem;
      }
      .nav-links {
        display: none;
      }
      .stats-strip {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .grid-3, .grid-4, .quiz-options, .stats-strip {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 1.8rem;
      }
      .app-header {
        padding: 0 1rem;
      }
      .landing-container {
        padding: 1.5rem 1rem 4rem 1rem;
      }
    }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }
      .app-header, .btn-icon, .modal-overlay, .back-to-top {
        display: none !important;
      }
      .landing-container {
        padding: 0 !important;
        gap: 2rem !important;
      }
      .glass-card, .hero-section {
        background: #ffffff !important;
        border: 1px solid #ccc !important;
        box-shadow: none !important;
        color: #000000 !important;
      }
      .card-desc, .custom-list li, .timeline-text {
        color: #333333 !important;
      }
    }
  </style>
</head>
<body>

  <!-- STICKY HEADER BAR -->
  <header class="app-header">
    <div class="reading-progress" id="readingProgress"></div>

    <div class="brand-area" onclick="window.scrollTo({top:0, behavior:'smooth'})">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div>
        <div class="brand-title">Google Servislari & Tibbiyot IT</div>
      </div>
    </div>

    <!-- LANDING NAVIGATION LINKS -->
    <ul class="nav-links">
      <li><a href="#kirish" class="nav-link">Kirish</a></li>
      <li><a href="#workspace" class="nav-link">Workspace</a></li>
      <li><a href="#docs-sheets" class="nav-link">Docs & Sheets</a></li>
      <li><a href="#telemeditsina" class="nav-link">Telemeditsina</a></li>
      <li><a href="#amaliyot" class="nav-link">Amaliyot</a></li>
      <li><a href="#test" class="nav-link">Test</a></li>
      <li><a href="#lugat" class="nav-link">Lug'at</a></li>
    </ul>

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
      <button class="btn-icon" id="printBtn" title="Chop Etish / PDF">
        <svg viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
      </button>
    </div>
  </header>

  <!-- MAIN LANDING PAGE CONTAINER -->
  <main class="landing-container">

    <!-- HERO BANNER SECTION -->
    <section class="hero-section" id="kirish">
      <div class="hero-badge">Tibbiyotda Axborot Texnologiyalari Fani</div>
      <h1 class="hero-title">Google tomonidan ishlab chiqarilgan dasturlar</h1>
      <p class="hero-subtitle">Zamonaviy bulutli texnologiyalar, Google Workspace ilovalari hamda ularning tibbiy amaliyot va telemeditsinada qo'llanilishi bo'yicha interaktiv darslik.</p>

      <div class="hero-logo-box">
        <svg width="65" height="65" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      </div>

      <div class="hero-cta-group">
        <a href="#maqsadi" class="btn-primary">
          Darsni boshlash
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </a>
        <a href="#test" class="btn-secondary">
          Interaktiv Test (15 ta)
        </a>
      </div>

      <div class="stats-strip">
        <div class="stat-card">
          <div class="stat-num">18+</div>
          <div class="stat-label">Mavzular bo'limi</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">8+</div>
          <div class="stat-label">Google Workspace Servislari</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">15+</div>
          <div class="stat-label">Interaktiv Sinov Testlari</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">100%</div>
          <div class="stat-label">Avtonom (Offline) Ishlash</div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: DARSNING MAQSADI -->
    <section class="section-block" id="maqsadi">
      <div class="section-badge">1-Bo'lim: Reja & Maqsad</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        Darsning Maqsadi va Vafizalari
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-blue);">Asosiy O'quv Maqsadlari</div>
          <ul class="custom-list">
            <li><strong>Google kompaniyasini tanish:</strong> Kompaniyaning rivojlanish tarixi va dunyo IT sohasidagi o'rni.</li>
            <li><strong>Google servislarini o'rganish:</strong> Google Workspace tarkibiga kiruvchi amaliy dasturlar bilan tanishish.</li>
            <li><strong>Bulut texnologiyalarini tushunish:</strong> Ma'lumotlarni masofaviy serverlarda xavfsiz saqlash va sinxronlash.</li>
            <li><strong>Tibbiyotda qo'llanilishini bilish:</strong> Shifokor va tibbiyot xodimlarining kunlik ishini avtomatlashtirish.</li>
          </ul>
        </div>

        <div class="glass-card" style="align-items:center; justify-content:center; text-align:center; background:linear-gradient(135deg, rgba(14,165,233,0.1), rgba(16,185,129,0.1));">
          <div style="display:flex; flex-direction:column; gap:16px; width:100%; max-width:340px;">
            <div style="padding:14px; background:rgba(255,255,255,0.05); border:1px solid var(--med-blue); border-radius:12px; font-weight:700;">1. Bilim va Tushuncha</div>
            <div style="color:var(--med-blue); font-weight:900;">↓</div>
            <div style="padding:14px; background:rgba(255,255,255,0.05); border:1px solid var(--med-green); border-radius:12px; font-weight:700;">2. Amaliy Ko'nikma</div>
            <div style="color:var(--med-green); font-weight:900;">↓</div>
            <div style="padding:14px; background:linear-gradient(90deg, var(--med-blue), var(--med-green)); color:#fff; border-radius:12px; font-weight:700;">3. Tibbiyotda Samaradorlik</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: ABOUT GOOGLE & TIMELINE -->
    <section class="section-block" id="haqida">
      <div class="section-badge">2-Bo'lim: Tarix & Rivojlanish</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-blue)" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
        Google Kompaniyasi Haqida
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--med-blue);">Kompaniya Faktlari</div>
          <ul class="custom-list">
            <li><strong>Tashkil topgan yili:</strong> 1998-yil 4-sentyabr (Garajda boshlangan loyiha).</li>
            <li><strong>Asoschilari:</strong> Larry Page va Sergey Brin (Stanford Universiteti).</li>
            <li><strong>Bosh ofisi:</strong> Mountain View, Kaliforniya, AQSh (Googleplex).</li>
            <li><strong>Dunyodagi o'rni:</strong> Global qidiruv bozorining 90%+ qismini egallagan texnologik gigant.</li>
            <li><strong>Sun'iy intellekt:</strong> Google Gemini, DeepMind hamda tibbiy AI ishlanmalari.</li>
            <li><strong>Cloud texnologiyalari:</strong> Dunyo bo'ylab millionlab korxona va tibbiyot muassasalariga bulutli infratuzilma taqdim etadi.</li>
          </ul>
        </div>

        <div class="glass-card">
          <div class="card-title" style="color:var(--med-green);">Rivojlanish Bosqichlari (Timeline)</div>
          <div class="timeline-container">
            <div class="timeline-item">
              <div class="timeline-year">1998-yil</div>
              <div class="timeline-text">Google Qidiruv tizimining ishga tushishi.</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-year">2004-yil</div>
              <div class="timeline-text">Gmail pochta xizmatining taqdim etilishi.</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-year">2006-yil</div>
              <div class="timeline-text">Google Docs va Spreadsheets bulutli muharrirlari taqdimoti.</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-year">2012-yil</div>
              <div class="timeline-text">Google Drive bulutli xotira xizmati ishga tushirildi.</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-year">2024-2026-yillar</div>
              <div class="timeline-text">Gemini AI hamda AlphaFold 3 tibbiy oqsil modellashtirish inqilobi.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: GOOGLE WORKSPACE OVERVIEW -->
    <section class="section-block" id="workspace">
      <div class="section-badge">3-Bo'lim: Google Workspace</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Google Workspace Servislari
      </h2>
      <div class="grid-4">
        <!-- Docs -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(66,133,244,0.15); color:var(--g-blue);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <div class="card-title">Google Docs</div>
          <div class="card-desc">Matnli hujjatlar yaratish va real vaqtda hamkorlikda tahrirlash.</div>
          <div class="med-tag">🏥 Kasallik tarixlari</div>
        </div>

        <!-- Sheets -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(52,168,83,0.15); color:var(--g-green);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 3v3h-7V6h7zm-8 0v3H5V6h6zm-6 5h6v3H5v-3zm8 0h7v3h-7v-3zm7 8h-7v-3h7v3zm-8 0H5v-3h6v3z"/></svg>
          </div>
          <div class="card-title">Google Sheets</div>
          <div class="card-desc">Elektron jadvallar, formulalar va tibbiy statistika tahlili.</div>
          <div class="med-tag">📊 Lab tahlillari</div>
        </div>

        <!-- Slides -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(251,188,5,0.15); color:var(--g-yellow);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H5V5h14v12z"/></svg>
          </div>
          <div class="card-title">Google Slides</div>
          <div class="card-desc">Interaktiv taqdimotlar va ilmiy maruzalar tayyorlash.</div>
          <div class="med-tag">🎓 Tibbiy ma'ruzalar</div>
        </div>

        <!-- Forms -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(168,85,247,0.15); color:var(--g-purple);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm4-4H7v-2h9v2zm0-4H7V7h9v2z"/></svg>
          </div>
          <div class="card-title">Google Forms</div>
          <div class="card-desc">Onlayn anketalar, so'rovnomalar va testlar o'tkazish.</div>
          <div class="med-tag">📋 Bemor anketalari</div>
        </div>

        <!-- Drive -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(66,133,244,0.15); color:var(--g-blue);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5H7.71zM9.73 15L6.3 21h13.12l3.43-6H9.73zm6.56-11.5L9.73 15h13.12l6.56-11.5H16.29z"/></svg>
          </div>
          <div class="card-title">Google Drive</div>
          <div class="card-desc">15 GB bepul bulutli xotira, fayllarni xavfsiz saqlash.</div>
          <div class="med-tag">💾 Rentgen va MRT</div>
        </div>

        <!-- Meet -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(234,67,53,0.15); color:var(--g-red);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </div>
          <div class="card-title">Google Meet</div>
          <div class="card-desc">Onlayn videokonferensiya va masofaviy muloqot tizimi.</div>
          <div class="med-tag">👨‍⚕️ Telemeditsina</div>
        </div>

        <!-- Calendar -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(66,133,244,0.15); color:var(--g-blue);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
          </div>
          <div class="card-title">Google Calendar</div>
          <div class="card-desc">Vaqtni rejalashtirish, navbatchilik va qabul jadvali.</div>
          <div class="med-tag">📅 Qabul vaqtlari</div>
        </div>

        <!-- Keep -->
        <div class="glass-card">
          <div class="card-icon" style="background:rgba(251,188,5,0.15); color:var(--g-yellow);">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
          </div>
          <div class="card-title">Google Keep</div>
          <div class="card-desc">Tezkor eslatmalar, qaydlar va topshiriqlar ro'yxati.</div>
          <div class="med-tag">📝 Dori eslatmalari</div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: GOOGLE DOCS & SHEETS -->
    <section class="section-block" id="docs-sheets">
      <div class="section-badge">4-Bo'lim: Hujjatlar & Statistika</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="var(--g-blue)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        Google Docs va Google Sheets
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--g-blue);">Google Docs Tibbiyotda</div>
          <ul class="custom-list">
            <li><strong>Bulutli Matn Muharriri:</strong> Dasturni kompyuterga o'rnatish shart emas.</li>
            <li><strong>Real vaqtda hamkorlik:</strong> Bir nechta shifokorlar bir vaqtning o mezonida kasallik tarixini (Epicrisis) tahrirlashi.</li>
            <li><strong>PDF Eksport:</strong> Tayyor tibbiy hisobot va tavsiyalarni PDF ko'rinishida saqlash.</li>
          </ul>
        </div>

        <div class="glass-card">
          <div class="card-title" style="color:var(--g-green);">Google Sheets Tibbiyotda</div>
          <ul class="custom-list">
            <li><strong>Formulalar:</strong> SUM, AVERAGE, COUNTIF yordamida tahlillarni avtomatik hisoblash.</li>
            <li><strong>Diagrammalar:</strong> Bemorlar dinamikasi va laboratoriya ko'rsatkichlarini vizuallashtirish.</li>
            <li><strong>Filtrlash:</strong> Kasallik turlari va yosh toifalari bo'yicha saralash.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 6: TELEMEDICINE & MEET -->
    <section class="section-block" id="telemeditsina">
      <div class="section-badge">5-Bo'lim: Muloqot & Telemeditsina</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="var(--g-red)"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        Google Meet va Telemeditsina Imkoniyatlari
      </h2>
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-title" style="color:var(--g-red);">Masofaviy Muloqot va Konsilium</div>
          <ul class="custom-list">
            <li><strong>HD Sifatli Muloqot:</strong> Shifokor va bemor o'rtasidagi masofaviy konsultatsiyalar.</li>
            <li><strong>Ekran Namoyishi (Screen Share):</strong> Rentgen va MRT tasvirlarini jonli muloqotda tahlil etish.</li>
            <li><strong>Xavfsizlik:</strong> Shifrlangan kanal va maxfiy kirish kodlari.</li>
          </ul>
        </div>

        <div class="glass-card" style="align-items:center; justify-content:center; text-align:center; border-color:var(--g-red);">
          <div style="width:70px; height:70px; border-radius:50%; background:rgba(234,67,53,0.15); display:flex; align-items:center; justify-content:center; color:var(--g-red); margin-bottom:10px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </div>
          <div class="card-title" style="color:var(--g-red);">Telemeditsina Seansi</div>
          <div class="card-desc">Google Meet orqali masofaviy konsilium o'tkazish</div>
        </div>
      </div>
    </section>

    <!-- SECTION 7: PROS & CONS -->
    <section class="section-block" id="tahlil">
      <div class="section-badge">6-Bo'lim: Solishtirish</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
        Afzalliklari va Kamchiliklari
      </h2>
      <div class="grid-2">
        <div class="glass-card" style="border-color:var(--med-green);">
          <div class="card-title" style="color:var(--med-green); display:flex; align-items:center; gap:8px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            Afzalliklari
          </div>
          <ul class="custom-list">
            <li><strong>Mutlaqo Bepul va Qulay:</strong> Asosiy funksiyalar bepul taqdim etiladi.</li>
            <li><strong>Cross-Platform:</strong> Telefon, planshet va kompyuterda sinxron ishlaydi.</li>
            <li><strong>Real Vaqtda Saqlanish:</strong> Elektr uzilsa ham fayllar yo'qolmaydi.</li>
            <li><strong>Vaqtni Tejaydi:</strong> Qog'ozbozlik va ortiqcha qatnovlarni kamaytiradi.</li>
          </ul>
        </div>

        <div class="glass-card" style="border-color:var(--g-red);">
          <div class="card-title" style="color:var(--g-red); display:flex; align-items:center; gap:8px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
            Kamchiliklari
          </div>
          <ul class="custom-list">
            <li><strong>Internet Bog'liqligi:</strong> Avtonom (offline) rejimda ayrim imkoniyatlar cheklangan.</li>
            <li><strong>Maxfiylik Xavflari:</strong> Bulutli saqlashda kiberxavfsizlik qoidalariga amal qilish shart.</li>
            <li><strong>15 GB Cheklovi:</strong> Katta hajmdagi MRT/CT tasvirlari uchun qo'shimcha xotira sotib olish kerak.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION 8: PRACTICAL EXERCISE -->
    <section class="section-block" id="amaliyot">
      <div class="section-badge">7-Bo'lim: Amaliyot</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        Amaliy Mashq (Talabalar uchun)
      </h2>
      <div class="glass-card">
        <div class="card-title" style="color:var(--med-blue);">Quyidagi topshiriqlarni bajaring va belgilang:</div>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
          <label class="checklist-item">
            <input type="checkbox" onchange="updateTaskProgress()">
            <span>1. Google Docs'da "Tibbiy Kasallik Tarixi" shablonini yaratish va PDF ko'rinishida yuklab olish.</span>
          </label>
          <label class="checklist-item">
            <input type="checkbox" onchange="updateTaskProgress()">
            <span>2. Google Forms orqali 5 ta savoldan iborat "Bemor So'rovnomasi" anketasini tuzish.</span>
          </label>
          <label class="checklist-item">
            <input type="checkbox" onchange="updateTaskProgress()">
            <span>3. Google Sheets'da "Laboratoriya Natijalari" jadvalini tuzish va AVERAGE formulasini ulash.</span>
          </label>
          <label class="checklist-item">
            <input type="checkbox" onchange="updateTaskProgress()">
            <span>4. Google Drive'da "Tibbiy Hujjatlar" papkasini ochib, unga kirish havolasini tayyorlash.</span>
          </label>
        </div>
        <div id="taskStatusText" style="font-weight:700; color:var(--med-green); margin-top:10px; display:none;">
          🎉 Barcha amaliy topshiriqlar muvaffaqiyatli bajarildi!
        </div>
      </div>
    </section>

    <!-- SECTION 9: MUSTAHKAMLASH SAVOLLARI -->
    <section class="section-block" id="savollar">
      <div class="section-badge">8-Bo'lim: Savollar</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Mustahkamlash Savollari
      </h2>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            1. Google kompaniyasiga qachon va kimlar tomonidan asos solingan?
            <span>+</span>
          </div>
          <div class="accordion-body">1998-yilda Stanford Universiteti talabalari Larry Page va Sergey Brin tomonidan asos solingan.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            2. Google Workspace tarkibiga qaysi asosiy dasturlar kiradi?
            <span>+</span>
          </div>
          <div class="accordion-body">Google Docs, Sheets, Slides, Forms, Drive, Meet, Calendar hamda Keep dasturlari kiradi.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            3. Google Docs dasturining MS Word'dan asosiy ustunligi nimada?
            <span>+</span>
          </div>
          <div class="accordion-body">Bulutda ishlashi, dastur o'rnatish shart emasligi hamda real vaqtda bir nechta shifokorlar birgalikda tahrirlashi imkoniyatidir.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            4. Google Sheets tibbiy statistikada qanday imkoniyatlarni beradi?
            <span>+</span>
          </div>
          <div class="accordion-body">Laboratoriya tahlillarini hisoblash, statistik formulalarni qo'llash va grafik doiraviy diagrammalar yaratish.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            5. Telemeditsinada Google Meet dasturining o'rni qanday?
            <span>+</span>
          </div>
          <div class="accordion-body">Masofaviy shifokor-bemor videomuloqoti, tibbiy konsiliumlar hamda ekranni namoyish etib rentgen tasvirlarini tahlil qilish imkonini beradi.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            6. Google Drive foydalanuvchilariga bepul qancha joy beradi?
            <span>+</span>
          </div>
          <div class="accordion-body">Har bir foydalanuvchiga 15 GB bepul bulutli xotira ajratiladi.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            7. Shifokor navbatchilik va qabul vaqtlarini boshqarishda qaysi servis ishlatiladi?
            <span>+</span>
          </div>
          <div class="accordion-body">Google Calendar (Taqvim) servisi yordamida qabul va navbatchiliklar rejalashtiriladi.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            8. Google Forms orqali bemorlardan ma'lumot yig'ishning afzalligi nimada?
            <span>+</span>
          </div>
          <div class="accordion-body">Anketalarni masofadan to'ldirish va natijalarni avtomatik ravishda grafik holatida yig'ib berishi.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            9. Google Keep dasturidan tibbiyotda qanday foydalaniladi?
            <span>+</span>
          </div>
          <div class="accordion-body">Tezkor eslatmalar, dori qabul qilish vaqtlari hamda kunlik shifokor topshiriqlarini yozib borishda.</div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            10. Bulut texnologiyalarining tibbiyotdagi asosiy afzalligi nimada?
            <span>+</span>
          </div>
          <div class="accordion-body">Ma'lumotlarning har qanday qurilmadan tezkor olinishi, zaxira nusxalanishi va jamoaviy ishlash imkoniyatidir.</div>
        </div>
      </div>
    </section>

    <!-- SECTION 10: INTERACTIVE QUIZ -->
    <section class="section-block" id="test">
      <div class="section-badge">9-Bo'lim: Sinov Testi</div>
      <h2 class="section-title" style="justify-content:space-between;">
        <span style="display:flex; align-items:center; gap:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Interaktiv Test (15 ta Savol)
        </span>
        <span id="quizScoreBadge" style="font-size:1.05rem; font-weight:800; color:var(--med-green);">Ball: 0 / 15</span>
      </h2>
      <div class="glass-card">
        <div id="quizContainer" style="display:flex; flex-direction:column; gap:14px;">
          <!-- Rendered dynamically -->
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:15px;">
          <button class="btn-primary" onclick="resetQuiz()" style="font-size:0.95rem; padding:0.7rem 1.8rem;">
            Qayta Ishlash (Reset)
          </button>
        </div>
      </div>
    </section>

    <!-- SECTION 11: INTERESTING FACTS -->
    <section class="section-block" id="faktlar">
      <div class="section-badge">10-Bo'lim: Faktlar</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-yellow)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Google Haqida Qiziqarli Faktlar
      </h2>
      <div class="grid-2">
        <div class="glass-card"><strong>1. Google Nomi:</strong> "Googol" (1 va 100 ta nol) matematik atamasidan olingan.</div>
        <div class="glass-card"><strong>2. Garaj va LEGO:</strong> Dastlabki Google serveri LEGO kubiklaridan yasalgan korpusda saqlangan.</div>
        <div class="glass-card"><strong>3. Qidiruv Hajmi:</strong> Google har kuni 8.5 milliarddan ortiq qidiruv so'rovlarini qayta ishlaydi.</div>
        <div class="glass-card"><strong>4. AlphaFold Inqilobi:</strong> Google DeepMind 200 milliondan ortiq oqsil strukturasini bashorat qildi.</div>
        <div class="glass-card"><strong>5. 3 Milliard Foydalanuvchi:</strong> Google Workspace 3 milliarddan ortiq faol foydalanuvchiga ega.</div>
        <div class="glass-card"><strong>6. YouTube Xaridi:</strong> 2006-yilda YouTube 1.65 milliard dollarga sotib olingan.</div>
        <div class="glass-card"><strong>7. Android Xaridi:</strong> Mobil Android tizimi 2005-yilda sotib olingan.</div>
        <div class="glass-card"><strong>8. Tillarni Qo'llash:</strong> Google Qidiruv 150 dan ortiq tillarda xizmat beradi.</div>
        <div class="glass-card"><strong>9. Yashil Energiya:</strong> Bosh ofis 100% qayta tiklanuvchi energiya bilan ta'minlangan.</div>
        <div class="glass-card"><strong>10. Tibbiy AI Diagnostika:</strong> Google AI ko'z to'r pardasi skanerida shifokorlar bilan bir xil aniqlikda diagnostika qiladi.</div>
      </div>
    </section>

    <!-- SECTION 12: GLOSSARY -->
    <section class="section-block" id="lugat">
      <div class="section-badge">11-Bo'lim: Lug'at</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        Atamalar Lug'ati
      </h2>
      <div class="grid-3">
        <div class="glass-card"><strong>Cloud (Bulut):</strong> Ma'lumotlarni masofaviy serverlarda saqlash va internet orqali kirish.</div>
        <div class="glass-card"><strong>Workspace:</strong> Google tomonidan yaratilgan bulutli ishchi muhit ilovalari to'plami.</div>
        <div class="glass-card"><strong>Storage (Xotira):</strong> Ma'lumot va fayllar saqlanadigan raqamli sig'im.</div>
        <div class="glass-card"><strong>Meeting (Videomuloqot):</strong> Internet orqali masofaviy onlayn uchrashuv.</div>
        <div class="glass-card"><strong>Docs:</strong> Bulutli matnli hujjatlar yaratish dasturi.</div>
        <div class="glass-card"><strong>Forms:</strong> Anketalar va testlar yaratish servisi.</div>
        <div class="glass-card"><strong>Sheets:</strong> Elektron jadvallar va statistik formulalar dasturi.</div>
        <div class="glass-card"><strong>Drive:</strong> Google'ning bulutli saqlash diski.</div>
        <div class="glass-card"><strong>Calendar:</strong> Elektron taqvim va vaqtni rejalashtirish tizimi.</div>
        <div class="glass-card"><strong>Sync (Sinxronlash):</strong> Barcha qurilmalardagi ma'lumotlarni bir xil holatga keltirish.</div>
        <div class="glass-card"><strong>Offline (Avtonom):</strong> Internet ulanmagan holatda ishlash rejimi.</div>
        <div class="glass-card"><strong>Backup (Zaxira):</strong> Fayllarning nusxasini havfsiz joyda saqlash.</div>
      </div>
    </section>

    <!-- SECTION 13: CONCLUSION -->
    <section class="section-block" id="xulosa">
      <div class="section-badge">12-Bo'lim: Yakun</div>
      <h2 class="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        Xulosa
      </h2>
      <div class="grid-2">
        <div class="glass-card" style="border-color:var(--med-blue);">
          <div class="card-title" style="color:var(--med-blue);">Asosiy Xulosalar</div>
          <ul class="custom-list">
            <li>Google servislari zamonaviy tibbiyot xodimining ajralmas yordamchisiga aylangan.</li>
            <li>Hujjatlar, statistika va bemorlar bazasini bulutda saqlash ish unumdorligini 3-4 barobarga oshiradi.</li>
            <li>Telemeditsina va masofaviy konsiliumlar shifokorlar va bemorlar orasidagi masofani qisqartiradi.</li>
          </ul>
        </div>

        <div class="glass-card" style="border-color:var(--med-green); text-align:center; align-items:center; justify-content:center;">
          <div style="font-size:3rem; margin-bottom:10px;">🎓</div>
          <div class="card-title" style="color:var(--med-green);">Mavzu Yakunlandi!</div>
          <div class="card-desc">Google Dasturlari bo'yicha elektron darslikni muvaffaqiyatli o'zlashtirdingiz.</div>
          <button class="btn-primary" onclick="window.scrollTo({top:0, behavior:'smooth'})" style="margin-top:15px; font-size:0.9rem; padding:0.7rem 1.6rem;">
            Yuqoriga Qaytish ⬆️
          </button>
        </div>
      </div>
    </section>

  </main>

  <!-- BACK TO TOP BUTTON -->
  <button class="back-to-top" id="backToTopBtn" onclick="window.scrollTo({top:0, behavior:'smooth'})" title="Yuqoriga Qaytish">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 15l-6-6-6 6"/></svg>
  </button>

  <!-- SEARCH MODAL -->
  <div class="modal-overlay" id="searchModal">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-size:1.1rem; color:var(--med-blue);">Mavzularni Izlash</h3>
        <button class="btn-icon" onclick="closeSearchModal()" style="width:30px;height:30px;"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <input type="text" class="search-input" id="searchInput" placeholder="Qidiruv so'zini kiriting (Forms, Meet, Drive)..." onkeyup="handleSearch()">
      <div class="search-results" id="searchResults">
        <!-- Search items -->
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    // ==========================================
    // 1. DATA & QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
      { q: "1. Google kompaniyasiga qachon va kimlar asos solgan?", options: ["A) 1998, Larry Page & Sergey Brin", "B) 1995, Bill Gates", "C) 2004, Mark Zuckerberg", "D) 2000, Steve Jobs"], correct: 0 },
      { q: "2. Real vaqtda kasallik tarixini tahrirlash uchun qaysi servis ishlatiladi?", options: ["A) Google Docs", "B) Google Keep", "C) Google Meet", "D) Google Calendar"], correct: 0 },
      { q: "3. Google Drive foydalanuvchilariga bepul qancha joy beradi?", options: ["A) 5 GB", "B) 10 GB", "C) 15 GB", "D) 50 GB"], correct: 2 },
      { q: "4. Bemorlardan anonim so'rovnoma yig'ish uchun qaysi dastur qo'llaniladi?", options: ["A) Google Sheets", "B) Google Forms", "C) Google Docs", "D) Google Meet"], correct: 1 },
      { q: "5. Laboratoriya tahlillarini formulalar bilan hisoblash qaysi dasturda bajariladi?", options: ["A) Google Sheets", "B) Google Keep", "C) Google Slides", "D) Google Drive"], correct: 0 },
      { q: "6. Telemeditsinada masofaviy konsilium o'tkazish servisi qaysi?", options: ["A) Google Meet", "B) Google Docs", "C) Google Forms", "D) Google Calendar"], correct: 0 },
      { q: "7. Shifokor qabul vaqtlarini rejalashtirish qaysi dasturda amalga oshiriladi?", options: ["A) Google Calendar", "B) Google Drive", "C) Google Sheets", "D) Google Keep"], correct: 0 },
      { q: "8. Dori qabul qilish eslatmalari uchun eng qulay servis qaysi?", options: ["A) Google Keep", "B) Google Slides", "C) Google Forms", "D) Google Meet"], correct: 0 },
      { q: "9. Google DeepMind oqsil strukturasini bashorat qiluvchi AI tizimi nima?", options: ["A) AlphaFold", "B) ChatGPT", "C) Google Translate", "D) TensorFlow"], correct: 0 },
      { q: "10. Google Workspace'ning tibbiyotdagi asosiy afzalligi nimada?", options: ["A) Real vaqtda ma'lumot almashinuvi", "B) Faqat kompyuterda ishlashi", "C) Yuqori litsenziya narxi", "D) Internet kerak emasligi"], correct: 0 },
      { q: "11. Rentgen tasvirlarini bulutda saqlash va ulashish servisi qaysi?", options: ["A) Google Drive", "B) Google Calendar", "C) Google Keep", "D) Google Forms"], correct: 0 },
      { q: "12. Google Docs hujjatini qaysi formatga eksport qilish mumkin?", options: ["A) PDF", "B) MP3", "C) EXE", "D) ZIP"], correct: 0 },
      { q: "13. Google Sheets'da bemorlar yoshining o'rtacha qiymatini hisoblash formula qaysi?", options: ["A) =AVERAGE()", "B) =SUM()", "C) =COUNT()", "D) =MAX()"], correct: 0 },
      { q: "14. Google Workspace xizmatlaridan foydalanish uchun nima talab etiladi?", options: ["A) Google (Gmail) hisobi", "B) Faqat Windows 11", "C) Maxsus baza kartasi", "D) Shifokor kodi"], correct: 0 },
      { q: "15. Cloud Technology atamasining ma'nosi nimada?", options: ["A) Ma'lumotlarni masofaviy serverda saqlash", "B) Vinchesterda saqlash", "C) Ob-havo dasturi", "D) Fleshka xotira"], correct: 0 }
    ];

    let quizAnswers = new Array(quizQuestions.length).fill(null);

    const sections = [
      { id: "kirish", title: "Kirish va Sarlavha" },
      { id: "maqsadi", title: "Darsning Maqsadi" },
      { id: "haqida", title: "Google Kompaniyasi Haqida" },
      { id: "workspace", title: "Google Workspace Servislari" },
      { id: "docs-sheets", title: "Google Docs & Sheets" },
      { id: "telemeditsina", title: "Telemeditsina va Meet" },
      { id: "tahlil", title: "Afzalliklari va Kamchiliklari" },
      { id: "amaliyot", title: "Amaliy Mashq" },
      { id: "savollar", title: "Mustahkamlash Savollari" },
      { id: "test", title: "Interaktiv Test" },
      { id: "faktlar", title: "Qiziqarli Faktlar" },
      { id: "lugat", title: "Atamalar Lug'ati" },
      { id: "xulosa", title: "Xulosa" }
    ];

    // ==========================================
    // 2. INITIALIZATION
    // ==========================================
    document.addEventListener("DOMContentLoaded", () => {
      renderQuiz();
      setupEventListeners();
      setupScrollHandler();
    });

    // ==========================================
    // 3. SCROLL PROGRESS & ACTIVE NAV HIGHLIGHT
    // ==========================================
    function setupScrollHandler() {
      const readingProgress = document.getElementById("readingProgress");
      const backToTopBtn = document.getElementById("backToTopBtn");
      const navLinks = document.querySelectorAll(".nav-link");

      window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        readingProgress.style.width = progress + "%";

        // Show/Hide Back to top button
        if (window.scrollY > 400) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }

        // Highlight Active Nav Link
        let currentSec = "";
        sections.forEach(sec => {
          const el = document.getElementById(sec.id);
          if (el) {
            const top = el.offsetTop - 120;
            if (window.scrollY >= top) {
              currentSec = sec.id;
            }
          }
        });

        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + currentSec) {
            link.classList.add("active");
          }
        });
      });
    }

    // ==========================================
    // 4. INTERACTIVE QUIZ ENGINE
    // ==========================================
    function renderQuiz() {
      const container = document.getElementById("quizContainer");
      container.innerHTML = "";

      quizQuestions.forEach((q, qIdx) => {
        const card = document.createElement("div");
        card.className = "quiz-card";

        let optsHtml = "";
        q.options.forEach((opt, oIdx) => {
          let extraClass = "";
          if (quizAnswers[qIdx] !== null) {
            if (oIdx === q.correct) extraClass = "correct";
            else if (quizAnswers[qIdx] === oIdx) extraClass = "incorrect";
          }
          optsHtml += `<button class="quiz-opt ${extraClass}" onclick="selectAnswer(${qIdx}, ${oIdx})">${opt}</button>`;
        });

        card.innerHTML = `
          <div class="quiz-question">${q.q}</div>
          <div class="quiz-options">${optsHtml}</div>
        `;
        container.appendChild(card);
      });

      calculateScore();
    }

    function selectAnswer(qIdx, oIdx) {
      if (quizAnswers[qIdx] !== null) return;
      quizAnswers[qIdx] = oIdx;
      renderQuiz();
    }

    function calculateScore() {
      let score = 0;
      quizAnswers.forEach((ans, qIdx) => {
        if (ans === quizQuestions[qIdx].correct) score++;
      });
      document.getElementById("quizScoreBadge").innerText = `Ball: ${score} / ${quizQuestions.length}`;
    }

    function resetQuiz() {
      quizAnswers = new Array(quizQuestions.length).fill(null);
      renderQuiz();
    }

    // Accordion handler
    function toggleAccordion(header) {
      const item = header.parentElement;
      item.classList.toggle("active");
      const span = header.querySelector("span");
      span.innerText = item.classList.contains("active") ? "−" : "+";
    }

    // Task Checklist handler
    function updateTaskProgress() {
      const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      document.getElementById("taskStatusText").style.display = allChecked ? "block" : "none";
    }

    // Theme Toggle
    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
    }

    // Fullscreen Toggle
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }

    // Search Modal
    function openSearchModal() {
      document.getElementById("searchModal").classList.add("open");
      document.getElementById("searchInput").focus();
      handleSearch();
    }

    function closeSearchModal() {
      document.getElementById("searchModal").classList.remove("open");
    }

    function handleSearch() {
      const query = document.getElementById("searchInput").value.toLowerCase();
      const resultsContainer = document.getElementById("searchResults");
      resultsContainer.innerHTML = "";

      const filtered = sections.filter(s => s.title.toLowerCase().includes(query));
      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<div style="color:var(--text-muted); font-size:0.88rem;">Hech narsa topilmadi</div>`;
        return;
      }

      filtered.forEach(s => {
        const item = document.createElement("div");
        item.className = "search-item";
        item.innerHTML = `<strong>${s.title}</strong>`;
        item.onclick = () => {
          const el = document.getElementById(s.id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          closeSearchModal();
        };
        resultsContainer.appendChild(item);
      });
    }

    function setupEventListeners() {
      document.getElementById("themeToggleBtn").onclick = toggleTheme;
      document.getElementById("fullscreenBtn").onclick = toggleFullscreen;
      document.getElementById("printBtn").onclick = () => window.print();
      document.getElementById("searchBtn").onclick = openSearchModal;

      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          openSearchModal();
        } else if (e.key === "Escape") {
          closeSearchModal();
        }
      });
    }
  </script>
</body>
</html>
'''

with open(r'd:\01. Antigravity\HTML darsliklar\index.html', 'w', encoding='utf-8') as f:
    f.write(landing_html)

print("Generated landing page style index.html successfully!")
