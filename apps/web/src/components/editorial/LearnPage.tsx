"use client";

import Link from "next/link";

import { CalloutBox } from "@/components/editorial/CalloutBox";
import { Card } from "@/components/editorial/Card";
import { ChartDiagram } from "@/components/editorial/ChartDiagram";
import { KeyTakeawayBox } from "@/components/editorial/KeyTakeawayBox";
import type { EditorialLearnPage, EditorialSection } from "@/lib/types";

export function LearnPage({
  section,
  page,
}: {
  section: EditorialSection;
  page: EditorialLearnPage;
}) {
  const paragraphBlocks = page.blocks.filter((block) => block.type === "paragraph").length;

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {page.emoji} {page.title}
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)] md:text-5xl">
          {section.title}
        </h1>
        <p className="mt-4 max-w-4xl text-[18px] leading-8 text-[var(--text-secondary)]">
          Read this page straight through, then move to the next material with the sticky controls below or the
          section menu above.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">
          <span>Text depth:</span>
          <span className="text-[var(--text-primary)]">{paragraphBlocks} full explanation paragraphs</span>
        </div>
      </Card>

      <div className="space-y-5">
        {page.blocks.map((block, index) => {
          if (block.type === "heading") {
            return (
              <Card key={`${block.type}-${index}`} className="p-6 md:p-7">
                <h2 className="font-reading text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                  📖 {block.text}
                </h2>
              </Card>
            );
          }

          if (block.type === "paragraph") {
            return (
              <Card key={`${block.type}-${index}`} className="p-6 md:p-7">
                <p className="reading-body m-0">{block.text}</p>
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
              <div key={`${block.type}-${index}`} className="mnemonic-card">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  🧠 Mnemonic
                </div>
                <div className="mt-2 text-3xl font-bold text-[var(--text-primary)]">{block.mnemonic.label}</div>
                <p className="mt-2 text-[17px] leading-7 text-[var(--text-secondary)]">{block.mnemonic.purpose}</p>
                <ul className="mt-4 space-y-2 pl-5 text-[16px] leading-7 text-[var(--text-primary)]">
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
                  {block.resource.description || "Open the source in a new tab to inspect the artifact more closely."}
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
  );
}
