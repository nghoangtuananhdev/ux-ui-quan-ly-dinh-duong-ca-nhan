import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-line ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3.5 animate-pulse rounded bg-line ${
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-16 w-full animate-pulse rounded-lg bg-line/70 p-3 flex items-center gap-3 ${className}`}
      aria-hidden="true"
    >
      <div className="size-10 rounded-md bg-line" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-line" />
        <div className="h-3 w-1/3 rounded bg-line" />
      </div>
      <div className="h-4 w-12 rounded bg-line" />
    </div>
  );
}

export function SkeletonCircle({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`shrink-0 animate-pulse rounded-full bg-line ${className}`}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
