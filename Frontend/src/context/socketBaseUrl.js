export function getBaseUrl() {
    const v = (import.meta.env?.VITE_BASE_URL || "").trim();
    if (v) return v.replace(/\/+$/, "");
    if (import.meta.env?.DEV) return "http://localhost:4000";
    throw new Error("VITE_BASE_URL is not set in production build.");
}
