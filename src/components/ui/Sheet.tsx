import React, { useEffect, useRef } from "react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function Sheet({
  isOpen,
  onClose,
  title,
  children,
  triggerRef,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab" && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus into sheet
    const timeout = setTimeout(() => {
      if (sheetRef.current) {
        const first = sheetRef.current.querySelector<HTMLElement>("button, input");
        first?.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", handleKeyDown);
      // Return focus to trigger
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-end bg-brand-950/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Bảng hành động"}
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[440px] mx-auto rounded-t-xl bg-surface p-5 shadow-lg max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" aria-hidden="true" />
        {title && <h2 className="text-h2 font-bold text-ink mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
