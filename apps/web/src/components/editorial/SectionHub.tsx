"use client";

import Link from "next/link";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { StatusBadge } from "@/components/editorial/StatusBadge";
import { getMaterialStatus } from "@/components/editorial/editorial-progress-provider";
import { buildMaterialHref, getSectionProgressRatio } from "@/lib/editorial-navigation";
import type { EditorialSection, EditorialSectionProgress } from "@/lib/types";

export function SectionHub({
  chapterId,
  section,
  sectionProgress,
}: {
  chapterId: string;
  section: EditorialSection;
  sectionProgress: EditorialSectionProgress | null;
}) {
  if (!sectionProgress?.unlocked) {
    return (
      <Card className="p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🔒 Section Locked
        </div>
        <h1 className="font-reading mt-3 text-3xl font-bold text-[var(--text-primary)]">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          Finish the previous section hard test to unlock this section.
        </p>
      </Card>
    );
  }

  const ratio = getSectionProgressRatio(section, sectionProgress);

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {section.emoji} Section Hub
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">{section.purpose}</p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--text-secondary)]">
            <span>Progress through section materials</span>
            <span>{Math.round(ratio * 100)}%</span>
          </div>
          <ProgressBar value={ratio} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🎯 Objectives
        </div>
        <div className="flex flex-wrap gap-3">
          {section.objectives.map((objective) => (
            <span
              key={objective.id}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]"
            >
              {objective.label}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🧭 Materials
        </div>
        <p className="mb-5 text-[16px] leading-7 text-[var(--text-secondary)]">
          Materials stay open once you enter the section. Use the order below as the recommended path, but
          you can move back and forth freely. The hard test unlocks only after the quiz is passed.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {section.materials.map((material) => {
            const status = getMaterialStatus(sectionProgress, material.id);
            const locked = status === "locked";
            const tone = locked
              ? "locked"
              : status === "complete"
                ? "complete"
                : status === "in_progress"
                  ? "progress"
                  : "info";
            const label = locked
              ? "Locked"
              : status === "complete"
                ? "Complete"
                : status === "in_progress"
                  ? "In progress"
                  : "Ready";

            const cardBody = (
              <Card className={`h-full p-5 ${locked ? "opacity-70" : "transition-transform hover:-translate-y-1"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl">{material.emoji}</div>
                    <div className="mt-3 text-xl font-bold text-[var(--text-primary)]">{material.title}</div>
                  </div>
                  <StatusBadge label={label} tone={tone} />
                </div>
              </Card>
            );

            return locked ? (
              <div key={material.id}>{cardBody}</div>
            ) : (
              <Link
                href={buildMaterialHref(chapterId, section.id, material.id)}
                key={material.id}
                className="block"
              >
                {cardBody}
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
