import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'auth_session';

/** Foydalanuvchi nomiga mos school parametrini qaytaradi */
function getUserSchool(username: string): string | null {
  const map: Record<string, string> = {
    napasov: 'shahrisabz',
    ozodbek: 'ibn_sino',
  };
  return map[username.toLowerCase()] ?? null;
}

/** Cookie'dan username ni oladi */
function getUsernameFromCookie(cookie: string | undefined): string | null {
  if (!cookie) return null;
  try {
    const decoded = JSON.parse(atob(cookie));
    return decoded?.username ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Static asset'larni o'tkazib yuborish
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionValue = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoginPage = pathname === '/login';

  // ──────────────────────────────────────────
  // 1. Login qilinmagan → /login ga redirect
  // ──────────────────────────────────────────
  if (!sessionValue) {
    if (isLoginPage) return NextResponse.next();
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ──────────────────────────────────────────
  // 2. Login qilingan → /login ga kelib qolsa, o'z sahifasiga redirect
  // ──────────────────────────────────────────
  const username = getUsernameFromCookie(sessionValue);
  const userSchool = username ? getUserSchool(username) : null;

  if (isLoginPage) {
    // Allaqachon kirgan → o'z sahifasiga
    const dest = userSchool ? `/?techSchool=${userSchool}` : '/';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ──────────────────────────────────────────
  // 3. Root `/` — techSchool parametrisiz kelsa, o'z sahifasiga redirect
  // ──────────────────────────────────────────
  if (pathname === '/' && userSchool) {
    const requested = searchParams.get('techSchool');

    if (!requested) {
      // Parametrsiz → o'z texnikumiga
      return NextResponse.redirect(
        new URL(`/?techSchool=${userSchool}`, request.url)
      );
    }

    // Boshqa texnikumga kirishga urinayapti → o'z texnikumiga qaytarish
    if (requested !== userSchool) {
      return NextResponse.redirect(
        new URL(`/?techSchool=${userSchool}`, request.url)
      );
    }
  }

  // ──────────────────────────────────────────
  // 4. /journal sahifasida ham tekshirish mumkin (ixtiyoriy)
  // ──────────────────────────────────────────

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
