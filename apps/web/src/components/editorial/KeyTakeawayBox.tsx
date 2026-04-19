"use client";

import type { EditorialKeyTakeaway } from "@/lib/types";

import { Card } from "@/components/editorial/Card";

export function KeyTakeawayBox({
  takeaway,
}: {
  takeaway: EditorialKeyTakeaway;
}) {
  return (
    <Card className="border-l-4 border-l-[var(--accent)] bg-[var(--bg-secondary)] p-5">
      <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        📌 {takeaway.title}
      </div>
      <ul className="m-0 space-y-2 pl-5 text-[16px] leading-7 text-[var(--text-primary)]">
        {takeaway.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
