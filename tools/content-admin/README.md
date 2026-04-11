# Content Admin Layer

This folder is for laptop-only source normalization.

## What belongs here

- local source indexing
- OCR backlog management
- mapping raw files to objectives
- backup/export helpers

## Current script

- `build_private_source_index.py`
- `export_published_backup.py`

`build_private_source_index.py` scans the workspace root, records raw-source metadata, and emits a private source index that is not consumed by the hosted app directly.

`export_published_backup.py` snapshots the normalized app content and Supabase migration files into a timestamped local backup folder.
