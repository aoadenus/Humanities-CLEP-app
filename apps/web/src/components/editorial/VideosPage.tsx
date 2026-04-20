"use client";

import { useState } from "react";
import Link from "next/link";

import { CalloutBox } from "@/components/editorial/CalloutBox";
import { Card } from "@/components/editorial/Card";
import type { EditorialSection, EditorialVideo } from "@/lib/types";

function isDirectImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);
}

function youtubeIdFromEmbed(embedUrl: string): string | null {
  const match = embedUrl.match(/youtube\.com\/embed\/([^?&/]+)/);
  return match?.[1] ?? null;
}

function VideoCard({ video }: { video: EditorialVideo }) {
  const [loaded, setLoaded] = useState(false);
  const youtubeId = youtubeIdFromEmbed(video.embedUrl);
  const thumbUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">🎬 Video</div>
          <div className="mt-1 text-xl font-bold leading-tight text-[var(--text-primary)]">{video.title}</div>
        </div>
        <Link
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="button-secondary inline-flex shrink-0 items-center text-sm"
        >
          Open in New Tab ↗
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
        {loaded ? (
          <div className="aspect-video">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              src={video.embedUrl}
              title={video.title}
            />
          </div>
        ) : (
          <button
            aria-label={`Play ${video.title}`}
            className="group relative flex aspect-video w-full cursor-pointer items-center justify-center bg-[var(--bg-secondary)] transition-colors hover:bg-[var(--bg-card)]"
            onClick={() => setLoaded(true)}
            type="button"
          >
            {thumbUrl ? (
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-90"
                loading="lazy"
                src={thumbUrl}
              />
            ) : null}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(0,0,0,0.72)] text-white shadow-lg transition-transform group-hover:scale-110">
              <svg
                className="h-7 w-7 translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="absolute bottom-3 left-3 right-3 z-10 truncate rounded-lg bg-[rgba(0,0,0,0.55)] px-3 py-1.5 text-sm font-semibold text-white">
              {video.title}
            </span>
          </button>
        )}
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
  );
}

export function VideosPage({ section }: { section: EditorialSection }) {
  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          🎬 Videos & Resources
        </div>
        <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{section.title}</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          Click any video to load the player. Resource links are listed below.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
            {section.videos.length} video{section.videos.length !== 1 ? "s" : ""}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
            {section.resources.length} resource{section.resources.length !== 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {section.videos.length > 0 && (
        <div className="space-y-6">
          {section.videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {section.resources.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            🖼️ Reference & Study Links
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {section.resources.map((resource) => (
              <Card key={resource.id} className="flex h-full flex-col p-5">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold leading-tight text-[var(--text-primary)]">{resource.title}</div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {resource.source ? (
                        <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-xs font-semibold text-[var(--text-muted)]">
                          {resource.source}
                        </span>
                      ) : null}
                      {resource.kind === "image" ? (
                        <span className="rounded-full bg-[var(--info-light,#e8f0fb)] px-2 py-0.5 text-xs font-semibold text-[var(--info,#4a6fa5)]">
                          Image
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {isDirectImageUrl(resource.url) ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <img alt={resource.title} className="h-auto w-full" loading="lazy" src={resource.url} />
                  </div>
                ) : null}

                <p className="mt-3 flex-1 text-[15px] leading-7 text-[var(--text-secondary)]">
                  {resource.description || "Open the source to inspect the artifact or reference material."}
                </p>
                <Link
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary mt-4 inline-flex self-start text-sm"
                >
                  Open Resource ↗
                </Link>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
