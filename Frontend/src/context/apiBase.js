
export function apiBase() {
    const base = (import.meta.env?.VITE_BASE_URL || "")
        .trim()
        .replace(/\/+$/, ""); // strip trailing slashes
    if (!base) throw new Error("VITE_BASE_URL is not set");
    return base;
}

export function api(path = "") {
    const base = apiBase();
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
}
