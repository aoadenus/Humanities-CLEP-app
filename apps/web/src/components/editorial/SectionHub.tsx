"use client";

import Link from "next/link";

import { Card } from "@/components/editorial/Card";
import { ProgressBar } from "@/components/editorial/ProgressBar";
import { StatusBadge } from "@/components/editorial/StatusBadge";
import { getMaterialStatus } from "@/components/editorial/editorial-progress-provider";
import { buildMaterialHref, getSectionProgressRatio } from "@/lib/editorial-navigation";
import type { EditorialSection, EditorialSectionProgress } from "@/lib/types";

function looksLikeImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);
}

function getVisiblePreviewUrl(url: string) {
  if (looksLikeImageUrl(url)) {
    return url;
  }

  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;
}

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
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          🔒 Section Locked
        </div>
        <h1 className="font-reading mt-3 text-3xl font-bold text-(--text-primary)">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-(--text-secondary)">
          Finish the previous section hard test to unlock this section.
        </p>
      </Card>
    );
  }

  const ratio = getSectionProgressRatio(section, sectionProgress);

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          {section.emoji} Section Hub
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-(--text-primary)">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-(--text-secondary)">{section.purpose}</p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-(--text-secondary)">
            <span>Progress through section materials</span>
            <span>{Math.round(ratio * 100)}%</span>
          </div>
          <ProgressBar value={ratio} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          📘 Full Student-Facing Section Guide
        </div>
        <p className="mb-5 text-[16px] leading-7 text-(--text-secondary)">
          This is the complete section guide text in reading order so no core lesson information is dropped,
          summarized, or rewritten into fragments.
        </p>
        <div className="student-guide-block">{section.studentGuide}</div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          🖼️ Embedded Section Images
        </div>
        <p className="mb-5 text-[16px] leading-7 text-(--text-secondary)">
          Every image link for this section is embedded below so visuals are visible directly in this chapter flow.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {section.resources
            .filter((resource) => resource.kind === "image")
            .map((resource) => (
              <Card key={resource.id} className="h-full p-5">
                <div className="text-lg font-bold text-(--text-primary)">{resource.title}</div>
                <div className="mt-2 text-sm font-semibold text-(--text-muted)">
                  {resource.source ?? "Reference"}
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-(--border) bg-(--bg-secondary)">
                  <img
                    alt={resource.title}
                    className="h-auto w-full"
                    loading="lazy"
                    src={getVisiblePreviewUrl(resource.url)}
                  />
                </div>
                <p className="mt-4 text-[15px] leading-7 text-(--text-secondary)">
                  {resource.description || "Embedded from the section image link list."}
                </p>
                <Link href={resource.url} target="_blank" rel="noreferrer" className="button-secondary mt-4 inline-flex">
                  Open Source ↗
                </Link>
              </Card>
            ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          🎯 Objectives
        </div>
        <div className="flex flex-wrap gap-3">
          {section.objectives.map((objective) => (
            <span
              key={objective.id}
              className="rounded-full border border-(--border) bg-(--bg-secondary) px-4 py-2 text-sm font-semibold text-(--text-secondary)"
            >
              {objective.label}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-(--text-muted)">
          🧭 Materials
        </div>
        <p className="mb-5 text-[16px] leading-7 text-(--text-secondary)">
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
                    <div className="mt-3 text-xl font-bold text-(--text-primary)">{material.title}</div>
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
