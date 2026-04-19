"use client";

export function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const width = `${Math.max(0, Math.min(100, Math.round(value * 100)))}%`;

  return (
    <div className={`progress-track h-3 w-full ${className}`.trim()}>
      <div className="progress-fill h-full" style={{ width }} />
    </div>
  );
}
