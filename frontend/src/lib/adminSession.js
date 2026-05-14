const ADMIN_SESSION_KEY = "gdms-admin-session";
const EVENTS_VERSION_KEY = "gdms-events-version";
const EVENTS_UPDATED_EVENT = "gdms:events-updated";

export function loadAdminSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getAdminToken() {
  return loadAdminSession()?.token || "";
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function broadcastEventsUpdated() {
  if (typeof window === "undefined") return;

  const version = String(Date.now());
  window.localStorage.setItem(EVENTS_VERSION_KEY, version);
  window.dispatchEvent(new CustomEvent(EVENTS_UPDATED_EVENT, { detail: { version } }));
}

export function subscribeToEventUpdates(callback) {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event) => callback(event.detail?.version || "");
  const handleStorageEvent = (event) => {
    if (event.key === EVENTS_VERSION_KEY && event.newValue) {
      callback(event.newValue);
    }
  };

  window.addEventListener(EVENTS_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(EVENTS_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
