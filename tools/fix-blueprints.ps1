$file = Join-Path $PSScriptRoot '..\apps\web\src\content\editorial-chapters.ts'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Find start of EDITORIAL_CHAPTER_BLUEPRINTS
$startMarker = 'export const EDITORIAL_CHAPTER_BLUEPRINTS'
$startIdx = $content.IndexOf($startMarker)
if ($startIdx -lt 0) { Write-Host "Could not find start marker"; exit 1 }

# Keep everything before the blueprints block
$before = $content.Substring(0, $startIdx)

$newBlueprints = @'
export const EDITORIAL_CHAPTER_BLUEPRINTS: readonly EditorialChapterBlueprint[] = [
  {
    id: "ch1",
    title: "Classical",
    emoji: "🏛️",
    color: "var(--ch1-color)",
    locked: false,
    notebookLmUrl: "https://notebooklm.google.com/notebook/b67bef6c-bd32-4971-8bfb-531e20135a2e",
    notebookLmSources: [
      { section: "Section 1 (Dawn of Culture)", label: "Audio Overview, Slide Deck, Video Overview, Quiz, and two sets of Flashcards", kind: "bundle" },
      { section: "Section 2 (Mesopotamia and Egypt)", label: "Video Overview, Slide Deck, Audio Overview, Quiz, and Flashcards", kind: "bundle" },
      { section: "Section 3 (Beyond the Mediterranean)", label: "Video Overview, Slide Deck, Audio Overview, Quiz, and Flashcards", kind: "bundle" },
      { section: "Section 4 (Aegean and Greek Beginnings)", label: "Slide Deck, Quiz, and Flashcards", kind: "bundle" },
      { section: "Section 5 (Classical Greece)", label: "Quiz and Flashcards", kind: "bundle" },
      { section: "Section 6 (Rome)", label: "Quiz and Flashcards", kind: "bundle" },
    ],
    sourceFile: "src/content/sources/CHAPTER 1 SECTION 1-6.CANONICAL.txt",
    sourceFallbackFiles: [
      "CHAPTER 1 SECTION 1-6 TEACHABLE.md",
      "src/content/sources/CHAPTER 1 SECTION 1-6.txt",
    ],
    sourceEnvVar: "EDITORIAL_CH1_SOURCE_FILE",
    sectionMeta: CHAPTER_1_SECTION_META,
  },
  {
    id: "ch2",
    title: "Medieval",
    emoji: "⚔️",
    color: "var(--ch2-color)",
    locked: false,
    unlockWhenSectionsReady: true,
    notebookLmUrl: "https://notebooklm.google.com/notebook/56f021fe-263e-4b5c-a8d9-3a4f0321dd5e",
    notebookLmSources: [
      { section: "Chapter 2: Medieval (Module-Wide)", label: "Flashcards, Quiz, Slide Deck, and Infographic", kind: "bundle" },
      { section: "Section 1 (Late Rome, Judaism, and Christianity)", label: "Tailored Report", kind: "report" },
      { section: "Section 2 (Byzantium)", label: "Tailored Report, Flashcards, and Quiz", kind: "bundle" },
      { section: "Section 3 (Rise and Spread of Islam)", label: "Tailored Report, Flashcards, Quiz, and Infographic", kind: "bundle" },
      { section: "Section 4 (Fiefdom, Monastery, and Romanesque World)", label: "Tailored Report", kind: "report" },
    ],
    sourceFile: "src/content/sources/CHAPTER 2 SECTION 1-6.CANONICAL.txt",
    sourceEnvVar: "EDITORIAL_CH2_SOURCE_FILE",
    sectionMeta: CHAPTER_2_SECTION_META,
  },
  {
    id: "ch3",
    title: "Renaissance",
    emoji: "🎨",
    color: "var(--ch3-color)",
    locked: false,
    unlockWhenSectionsReady: true,
    notebookLmUrl: "https://notebooklm.google.com/notebook/29e80e21-9c43-4ef8-b55c-2c1ef5521a20",
    notebookLmSources: [
      { section: "Section 1 (Florence and Early Renaissance Humanism)", label: "Video Overview and Supplemental Add-On", kind: "bundle" },
      { section: "Section 2 (High Renaissance Rome and Venice)", label: "Video Overview and Supplemental Add-On", kind: "bundle" },
      { section: "Section 3 (Northern Renaissance)", label: "Ask any questions, and build your own resources", kind: "guide" },
      { section: "Section 4 (The Reformation)", label: "Ask any questions, and build your own resources", kind: "guide" },
      { section: "Section 5 (Counter-Reformation and Mannerism)", label: "Ask any questions, and build your own resources", kind: "guide" },
      { section: "Section 6 (Encounter, Expansion, and Tudor England)", label: "Ask any questions, and build your own resources", kind: "guide" },
    ],
    sourceFile: "src/content/sources/ch3 Section 1-6 (Canonical).md",
    sourceEnvVar: "EDITORIAL_CH3_SOURCE_FILE",
    sectionMeta: CHAPTER_3_SECTION_META,
  },
  {
    id: "ch4",
    title: "Baroque & Enlightenment",
    emoji: "💡",
    color: "var(--ch4-color)",
    locked: true,
  },
  {
    id: "ch5",
    title: "19th Century",
    emoji: "🏭",
    color: "var(--ch5-color)",
    locked: true,
  },
  {
    id: "ch6",
    title: "20th Century & Beyond",
    emoji: "🌐",
    color: "var(--ch6-color)",
    locked: true,
  },
] as const;
'@

$result = $before + $newBlueprints
[System.IO.File]::WriteAllText($file, $result, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done"
