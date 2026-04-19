"use client";

import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/editorial/Card";
import { useEditorialProgress } from "@/components/editorial/editorial-progress-provider";
import type { EditorialSection, EditorialSectionProgress } from "@/lib/types";

function shuffleNumbers(values: number[]) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex]!;
    copy[swapIndex] = current!;
  }
  return copy;
}

export function FlashcardsPage({
  chapterId,
  section,
  sectionProgress,
}: {
  chapterId: string;
  section: EditorialSection;
  sectionProgress: EditorialSectionProgress | null;
}) {
  const { updateFlashcardPosition, toggleStar } = useEditorialProgress();
  const cards = section.flashcards;
  const [order, setOrder] = useState(() => cards.map((_, index) => index));
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const restoredIndex = Math.min(sectionProgress?.flashcardPosition ?? 0, Math.max(cards.length - 1, 0));
  const currentIndex = Math.min(manualIndex ?? restoredIndex, Math.max(cards.length - 1, 0));

  useEffect(() => {
    updateFlashcardPosition(chapterId, section.id, currentIndex);
  }, [chapterId, currentIndex, section.id, updateFlashcardPosition]);

  const currentCard = useMemo(() => {
    const resolvedIndex = order[currentIndex] ?? 0;
    return cards[resolvedIndex] ?? null;
  }, [cards, currentIndex, order]);

  const starred = currentCard
    ? (sectionProgress?.starredFlashcards ?? []).includes(currentCard.id)
    : false;

  const moveTo = (nextIndex: number) => {
    setFlipped(false);
    setManualIndex(Math.max(0, Math.min(nextIndex, cards.length - 1)));
  };

  if (!cards.length) {
    return (
      <Card className="p-8">
        <h1 className="font-reading text-3xl font-bold text-[var(--text-primary)]">Flashcards</h1>
        <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
          No flashcards were parsed from this section yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="surface-tint p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              🃏 Flashcards
            </div>
            <h1 className="font-reading mt-3 text-4xl font-bold text-[var(--text-primary)]">{section.title}</h1>
            <p className="mt-4 text-[18px] leading-8 text-[var(--text-secondary)]">
              One card at a time. Flip to reveal the back, move freely, shuffle the deck, and star cards you
              want to revisit later.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="button-secondary"
              onClick={() => {
                setOrder(shuffleNumbers(cards.map((_, index) => index)));
                setFlipped(false);
                setManualIndex(0);
              }}
              type="button"
            >
              Shuffle 🔀
            </button>
            {currentCard ? (
              <button
                className="button-secondary"
                onClick={() => toggleStar(chapterId, section.id, currentCard.id)}
                type="button"
              >
                {starred ? "★ Starred" : "☆ Star"}
              </button>
            ) : null}
          </div>
        </div>
      </Card>

      {currentCard ? (
        <div className="mx-auto max-w-[520px] space-y-5">
          <div className="flip-perspective">
            <button
              className="w-full border-0 bg-transparent p-0 text-left"
              onClick={() => setFlipped((value) => !value)}
              type="button"
            >
              <div className={`flip-inner h-[340px] ${flipped ? "is-flipped" : ""}`.trim()}>
                <Card className="flip-face absolute inset-0 flex h-full flex-col justify-between bg-[var(--bg-card)] p-8">
                  <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    <span>{currentCard.deck === "core" ? "Core 10" : "Extra 10"}</span>
                    <span>Tap to flip</span>
                  </div>
                  <div className="font-reading text-3xl font-bold leading-tight text-[var(--text-primary)]">
                    {currentCard.front}
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-secondary)]">Front</div>
                </Card>

                <Card className="flip-face flip-back absolute inset-0 flex h-full flex-col justify-between bg-[var(--highlight)] p-8">
                  <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    <span>{currentCard.deck === "core" ? "Core 10" : "Extra 10"}</span>
                    <span>Tap to flip</span>
                  </div>
                  <div className="text-[22px] font-semibold leading-9 text-[var(--text-primary)]">
                    {currentCard.back}
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-secondary)]">Back</div>
                </Card>
              </div>
            </button>
          </div>

          <div className="card flex items-center justify-between gap-3 p-4">
            <button
              className="button-secondary"
              disabled={currentIndex === 0}
              onClick={() => moveTo(currentIndex - 1)}
              type="button"
            >
              ← Prev
            </button>
            <div className="text-center text-sm font-bold text-[var(--text-secondary)]">
              Card {currentIndex + 1} of {cards.length}
            </div>
            <button
              className="button-secondary"
              disabled={currentIndex === cards.length - 1}
              onClick={() => moveTo(currentIndex + 1)}
              type="button"
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
