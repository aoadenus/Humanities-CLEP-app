$file = Join-Path $PSScriptRoot '..\apps\web\src\app\globals.css'
$css = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$oldBlock = '/* ── NotebookLM simple card'
$startIdx = $css.IndexOf($oldBlock)

$nextSection = '/* ── NotebookLM inline mid-read nudge'
$endIdx = $css.IndexOf($nextSection)

if ($startIdx -lt 0 -or $endIdx -lt 0) {
    Write-Host "Could not find CSS block: start=$startIdx end=$endIdx"
    exit 1
}

$before = $css.Substring(0, $startIdx)
$after  = $css.Substring($endIdx)

$newCss = @'
/* ── NotebookLM card ────────────────────────────────────────────────────── */
.nlm-card {
  background: linear-gradient(150deg, #FFFFFF 0%, #F4F0FF 100%);
  border: 1px solid #D8D0F0;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.nlm-card-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
}

@media (min-width: 768px) {
  .nlm-card-inner {
    flex-direction: row;
  }
}

.nlm-card-left {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nlm-card-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #6B5A7E;
}

.nlm-card-headline {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.55;
  margin: 0;
  max-width: 42ch;
}

.nlm-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  align-self: flex-start;
  background: #6B5A7E;
  color: #fff;
  border-radius: var(--radius-sm);
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: background 140ms, transform 140ms, box-shadow 140ms;
  box-shadow: 0 2px 8px rgba(107,90,126,0.22);
}

.nlm-card-btn:hover {
  background: #5A4A6B;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(107,90,126,0.30);
}

.nlm-card-right {
  flex: 1;
  padding: 20px 24px;
  border-top: 1px solid #D8D0F0;
  background: rgba(107,90,126,0.04);
}

@media (min-width: 768px) {
  .nlm-card-right {
    border-top: none;
    border-left: 1px solid #D8D0F0;
  }
}

.nlm-card-list-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9B8E82;
  margin-bottom: 10px;
}

.nlm-card-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.nlm-card-list li {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nlm-card-section {
  font-size: 12px;
  font-weight: 700;
  color: #5A4A6B;
  line-height: 1.4;
}

.nlm-card-detail {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

'@

$result = $before + $newCss + $after
[System.IO.File]::WriteAllText($file, $result, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"
