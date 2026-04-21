$file = Join-Path $PSScriptRoot '..\apps\web\src\app\globals.css'
$css = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Add emoji to sans and reading fallbacks so system emoji aren't blocked by the web font
$css = $css -replace 'font-family: var\(--font-sans\), sans-serif;', 'font-family: var(--font-sans), "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;'
$css = $css -replace 'font-family: var\(--font-reading\), serif;', 'font-family: var(--font-reading), "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", serif;'

[System.IO.File]::WriteAllText($file, $css, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"
