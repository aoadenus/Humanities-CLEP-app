"use client";

import type { EditorialKeyTakeaway } from "@/lib/types";

import { Card } from "@/components/editorial/Card";

export function KeyTakeawayBox({
  takeaway,
}: {
  takeaway: EditorialKeyTakeaway;
}) {
  return (
    <Card className="key-takeaway-card p-5 md:p-6">
      <div className="key-takeaway-topline" />
      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        <span aria-hidden="true">📌</span>
        <span>{takeaway.title}</span>
      </div>
      <ul className="m-0 space-y-3 pl-5 text-[16px] leading-8 text-[var(--text-primary)]">
        {takeaway.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
