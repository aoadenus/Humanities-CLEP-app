"use client";

import type { EditorialCallout } from "@/lib/types";

const toneClass: Record<EditorialCallout["tone"], string> = {
  beginner: "callout-beginner",
  exam: "callout-exam",
  why: "callout-why",
  recognition: "callout-recognition",
  compare: "callout-compare",
  info: "callout-info",
};

export function CalloutBox({ callout }: { callout: EditorialCallout }) {
  return (
    <div className={`callout ${toneClass[callout.tone]}`.trim()}>
      <div className="callout-label">
        {callout.emoji} {callout.label}
      </div>
      <p className="m-0 text-[15px] leading-7 text-[var(--text-primary)]">{callout.text}</p>
    </div>
  );
}
