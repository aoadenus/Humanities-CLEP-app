from __future__ import annotations

import json
import re
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = Path(__file__).resolve().parent / "output" / "source-index.json"
TEXT_EXTENSIONS = {".txt", ".md", ".html"}
RAW_EXTENSIONS = {".pdf", ".pptx", ".png", ".jpg", ".jpeg"}
SKIP_DIRS = {".venv", ".venv-1", "node_modules", ".next", ".git"}


def classify_source(path: Path) -> str:
    name = path.name.lower()
    if "clep" in name or "samplequestion" in name:
        return "exam-anchor"
    if "unit" in name or "modern" in name:
        return "course-import"
    if "sayre" in name or "fiero" in name:
        return "textbook"
    if path.suffix.lower() == ".html":
        return "html-asset"
    if path.suffix.lower() == ".pdf":
        return "raw-pdf"
    return "study-note"


def text_preview(path: Path) -> str:
    if path.suffix.lower() not in TEXT_EXTENSIONS:
      return ""

    content = path.read_text(encoding="utf-8", errors="ignore")
    if path.suffix.lower() == ".html":
        content = re.sub(r"<[^>]+>", " ", content)
    content = unescape(content)
    content = re.sub(r"\s+", " ", content).strip()
    return content[:350]


def main() -> None:
    items = []

    for path in ROOT.iterdir():
        if path.name in SKIP_DIRS or path.name in {"apps", "project-docs", "tools", "supabase"}:
            continue
        if path.is_dir():
            items.append(
                {
                    "path": path.name,
                    "type": "directory",
                    "classification": "raw-source-group",
                }
            )
            continue

        if path.suffix.lower() not in TEXT_EXTENSIONS | RAW_EXTENSIONS:
            continue

        items.append(
            {
                "path": path.name,
                "type": "file",
                "extension": path.suffix.lower(),
                "classification": classify_source(path),
                "bytes": path.stat().st_size,
                "preview": text_preview(path),
            }
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({"workspace": str(ROOT), "items": items}, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
