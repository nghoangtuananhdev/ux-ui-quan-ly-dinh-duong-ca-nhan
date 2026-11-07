import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export type ToastOptions = {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type ToastContextType = {
  showToast: (options: string | ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const timerRef = useRef<number | null>(null);

  const showToast = useCallback((options: string | ToastOptions) => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const current: ToastOptions =
      typeof options === "string" ? { text: options } : options;
    setToast(current);

    const duration = current.duration || (current.onAction ? 5000 : 3500);
    timerRef.current = window.setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, duration);
  }, []);

  const handleAction = () => {
    if (toast?.onAction) {
      toast.onAction();
    }
    setToast(null);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const phone = typeof document !== "undefined" ? document.querySelector(".phone-shell") : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && createPortal(
        <div
          role="status"
          aria-live="polite"
          className={`${phone ? "absolute" : "fixed"} bottom-[88px] left-4 right-4 z-50 mx-auto max-w-sm flex items-center justify-between gap-3 rounded-md bg-ink px-4 py-3 text-canvas shadow-lg duration-200`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white"
              aria-hidden="true"
            >
              <Icon name="check" size={14} />
            </span>
            <span className="text-body font-medium leading-snug break-words">{toast.text}</span>
          </div>

          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={handleAction}
              className="shrink-0 rounded px-2.5 py-1 text-label font-bold text-accent-500 hover:text-accent-100 hover:bg-white/10 transition-colors cursor-pointer"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>,
        phone ?? document.body
      )}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
