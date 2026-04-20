"use client";

export function StickyNav({
  prevHref,
  prevLabel,
  nextHref,
  nextLabel,
  nextDisabledLabel,
}: {
  prevHref?: string | null;
  prevLabel?: string;
  nextHref?: string | null;
  nextLabel?: string;
  nextDisabledLabel?: string;
}) {
  return (
    <div className="sticky-bottom-bar mt-10">
      <div className="mx-auto flex w-full max-w-[980px] items-center justify-between gap-4 px-4 py-4 md:px-8">
        {prevHref ? (
          <a href={prevHref} className="button-secondary inline-flex items-center">
            Back to {prevLabel ?? "Previous"}
          </a>
        ) : (
          <div />
        )}

        {nextHref ? (
          <a href={nextHref} className="button-primary inline-flex items-center">
            {nextLabel ?? "Next"}
          </a>
        ) : nextDisabledLabel ? (
          <button className="button-primary" disabled type="button">
            {nextDisabledLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
