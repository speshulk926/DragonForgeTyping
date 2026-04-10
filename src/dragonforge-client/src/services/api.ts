const API_BASE = import.meta.env.VITE_API_URL ?? "https://dragonforge-api.azurewebsites.net";

function getParentToken(): string | null {
  return localStorage.getItem("df_parent_token");
}

function getChildSession(): string | null {
  return localStorage.getItem("df_child_session");
}

export function setParentToken(token: string) {
  localStorage.setItem("df_parent_token", token);
}

export function setChildSession(token: string) {
  localStorage.setItem("df_child_session", token);
}

export function clearParentToken() {
  localStorage.removeItem("df_parent_token");
}

export function clearChildSession() {
  localStorage.removeItem("df_child_session");
}

export function isParentLoggedIn(): boolean {
  return !!getParentToken();
}

export function isChildLoggedIn(): boolean {
  return !!getChildSession();
}

async function parentFetch(path: string, options: RequestInit = {}) {
  const token = getParentToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearParentToken();
    throw new Error("Session expired");
  }
  return res;
}

export async function parentFetchJson(path: string, options: RequestInit = {}) {
  const res = await parentFetch(path, options);
  if (!res.ok) throw new Error("Request failed");
  if (options.method === "DELETE") return;
  return res.json();
}

async function childFetch(path: string, options: RequestInit = {}) {
  const session = getChildSession();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session ? { "X-Child-Session": session } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    clearChildSession();
    throw new Error("Session expired");
  }
  return res;
}

// === Auth ===

export async function registerParent(email: string, password: string, displayName: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Registration failed");
  setParentToken(data.token);
  return data as { token: string; displayName: string; userId: string };
}

export async function loginParent(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Login failed");
  setParentToken(data.token);
  return data as { token: string; displayName: string; userId: string };
}

export async function generateChildCode(childId: string) {
  const res = await parentFetch("/api/auth/child-code", {
    method: "POST",
    body: JSON.stringify({ childId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to generate code");
  return data as { code: string; expiresAt: string };
}

export async function childLogin(code: string) {
  const res = await fetch(`${API_BASE}/api/auth/child-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Invalid code");
  setChildSession(data.sessionToken);
  return data as { sessionToken: string; childId: string; displayName: string };
}

export async function parentPlay() {
  const res = await parentFetch("/api/auth/parent-play", { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to start game");
  setChildSession(data.sessionToken);
  return data as { sessionToken: string; childId: string; displayName: string };
}

export async function childLogout() {
  const session = getChildSession();
  if (session) {
    await fetch(`${API_BASE}/api/auth/child-logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Child-Session": session },
    }).catch(() => {});
  }
  clearChildSession();
}

// === Children (parent endpoints) ===

export async function getChildren() {
  const res = await parentFetch("/api/children");
  return res.json();
}

export async function createChild(displayName: string, avatarChoice?: string) {
  const res = await parentFetch("/api/children", {
    method: "POST",
    body: JSON.stringify({ displayName, avatarChoice }),
  });
  return res.json();
}

// === Game (child endpoints) ===

export async function getGameProfile() {
  const res = await childFetch("/api/game/profile");
  if (!res.ok) throw new Error("Failed to get profile");
  return res.json();
}

export async function submitAttempt(data: {
  levelNumber: number;
  wpm: number;
  accuracy: number;
  heartsRemaining: number;
  pointsAwarded: number;
  passed: boolean;
}) {
  const res = await childFetch("/api/game/attempt", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}
