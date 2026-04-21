$root = Join-Path $PSScriptRoot '..'
$web = Join-Path $root 'apps\web\src'

# 1. Fix layout.tsx - add 800/900 weights and emoji fallback in body font-family
$layoutFile = Join-Path $web 'app\layout.tsx'
$layout = [System.IO.File]::ReadAllText($layoutFile, [System.Text.Encoding]::UTF8)
$layout = $layout -replace "weight: \[""400"", ""500"", ""600"", ""700""\]", 'weight: ["400", "500", "600", "700", "800", "900"]'
[System.IO.File]::WriteAllText($layoutFile, $layout, [System.Text.UTF8Encoding]::new($false))
Write-Host "layout.tsx done"

# 2. Fix ChapterOverview.tsx - remove variant prop
$coFile = Join-Path $web 'components\editorial\ChapterOverview.tsx'
$co = [System.IO.File]::ReadAllText($coFile, [System.Text.Encoding]::UTF8)
$co = $co -replace '<NotebookLmCard chapter=\{chapter\} variant="overview" />', '<NotebookLmCard chapter={chapter} />'
[System.IO.File]::WriteAllText($coFile, $co, [System.Text.UTF8Encoding]::new($false))
Write-Host "ChapterOverview.tsx done"

# 3. Fix Dashboard.tsx - remove variant prop
$dashFile = Join-Path $web 'components\editorial\Dashboard.tsx'
$dash = [System.IO.File]::ReadAllText($dashFile, [System.Text.Encoding]::UTF8)
$dash = $dash -replace '<NotebookLmCard chapter=\{chapter\} variant="dashboard" />', '<NotebookLmCard chapter={chapter} />'
[System.IO.File]::WriteAllText($dashFile, $dash, [System.Text.UTF8Encoding]::new($false))
Write-Host "Dashboard.tsx done"

# 4. Fix EditorialShell.tsx - LearnPage still uses notebookLmUrl prop, check LearnPage signature
$learnFile = Join-Path $web 'components\editorial\LearnPage.tsx'
$learn = [System.IO.File]::ReadAllText($learnFile, [System.Text.Encoding]::UTF8)
# Check if LearnPage accepts notebookLmUrl - if it has chapter prop instead, fix shell
if ($learn -match 'chapter: EditorialChapter') {
    # LearnPage expects chapter, fix EditorialShell to pass chapter
    $shellFile = Join-Path $web 'components\editorial\EditorialShell.tsx'
    $shell = [System.IO.File]::ReadAllText($shellFile, [System.Text.Encoding]::UTF8)
    $shell = $shell -replace '<LearnPage section=\{section\} page=\{page\} notebookLmUrl=\{chapter\.notebookLmUrl\} />', '<LearnPage chapter={chapter} section={section} page={page} />'
    [System.IO.File]::WriteAllText($shellFile, $shell, [System.Text.UTF8Encoding]::new($false))
    Write-Host "EditorialShell LearnPage fixed to use chapter prop"
} else {
    Write-Host "LearnPage uses notebookLmUrl - no change needed"
}

Write-Host "All done"
