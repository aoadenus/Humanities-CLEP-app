export interface EditorialSectionMeta {
  id: string;
  title: string;
  emoji: string;
  canonicalHeader?: string;
  anchors: string[];
}

export interface NotebookLmSourceBlueprint {
  label: string;
  kind: "audio" | "video" | "quiz" | "flashcards" | "slides" | "report" | "guide" | "infographic" | "bundle";
  section?: string;
}

export interface NotebookLmReminderBlueprint {
  label: string;
  text: string;
}

export interface NotebookLmPromptBlueprint {
  label: string;
  prompt: string;
}

export interface EditorialChapterBlueprint {
  id: string;
  title: string;
  emoji: string;
  color: string;
  locked: boolean;
  unlockWhenSectionsReady?: boolean;
  notebookLmUrl?: string;
  notebookLmIntro?: string;
  notebookLmSources?: readonly NotebookLmSourceBlueprint[];
  notebookLmReminders?: readonly NotebookLmReminderBlueprint[];
  notebookLmPrompts?: readonly NotebookLmPromptBlueprint[];
  sourceFile?: string;
  sourceFallbackFiles?: string[];
  sourceEnvVar?: string;
  sectionMeta?: readonly EditorialSectionMeta[];
}

export const CHAPTER_1_SECTION_META = [
  {
    id: "s1",
    title: "From Survival to Culture",
    emoji: "🌍",
    canonicalHeader: "## Section 1 (Canonical)",
    anchors: [
      "I rebuilt this to match your locked Chapter 1 — Classical, Section 1 — From Survival to Culture scope",
      "Chapter 1 — Classical, Section 1 — From Survival to Culture",
      "Section 1 — From Survival to Culture",
    ],
  },
  {
    id: "s2",
    title: "Mesopotamia and Egypt",
    emoji: "🗿",
    canonicalHeader: "## Section 2 (Canonical)",
    anchors: [
      "Rebuilt for your current student-facing textbook engine: Chapter 1 — Classical, Section 2 — Mesopotamia and Egypt",
      "Section 2 — Mesopotamia and Egypt\n1) Section Relevance and Stakes",
      "Section 2 — Mesopotamia and Egypt",
    ],
  },
  {
    id: "s3",
    title: "Early Civilizations Beyond the Mediterranean",
    emoji: "🌏",
    canonicalHeader: "## Section 3 (Canonical)",
    anchors: [
      "Using your student-facing textbook engine and the verified-links-only rule, here is the rebuilt Chapter 1, Section 3",
      "Section 3 — China, India, and Africa: Early Civilizations\n1) Section Relevance and Stakes",
      "Section 3 — Early Civilizations Beyond the Mediterranean\n1) Section Relevance and Stakes",
      "Section 3 — Early Civilizations Beyond the Mediterranean",
    ],
  },
  {
    id: "s4",
    title: "The Aegean World and Greek Beginnings",
    emoji: "🌀",
    canonicalHeader: "## Section 4 (Canonical)",
    anchors: [
      "Section: Section 4 — The Aegean World and Greek Beginnings",
      "Section 4 — The Aegean World and Greek Beginnings\n1) Section Relevance and Stakes",
      "Section 4 — The Aegean World and Greek Beginnings",
    ],
  },
  {
    id: "s5",
    title: "Classical Greece",
    emoji: "🏛️",
    canonicalHeader: "## Section 5 (Canonical)",
    anchors: [
      "Section 5 — Classical Greece\n1) Section Relevance and Stakes",
      "Chapter 1, Section 5 = Classical Greece",
      "Section 5 — Classical Greece",
    ],
  },
  {
    id: "s6",
    title: "Rome",
    emoji: "🦅",
    canonicalHeader: "## Section 6 (Canonical)",
    anchors: [
      "Absolutely — here is a full redo of Chapter 1, Section 6 rebuilt around Rome: Urban Life and Imperial Majesty",
      "Chapter 1, Section 6\nRome: Urban Life and Imperial Majesty",
      "Section 6 — Rome\n1) Section Relevance and Stakes",
      "Section 6 — Rome",
    ],
  },
] as const satisfies readonly EditorialSectionMeta[];

export const CHAPTER_2_SECTION_META = [
  {
    id: "s1",
    title: "Late Rome, Judaism, and Christianity",
    emoji: "🏚️",
    canonicalHeader: "## Section 1 (Canonical)",
    anchors: ["Section 1 — Late Rome, Judaism, and Christianity", "Late Rome, Judaism, and Christianity"],
  },
  {
    id: "s2",
    title: "Byzantium",
    emoji: "✝️",
    canonicalHeader: "## Section 2 (Canonical)",
    anchors: ["Section 2 — Byzantium", "Byzantium"],
  },
  {
    id: "s3",
    title: "Rise and Spread of Islam",
    emoji: "☪️",
    canonicalHeader: "## Section 3 (Canonical)",
    anchors: ["Section 3 — Rise and Spread of Islam", "Rise and Spread of Islam"],
  },
  {
    id: "s4",
    title: "Fiefdom, Monastery, and Romanesque World",
    emoji: "⛪",
    canonicalHeader: "## Section 4 (Canonical)",
    anchors: ["Section 4 — Fiefdom, Monastery, and Romanesque World", "Fiefdom, Monastery, and Romanesque World"],
  },
  {
    id: "s5",
    title: "Gothic Age",
    emoji: "🏰",
    canonicalHeader: "## Section 5 (Canonical)",
    anchors: ["Section 5 — Gothic Age", "Gothic Age"],
  },
  {
    id: "s6",
    title: "Siena, Florence, and Global Medieval Worlds",
    emoji: "🌍",
    canonicalHeader: "## Section 6 (Canonical)",
    anchors: ["Section 6 — Siena, Florence, and Global Medieval Worlds", "Siena, Florence, and Global Medieval Worlds"],
  },
] as const satisfies readonly EditorialSectionMeta[];

export const CHAPTER_3_SECTION_META = [
  {
    id: "s1",
    title: "Florence and Early Renaissance Humanism",
    emoji: "🌸",
    canonicalHeader: "## Section 1 (Canonical)",
    anchors: ["Section 1 — Florence and Early Renaissance Humanism", "Florence and Early Renaissance Humanism"],
  },
  {
    id: "s2",
    title: "High Renaissance Rome and Venice",
    emoji: "🎨",
    canonicalHeader: "## Section 2 (Canonical)",
    anchors: ["Section 2 — High Renaissance Rome and Venice", "High Renaissance Rome and Venice"],
  },
  {
    id: "s3",
    title: "Northern Renaissance",
    emoji: "🪟",
    canonicalHeader: "## Section 3 (Canonical)",
    anchors: ["Section 3 — Northern Renaissance", "Northern Renaissance"],
  },
  {
    id: "s4",
    title: "Reformation",
    emoji: "📜",
    canonicalHeader: "## Section 4 (Canonical)",
    anchors: ["Section 4 — Reformation", "Reformation"],
  },
  {
    id: "s5",
    title: "Counter-Reformation and Mannerism",
    emoji: "⛪",
    canonicalHeader: "## Section 5 (Canonical)",
    anchors: ["Section 5 — Counter-Reformation and Mannerism", "Counter-Reformation and Mannerism"],
  },
  {
    id: "s6",
    title: "Encounter, Expansion, and Tudor England",
    emoji: "🌍",
    canonicalHeader: "## Section 6 (Canonical)",
    anchors: ["Section 6 — Encounter, Expansion, and Tudor England", "Encounter, Expansion, and Tudor England"],
  },
] as const satisfies readonly EditorialSectionMeta[];

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
      { section: "Chapter 3: Renaissance (Module-Wide)", label: "Senior Technical Study Guide", kind: "guide" },
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
    emoji: "🧭",
    color: "var(--ch6-color)",
    locked: true,
  },
] as const;