import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const TG_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const DAY_NAMES_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const MONTH_NAMES_UZ = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

async function sendMessage(chatId: string, text: string) {
  const res = await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  return res.json();
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

/**
 * GET /api/cron/daily-schedule
 * Vercel Cron Job tomonidan har kuni ertalab chaqiriladi.
 * Bugungi darslarni TELEGRAM_CHAT_ID ga yuboradi.
 */
export async function GET(req: NextRequest) {
  // Cron secret tekshirish (Vercel cron job avtomatik qo'shadi)
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chatId = process.env.TELEGRAM_CHAT_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!chatId || !botToken) {
    return NextResponse.json(
      { error: 'TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN is not set.' },
      { status: 500 }
    );
  }

  try {
    let data;
    try {
      const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error('Failed to read data.json:', err);
      await sendMessage(chatId, '❌ Jadval ma\'lumotlari yuklanmadi (fayl topilmadi).');
      return NextResponse.json({ error: 'data.json file not found' }, { status: 500 });
    }
    const { settings, lessons, groups, sections, bellSchedule } = data;

    const semStart = settings?.semesterStartDate || '';
    const currentWeek = semStart ? getCurrentWeek(semStart) : (settings?.currentWeek || 1);
    const techSchool = settings?.techSchool || 'shahrisabz';

    // O'zbekiston vaqti (UTC+5)
    const now = new Date();
    const uzTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const jsDay = uzTime.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;

    const dateStr = `${uzTime.getDate()}-${MONTH_NAMES_UZ[uzTime.getMonth()]}`;
    const dayName = DAY_NAMES_UZ[jsDay];

    // Dam olish kuni
    if (dayOfWeek === 7) {
      await sendMessage(
        chatId,
        `☀️ Bugun <b>Yakshanba</b> — dam olish kuni!\n\nYaxshi hordiq oling 😊`
      );
      return NextResponse.json({ ok: true, day: 'sunday' });
    }

    const todayLessons: any[] = (lessons || [])
      .filter((l: any) => {
        if (Number(l.dayOfWeek) !== dayOfWeek) return false;
        const weeks = (l.weeks || '').split(',').map(Number);
        return weeks.includes(currentWeek);
      })
      .map((l: any) => {
        const group = (groups || []).find((g: any) => g.id === l.groupId);
        const section = (sections || []).find((s: any) => s.id === l.sectionId);
        if (!group || group.tech_school !== techSchool) return null;
        const bell = bellSchedule?.[String(l.shift)]?.[l.period] || { start: '08:30', end: '09:50' };
        return { ...l, groupName: group.name, sectionName: section?.name || '—', bell };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.period - b.period);

    // Hostname helper
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
      return 'http://localhost:3000';
    };

    let msg = `🌅 <b>Xayrli tong!</b>\n\n`;
    msg += `📅 <b>${dayName}, ${dateStr}</b>\n`;
    msg += `📌 ${currentWeek}-hafta\n\n`;

    if (todayLessons.length === 0) {
      msg += `😌 Bugun dars yo'q. Yaxshi dam oling!`;
    } else {
      const baseUrl = getBaseUrl();
      todayLessons.forEach((l: any) => {
        const journalUrl = `${baseUrl}/journal?groupId=${l.groupId}&groupName=${encodeURIComponent(l.groupName)}`;
        msg += `┌─────────────────────\n`;
        msg += `│ <b>${ROMAN[l.period]}-para</b>  ${l.bell.start}–${l.bell.end}\n`;
        msg += `│ 👥 ${l.groupName}\n`;
        msg += `│ 📚 ${l.sectionName}\n`;
        msg += `│ 🔗 <a href="${journalUrl}">Jurnalni ochish</a>\n`;
        msg += `└─────────────────────\n`;
      });

      const totalHours = (todayLessons.length * 1.5).toFixed(1).replace('.0', '');
      msg += `\n📊 Jami: <b>${todayLessons.length} ta dars</b> · ${totalHours} soat`;
      msg += `\n\n🎓 Yaxshi dars!`;
    }

    const result = await sendMessage(chatId, msg);

    return NextResponse.json({
      ok: true,
      lessons_count: todayLessons.length,
      day: dayName,
      week: currentWeek,
      telegram_result: result,
    });
  } catch (err: any) {
    console.error('Cron error:', err);
    try {
      await sendMessage(chatId, `❌ Xato yuz berdi: ${err.message}`);
    } catch {}
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
