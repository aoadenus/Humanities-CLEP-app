$ErrorActionPreference = 'Stop'

$path = 'c:\Users\adere\Downloads\Humanities Study App\apps\web\src\content\sources\ch3 Section 1-6 (Canonical).md'
$raw = Get-Content -Raw -Path $path

# Build mojibake tokens using Unicode escapes so script encoding cannot corrupt them.
$tokEmDash = "`u0393`u00C7`u00F6"
$tokEnDash = "`u0393`u00C7`u00F4"
$tokLq = "`u0393`u00C7`u00A3"
$tokRq = "`u0393`u00C7`u00A5"
$tokApos = "`u0393`u00C7`u2013"
$tokArrow = "`u0393`u00E5`u00C6"
$realEmDash = "`u2014"
$realEnDash = "`u2013"
$realLq = "`u201C"
$realRq = "`u201D"
$realApos = "`u2019"
$realArrow = "`u2192"

# Fix common mojibake artifacts.
$raw = $raw.Replace($tokEmDash, $realEmDash)
$raw = $raw.Replace($tokEnDash, $realEnDash)
$raw = $raw.Replace($tokLq, $realLq)
$raw = $raw.Replace($tokRq, $realRq)
$raw = $raw.Replace($tokApos, $realApos)
$raw = $raw.Replace($tokArrow, $realArrow)

$lines = $raw -split "`r?`n"
$out = New-Object System.Collections.Generic.List[string]
$arrowEsc = [regex]::Escape($realArrow)

foreach ($line in $lines) {
  if ($line -match "^(Core|Extra)\s+\d+\.\s+(.+?)\s+$arrowEsc\s+(.+)$") {
    $front = $matches[2].Trim()
    $back = $matches[3].Trim()
    $out.Add("Front: $front")
    $out.Add("Back: $back")
  } else {
    $out.Add($line)
  }
}

Set-Content -Path $path -Value $out -Encoding UTF8
Write-Output 'ch3 cleanup complete'
