export interface EditorialSectionMeta {
  id: string;
  title: string;
  emoji: string;
  canonicalHeader?: string;
  anchors: string[];
}

export interface EditorialChapterBlueprint {
  id: string;
  title: string;
  emoji: string;
  color: string;
  locked: boolean;
  unlockWhenSectionsReady?: boolean;
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

export const EDITORIAL_CHAPTER_BLUEPRINTS: readonly EditorialChapterBlueprint[] = [
  {
    id: "ch1",
    title: "Classical",
    emoji: "🏛️",
    color: "var(--ch1-color)",
    locked: false,
    sourceFile: "CHAPTER 1 SECTION 1-6 TEACHABLE.md",
    sourceFallbackFiles: ["src/content/sources/CHAPTER 1 SECTION 1-6.txt"],
    sourceEnvVar: "EDITORIAL_CH1_SOURCE_FILE",
    sectionMeta: CHAPTER_1_SECTION_META,
  },
  {
    id: "ch2",
    title: "Medieval",
    emoji: "⚔️",
    color: "var(--ch2-color)",
    locked: true,
    unlockWhenSectionsReady: true,
    sourceFile: "CHAPTER 2 SECTION 1-6.txt",
    sourceEnvVar: "EDITORIAL_CH2_SOURCE_FILE",
    sectionMeta: [],
  },
  {
    id: "ch3",
    title: "Renaissance",
    emoji: "🎨",
    color: "var(--ch3-color)",
    locked: true,
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
