"use client";

import Link from "next/link";

import { CalloutBox } from "@/components/editorial/CalloutBox";
import { Card } from "@/components/editorial/Card";
import type { EditorialSection } from "@/lib/types";

export function VideosPage({ section }: { section: EditorialSection }) {
  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🎬 Videos to Watch
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          Watch the embedded clips here or open them in a new tab. The resource cards below act as your
          artifact and image bank for this section.
        </p>
      </Card>

      <div className="space-y-6">
        {section.videos.map((video) => (
          <Card key={video.id} className="p-5 md:p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-xl font-bold text-[var(--text-primary)]">🎬 {video.title}</div>
              <Link href={video.url} target="_blank" rel="noreferrer" className="button-secondary inline-flex">
                Open in New Tab ↗
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="aspect-video">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  src={video.embedUrl}
                  title={video.title}
                />
              </div>
            </div>

            <div className="mt-4">
              <CalloutBox
                callout={{
                  tone: "exam",
                  label: "WATCH FOR",
                  emoji: "🎯",
                  text: video.watchFor,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🖼️ Resources & Image Links
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {section.resources.map((resource) => (
            <Card key={resource.id} className="h-full p-5">
              <div className="text-lg font-bold text-[var(--text-primary)]">{resource.title}</div>
              <div className="mt-2 text-sm font-semibold text-[var(--text-muted)]">
                {resource.source ?? "Reference"}
              </div>
              <p className="mt-3 text-[16px] leading-7 text-[var(--text-secondary)]">
                {resource.description || "Open the source to inspect the artifact or image collection."}
              </p>
              <Link
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="button-secondary mt-4 inline-flex"
              >
                Open in New Tab ↗
              </Link>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
