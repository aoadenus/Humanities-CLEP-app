$file = Join-Path $PSScriptRoot '..\apps\web\src\app\globals.css'
$lines = [System.IO.File]::ReadAllLines($file, [System.Text.Encoding]::UTF8)

$before = $lines[0..469]
$after  = $lines[633..($lines.Length - 1)]

$newCss = @'
/* ── NotebookLM simple card ─────────────────────────────────────────────── */
.nlm-simple-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--info);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nlm-simple-top {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nlm-simple-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--info);
}

.nlm-simple-tagline {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.5;
}

.nlm-simple-link {
  font-size: 13px;
  color: var(--info);
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-all;
  transition: color 120ms;
}

.nlm-simple-link:hover { color: #1E3A6E; }

.nlm-simple-list {
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.nlm-simple-list-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.nlm-simple-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nlm-simple-list li {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.nlm-simple-section {
  font-weight: 700;
  color: var(--text-primary);
}

/* ── NotebookLM inline mid-read nudge ───────────────────────────────────── */
.nlm-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #EEF4FF 0%, #F0EBFF 100%);
  border: 1px solid #C8D8F8;
  border-left: 3px solid #3D5F96;
  border-radius: var(--radius-sm);
  padding: 11px 16px;
}

.nlm-inline-icon { font-size: 20px; flex-shrink: 0; line-height: 1; }

.nlm-inline-text { font-size: 13px; color: #2B3D6B; line-height: 1.5; flex: 1; }

.nlm-inline-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #3D5F96;
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 120ms;
  flex-shrink: 0;
}

.nlm-inline-link:hover { color: #1E3A6E; }
'@

$combined = $before + ($newCss -split "`n") + $after
[System.IO.File]::WriteAllLines($file, $combined, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done. Lines: $($combined.Length)"
