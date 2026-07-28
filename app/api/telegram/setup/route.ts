import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/telegram/setup
 * Telegram-ga webhook URL ni ro'yxatdan o'tkazadi.
 * Bir marta ishlatiladi — Vercel-ga deploy qilingandan so'ng.
 */
export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secretToken = process.env.TELEGRAM_SECRET_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'TELEGRAM_BOT_TOKEN environment variable is missing.' },
      { status: 500 }
    );
  }

  // Vercel URL ni aniqlash
  const host = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : req.headers.get('host')
    ? `https://${req.headers.get('host')}`
    : 'http://localhost:3000';

  const webhookUrl = `${host}/api/telegram/webhook`;

  try {
    // Avval eski webhook ni o'chiramiz
    await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drop_pending_updates: true }),
    });

    // Yangi webhook o'rnatamiz
    const body: any = {
      url: webhookUrl,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    };
    if (secretToken) body.secret_token = secretToken;

    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await res.json();

    if (!result.ok) {
      return NextResponse.json(
        { error: `Telegram API error: ${result.description || 'Unknown error'} (Webhook URL: ${webhookUrl})`, details: result },
        { status: 400 }
      );
    }

    // Botning info si
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const me = await meRes.json();

    return NextResponse.json({
      success: true,
      webhook_url: webhookUrl,
      bot: {
        username: me.result?.username,
        name: me.result?.first_name,
        id: me.result?.id,
      },
      message: `✅ Webhook muvaffaqiyatli o'rnatildi! @${me.result?.username} botiga /start yozing.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Webhook setup failed', details: err.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/telegram/setup
 * Webhook ni o'chiradi.
 */
export async function DELETE() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 500 });
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drop_pending_updates: true }),
  });
  const result = await res.json();
  return NextResponse.json({ success: result.ok, details: result });
}
