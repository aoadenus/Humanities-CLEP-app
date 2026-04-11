from __future__ import annotations

from datetime import datetime
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[2]
OUTPUT_ROOT = Path(__file__).resolve().parent / "output" / "backups"


def copy_if_exists(source: Path, destination: Path) -> None:
    if not source.exists():
        return

    if source.is_dir():
        shutil.copytree(source, destination, dirs_exist_ok=True)
    else:
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)


def main() -> None:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    target = OUTPUT_ROOT / stamp
    target.mkdir(parents=True, exist_ok=True)

    copy_if_exists(ROOT / "apps" / "web" / "src" / "content", target / "published-content")
    copy_if_exists(ROOT / "supabase" / "migrations", target / "supabase-migrations")
    copy_if_exists(ROOT / "apps" / "web" / ".env.example", target / "app" / ".env.example")

    print(f"Wrote backup to {target}")


if __name__ == "__main__":
    main()
