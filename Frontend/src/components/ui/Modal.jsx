import React, { useEffect } from "react";
import ReactDOM from "react-dom";

/**
 * Minimal, clean modal.
 * Usage:
 *   <Modal open={open} onClose={()=>setOpen(false)} title="Title">
 *     <p>Body</p>
 *   </Modal>
 */
export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-x-4 top-[10%] mx-auto max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-black/5"
            aria-label="Close"
          >
            {/* X icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer ? <div className="px-4 py-3 border-t">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
