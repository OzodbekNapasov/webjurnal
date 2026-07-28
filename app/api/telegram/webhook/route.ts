import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// ─── Telegram API helper ──────────────────────────────────────────────────────
const TG_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId: string | number, text: string, replyMarkup?: any, parseMode = 'HTML') {
  const body: any = { chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// GitHub & local sync helper
async function saveScheduleData(data: any): Promise<{ success: boolean; error?: string }> {
  const jsonString = JSON.stringify(data, null, 4);

  // 1. Local filesystem save
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    fs.writeFileSync(filePath, jsonString, 'utf-8');
  } catch (fsErr) {
    console.warn('Local fs write skipped:', fsErr);
  }

  // 2. Direct GitHub API commit
  const githubToken = (process.env.GITHUB_TOKEN || '').trim();
  const githubRepo = (process.env.GITHUB_REPO || 'OzodbekNapasov/webjurnal').trim();

  if (githubToken) {
    try {
      const fileUrl = `https://api.github.com/repos/${githubRepo}/contents/public/schedule/data.json`;
      
      const getRes = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'WebJurnal-Bot'
        },
        cache: 'no-store'
      });

      let sha: string | undefined = undefined;
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
      }

      const base64Content = Buffer.from(jsonString).toString('base64');

      const putRes = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'WebJurnal-Bot'
        },
        body: JSON.stringify({
          message: "chore(schedule): update schedule data.json from telegram bot",
          content: base64Content,
          sha: sha,
          branch: "main"
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        return { success: false, error: `GitHub API status ${putRes.status}: ${errText}` };
      }
      return { success: true };
    } catch (ghErr: any) {
      return { success: false, error: ghErr?.message || String(ghErr) };
    }
  }

  return { success: true }; // Local only
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

// Hostname helper
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
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

  let data;
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to read data.json:', err);
    return '❌ Jadval ma\'lumotlari topilmadi.';
  }

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

  const label = targetDay ? (targetDay === (jsDay === 0 ? 7 : jsDay) + 1 ? 'Ertangi' : `${DAY_NAMES_UZ[targetDay - 1]} kungi`) : 'Bugungi';

  if (todayLessons.length === 0) {
    return `📅 <b>${label} darslar — ${todayUz()}</b>\n\n😌 Bugun dars yo'q. Yaxshi dam oling!`;
  }

  const totalHours = todayLessons.length * 1.5;
  const baseUrl = getBaseUrl();
  let msg = `📅 <b>${label} darslar — ${todayUz()}</b>\n`;
  msg += `📌 ${currentWeek}-hafta\n\n`;

  todayLessons.forEach((l: any) => {
    const journalUrl = `${baseUrl}/journal?groupId=${l.groupId}&groupName=${encodeURIComponent(l.groupName)}`;
    msg += `┌─────────────────────\n`;
    msg += `│ <b>${ROMAN[l.period]}-para</b>  ${l.bell.start}–${l.bell.end}\n`;
    msg += `│ 👥 ${l.groupName}\n`;
    msg += `│ 📚 ${l.sectionName}\n`;
    msg += `│ 🔗 <a href="${journalUrl}">Jurnalni ochish</a>\n`;
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
    + `Quyidagi tugmalardan foydalanib darslar jadvali va elektron jurnallarni tezkor boshqarishingiz mumkin:`;

  const keyboard = {
    keyboard: [
      [{ text: "📅 Bugungi darslar" }, { text: "⏰ Ertangi darslar" }],
      [{ text: "🗓 Haftalik jadval" }, { text: "📘 Jurnallar ro'yxati" }],
      [{ text: "🗑 Dars o'chirish" }, { text: "ℹ️ Yordam" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };

  await sendMessage(chatId, msg, keyboard);
}

async function handleHelp(chatId: number) {
  const msg = `ℹ️ <b>Yordam</b>\n\n`
    + `/today — Bugungi darslar ro'yxati\n`
    + `/tomorrow — Ertangi darslar ro'yxati\n`
    + `/week — Haftalik darslar\n`
    + `/journals — Barcha faol guruhlar jurnallari\n\n`
    + `🔔 Har kuni soat 07:00 da darslar ro'yxati avtomatik yuboriladi.`;
  await sendMessage(chatId, msg);
}

async function handleToday(chatId: number) {
  const msg = await buildTodayMessage();
  await sendMessage(chatId, msg);
}

async function handleTomorrow(chatId: number) {
  const now = new Date();
  const jsDay = now.getDay();
  let tomorrowDay = (jsDay === 0 ? 7 : jsDay) + 1;
  if (tomorrowDay > 7) tomorrowDay = 1;
  const msg = await buildTodayMessage(tomorrowDay);
  await sendMessage(chatId, msg);
}

async function handleWeek(chatId: number) {
  const days = [];
  for (let day = 1; day <= 6; day++) {
    const msg = await buildTodayMessage(day);
    days.push(msg);
  }
  const combinedMsg = days.join('\n\n====================\n\n');
  await sendMessage(chatId, combinedMsg);
}

async function handleJournals(chatId: number) {
  
  let data;
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    await sendMessage(chatId, '❌ Jurnallar ma\'lumotlarini o\'qib bo\'lmadi.');
    return;
  }

  const { groups, settings } = data;
  const techSchool = settings?.techSchool || 'shahrisabz';
  const schoolGroups = (groups || []).filter((g: any) => g.tech_school === techSchool);

  if (schoolGroups.length === 0) {
    await sendMessage(chatId, '📭 Obuna bo\'lish uchun guruhlar topilmadi.');
    return;
  }

  const baseUrl = getBaseUrl();
  let msg = `📘 <b>Elektron Jurnallar Ro'yxati</b>\n`;
  msg += `🏫 Texnikum: <i>${techSchool.toUpperCase()}</i>\n\n`;

  schoolGroups.forEach((g: any, i: number) => {
    const journalUrl = `${baseUrl}/journal?groupId=${g.id}&groupName=${encodeURIComponent(g.name)}`;
    msg += `${i + 1}. <b>${g.name}</b> — <a href="${journalUrl}">Jurnalni ochish ➡️</a>\n`;
  });

  await sendMessage(chatId, msg);
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
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;
    const message = body?.message || body?.edited_message;

    // Callback query kelganda (masalan, darsni o'chirish)
    const callbackQuery = body?.callback_query;
    if (callbackQuery) {
      const cChatId = callbackQuery.message.chat.id;
      const cData = callbackQuery.data;
      const cQueryId = callbackQuery.id;

      // Access control
      if (allowedChatId && String(cChatId) !== String(allowedChatId)) {
        return NextResponse.json({ ok: true });
      }

      if (cData.startsWith('del_sch_')) {
        const lessonId = parseInt(cData.replace('del_sch_', ''));
        await handleCallbackDeleteLesson(cChatId, cQueryId, lessonId);
      }
      return NextResponse.json({ ok: true });
    }

    if (!message) return NextResponse.json({ ok: true });

    const chatId: number = message.chat.id;
    const text: string = (message.text || '').trim().toLowerCase();
    const firstName: string = message.from?.first_name || 'Do\'stim';

    // Ruxsat etilgan foydalanuvchini tekshirish
    if (allowedChatId && String(chatId) !== String(allowedChatId)) {
      await sendMessage(chatId, "⚠️ <b>Ruxsat berilmagan!</b>\nSiz ushbu botdan foydalana olmaysiz.");
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Ovozli xabar yoki oddiy izoh matni kelganda
    const isCommand = text.startsWith('/');
    const isKeyboardButton = [
      "📅 bugungi darslar",
      "⏰ ertangi darslar",
      "🗓 haftalik jadval",
      "📘 jurnallar ro'yxati",
      "🗑 dars o'chirish",
      "ℹ️ yordam"
    ].includes(text);
    const voice = message.voice;

    if (!isCommand && !isKeyboardButton && (text || voice)) {
      await handleIncomingNote(chatId, text, voice);
    } else if (text === '/start' || text.startsWith('/start ')) {
      await handleStart(chatId, firstName);
    } else if (text === '/today' || text === "📅 bugungi darslar") {
      await handleToday(chatId);
    } else if (text === '/tomorrow' || text === "⏰ ertangi darslar") {
      await handleTomorrow(chatId);
    } else if (text === '/week' || text === "🗓 haftalik jadval") {
      await handleWeek(chatId);
    } else if (text === '/journals' || text === "📘 jurnallar ro'yxati") {
      await handleJournals(chatId);
    } else if (text.startsWith('/add_lesson')) {
      await handleAddLesson(chatId, message.text || '');
    } else if (text === '/delete_lesson' || text === "🗑 dars o'chirish") {
      await handleDeleteLessonList(chatId);
    } else if (text === '/help' || text === "ℹ️ yordam") {
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

// ─── Incoming Note/Voice Handler ──────────────────────────────────────────────
async function handleIncomingNote(chatId: number, rawText: string, voice: any) {
  let textToProcess = rawText || '';

  // 1. Ovozli xabarni transkripsiya qilish (Gemini yordamida)
  if (voice) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      await sendMessage(chatId, "⚠️ <b>Ovozli xabar qabul qilindi.</b>\nLekin uni matnga aylantirish uchun serverda <code>GEMINI_API_KEY</code> sozlanishi kerak. Hozircha faqat matnli izoh yubora olasiz.");
      return;
    }

    await sendMessage(chatId, "🎙 <i>Ovozli xabar eshitilmoqda va matnga aylantirilmoqda...</i>");

    try {
      const fileId = voice.file_id;
      // Telegramdan fayl yo'lini olamiz
      const fileRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();
      if (!fileData.ok) throw new Error("Faylni yuklab bo'lmadi");

      const filePath = fileData.result.file_path;
      // Ogg faylini yuklab olamiz
      const oggRes = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`);
      const oggBuffer = await oggRes.arrayBuffer();
      const base64Audio = Buffer.from(oggBuffer).toString('base64');

      // Gemini API ga yuboramiz
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/ogg',
                  data: base64Audio
                }
              },
              {
                text: "Ushbu ovozli xabarni o'zbek tilidagi matnga aylantiring (Transkripsiya qiling). Matnda guruh nomi (masalan 25-16, 25-17) bo'lsa, uni albatta to'g'ri va aniq yozing. Faqat transkripsiya matnini qaytaring, boshqa hech narsa yozmang."
              }
            ]
          }]
        })
      });

      const geminiData = await geminiRes.json();
      const transcription = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!transcription) throw new Error("Transkripsiya amalga oshmadi");

      textToProcess = transcription.trim();
    } catch (e: any) {
      console.error("Gemini audio transcription error:", e);
      await sendMessage(chatId, `❌ <b>Ovozli xabarni o'qishda xatolik:</b> ${e.message}`);
      return;
    }
  }

  // 2. Guruh nomini aniqlash (Regex: 25-16, 24-14 va h.k.)
  const groupRegex = /\b(2\d-\d\d)\b/;
  const match = textToProcess.match(groupRegex);

  if (!match) {
    const errorPrefix = voice ? `🎙 <b>Transkripsiya:</b> <i>"${textToProcess}"</i>\n\n` : '';
    await sendMessage(chatId, `${errorPrefix}⚠️ <b>Guruh aniqlanmadi!</b>\nIzoh yoki qayd yozayotganda guruh nomini albatta ko'rsating.\n\n<i>Masalan: \"25-16 guruh dars zo'r o'tdi\"</i>`);
    return;
  }

  const groupName = match[1];
  // Izoh matnidan guruh nomini va boshqa ortiqcha so'zlarni olib tashlash
  const noteText = textToProcess
    .replace(groupRegex, '')
    .replace(/izoh|qayd|[:\-]/gi, '')
    .trim();

  if (!noteText) {
    await sendMessage(chatId, `⚠️ <b>Izoh matni bo'sh!</b>\nGuruh nomidan keyin izoh matnini ham yozing.\n\n<i>Masalan: \"${groupName} dars a'lo darajada o'tdi\"</i>`);
    return;
  }

  // 3. Supabase orqali guruh ID sini aniqlash
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  let data;
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (err) {
    await sendMessage(chatId, '❌ Server ma\'lumotlarini o\'qib bo\'lmadi.');
    return;
  }

  const { groups } = data;
  const group = (groups || []).find((g: any) => g.name.toLowerCase().includes(groupName.toLowerCase()));

  if (!group) {
    await sendMessage(chatId, `❌ Tizimda <b>${groupName}</b> guruhi topilmadi.`);
    return;
  }

  // Bugungi sanani formatlash (DD.MM.YYYY Uzbekistan vaqti)
  const now = new Date();
  const uzTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const day = String(uzTime.getDate()).padStart(2, '0');
  const month = String(uzTime.getMonth() + 1).padStart(2, '0');
  const year = uzTime.getFullYear();
  const todayDateStr = `${day}.${month}.${year}`;

  // Bugungi darsni izlash
  const { data: todayLessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('group_id', group.id)
    .eq('lesson_date', todayDateStr);

  let updatedCount = 0;
  let targetLessonInfo = '';

  if (todayLessons && todayLessons.length > 0) {
    // Bugungi dars(lar)ga izoh yozamiz
    const { error } = await supabase
      .from('lessons')
      .update({ note: noteText })
      .eq('group_id', group.id)
      .eq('lesson_date', todayDateStr);

    if (error) {
      await sendMessage(chatId, `❌ Izohni saqlashda xatolik: ${error.message}`);
      return;
    }
    updatedCount = todayLessons.length;
    targetLessonInfo = `bugungi (${todayDateStr}) darsiga`;
  } else {
    // Agar bugun dars topilmasa, guruhning oxirgi darsiga yozamiz
    const { data: latestLessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('group_id', group.id)
      .order('id', { ascending: false })
      .limit(1);

    if (latestLessons && latestLessons.length > 0) {
      const { error } = await supabase
        .from('lessons')
        .update({ note: noteText })
        .eq('id', latestLessons[0].id);

      if (error) {
        await sendMessage(chatId, `❌ Oxirgi darsga izoh saqlashda xatolik: ${error.message}`);
        return;
      }
      updatedCount = 1;
      targetLessonInfo = `oxirgi darsiga (${latestLessons[0].lesson_date || 'sanasiz dars'})`;
    }
  }

  if (updatedCount > 0) {
    const successMsg = `✅ <b>Qayd muvaffaqiyatli saqlandi!</b>\n\n`
      + `👥 Guruh: <b>${group.name}</b>\n`
      + `📅 Joyi: <b>Guruhning ${targetLessonInfo}</b>\n`
      + `${voice ? `🎙 <i>Ovozli xabar matni:</i>\n` : `📝 <i>Izoh matni:</i>\n`}`
      + `\"${noteText}\"\n\n`
      + `📱 <i>Ushbu qayd avtomatik tarzda elektron jurnal platformasidagi <b>"Izoh / Qayd"</b> ustuniga kelib tushdi.</i>`;
    await sendMessage(chatId, successMsg);
  } else {
    await sendMessage(chatId, `❌ <b>${group.name}</b> guruhi uchun hech qanday dars mavzulari topilmadi. Avval platformadan dars kiriting.`);
  }
}

// ─── Add/Delete Schedule Functions ───────────────────────────────────────────
async function handleAddLesson(chatId: number, text: string) {
  const parts = text.split(/\s+/).slice(1);
  if (parts.length < 4) {
    await sendMessage(chatId, "⚠️ <b>Noto'g'ri format!</b>\n\nBuyruq formati:\n<code>/add_lesson [Guruh] [Para] [Kun] [Haftalar]</code>\n\n<i>Misol: /add_lesson 25-16 1 Dushanba 1-20</i>");
    return;
  }

  const [groupInput, paraInput, dayInput, weeksInput] = parts;

  let data;
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    await sendMessage(chatId, "❌ Ma'lumotlarni o'qib bo'lmadi.");
    return;
  }

  const group = (data.groups || []).find((g: any) => g.name.toLowerCase().includes(groupInput.toLowerCase()));
  if (!group) {
    await sendMessage(chatId, `❌ Tizimda <b>${groupInput}</b> guruhi topilmadi.`);
    return;
  }

  const period = parseInt(paraInput);
  if (isNaN(period) || period < 1 || period > 6) {
    await sendMessage(chatId, "❌ Paralar 1 dan 6 gacha raqam bo'lishi kerak.");
    return;
  }

  const daysMap: Record<string, number> = {
    'dushanba': 1, '1': 1, 'mon': 1,
    'seshanba': 2, '2': 2, 'tue': 2,
    'chorshanba': 3, '3': 3, 'wed': 3,
    'payshanba': 4, '4': 4, 'thu': 4,
    'juma': 5, '5': 5, 'fri': 5,
    'shanba': 6, '6': 6, 'sat': 6,
  };
  const dayOfWeek = daysMap[dayInput.toLowerCase()];
  if (!dayOfWeek) {
    await sendMessage(chatId, "❌ Kun nomi noto'g'ri (Dushanba-Shanba oralig'ida yozing).");
    return;
  }

  let weeksStr = '';
  if (weeksInput.includes('-')) {
    const [start, end] = weeksInput.split('-').map(Number);
    if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > 20) {
      await sendMessage(chatId, "❌ Haftalar oralig'i noto'g'ri (Masalan: 1-20).");
      return;
    }
    const wArr = [];
    for (let w = start; w <= end; w++) wArr.push(w);
    weeksStr = wArr.join(',');
  } else {
    weeksStr = weeksInput;
  }

  const newId = (data.lessons || []).length > 0
    ? Math.max(...data.lessons.map((l: any) => l.id || 0)) + 1
    : 1;

  const newLesson = {
    id: newId,
    sectionId: 1,
    groupId: group.id,
    weeks: weeksStr,
    dayOfWeek: dayOfWeek,
    shift: 1,
    period: period,
    teacher: "Napasov O.",
    note: ""
  };

  data.lessons.push(newLesson);

  await sendMessage(chatId, "⏳ Jadval saqlanmoqda va GitHub-ga yuklanmoqda...");

  const res = await saveScheduleData(data);
  if (res.success) {
    await sendMessage(chatId, `✅ <b>Dars jadvalga muvaffaqiyatli qo'shildi!</b>\n\n👥 Guruh: <b>${group.name}</b>\n📅 Kun: <b>${DAY_NAMES_UZ[dayOfWeek]}</b>\n🕒 Para: <b>${period}-para</b>\n📅 Haftalar: <b>${weeksInput}</b>\n\n🔄 <i>Saytda yangilanishi uchun Vercel qayta qurishini kuting (1 daqiqa).</i>`);
  } else {
    await sendMessage(chatId, `❌ GitHub bilan sinxronlashda xatolik: ${res.error}`);
  }
}

async function handleDeleteLessonList(chatId: number) {
  let data;
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    await sendMessage(chatId, "❌ Ma'lumotlarni o'qib bo'lmadi.");
    return;
  }

  const { lessons, groups, settings } = data;
  const techSchool = settings?.techSchool || 'shahrisabz';

  const schoolLessons = (lessons || []).filter((l: any) => {
    const grp = (groups || []).find((g: any) => g.id === l.groupId);
    return grp && grp.tech_school === techSchool;
  });

  if (schoolLessons.length === 0) {
    await sendMessage(chatId, "📭 Jadvalda hech qanday dars topilmadi.");
    return;
  }

  let msg = `🗑 <b>Darsni O'chirish</b>\n\nO'chirmoqchi bo'lgan darsni tanlang:\n`;
  const inlineKeyboard: any[] = [];

  schoolLessons.slice(0, 15).forEach((l: any) => {
    const grp = (groups || []).find((g: any) => g.id === l.groupId);
    const label = `${grp?.name || 'Guruh'} | ${DAY_NAMES_UZ[l.dayOfWeek]} (${l.period}-para)`;
    inlineKeyboard.push([
      { text: `❌ ${label}`, callback_data: `del_sch_${l.id}` }
    ]);
  });

  await sendMessage(chatId, msg, { inline_keyboard: inlineKeyboard });
}

async function handleCallbackDeleteLesson(chatId: number, callbackQueryId: string, lessonId: number) {
  let data;
  try {
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: "❌ Faylni o'qishda xatolik", show_alert: true })
    });
    return;
  }

  const lessonExists = data.lessons.some((l: any) => l.id === lessonId);
  if (!lessonExists) {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: "⚠️ Ushbu dars allaqachon o'chirilgan", show_alert: true })
    });
    return;
  }

  data.lessons = data.lessons.filter((l: any) => l.id !== lessonId);

  const res = await saveScheduleData(data);

  if (res.success) {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: "✅ Dars o'chirildi!" })
    });

    await sendMessage(chatId, `❌ <b>Dars jadvaldan o'chirildi!</b>\n\n🔄 <i>Saytda yangilanishi uchun Vercel qayta qurishini kuting (1 daqiqa).</i>`);
  } else {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: `❌ GitHub xatosi: ${res.error}`, show_alert: true })
    });
  }
}
