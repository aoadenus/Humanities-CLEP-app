"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { CalloutBox } from "@/components/editorial/CalloutBox";
import { Card } from "@/components/editorial/Card";
import { ChartDiagram } from "@/components/editorial/ChartDiagram";
import { KeyTakeawayBox } from "@/components/editorial/KeyTakeawayBox";
import type { EditorialLearnPage, EditorialSection } from "@/lib/types";

// Filters out leaked authoring/machine-ID strings that should never render as body text
const MACHINE_ID_RE = /^(\w+\.s\d+\.[\w.-]+|M\d+-?S\d+-|objective[-_]id\b)/i;

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function estimateReadMinutes(blocks: EditorialLearnPage["blocks"]): number {
  const wordCount = blocks
    .filter((b) => b.type === "paragraph")
    .reduce((sum, b) => sum + (b as { type: "paragraph"; text: string }).text.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(wordCount / 200));
}

function buildLessonOutcomes(page: EditorialLearnPage, section: EditorialSection) {
  const headingOutcomes = page.blocks
    .filter((block): block is Extract<EditorialLearnPage["blocks"][number], { type: "heading" }> => block.type === "heading")
    .slice(0, 3)
    .map((block) => `Explain ${block.text.toLowerCase()}.`);

  if (headingOutcomes.length > 0) {
    return headingOutcomes;
  }

  return section.objectives.slice(0, 3).map((objective) => objective.label);
}

function TableOfContents({
  headings,
  activeId,
}: {
  headings: { id: string; text: string; level: 1 | 2 | 3 }[];
  activeId: string;
}) {
  if (!headings.length) return null;
  return (
    <nav aria-label="Page outline" className="space-y-1">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        On this page
      </div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={[
            "block truncate rounded-lg px-3 py-2 text-sm transition-colors",
            h.level === 3 ? "ml-3" : "",
            activeId === h.id
              ? "bg-[var(--bg-secondary)] font-bold text-[var(--text-primary)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          ].join(" ")}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

export function LearnPage({
  section,
  page,
}: {
  section: EditorialSection;
  page: EditorialLearnPage;
}) {
  const pageIndex = section.learnPages.findIndex((p) => p.id === page.id);
  const pageNumber = pageIndex + 1;
  const totalPages = section.learnPages.length;
  const lessonOutcomes = buildLessonOutcomes(page, section);

  // Strip machine-ID paragraphs before rendering
  const filteredBlocks = page.blocks.filter((b) => {
    if (b.type === "paragraph" && MACHINE_ID_RE.test(b.text.trim())) return false;
    return true;
  });

  const readMinutes = estimateReadMinutes(filteredBlocks);

  // Build heading list for TOC and progress tracking
  const headings = filteredBlocks
    .flatMap((block, index) => {
      if (block.type !== "heading") {
        return [];
      }

      return [{
        id: `${slugify(block.text)}-${index}`,
        text: block.text,
        level: block.level,
      }];
    });

  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const headingRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    headingRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings.length]);

  const activeHeadingIndex = headings.findIndex((h) => h.id === activeId);
  const headingProgress =
    headings.length > 1 ? Math.round(((activeHeadingIndex + 1) / headings.length) * 100) : 0;

  return (
    <div className="xl:grid xl:grid-cols-[1fr_220px] xl:items-start xl:gap-8">
      {/* Main content column */}
      <div className="min-w-0 space-y-6">
        {/* Hero card */}
        <Card className="surface-tint p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {page.emoji} {page.title}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 font-semibold">
                Part {pageNumber} of {totalPages}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 font-semibold">
                ~{readMinutes} min read
              </span>
            </div>
          </div>

          <h1 className="learn-heading-h1 mt-3 md:text-5xl">
            {section.title}
          </h1>

          {lessonOutcomes.length > 0 && (
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                On this lesson you should be able to
              </div>
              <ul className="space-y-1.5">
                {lessonOutcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="mt-0.5 shrink-0 font-bold text-[var(--accent)]">→</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mobile topics chips */}
          {headings.length > 1 && (
            <div className="mt-5 xl:hidden">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Topics on this page
              </div>
              <div className="flex flex-wrap gap-2">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                  >
                    {h.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Content blocks */}
        <div className="space-y-5">
          {filteredBlocks.map((block, index) => {
            if (block.type === "heading") {
              const id = `${slugify(block.text)}-${index}`;
              return (
                <Card key={`${block.type}-${index}`} className="p-6 md:p-7">
                  {block.level === 3 ? (
                    <h3
                      id={id}
                      ref={(el) => {
                        if (el) headingRefs.current.set(id, el);
                        else headingRefs.current.delete(id);
                      }}
                      className="learn-heading-h3 scroll-mt-24"
                    >
                      {block.text}
                    </h3>
                  ) : (
                    <h2
                      id={id}
                      ref={(el) => {
                        if (el) headingRefs.current.set(id, el);
                        else headingRefs.current.delete(id);
                      }}
                      className="learn-heading-h2 scroll-mt-24"
                    >
                      {block.text}
                    </h2>
                  )}
                </Card>
              );
            }

            if (block.type === "paragraph") {
              return (
                <Card key={`${block.type}-${index}`} className="p-6 md:p-7">
                  <p className="reading-body m-0 max-w-[72ch]">{block.text}</p>
                </Card>
              );
            }

            if (block.type === "callout") {
              return <CalloutBox key={`${block.type}-${index}`} callout={block.callout} />;
            }

            if (block.type === "key-takeaways") {
              return <KeyTakeawayBox key={`${block.type}-${index}`} takeaway={block.takeaway} />;
            }

            if (block.type === "mnemonic") {
              return (
                <div key={`${block.type}-${index}`} className="memory-aid-card">
                  <div className="memory-aid-chip">
                    🧠 Memory Aid
                  </div>
                  <div className="mt-3 text-2xl font-bold leading-tight text-[var(--text-primary)]">{block.mnemonic.label}</div>
                  <p className="mt-2 max-w-[72ch] text-[17px] leading-8 text-[var(--text-secondary)]">{block.mnemonic.purpose}</p>
                  <div className="memory-aid-divider" />
                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    Use it this way
                  </div>
                  <ul className="mt-3 space-y-2 pl-5 text-[16px] leading-8 text-[var(--text-primary)]">
                    {block.mnemonic.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (block.type === "resource") {
              return (
                <Card key={`${block.type}-${index}`} className="p-6">
                  <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    🖼️ Study Artifact
                  </div>
                  <div className="mt-3 text-2xl font-bold text-[var(--text-primary)]">{block.resource.title}</div>
                  <p className="mt-3 text-[17px] leading-7 text-[var(--text-secondary)]">
                    {block.resource.description ||
                      "Open the source in a new tab to inspect the artifact more closely."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {block.resource.source ? (
                      <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-sm font-semibold text-[var(--text-secondary)]">
                        {block.resource.source}
                      </span>
                    ) : null}
                    <Link
                      href={block.resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="button-secondary inline-flex items-center"
                    >
                      View Source ↗
                    </Link>
                  </div>
                </Card>
              );
            }

            return <ChartDiagram key={`${block.type}-${index}`} diagram={block.diagram} />;
          })}
        </div>
      </div>

      {/* Desktop TOC sidebar */}
      {headings.length > 1 && (
        <aside className="sticky top-6 hidden xl:block" aria-label="Page outline">
          <Card className="p-4">
            {headingProgress > 0 && (
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>Reading progress</span>
                  <span className="font-bold">{headingProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${headingProgress}%` }}
                  />
                </div>
              </div>
            )}
            <TableOfContents headings={headings} activeId={activeId} />
          </Card>
        </aside>
      )}
    </div>
  );
}
