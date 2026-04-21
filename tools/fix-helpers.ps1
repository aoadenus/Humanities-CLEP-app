$file = Join-Path $PSScriptRoot '..\apps\web\src\content\editorial-course.ts'
$lines = [System.IO.File]::ReadAllLines($file, [System.Text.Encoding]::UTF8)

# Find the line index of "function formatCanonicalWorksAsH2"
$startIdx = -1
$endIdx = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function formatCanonicalWorksAsH2') { $startIdx = $i }
    if ($startIdx -ge 0 -and $i -gt $startIdx -and $lines[$i] -match '^function formatMnemonicsAsH2') {
        # find closing brace of formatMnemonicsAsH2
        for ($j = $i; $j -lt $lines.Length; $j++) {
            if ($lines[$j] -eq '}') { $endIdx = $j; break }
        }
        break
    }
}

if ($startIdx -lt 0 -or $endIdx -lt 0) {
    Write-Host "Could not find target range: startIdx=$startIdx endIdx=$endIdx"
    exit 1
}

Write-Host "Replacing lines $startIdx to $endIdx"

$em = [char]0x2014
$bull = [char]0x2022

$newBlock = @(
"function formatCanonicalWorksAsH2(block: string): string {",
"  if (!block.trim()) return `"`";",
"  const lines = block.split(`"\n`").map((l) => l.trim()).filter(Boolean);",
"  // The block-6 separator survives cleanText as literal ?\`" (mojibake for em-dash)",
"  const termLines = lines",
"    .filter((l) => /\?\`"|$em|--|$em$em/.test(l))",
"    .map((l) => l.replace(/\s*(\?\`"|$em{1,2}|--)\s*/g, `" $em `").trim())",
"    .filter(Boolean);",
"  if (!termLines.length) return `"`";",
"  return `"\nH2 $em Key People, Works, and Terms\n\n`" + termLines.join(`"\n`") + `"\n`";",
"}",
"",
"function formatCheatSheetAsH2(block: string): string {",
"  if (!block.trim()) return `"`";",
"  const lines = block.split(`"\n`").map((l) => l.trim()).filter(Boolean);",
"  const summaryLine = lines.find((l) => /^1-line:/i.test(l))?.replace(/^1-line:\s*/i, `"`").trim() ?? `"`";",
"  const highlights = lines.filter((l) => /^[-$bull*]/.test(l)).map((l) => l.replace(/^[-$bull*]\s*/, `"`"));",
"  if (!highlights.length && !summaryLine) return `"`";",
"  const parts = summaryLine ? [summaryLine, ...highlights] : highlights;",
"  return `"\nH2 $em Fast Review Checklist\n\n`" + parts.join(`"\n`") + `"\n`";",
"}",
"",
"function formatMnemonicsAsH2(block: string): string {",
"  if (!block.trim()) return `"`";",
"  const lines = block.split(`"\n`").map((l) => l.trim()).filter(Boolean);",
"  if (!lines.length) return `"`";",
"  return `"\nH2 $em Memory Aids\n\n`" + lines.join(`"\n`") + `"\n`";",
"}"
)

$before = $lines[0..($startIdx - 1)]
$after  = $lines[($endIdx + 1)..($lines.Length - 1)]
$combined = $before + $newBlock + $after

[System.IO.File]::WriteAllLines($file, $combined, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done. New line count: $($combined.Length)"
