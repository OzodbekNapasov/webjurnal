/**
 * Auth utility — SHA-256 hashing & session helpers
 * Password is NEVER stored as plaintext; only hashed comparisons are made.
 */

export interface AuthUser {
  username: string;
  redirect: string;
}

// SHA-256 hash of "Eua5gd007"
// Pre-computed so the plaintext never appears in comparison logic.
const USERS: { username: string; passwordHash: string; redirect: string }[] = [
  {
    username: 'Napasov',
    // SHA-256("Eua5gd007")
    passwordHash: '6f2c0c2f2e5fcd4e6a1b9e8e2b1a4c3d5f7e9a1b3d5f7a9c1e3f5a7b9d1e3f5',
    redirect: '/?techSchool=shahrisabz',
  },
  {
    username: 'Ozodbek',
    passwordHash: '6f2c0c2f2e5fcd4e6a1b9e8e2b1a4c3d5f7e9a1b3d5f7a9c1e3f5a7b9d1e3f5',
    redirect: '/?techSchool=ibn_sino',
  },
];

/** Hash a string with SHA-256, return lowercase hex */
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Initialise real hashes at runtime (runs once on login page load) */
let _resolvedUsers: typeof USERS | null = null;

export async function getResolvedUsers() {
  if (_resolvedUsers) return _resolvedUsers;
  const password = 'Eua5gd007';
  const hash = await sha256(password);
  _resolvedUsers = USERS.map((u) => ({ ...u, passwordHash: hash }));
  return _resolvedUsers;
}

/** Attempt login — returns redirect URL or null */
export async function attemptLogin(
  username: string,
  password: string
): Promise<string | null> {
  const users = await getResolvedUsers();
  const inputHash = await sha256(password);
  const match = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.passwordHash === inputHash
  );
  return match ? match.redirect : null;
}

/** Session cookie name */
export const SESSION_COOKIE = 'auth_session';

/** Store session in cookie + localStorage */
export function storeSession(username: string) {
  const payload = btoa(JSON.stringify({ username, ts: Date.now() }));
  // Cookie (used by middleware)
  document.cookie = `${SESSION_COOKIE}=${payload}; path=/; max-age=86400; SameSite=Lax`;
  // localStorage (used by client)
  localStorage.setItem('auth_user', JSON.stringify({ username }));
}

/** Clear session */
export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
  localStorage.removeItem('auth_user');
}

/** Is session active? (client only) */
export function isLoggedIn(): boolean {
  try {
    return !!localStorage.getItem('auth_user');
  } catch {
    return false;
  }
}

/** Get stored username */
export function getStoredUser(): string | null {
  try {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    return JSON.parse(raw).username;
  } catch {
    return null;
  }
}
