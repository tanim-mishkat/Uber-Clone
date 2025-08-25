import React, { useCallback, useMemo, useRef, useState } from "react";
import { ToastCtx } from "./toastContext";

// Simple toast item
function Toast({ id, type, message, onClose }) {
  const icon = useMemo(() => {
    switch (type) {
      case "success":
        return (
          <svg
            className="shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 8v4m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "info":
      default:
        return (
          <svg
            className="shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 8h.01M11 12h2v6h-2zM12 2a10 10 0 110 20 10 10 0 010-20z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  }, [type]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-start gap-2 rounded-lg border bg-white shadow-lg px-3 py-2 text-sm text-gray-900 w-[min(92vw,360px)]"
    >
      <span
        className={
          type === "error"
            ? "text-red-600"
            : type === "success"
            ? "text-green-600"
            : "text-gray-700"
        }
      >
        {icon}
      </span>
      <div className="flex-1">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-2 text-gray-500 hover:text-black"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const recentRef = useRef(new Map()); // signature -> expiry
  const MAX = 3; // cap visible toasts
  const DEDUPE_MS = 1500;

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    ({ type = "info", message, timeout = 3000, key, replace = false }) => {
      if (!message) return null;

      // De-dupe identical messages spamming within a short window
      const sig = `${type}:${message}`;
      const now = Date.now();
      const exp = recentRef.current.get(sig) || 0;
      if (exp > now) {
        // already shown very recently
        return null;
      }
      recentRef.current.set(sig, now + DEDUPE_MS);

      setToasts((curr) => {
        let next = curr.slice();

        // If a key is provided, replace existing toast with same key
        if (key) {
          next = next.filter((t) => t.key !== key);
        } else if (replace) {
          next = []; // optional global replace behavior
        }

        const id = crypto.randomUUID();
        const toast = { id, key, type, message, timeout };

        // Enforce max size (drop oldest)
        if (next.length >= MAX) next.shift();

        next.push(toast);

        // schedule auto-dismiss
        if (timeout) {
          setTimeout(() => {
            dismiss(id);
          }, timeout);
        }

        return next;
      });

      return true;
    },
    [dismiss]
  );

  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      {/* Stack container */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            type={t.type}
            message={t.message}
            onClose={dismiss}
          />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export default ToasterProvider;
