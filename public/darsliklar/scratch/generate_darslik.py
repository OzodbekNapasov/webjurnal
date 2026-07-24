import os

html_content = '''<!DOCTYPE html>
<html lang="uz" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Tibbiyotda Axborot Texnologiyalari fani bo'yicha 'Google tomonidan ishlab chiqarilgan dasturlar' interaktiv elektron darsligi va taqdimoti.">
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
      --bg-card-hover: rgba(30, 41, 59, 0.85);
      --border-color: rgba(255, 255, 255, 0.12);
      --border-glow: rgba(14, 165, 233, 0.4);
      
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      
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
      --shadow-glow: 0 0 25px rgba(14, 165, 233, 0.3);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    [data-theme="light"] {
      --bg-main: #f0f4f9;
      --bg-card: rgba(255, 255, 255, 0.88);
      --bg-card-hover: #ffffff;
      --border-color: rgba(14, 165, 233, 0.18);
      --border-glow: rgba(2, 132, 199, 0.4);
      
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

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: var(--bg-main);
      color: var(--text-primary);
      user-select: none;
    }

    body {
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at 15% 15%, rgba(14, 165, 233, 0.12) 0%, transparent 40%),
                  radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 40%),
                  var(--bg-main);
      transition: background 0.4s ease, color 0.4s ease;
    }

    /* ==========================================
       3. TOP HEADER BAR
       ========================================== */
    .app-header {
      height: 60px;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      z-index: 100;
    }

    .brand-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--med-blue), var(--med-green));
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }

    .brand-logo svg {
      width: 22px;
      height: 22px;
      fill: #ffffff;
    }

    .brand-title {
      font-size: 1rem;
      font-weight: 700;
      background: linear-gradient(90deg, var(--text-primary), var(--med-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
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
    }

    .btn-icon svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
      stroke: currentColor;
      fill: none;
    }

    /* Progress Indicator */
    .slide-progress-container {
      flex: 1;
      max-width: 300px;
      margin: 0 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-bar-bg {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      width: 5.55%;
      background: linear-gradient(90deg, var(--med-blue), var(--med-green));
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-align: center;
      font-weight: 600;
    }

    /* ==========================================
       4. MAIN PRESENTATION VIEW
       ========================================== */
    .presentation-container {
      flex: 1;
      position: relative;
      display: flex;
      overflow: hidden;
    }

    /* Sidebar Drawer (Slide Navigator) */
    .sidebar-drawer {
      width: 280px;
      height: 100%;
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 90;
      position: absolute;
      left: 0;
      top: 0;
      transform: translateX(-100%);
    }

    .sidebar-drawer.open {
      transform: translateX(0);
      box-shadow: 10px 0 30px rgba(0, 0, 0, 0.4);
    }

    .sidebar-header {
      padding: 1.2rem 1rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--med-blue);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sidebar-list {
      flex: 1;
      overflow-y: auto;
      padding: 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .sidebar-item {
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      font-size: 0.83rem;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: var(--transition);
      border: 1px solid transparent;
    }

    .sidebar-item:hover {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-primary);
    }

    .sidebar-item.active {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.15));
      border-color: var(--med-blue);
      color: var(--text-primary);
      font-weight: 600;
    }

    .sidebar-num {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72rem;
      font-weight: 700;
    }

    .sidebar-item.active .sidebar-num {
      background: var(--med-blue);
      color: #ffffff;
    }

    /* Slides View Area */
    .slides-wrapper {
      flex: 1;
      height: 100%;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .slide {
      position: absolute;
      width: 100%;
      max-width: 1280px;
      height: 100%;
      max-height: 720px;
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: 2.2rem 2.5rem;
      display: none;
      flex-direction: column;
      opacity: 0;
      transform: scale(0.97) translateY(15px);
      transition: opacity 0.4s ease, transform 0.4s ease;
      overflow-y: auto;
    }

    .slide.active {
      display: flex;
      opacity: 1;
      transform: scale(1) translateY(0);
      animation: slideFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideFadeIn {
      from {
        opacity: 0;
        transform: scale(0.96) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Slide Header & Titles */
    .slide-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.15));
      border: 1px solid var(--med-blue);
      color: var(--med-blue);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: fit-content;
      margin-bottom: 0.8rem;
    }

    .slide-title {
      font-size: 1.85rem;
      font-weight: 800;
      margin-bottom: 1.2rem;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 12px;
      line-height: 1.25;
    }

    .slide-title svg {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    /* ==========================================
       5. COMPONENTS & CARDS
       ========================================== */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.2rem;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.2rem;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    .glass-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-glow);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow);
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(14, 165, 233, 0.15);
      color: var(--med-blue);
      flex-shrink: 0;
    }

    .card-icon svg {
      width: 24px;
      height: 24px;
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-desc {
      font-size: 0.86rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .med-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--med-green);
      background: rgba(16, 185, 129, 0.12);
      padding: 3px 8px;
      border-radius: 6px;
      width: fit-content;
      margin-top: auto;
    }

    /* Bullet List Component */
    .custom-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .custom-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .custom-list li::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--med-blue);
      margin-top: 7px;
      flex-shrink: 0;
      box-shadow: 0 0 8px var(--med-blue);
    }

    /* Timeline Component */
    .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      padding-left: 20px;
      border-left: 2px solid var(--border-color);
      margin: 10px 0;
    }

    .timeline-item {
      position: relative;
      padding: 0.8rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .timeline-item:hover {
      background: var(--bg-card-hover);
      border-color: var(--med-blue);
      transform: translateX(5px);
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: -27px;
      top: 16px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--med-blue);
      border: 2px solid var(--bg-main);
      box-shadow: 0 0 10px var(--med-blue);
    }

    .timeline-year {
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--med-green);
    }

    .timeline-text {
      font-size: 0.88rem;
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
      padding: 0.9rem 1.2rem;
      border-bottom: 1px solid var(--border-color);
    }

    .custom-table th {
      background: rgba(14, 165, 233, 0.15);
      color: var(--med-blue);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .custom-table td {
      font-size: 0.88rem;
      color: var(--text-secondary);
    }

    .custom-table tr:hover td {
      background: rgba(255, 255, 255, 0.04);
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
      padding: 0.9rem 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.92rem;
      color: var(--text-primary);
    }

    .accordion-header:hover {
      background: rgba(14, 165, 233, 0.1);
    }

    .accordion-body {
      padding: 0.9rem 1.2rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.6;
      display: none;
      background: rgba(0, 0, 0, 0.2);
    }

    .accordion-item.active .accordion-body {
      display: block;
    }

    /* Interactive Quiz */
    .quiz-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .quiz-question {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .quiz-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .quiz-opt {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
      font-size: 0.85rem;
      cursor: pointer;
      text-align: left;
      transition: var(--transition);
    }

    .quiz-opt:hover {
      background: rgba(14, 165, 233, 0.2);
      border-color: var(--med-blue);
      color: var(--text-primary);
    }

    .quiz-opt.correct {
      background: rgba(16, 185, 129, 0.3) !important;
      border-color: var(--med-green) !important;
      color: #ffffff !important;
      font-weight: 700;
    }

    .quiz-opt.incorrect {
      background: rgba(239, 68, 68, 0.3) !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
    }

    /* Checklist Component */
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: var(--transition);
    }

    .checklist-item:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .checklist-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--med-green);
      cursor: pointer;
    }

    /* Hero Slide (Slide 1) */
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 100%;
      gap: 1.5rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 30px;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid var(--med-blue);
      color: var(--med-blue);
      font-size: 0.88rem;
      font-weight: 700;
    }

    .hero-title {
      font-size: 2.8rem;
      font-weight: 900;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 30%, var(--med-blue) 70%, var(--med-green) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      max-width: 900px;
    }

    .hero-subject {
      font-size: 1.25rem;
      color: var(--text-secondary);
      font-weight: 500;
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
      box-shadow: 0 0 40px rgba(14, 165, 233, 0.35);
      animation: floatGlow 3s ease-in-out infinite alternate;
    }

    @keyframes floatGlow {
      0% { transform: translateY(0) scale(1); box-shadow: 0 0 30px rgba(14, 165, 233, 0.3); }
      100% { transform: translateY(-10px) scale(1.03); box-shadow: 0 0 50px rgba(16, 185, 129, 0.4); }
    }

    .btn-start {
      padding: 0.9rem 2.2rem;
      border-radius: 30px;
      border: none;
      background: linear-gradient(135deg, var(--med-blue), var(--med-green));
      color: #ffffff;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .btn-start:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.5);
    }

    /* ==========================================
       6. BOTTOM FOOTER CONTROLS
       ========================================== */
    .app-footer {
      height: 65px;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--border-color);
      z-index: 100;
    }

    .nav-btn-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-nav {
      padding: 0.65rem 1.4rem;
      border-radius: 10px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }

    .btn-nav:hover:not(:disabled) {
      background: var(--med-blue);
      color: #ffffff;
      border-color: var(--med-blue);
      transform: translateY(-2px);
    }

    .btn-nav:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .slide-counter {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.06);
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
    }

    /* ==========================================
       7. MODALS (SEARCH & TOC)
       ========================================== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      z-index: 200;
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
      max-width: 600px;
      background: var(--bg-main);
      border: 1px solid var(--border-glow);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.9rem 1.2rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
      font-size: 1rem;
      outline: none;
    }

    .search-input:focus {
      border-color: var(--med-blue);
      box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
    }

    .search-results {
      max-height: 320px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .search-item {
      padding: 0.8rem 1rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--text-secondary);
      transition: var(--transition);
    }

    .search-item:hover {
      background: var(--med-blue);
      color: #ffffff;
    }

    /* ==========================================
       8. RESPONSIVE DESIGN
       ========================================== */
    @media (max-width: 992px) {
      .grid-3, .grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
      .grid-2 {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 2.1rem;
      }
      .slide-title {
        font-size: 1.45rem;
      }
      .slide {
        padding: 1.4rem;
      }
    }

    @media (max-width: 640px) {
      .grid-3, .grid-4, .quiz-options {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 1.65rem;
      }
      .brand-subtitle, .slide-progress-container {
        display: none;
      }
      .btn-nav span {
        display: none;
      }
    }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        overflow: visible !important;
      }
      .app-header, .app-footer, .sidebar-drawer, .btn-icon, .modal-overlay {
        display: none !important;
      }
      .slides-wrapper {
        padding: 0 !important;
        display: block !important;
      }
      .slide {
        display: block !important;
        position: relative !important;
        opacity: 1 !important;
        transform: none !important;
        page-break-after: always;
        max-width: 100% !important;
        max-height: none !important;
        border: 1px solid #ccc !important;
        box-shadow: none !important;
        margin-bottom: 20px;
        background: #ffffff !important;
        color: #000000 !important;
      }
      .card-desc, .custom-list li, .timeline-text {
        color: #333333 !important;
      }
    }
  </style>
</head>
<body>

  <!-- TOP HEADER BAR -->
  <header class="app-header">
    <div class="brand-area">
      <button class="btn-icon" id="toggleSidebarBtn" title="Slaydlar Navigatsiyasi">
        <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="brand-logo">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div>
        <div class="brand-title">Google Servislari va Tibbiyot IT</div>
        <div class="brand-subtitle">Tibbiyotda Axborot Texnologiyalari</div>
      </div>
    </div>

    <div class="slide-progress-container">
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" id="progressBar"></div>
      </div>
      <div class="progress-text" id="progressText">Slayd 1 / 18 (6%)</div>
    </div>

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

  <!-- MAIN PRESENTATION AREA -->
  <main class="presentation-container">

    <!-- SIDEBAR NAVIGATOR -->
    <aside class="sidebar-drawer" id="sidebarDrawer">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          Slaydlar Mundarijasi
        </div>
        <button class="btn-icon" id="closeSidebarBtn" style="width:28px;height:28px;">
          <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="sidebar-list" id="sidebarList">
        <!-- Rendered dynamically via JS -->
      </div>
    </aside>

    <!-- SLIDES WRAPPER -->
    <div class="slides-wrapper">

      <!-- SLIDE 1: HERO -->
      <section class="slide active" data-slide="1">
        <div class="hero-container">
          <div class="hero-badge">Tibbiyotda Axborot Texnologiyalari</div>
          <h1 class="hero-title">Google tomonidan ishlab chiqarilgan dasturlar</h1>
          <p class="hero-subject">Zamonaviy bulutli texnologiyalar va ularning tibbiy amaliyotdagi o'rni</p>

          <div class="hero-logo-box">
            <svg width="60" height="60" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          <button class="btn-start" onclick="goToSlide(2)">
            Darsni boshlash
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <!-- SLIDE 2: OBJECTIVES -->
      <section class="slide" data-slide="2">
        <div class="slide-badge">1-Bo'lim: Kirish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          Darsning Maqsadi
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--med-blue); font-size:1.15rem;">Asosiy O'quv Maqsadlari</div>
              <ul class="custom-list" style="margin-top:10px;">
                <li><strong>Google kompaniyasini tanish:</strong> Kompaniyaning rivojlanish tarixi va dunyo IT sohasidagi o'rni.</li>
                <li><strong>Google servislarini o'rganish:</strong> Google Workspace tarkibiga kiruvchi amaliy dasturlar bilan tanishish.</li>
                <li><strong>Bulut texnologiyalarini tushunish:</strong> Ma'lumotlarni masofaviy serverlarda xavfsiz saqlash va sinxronlash.</li>
                <li><strong>Tibbiyotda qo'llanilishini bilish:</strong> Shifokor va tibbiyot xodimlarining kunlik ishini avtomatlashtirish.</li>
              </ul>
            </div>

            <!-- Infographic Box -->
            <div class="glass-card" style="align-items:center; justify-content:center; text-align:center; background:linear-gradient(135deg, rgba(14,165,233,0.1), rgba(16,185,129,0.1));">
              <div style="display:flex; flex-direction:column; gap:16px; width:100%; max-width:320px;">
                <div style="padding:12px; background:rgba(255,255,255,0.05); border:1px solid var(--med-blue); border-radius:12px; font-weight:700;">1. Bilim va Tushuncha</div>
                <div style="color:var(--med-blue); font-weight:900;">↓</div>
                <div style="padding:12px; background:rgba(255,255,255,0.05); border:1px solid var(--med-green); border-radius:12px; font-weight:700;">2. Amaliy Ko'nikma</div>
                <div style="color:var(--med-green); font-weight:900;">↓</div>
                <div style="padding:12px; background:linear-gradient(90deg, var(--med-blue), var(--med-green)); color:#fff; border-radius:12px; font-weight:700;">3. Tibbiyotda Samaradorlik</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 3: ABOUT GOOGLE -->
      <section class="slide" data-slide="3">
        <div class="slide-badge">2-Bo'lim: Kompaniya Tarixi</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-blue)" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
          Google Kompaniyasi Haqida
        </h2>
        <div class="slide-content">
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

            <!-- Timeline -->
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
        </div>
      </section>

      <!-- SLIDE 4: GOOGLE WORKSPACE OVERVIEW -->
      <section class="slide" data-slide="4">
        <div class="slide-badge">3-Bo'lim: Google Workspace</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Google Workspace Servislari
        </h2>
        <div class="slide-content">
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
        </div>
      </section>

      <!-- SLIDE 5: GOOGLE DOCS DEEP DIVE -->
      <section class="slide" data-slide="5">
        <div class="slide-badge">4-Bo'lim: Chuqur O'rganish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="var(--g-blue)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          Google Docs va Tibbiyot Hujjatlari
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--g-blue);">Imkoniyatlari va Hususiyatlari</div>
              <ul class="custom-list">
                <li><strong>Bulutli Matn Muharriri:</strong> Dasturni kompyuterga o'rnatish shart emas, brauzer orqali ishlaydi.</li>
                <li><strong>Real vaqtda hamkorlik:</strong> Bir nechta shifokorlar bir vaqtning o'zida bitta hujjat ustida tahrir olib borishi mumkin.</li>
                <li><strong>O'zgarishlar tarixi (Version History):</strong> Hujjatga kiritilgan har bir tuzatish saqlanib boriladi.</li>
                <li><strong>Formatlarni qo'llab-quvvatlash:</strong> PDF, DOCX, TXT formatlarida eksport va import qilish.</li>
              </ul>
            </div>

            <div class="glass-card" style="border-color:var(--med-green);">
              <div class="card-title" style="color:var(--med-green);">Tibbiyotdagi Amaliy Misollar</div>
              <div style="display:flex; flex-direction:column; gap:10px; margin-top:5px;">
                <div style="padding:10px; background:rgba(255,255,255,0.04); border-radius:8px; border-left:3px solid var(--med-blue);">
                  <strong>1. Kasallik Tarixini Yozish (Epicrisis):</strong> Konsilium a'zolari bemor holatini masofadan turib to'ldirishi.
                </div>
                <div style="padding:10px; background:rgba(255,255,255,0.04); border-radius:8px; border-left:3px solid var(--med-green);">
                  <strong>2. Shifokor Hisobotlari:</strong> Oylik va yillik tibbiy hisobotlarni birgalikda tayyorlash.
                </div>
                <div style="padding:10px; background:rgba(255,255,255,0.04); border-radius:8px; border-left:3px solid var(--g-yellow);">
                  <strong>3. Davolash Rejalari:</strong> Murakkab operatsiyalar va davolash protokollarini tasdiqlash.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 6: GOOGLE SHEETS DEEP DIVE -->
      <section class="slide" data-slide="6">
        <div class="slide-badge">4-Bo'lim: Chuqur O'rganish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="var(--g-green)"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 3v3h-7V6h7zm-8 0v3H5V6h6zm-6 5h6v3H5v-3zm8 0h7v3h-7v-3zm7 8h-7v-3h7v3zm-8 0H5v-3h6v3z"/></svg>
          Google Sheets va Tibbiy Statistika
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--g-green);">Jadval va Formula Imkoniyatlari</div>
              <ul class="custom-list">
                <li><strong>Matematik va Statistik Formulalar:</strong> SUM, AVERAGE, COUNTIF, VLOOKUP yordamida tezkor hisob-kitoblar.</li>
                <li><strong>Vizual Diagrammalar:</strong> Bemorlar dinamikasi va laboratoriya ko'rsatkichlarini grafikda tasvirlash.</li>
                <li><strong>Avtomatik Filtrlash:</strong> Kasallik turlari yoki yosh toifasi bo'yicha bemorlarni saralash.</li>
                <li><strong>Sinxronizatsiya:</strong> Google Forms anketalaridan tushgan ma'lumotlarni avtomatik jadvalga yig'ish.</li>
              </ul>
            </div>

            <!-- Table Preview -->
            <div class="glass-card">
              <div class="card-title" style="color:var(--med-blue);">Tibbiy Bemorlar Jadvali (Namuna)</div>
              <div class="custom-table-container">
                <table class="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Bemor F.I.SH.</th>
                      <th>Diagnoz</th>
                      <th>Harorat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>Alimov A.B.</td>
                      <td>Pnevmoniya</td>
                      <td>38.2 °C</td>
                    </tr>
                    <tr>
                      <td>#002</td>
                      <td>Kariomva S.M.</td>
                      <td>Gipertoniya</td>
                      <td>36.6 °C</td>
                    </tr>
                    <tr>
                      <td>#003</td>
                      <td>Zokirov O.T.</td>
                      <td>Qandli Diabet</td>
                      <td>36.8 °C</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 7: GOOGLE FORMS DEEP DIVE -->
      <section class="slide" data-slide="7">
        <div class="slide-badge">4-Bo'lim: Chuqur O'rganish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="var(--g-purple)"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm4-4H7v-2h9v2zm0-4H7V7h9v2z"/></svg>
          Google Forms - Anketalar va So'rovnomalar
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--g-purple);">Forms Afzalliklari</div>
              <ul class="custom-list">
                <li><strong>Onlayn Ma'lumot Yig'ish:</strong> Istalgan qurilmadan kirib to'ldirish mumkin bo'lgan anketalar.</li>
                <li><strong>Avtomatik Tahlil:</strong> Natijalarni darhol doiraviy (pie chart) va ustunli grafiklarda ko'rsatish.</li>
                <li><strong>Avtonom Testlar:</strong> Talaba va xodimlar bilimini baholash uchun avtomatik ball hisoblaydigan testlar.</li>
                <li><strong>Format Cheklovi Yo'q:</strong> Ko'p tanlovli, matnli yoki fayl yuklash ko'rinishidagi savollar.</li>
              </ul>
            </div>

            <!-- Mini Form Interactive Mockup -->
            <div class="glass-card" style="border-color:var(--g-purple);">
              <div class="card-title" style="color:var(--g-purple);">Bemor Ro'yxatdan O'tish Formasi (Namuna)</div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <label style="font-size:0.8rem; color:var(--text-secondary);">Bemorning to'liq ismi:</label>
                <input type="text" placeholder="F.I.SH." style="padding:6px 10px; border-radius:6px; border:1px solid var(--border-color); background:rgba(255,255,255,0.05); color:#fff;">
                
                <label style="font-size:0.8rem; color:var(--text-secondary);">Shikoyatingiz turi:</label>
                <select style="padding:6px 10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-main); color:#fff;">
                  <option>Bosh og'rig'i va qon bosimi</option>
                  <option>Isitma va yo'tal</option>
                  <option>Profilaktik ko'rik</option>
                </select>
                <button style="margin-top:6px; padding:6px; border-radius:6px; background:var(--g-purple); color:#fff; border:none; cursor:pointer; font-weight:600;">Formani Yuborish</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 8: GOOGLE DRIVE DEEP DIVE -->
      <section class="slide" data-slide="8">
        <div class="slide-badge">4-Bo'lim: Chuqur O'rganish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="var(--g-blue)"><path d="M7.71 3.5L1.15 15l3.43 6 6.56-11.5H7.71zM9.73 15L6.3 21h13.12l3.43-6H9.73zm6.56-11.5L9.73 15h13.12l6.56-11.5H16.29z"/></svg>
          Google Drive va Bulutli Xotira
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--med-blue);">Bulutli Saqlash Hususiyatlari</div>
              <ul class="custom-list">
                <li><strong>15 GB Bepul Joy:</strong> Har bir Google hisob egasiga 15 gigabayt havfsiz joy beriladi.</li>
                <li><strong>Fayllarni Ulashish (Sharing):</strong> Havola orqali ruxsat darajalarini (Ko'rish, Izoh berish, Tahrirlash) sozlash.</li>
                <li><strong>Avtomatik Zaxiralash (Backup):</strong> Hujjat yo'qolishining oldini olish uchun doimiy nusxalash.</li>
                <li><strong>Qidiruv va AI Saralash:</strong> Fayllar ichidagi matn va tasvirlarni tezkor topish.</li>
              </ul>
            </div>

            <!-- Drive Capacity Infographic -->
            <div class="glass-card" style="align-items:center; justify-content:center; text-align:center;">
              <div style="font-size:2.5rem; font-weight:900; color:var(--med-blue);">15 GB</div>
              <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:12px;">Bepul Bulutli Xotira Sig'imi</div>
              <div style="width:100%; height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
                <div style="width:45%; height:100%; background:linear-gradient(90deg, var(--g-blue), var(--g-green));"></div>
              </div>
              <div style="font-size:0.78rem; color:var(--med-green); margin-top:8px;">🏥 Rentgen, MRT va Shifokor Hujjatlari Xavfsiz Saqlanadi</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 9: GOOGLE MEET DEEP DIVE -->
      <section class="slide" data-slide="9">
        <div class="slide-badge">4-Bo'lim: Chuqur O'rganish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="var(--g-red)"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          Google Meet va Telemeditsina
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--g-red);">Videokonferensiya Imkoniyatlari</div>
              <ul class="custom-list">
                <li><strong>HD Sifatli Muloqot:</strong> Yuqori tiniqlikdagi video va shovqinni kamaytirish tizimi.</li>
                <li><strong>Ekran Namoyishi (Screen Share):</strong> Rentgen va MRT tasvirlarini jonli efirda tahlil qilish.</li>
                <li><strong>Masofaviy Konsilium:</strong> Turli viloyat va mamlakat shifokorlarini bitta majlisga yig'ish.</li>
                <li><strong>Xavfsizlik:</strong> Shifrlangan muloqot va maxfiy uchrashuv kodlari.</li>
              </ul>
            </div>

            <!-- Telemedicine Mockup -->
            <div class="glass-card" style="border-color:var(--g-red); align-items:center; justify-content:center; text-align:center;">
              <div style="width:70px; height:70px; border-radius:50%; background:rgba(234,67,53,0.15); display:flex; align-items:center; justify-content:center; color:var(--g-red); margin-bottom:10px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
              </div>
              <div class="card-title" style="color:var(--g-red);">Telemeditsina Seansi</div>
              <div class="card-desc">Shifokor va Bemor o'rtasidagi masofaviy konsultatsiya</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 10: CALENDAR & KEEP -->
      <section class="slide" data-slide="10">
        <div class="slide-badge">4-Bo'lim: Chuqur O'rganish</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="var(--g-blue)"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
          Google Calendar va Keep
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <div class="glass-card">
              <div class="card-title" style="color:var(--g-blue);">Google Calendar (Taqvim)</div>
              <ul class="custom-list">
                <li><strong>Qabul Vaqtlari:</strong> Bemorlarni qabul qilish jadvalini avtomatik tuzish.</li>
                <li><strong>Navbatchilik Jadvali:</strong> Shifokorlar smena va navbatchiliklarini rejalashtirish.</li>
                <li><strong>SMS/E-mail Eslatmalar:</strong> Uchrashuv haqida bemorga oldindan eslatma yuborish.</li>
              </ul>
            </div>

            <div class="glass-card">
              <div class="card-title" style="color:var(--g-yellow);">Google Keep (Eslatmalar)</div>
              <ul class="custom-list">
                <li><strong>Tezkor Tibbiy Qaydlar:</strong> Muhim retsept va kuzatuvlarni lahzada yozib olish.</li>
                <li><strong>Dori Qabul Qilish Eslatmasi:</strong> Bemorlarga tayinlangan dorilar ro'yxati.</li>
                <li><strong>Checklist (Topshiriqlar):</strong> Kunlik operatsiya va ko'riklar ro'yxatini belgilash.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 11: SIGNIFICANCE IN MEDICINE -->
      <section class="slide" data-slide="11">
        <div class="slide-badge">5-Bo'lim: Tibbiyotdagi O'rni</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          Google Xizmatlarining Tibbiyotdagi Ahamiyati
        </h2>
        <div class="slide-content">
          <div class="grid-3">
            <div class="glass-card" style="align-items:center; text-align:center;">
              <div class="card-icon" style="background:rgba(14,165,233,0.15); color:var(--med-blue); width:54px; height:54px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              </div>
              <div class="card-title">Bulutli Infratuzilma</div>
              <div class="card-desc">Dunyoning istalgan nuqtasidan turib tibbiy ma'lumotlarga zudlik bilan kirish.</div>
            </div>

            <div class="glass-card" style="align-items:center; text-align:center;">
              <div class="card-icon" style="background:rgba(16,185,129,0.15); color:var(--med-green); width:54px; height:54px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="card-title">Yuqori Xavfsizlik</div>
              <div class="card-desc">Ma'lumotlar shifrlangan holda saqlanadi va ruxsat etilgan shaxslargagina beriladi.</div>
            </div>

            <div class="glass-card" style="align-items:center; text-align:center;">
              <div class="card-icon" style="background:rgba(251,188,5,0.15); color:var(--g-yellow); width:54px; height:54px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div class="card-title">Jamoaviy Hamkorlik</div>
              <div class="card-desc">Shifokor, hamshira va konsilium a'zolarining uzviy tezkor muloqoti.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SLIDE 12: PROS AND CONS -->
      <section class="slide" data-slide="12">
        <div class="slide-badge">5-Bo'lim: Tahlil</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
          Afzalliklari va Kamchiliklari
        </h2>
        <div class="slide-content">
          <div class="grid-2">
            <!-- Pros -->
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

            <!-- Cons -->
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
        </div>
      </section>

      <!-- SLIDE 13: PRACTICAL EXERCISE -->
      <section class="slide" data-slide="13">
        <div class="slide-badge">6-Bo'lim: Amaliyot</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          Amaliy Mashq (Talabalar uchun)
        </h2>
        <div class="slide-content">
          <div class="glass-card">
            <div class="card-title" style="color:var(--med-blue);">Quyidagi topshiriqlarni bajaring va belgilang:</div>
            <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">
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
        </div>
      </section>

      <!-- SLIDE 14: REVIEW QUESTIONS -->
      <section class="slide" data-slide="14">
        <div class="slide-badge">7-Bo mezon: Mustahkamlash</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Mustahkamlash Savollari
        </h2>
        <div class="slide-content">
          <div style="display:flex; flex-direction:column; gap:8px; max-height:420px; overflow-y:auto;">
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
        </div>
      </section>

      <!-- SLIDE 15: INTERACTIVE QUIZ -->
      <section class="slide" data-slide="15">
        <div class="slide-badge">8-Bo'lim: Sinov</div>
        <h2 class="slide-title" style="justify-content:space-between;">
          <span style="display:flex; align-items:center; gap:10px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Interaktiv Test (15 ta Savol)
          </span>
          <span id="quizScoreBadge" style="font-size:0.9rem; font-weight:700; color:var(--med-green);">Ball: 0 / 15</span>
        </h2>
        <div class="slide-content">
          <div id="quizContainer" style="display:flex; flex-direction:column; gap:12px; max-height:420px; overflow-y:auto;">
            <!-- Quiz questions will be dynamically populated or rendered via JS -->
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:10px;">
            <button class="btn-nav" onclick="resetQuiz()" style="background:var(--med-blue); color:#fff; border:none;">
              Qayta Ishlash (Reset)
            </button>
          </div>
        </div>
      </section>

      <!-- SLIDE 16: INTERESTING FACTS -->
      <section class="slide" data-slide="16">
        <div class="slide-badge">9-Bo'lim: Qo'shimcha</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--g-yellow)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Google Haqida Qiziqarli Faktlar
        </h2>
        <div class="slide-content">
          <div class="grid-2" style="max-height:420px; overflow-y:auto;">
            <div class="glass-card"><strong>1. Google Nomi:</strong> "Googol" (1 raqami va undan keyingi 100 ta nol) matimatik atamasidan olingan.</div>
            <div class="glass-card"><strong>2. Garaj va LEGO:</strong> Dastlabki Google serveri LEGO kubiklaridan yasalgan korpusda saqlangan.</div>
            <div class="glass-card"><strong>3. Qidiruv Hajmi:</strong> Google har kuni 8.5 milliarddan ortiq qidiruv so'rovlarini qayta ishlaydi.</div>
            <div class="glass-card"><strong>4. AlphaFold Inqilobi:</strong> Google DeepMind 200 milliondan ortiq oqsil strukturasini bashorat qilib tibbiyotda inqilob qildi.</div>
            <div class="glass-card"><strong>5. 3 Milliard Foydalanuvchi:</strong> Google Workspace dunyo bo'ylab 3 milliarddan ortiq faol foydalanuvchiga ega.</div>
            <div class="glass-card"><strong>6. YouTube Xaridi:</strong> 2006-yilda YouTube 1.65 milliard dollarga sotib olingan.</div>
            <div class="glass-card"><strong>7. Android Xaridi:</strong> Mobil operatsion tizim bo'lmish Android 2005-yilda sotib olingan.</div>
            <div class="glass-card"><strong>8. Tillarni Qo'llash:</strong> Google Qidiruv 150 dan ortiq tillarda xizmat beradi.</div>
            <div class="glass-card"><strong>9. Yashil Energiya:</strong> Google Bosh ofisi 100% qayta tiklanuvchi energiya bilan ta'minlangan.</div>
            <div class="glass-card"><strong>10. Tibbiy AI Diagnostika:</strong> Google AI ko'z to'r pardasi skanerida shifokorlar bilan bir xil aniqlikda diagnostika qiladi.</div>
          </div>
        </div>
      </section>

      <!-- SLIDE 17: GLOSSARY -->
      <section class="slide" data-slide="17">
        <div class="slide-badge">10-Bo'lim: Lug'at</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-blue)" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Atamalar Lug'ati
        </h2>
        <div class="slide-content">
          <div class="grid-3" style="max-height:420px; overflow-y:auto;">
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
        </div>
      </section>

      <!-- SLIDE 18: CONCLUSION -->
      <section class="slide" data-slide="18">
        <div class="slide-badge">11-Bo'lim: Yakun</div>
        <h2 class="slide-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--med-green)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          Xulosa
        </h2>
        <div class="slide-content">
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
              <button class="btn-start" onclick="goToSlide(1)" style="margin-top:15px; padding:0.6rem 1.5rem; font-size:0.9rem;">
                Qaytadan Boshlash 🔄
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- BOTTOM FOOTER CONTROLS -->
  <footer class="app-footer">
    <div class="nav-btn-group">
      <button class="btn-nav" id="prevBtn" onclick="changeSlide(-1)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        <span>Oldingi</span>
      </button>
      <button class="btn-nav" onclick="goToSlide(1)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"/></svg>
        <span>Asosiy menyu</span>
      </button>
    </div>

    <div class="slide-counter" id="slideCounter">Slayd 1 / 18</div>

    <div class="nav-btn-group">
      <button class="btn-nav" id="nextBtn" onclick="changeSlide(1)">
        <span>Keyingi</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  </footer>

  <!-- SEARCH MODAL -->
  <div class="modal-overlay" id="searchModal">
    <div class="modal-box">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3 style="font-size:1.1rem; color:var(--med-blue);">Mavzu va Slaydlarni Izlash</h3>
        <button class="btn-icon" onclick="closeSearchModal()" style="width:30px;height:30px;"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <input type="text" class="search-input" id="searchInput" placeholder="Qidiruv so'zini kiriting (masalan: Forms, Meet, Drive)..." onkeyup="handleSearch()">
      <div class="search-results" id="searchResults">
        <!-- Search items dynamically populated -->
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    // ==========================================
    // 1. STATE & CONSTANTS
    // ==========================================
    let currentSlide = 1;
    const totalSlides = 18;

    const slidesData = [
      { id: 1, title: "Sarlavha & Kirish" },
      { id: 2, title: "Darsning Maqsadi" },
      { id: 3, title: "Google Kompaniyasi Haqida" },
      { id: 4, title: "Google Workspace Servislari" },
      { id: 5, title: "Google Docs va Hujjatlar" },
      { id: 6, title: "Google Sheets va Statistika" },
      { id: 7, title: "Google Forms Anketalari" },
      { id: 8, title: "Google Drive Bulutli Xotirasi" },
      { id: 9, title: "Google Meet va Telemeditsina" },
      { id: 10, title: "Google Calendar va Keep" },
      { id: 11, title: "Tibbiyotdagi Ahamiyati" },
      { id: 12, title: "Afzalliklari va Kamchiliklari" },
      { id: 13, title: "Amaliy Mashq" },
      { id: 14, title: "Mustahkamlash Savollari" },
      { id: 15, title: "Interaktiv Test" },
      { id: 16, title: "Qiziqarli Faktlar" },
      { id: 17, title: "Atamalar Lug'ati" },
      { id: 18, title: "Xulosa" }
    ];

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

    // ==========================================
    // 2. INITIALIZATION
    // ==========================================
    document.addEventListener("DOMContentLoaded", () => {
      renderSidebar();
      renderQuiz();
      updateSlideView();
      setupEventListeners();
    });

    // ==========================================
    // 3. SLIDE NAVIGATION FUNCTIONS
    // ==========================================
    function goToSlide(n) {
      if (n >= 1 && n <= totalSlides) {
        currentSlide = n;
        updateSlideView();
      }
    }

    function changeSlide(dir) {
      const next = currentSlide + dir;
      if (next >= 1 && next <= totalSlides) {
        currentSlide = next;
        updateSlideView();
      }
    }

    function updateSlideView() {
      // Toggle slides
      document.querySelectorAll(".slide").forEach((s, idx) => {
        if (idx + 1 === currentSlide) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });

      // Update Header Progress
      const pct = Math.round((currentSlide / totalSlides) * 100);
      document.getElementById("progressBar").style.width = pct + "%";
      document.getElementById("progressText").innerText = `Slayd ${currentSlide} / ${totalSlides} (${pct}%)`;
      document.getElementById("slideCounter").innerText = `Slayd ${currentSlide} / ${totalSlides}`;

      // Update Nav Buttons State
      document.getElementById("prevBtn").disabled = (currentSlide === 1);
      document.getElementById("nextBtn").disabled = (currentSlide === totalSlides);

      // Update Sidebar Items
      document.querySelectorAll(".sidebar-item").forEach((item, idx) => {
        if (idx + 1 === currentSlide) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    // ==========================================
    // 4. SIDEBAR & SEARCH RENDER
    // ==========================================
    function renderSidebar() {
      const listContainer = document.getElementById("sidebarList");
      listContainer.innerHTML = "";
      slidesData.forEach(s => {
        const div = document.createElement("div");
        div.className = `sidebar-item ${s.id === currentSlide ? 'active' : ''}`;
        div.onclick = () => {
          goToSlide(s.id);
          closeSidebar();
        };
        div.innerHTML = `
          <div class="sidebar-num">${s.id}</div>
          <div>${s.title}</div>
        `;
        listContainer.appendChild(div);
      });
    }

    function toggleSidebar() {
      document.getElementById("sidebarDrawer").classList.toggle("open");
    }

    function closeSidebar() {
      document.getElementById("sidebarDrawer").classList.remove("open");
    }

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

      const filtered = slidesData.filter(s => s.title.toLowerCase().includes(query));
      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<div style="color:var(--text-muted); font-size:0.88rem;">Hech narsa topilmadi</div>`;
        return;
      }

      filtered.forEach(s => {
        const item = document.createElement("div");
        item.className = "search-item";
        item.innerHTML = `<strong>Slayd ${s.id}:</strong> ${s.title}`;
        item.onclick = () => {
          goToSlide(s.id);
          closeSearchModal();
        };
        resultsContainer.appendChild(item);
      });
    }

    // ==========================================
    // 5. INTERACTIVE QUIZ ENGINE
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
      if (quizAnswers[qIdx] !== null) return; // Prevent changing answer
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

    // Accordion handler for Slide 14
    function toggleAccordion(header) {
      const item = header.parentElement;
      item.classList.toggle("active");
      const span = header.querySelector("span");
      span.innerText = item.classList.contains("active") ? "−" : "+";
    }

    // Task Checklist handler for Slide 13
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

    // ==========================================
    // 6. EVENT LISTENERS (KEYBOARD & WHEEL)
    // ==========================================
    function setupEventListeners() {
      // Toggle Sidebar
      document.getElementById("toggleSidebarBtn").onclick = toggleSidebar;
      document.getElementById("closeSidebarBtn").onclick = closeSidebar;
      document.getElementById("themeToggleBtn").onclick = toggleTheme;
      document.getElementById("fullscreenBtn").onclick = toggleFullscreen;
      document.getElementById("printBtn").onclick = () => window.print();
      document.getElementById("searchBtn").onclick = openSearchModal;

      // Keyboard Controls
      document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.key === "ArrowRight" || e.key === " ") {
          changeSlide(1);
        } else if (e.key === "ArrowLeft") {
          changeSlide(-1);
        } else if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          openSearchModal();
        } else if (e.key === "Escape") {
          closeSearchModal();
          closeSidebar();
        }
      });

      // Mouse Wheel Navigation (Debounced)
      let wheelCoolDown = false;
      document.addEventListener("wheel", (e) => {
        if (wheelCoolDown) return;
        if (Math.abs(e.deltaY) > 30) {
          wheelCoolDown = true;
          if (e.deltaY > 0) {
            changeSlide(1);
          } else {
            changeSlide(-1);
          }
          setTimeout(() => { wheelCoolDown = false; }, 600);
        }
      }, { passive: true });
    }
  </script>
</body>
</html>
'''

with open(r'd:\01. Antigravity\HTML darsliklar\index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully generated index.html!")
