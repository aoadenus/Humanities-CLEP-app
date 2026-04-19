$ErrorActionPreference = 'Stop'

$src = Join-Path $PWD 'CHAPTER 1 SECTION 1-6.txt'
$out = Join-Path $PWD 'CHAPTER 1 SECTION 1-6 TEACHABLE.md'

if (-not (Test-Path $src)) {
  throw "Source file not found: $src"
}

$lines = [System.IO.File]::ReadAllLines($src)
$markers = @()

for ($i = 0; $i -lt $lines.Length; $i++) {
  $m = [regex]::Match($lines[$i], '^\s*CREATE CHAPTER 1 SECTION\s+([1-6])\b', 'IgnoreCase')
  if ($m.Success) {
    $markers += [pscustomobject]@{
      Index = $i
      Section = [int]$m.Groups[1].Value
    }
  }
}

if ($markers.Count -eq 0) {
  throw 'No section markers found.'
}

$segments = @()
if ($markers[0].Index -gt 0) {
  $segments += [pscustomobject]@{
    Start = 0
    End = $markers[0].Index - 1
    Section = 0
    MarkerIndex = -1
  }
}

for ($j = 0; $j -lt $markers.Count; $j++) {
  $start = $markers[$j].Index
  $end = if ($j -lt $markers.Count - 1) { $markers[$j + 1].Index - 1 } else { $lines.Length - 1 }
  $segments += [pscustomobject]@{
    Start = $start
    End = $end
    Section = $markers[$j].Section
    MarkerIndex = $j
  }
}

$canonical = @{}
for ($s = 1; $s -le 5; $s++) {
  $seg = $segments | Where-Object { $_.Section -eq $s } | Select-Object -First 1
  if ($null -ne $seg) {
    $canonical[$s] = $seg
  }
}

$sec6 = $segments | Where-Object { $_.Section -eq 6 }
if ($sec6.Count -gt 0) {
  $canonical[6] = $sec6 | Select-Object -Last 1
}

$sb = New-Object System.Text.StringBuilder
$null = $sb.AppendLine('# Chapter 1 Sections 1-6 Teachable Master')
$null = $sb.AppendLine('')
$null = $sb.AppendLine('This file is a teachable normalization of the source draft.')
$null = $sb.AppendLine('')
$null = $sb.AppendLine('- Canonical Student Flow: one primary Section 1 through Section 6 sequence.')
$null = $sb.AppendLine('- Full Preservation: every source line from the original file appears exactly once in this document.')
$null = $sb.AppendLine('- Variant Handling: alternate drafts and planning/provenance text are preserved in appendices.')
$null = $sb.AppendLine('')
$null = $sb.AppendLine('## Suggested Use Order')
$null = $sb.AppendLine('1. Read each canonical section in order.')
$null = $sb.AppendLine('2. Use flashcards, quiz, and answer key in each section.')
$null = $sb.AppendLine('3. Use weakness maps, mnemonics, and cheat sheets for targeted review.')
$null = $sb.AppendLine('4. Use appendices for alternate drafts and provenance text.')
$null = $sb.AppendLine('')
$null = $sb.AppendLine('## Canonical Student Flow')

$usedMarkerIndices = New-Object 'System.Collections.Generic.HashSet[int]'
$canonicalPrefaces = @()
for ($s = 1; $s -le 6; $s++) {
  if (-not $canonical.ContainsKey($s)) { continue }
  $seg = $canonical[$s]
  [void]$usedMarkerIndices.Add([int]$seg.MarkerIndex)

  $canonicalStart = $seg.Start
  $firstLessonAnchor = -1
  for ($k = $seg.Start; $k -le $seg.End; $k++) {
    if ($lines[$k] -match '^\s*1\)\s') {
      $firstLessonAnchor = $k
      break
    }
  }

  if ($firstLessonAnchor -ge 0 -and $firstLessonAnchor -gt $seg.Start) {
    $canonicalStart = $firstLessonAnchor
    $canonicalPrefaces += [pscustomobject]@{
      Section = $s
      Start = $seg.Start
      End = $firstLessonAnchor - 1
    }
  }

  $null = $sb.AppendLine('')
  $null = $sb.AppendLine('---')
  $null = $sb.AppendLine('')
  $null = $sb.AppendLine("## Section $s (Canonical)")
  $null = $sb.AppendLine('')

  for ($k = $canonicalStart; $k -le $seg.End; $k++) {
    $null = $sb.AppendLine($lines[$k])
  }
}

$null = $sb.AppendLine('')
$null = $sb.AppendLine('---')
$null = $sb.AppendLine('')
$null = $sb.AppendLine('## Appendices: Alternate Drafts and Source Provenance')

$appendixIndex = 1

$preface = $segments | Where-Object { $_.Section -eq 0 }
if ($preface.Count -gt 0) {
  $p = $preface[0]
  $label = [char](65 + $appendixIndex - 1)
  $null = $sb.AppendLine('')
  $null = $sb.AppendLine("### Appendix ${label}: Source Preface / Setup Text")
  $null = $sb.AppendLine('')
  for ($k = $p.Start; $k -le $p.End; $k++) {
    $null = $sb.AppendLine($lines[$k])
  }
  $appendixIndex++
}

$canonicalPrefacesSorted = $canonicalPrefaces | Sort-Object Section
foreach ($cp in $canonicalPrefacesSorted) {
  $label = [char](65 + $appendixIndex - 1)
  $null = $sb.AppendLine('')
  $null = $sb.AppendLine("### Appendix ${label}: Canonical Section $($cp.Section) Preface and Setup Text")
  $null = $sb.AppendLine('')
  for ($k = $cp.Start; $k -le $cp.End; $k++) {
    $null = $sb.AppendLine($lines[$k])
  }
  $appendixIndex++
}

for ($j = 0; $j -lt $markers.Count; $j++) {
  if ($usedMarkerIndices.Contains($j)) { continue }

  $seg = $segments | Where-Object { $_.MarkerIndex -eq $j } | Select-Object -First 1
  if ($null -eq $seg) { continue }

  $label = [char](66 + $appendixIndex - 1)
  $null = $sb.AppendLine('')
  $null = $sb.AppendLine("### Appendix ${label}: Alternate Segment (Section $($seg.Section))")
  $null = $sb.AppendLine('')

  for ($k = $seg.Start; $k -le $seg.End; $k++) {
    $null = $sb.AppendLine($lines[$k])
  }

  $appendixIndex++
}

[System.IO.File]::WriteAllText($out, $sb.ToString())

Write-Output "Created: $out"
Write-Output "Source lines: $($lines.Length)"
Write-Output "Markers found: $($markers.Count)"
Write-Output "Segments: $($segments.Count)"
Write-Output "Canonical sections present: $((1..6 | Where-Object { $canonical.ContainsKey($_) }).Count)"
