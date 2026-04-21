"use client";

import type { EditorialChapter } from "@/lib/types";

export function NotebookLmCard({ chapter }: { chapter: EditorialChapter }) {
  if (!chapter.notebookLmUrl) return null;

  return (
    <div className="nlm-card">
      <div className="nlm-card-inner">
        <div className="nlm-card-left">
          <div className="nlm-card-eyebrow">📓 NotebookLM — {chapter.title}</div>
          <p className="nlm-card-headline">
            Visit Notebook LM for cool slides, videos, flashcards and quizzes. Or ask the trained AI any questions.
          </p>
          <a className="nlm-card-btn" href={chapter.notebookLmUrl} rel="noreferrer" target="_blank">
            Open NotebookLM ↗
          </a>
        </div>

        {chapter.notebookLmSources && chapter.notebookLmSources.length > 0 && (
          <div className="nlm-card-right">
            <div className="nlm-card-list-label">Content Made</div>
            <ul className="nlm-card-list">
              {chapter.notebookLmSources.map((src) => (
                <li key={src.section ?? src.label}>
                  <span className="nlm-card-section">{src.section}</span>
                  <span className="nlm-card-detail">{src.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
