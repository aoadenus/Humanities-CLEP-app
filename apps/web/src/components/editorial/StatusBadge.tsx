"use client";

const TONE_STYLES = {
  complete: {
    background: "var(--success-light)",
    color: "var(--success)",
    border: "1px solid rgba(74,124,89,0.2)",
  },
  progress: {
    background: "var(--warning-light)",
    color: "var(--warning)",
    border: "1px solid rgba(212,168,67,0.22)",
  },
  locked: {
    background: "var(--bg-secondary)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
  },
  info: {
    background: "var(--info-light)",
    color: "var(--info)",
    border: "1px solid rgba(74,111,165,0.18)",
  },
} as const;

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof TONE_STYLES;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]"
      style={TONE_STYLES[tone]}
    >
      {label}
    </span>
  );
}
