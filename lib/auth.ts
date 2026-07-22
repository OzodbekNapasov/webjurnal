/**
 * Auth utility — SHA-256 hashing, profile updates & session helpers
 */

export interface AuthUser {
  username: string;
  fullName?: string;
  redirect: string;
}

const USERS: { username: string; passwordHash: string; redirect: string }[] = [
  {
    username: 'Napasov',
    passwordHash: '6f2c0c2f2e5fcd4e6a1b9e8e2b1a4c3d5f7e9a1b3d5f7a9c1e3f5a7b9d1e3f5',
    redirect: '/?techSchool=shahrisabz',
  },
  {
    username: 'Ozodbek',
    passwordHash: '6f2c0c2f2e5fcd4e6a1b9e8e2b1a4c3d5f7e9a1b3d5f7a9c1e3f5a7b9d1e3f5',
    redirect: '/?techSchool=ibn_sino',
  },
];

export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

let _resolvedUsers: typeof USERS | null = null;

export async function getResolvedUsers() {
  if (_resolvedUsers) return _resolvedUsers;
  const password = 'Eua5gd007';
  const hash = await sha256(password);
  _resolvedUsers = USERS.map((u) => ({ ...u, passwordHash: hash }));
  return _resolvedUsers;
}

export async function attemptLogin(
  username: string,
  password: string
): Promise<string | null> {
  const inputHash = await sha256(password);
  
  // Check local custom credentials first
  try {
    const customCreds = localStorage.getItem(`custom_creds_${username.toLowerCase()}`);
    if (customCreds) {
      const parsed = JSON.parse(customCreds);
      if (parsed.passwordHash === inputHash) {
        return parsed.redirect || '/?techSchool=shahrisabz';
      }
    }
  } catch (e) {
    console.error("Error reading custom creds:", e);
  }

  const users = await getResolvedUsers();
  const match = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.passwordHash === inputHash
  );
  return match ? match.redirect : null;
}

export const SESSION_COOKIE = 'auth_session';

export function storeSession(username: string, fullName?: string) {
  const payload = btoa(JSON.stringify({ username, fullName, ts: Date.now() }));
  document.cookie = `${SESSION_COOKIE}=${payload}; path=/; max-age=86400; SameSite=Lax`;
  localStorage.setItem('auth_user', JSON.stringify({ username, fullName: fullName || username }));
}

export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  localStorage.removeItem('auth_user');
}

export function isLoggedIn(): boolean {
  try {
    return !!localStorage.getItem('auth_user');
  } catch {
    return false;
  }
}

export function getStoredUser(): { username: string; fullName?: string } | null {
  try {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Update User Profile & Credentials locally and sync with Supabase */
export async function updateUserProfile(
  oldUsername: string,
  newUsername: string,
  newFullName: string,
  newPassword?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    let passwordHash = '';
    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.trim().length < 6) {
        return { success: false, message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!" };
      }
      passwordHash = await sha256(newPassword.trim());
    } else {
      const existingCreds = localStorage.getItem(`custom_creds_${oldUsername.toLowerCase()}`);
      if (existingCreds) {
        passwordHash = JSON.parse(existingCreds).passwordHash;
      } else {
        passwordHash = await sha256('Eua5gd007');
      }
    }

    const credsObj = {
      username: newUsername,
      fullName: newFullName,
      passwordHash,
      redirect: '/?techSchool=shahrisabz',
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`custom_creds_${newUsername.toLowerCase()}`, JSON.stringify(credsObj));
    storeSession(newUsername, newFullName);

    const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const envKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
    if (envUrl && envKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(envUrl, envKey);
        await supabase.from('user_profiles').upsert([
          {
            username: newUsername,
            full_name: newFullName,
            password_hash: passwordHash,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'username' });
      } catch (err) {
        console.warn("Could not sync to Supabase user_profiles table:", err);
      }
    }

    return { success: true, message: "Profil ma'lumotlari muvaffaqiyatli saqlandi!" };
  } catch (err: any) {
    return { success: false, message: err?.message || "Xatolik yuz berdi" };
  }
}
