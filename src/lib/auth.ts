import { useSyncExternalStore } from "react";

/**
 * Tài khoản phía frontend: lưu trong localStorage của trình duyệt.
 * Mật khẩu được băm SHA-256 kèm salt trước khi lưu, không bao giờ lưu dạng gốc.
 * (Bản frontend chưa có máy chủ — khi có backend chỉ cần thay các hàm trong file này.)
 */
export type Session = { email: string; name: string };
type Account = { name: string; salt: string; hash: string; createdAt: number };

const ACCOUNTS_KEY = "nutridaily:accounts";
const SESSION_KEY = "nutridaily:session";
const listeners = new Set<() => void>();

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

let session: Session | null = read<Session | null>(SESSION_KEY, null);

function setSession(next: Session | null) {
  session = next;
  write(SESSION_KEY, next);
  listeners.forEach((l) => l());
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const normalizeEmail = (e: string) => e.trim().toLowerCase();
export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export async function signUp(name: string, emailRaw: string, password: string): Promise<string | null> {
  const email = normalizeEmail(emailRaw);
  const accounts = read<Record<string, Account>>(ACCOUNTS_KEY, {});
  if (accounts[email]) return "Email này đã có tài khoản. Hãy đăng nhập.";
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
  accounts[email] = { name: name.trim(), salt, hash: await hashPassword(password, salt), createdAt: Date.now() };
  write(ACCOUNTS_KEY, accounts);
  newSignup = email;
  setSession({ email, name: name.trim() });
  return null;
}

let newSignup: string | null = null;
/** true ngay sau khi tài khoản vừa được tạo (để mở màn Thiết lập). */
export function isNewSignup(email: string) {
  return newSignup === email;
}

export function clearNewSignup() {
  newSignup = null;
}

/** Tên gọi thân mật: từ cuối của họ tên ("Nguyễn Thảo Nhi" → "Nhi"). */
export function givenName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] || name;
}

export async function signIn(emailRaw: string, password: string): Promise<string | null> {
  const email = normalizeEmail(emailRaw);
  const acc = read<Record<string, Account>>(ACCOUNTS_KEY, {})[email];
  if (!acc || (await hashPassword(password, acc.salt)) !== acc.hash) return "Email hoặc mật khẩu chưa đúng.";
  setSession({ email, name: acc.name });
  return null;
}

export function signOut() {
  setSession(null);
}

/** Xóa tài khoản khỏi thiết bị (dùng khi người dùng xóa toàn bộ dữ liệu). */
export function deleteAccount(email: string) {
  const accounts = read<Record<string, Account>>(ACCOUNTS_KEY, {});
  delete accounts[email];
  write(ACCOUNTS_KEY, accounts);
  setSession(null);
}

export function useSession() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => session,
  );
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(-2).map((p) => p[0]).join("").toUpperCase() || "?";
}
