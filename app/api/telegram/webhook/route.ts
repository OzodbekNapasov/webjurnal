import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ─── Telegram API helper ──────────────────────────────────────────────────────
const TG_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId: string | number, text: string, parseMode = 'HTML') {
  await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true }),
  });
}

// ─── Schedule helpers ─────────────────────────────────────────────────────────
const DAY_NAMES_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const MONTH_NAMES_UZ = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

function todayUz(): string {
  const now = new Date();
  return `${now.getDate()}-${MONTH_NAMES_UZ[now.getMonth()]}, ${DAY_NAMES_UZ[now.getDay()]}`;
}

function getCurrentWeek(semesterStartDate: string): number {
  const start = new Date(semesterStartDate);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - start.getTime();
  return Math.max(1, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1);
}

interface ScheduleLesson {
  period: number;
  dayOfWeek: number;
  weeks: string;
  shift: number;
  groupId: number;
  sectionId: number;
}

async function buildTodayMessage(targetDay?: number): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Load schedule from data.json via Supabase or filesystem
  // We read it from the public/schedule/data.json via fetch since it's a static file
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const dataRes = await fetch(`${baseUrl}/schedule/data.json`, { cache: 'no-store' });
  if (!dataRes.ok) return '❌ Ma\'lumotlar topilmadi.';
  const data = await dataRes.json();

  const { settings, lessons, groups, sections, bellSchedule } = data;

  const semStart = settings?.semesterStartDate || '';
  const currentWeek = semStart ? getCurrentWeek(semStart) : (settings?.currentWeek || 1);
  const techSchool = settings?.techSchool || 'shahrisabz';

  const now = new Date();
  const jsDay = now.getDay(); // 0=Sun
  const dayOfWeek = targetDay ?? (jsDay === 0 ? 7 : jsDay);

  if (dayOfWeek === 7) return '📅 Bugun Yakshanba — dam olish kuni! Yaxshi hordiq oling 😊';

  const todayLessons: any[] = (lessons || [])
    .filter((l: ScheduleLesson) => {
      if (Number(l.dayOfWeek) !== dayOfWeek) return false;
      const weeks = (l.weeks || '').split(',').map(Number);
      return weeks.includes(currentWeek);
    })
    .map((l: ScheduleLesson) => {
      const group = (groups || []).find((g: any) => g.id === l.groupId);
      const section = (sections || []).find((s: any) => s.id === l.sectionId);
      if (!group || group.tech_school !== techSchool) return null;
      const bell = bellSchedule?.[String(l.shift)]?.[l.period] || { start: '08:30', end: '09:50' };
      return { ...l, groupName: group.name, sectionName: section?.name || '—', bell };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.period - b.period);

  const dayName = DAY_NAMES_UZ[jsDay];
  const label = targetDay ? (targetDay === (jsDay === 0 ? 7 : jsDay) + 1 ? 'Ertangi' : `${DAY_NAMES_UZ[targetDay - 1]} kungi`) : 'Bugungi';

  if (todayLessons.length === 0) {
    return `📅 <b>${label} darslar — ${todayUz()}</b>\n\n😌 Bugun dars yo'q. Yaxshi dam oling!`;
  }

  const totalHours = todayLessons.length * 1.5;
  let msg = `📅 <b>${label} darslar — ${todayUz()}</b>\n`;
  msg += `📌 ${currentWeek}-hafta\n\n`;

  todayLessons.forEach((l: any) => {
    msg += `┌─────────────────────\n`;
    msg += `│ <b>${ROMAN[l.period]}-para</b>  ${l.bell.start}–${l.bell.end}\n`;
    msg += `│ 👥 ${l.groupName}\n`;
    msg += `│ 📚 ${l.sectionName}\n`;
    msg += `└─────────────────────\n`;
  });

  msg += `\n📊 Jami: <b>${todayLessons.length} ta dars</b> · ${totalHours} soat`;
  msg += `\n\n🎓 Yaxshi dars!`;
  return msg;
}

// ─── Command handlers ─────────────────────────────────────────────────────────
async function handleStart(chatId: number, firstName: string) {
  const msg = `👋 Salom, <b>${firstName}</b>!\n\n`
    + `Men <b>Dars Jadvali</b> botiman 🎓\n\n`
    + `📋 <b>Buyruqlar:</b>\n`
    + `/today — Bugungi darslar\n`
    + `/tomorrow — Ertangi darslar\n`
    + `/week — Haftalik jadval\n`
    + `/help — Yordam\n\n`
    + `Har kuni ertalab <b>07:00</b> da bugungi darslarni avtomatik yuboraman! ✅`;
  await sendMessage(chatId, msg);
}

async function handleHelp(chatId: number) {
  const msg = `ℹ️ <b>Yordam</b>\n\n`
    + `/today — Bugungi darslar ro'yxati\n`
    + `/tomorrow — Ertangi darslar ro'yxati\n`
    + `/week — Haftalik jadval\n\n`
    + `🔔 Har kuni soat 07:00 da darslar ro'yxati avtomatik yuboriladi.`;
  await sendMessage(chatId, msg);
}

async function handleToday(chatId: number) {
  await sendMessage(chatId, '⏳ Yuklanmoqda...');
  const msg = await buildTodayMessage();
  await sendMessage(chatId, msg);
}

async function handleTomorrow(chatId: number) {
  await sendMessage(chatId, '⏳ Yuklanmoqda...');
  const now = new Date();
  const jsDay = now.getDay();
  let tomorrowDay = (jsDay === 0 ? 7 : jsDay) + 1;
  if (tomorrowDay > 7) tomorrowDay = 1;
  const msg = await buildTodayMessage(tomorrowDay);
  await sendMessage(chatId, msg);
}

async function handleWeek(chatId: number) {
  await sendMessage(chatId, '⏳ Haftalik jadval yuklanmoqda...');
  const msgs: string[] = [];
  for (let day = 1; day <= 6; day++) {
    const msg = await buildTodayMessage(day);
    msgs.push(msg);
  }
  for (const m of msgs) {
    await sendMessage(chatId, m);
  }
}

// ─── Main webhook handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Verify secret token
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  if (process.env.TELEGRAM_SECRET_TOKEN && secret !== process.env.TELEGRAM_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const message = body?.message || body?.edited_message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId: number = message.chat.id;
    const text: string = (message.text || '').trim().toLowerCase();
    const firstName: string = message.from?.first_name || 'Do\'stim';

    if (text === '/start' || text.startsWith('/start ')) {
      await handleStart(chatId, firstName);
    } else if (text === '/today') {
      await handleToday(chatId);
    } else if (text === '/tomorrow') {
      await handleTomorrow(chatId);
    } else if (text === '/week') {
      await handleWeek(chatId);
    } else if (text === '/help') {
      await handleHelp(chatId);
    } else {
      await sendMessage(chatId, `❓ Buyruq topilmadi.\n\n/help — yordam olish uchun`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
