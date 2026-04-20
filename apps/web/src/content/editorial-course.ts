import fs from "node:fs";
import path from "node:path";

import {
  EDITORIAL_CHAPTER_BLUEPRINTS,
  type EditorialChapterBlueprint,
  type EditorialSectionMeta,
} from "@/content/editorial-chapters";
import type {
  EditorialCallout,
  EditorialChapter,
  EditorialCourse,
  EditorialDiagramDefinition,
  EditorialFlashcard,
  EditorialLearnPage,
  EditorialMaterial,
  EditorialMaterialId,
  EditorialMnemonic,
  EditorialObjective,
  EditorialQuestion,
  EditorialResource,
  EditorialSection,
  EditorialVideo,
} from "@/lib/types";


const MATERIALS: EditorialMaterial[] = [
  { id: "hub", title: "Section Hub", emoji: "🧭", type: "hub" },
  { id: "learn-1", title: "Learn 1", emoji: "📖", type: "learn" },
  { id: "learn-2", title: "Learn 2", emoji: "📖", type: "learn" },
  { id: "learn-3", title: "Learn 3", emoji: "📖", type: "learn" },
  { id: "learn-4", title: "Learn 4", emoji: "📖", type: "learn" },
  { id: "flashcards", title: "Flashcards", emoji: "🃏", type: "flashcards" },
  { id: "videos", title: "Videos & Resources", emoji: "🎬", type: "videos" },
  { id: "quiz", title: "Section Quiz", emoji: "📝", type: "quiz" },
  { id: "results", title: "Results", emoji: "📊", type: "results" },
  { id: "hard-test", title: "Hard Test", emoji: "🏆", type: "hard-test", lockedUntilQuizPass: true },
];

const BASE_MATERIALS_AFTER_LEARN = MATERIALS.filter(
  (material) => material.id !== "hub" && !material.id.startsWith("learn-"),
);

const DIAGRAMS: Record<string, EditorialDiagramDefinition> = {
  "ch1.s1": {
    id: "s1-flow",
    title: "From Symbol to Civilization",
    type: "flow",
    labels: ["Symbol", "Settlement", "Surplus", "Systems", "Civilization"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#5B4A3F",
    description: "The core progression from symbolic thought to organized culture.",
  },
  "ch1.s2": {
    id: "s2-compare",
    title: "Mesopotamia vs Egypt",
    type: "bar",
    labels: ["Writing", "Kingship", "Monumentality", "Law", "Afterlife"],
    values: [4, 5, 5, 4, 3],
    accentColor: "#4A6FA5",
    description: "A study comparison of the two major river-valley systems.",
  },
  "ch1.s3": {
    id: "s3-world",
    title: "China / India / Africa Foundations",
    type: "bar",
    labels: ["Writing", "Ritual", "Sacred Art", "Political Order", "Memory"],
    values: [5, 4, 5, 4, 4],
    accentColor: "#7B6B8D",
    description: "Shared civilization-building themes across three regions.",
  },
  "ch1.s4": {
    id: "s4-aegean",
    title: "Cycladic → Minoan → Mycenaean",
    type: "line",
    labels: ["Cycladic", "Minoan", "Mycenaean", "Homeric", "Polis"],
    values: [1, 3, 4, 3, 5],
    accentColor: "#4A7C59",
    description: "A fast timeline of the early Greek world.",
  },
  "ch1.s5": {
    id: "s5-athens",
    title: "Athens Civic System",
    type: "flow",
    labels: ["Polis", "Agora", "Drama", "Philosophy", "Sculpture"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#A3443A",
    description: "How public life and cultural forms reinforce one another in Athens.",
  },
  "ch1.s6": {
    id: "s6-rome",
    title: "Roman Systems",
    type: "flow",
    labels: ["Duty", "Law", "Forum", "Engineering", "Empire"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#D4A843",
    description: "A quick map of Rome as organized public culture.",
  },
  "ch2.s1": {
    id: "ch2-s1-flow",
    title: "Rome to Christian Rome",
    type: "flow",
    labels: ["Late Rome", "Judaism", "Christianity", "Constantine", "Basilica"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#6B4A3F",
    description: "The transformation from classical Rome into an early Christian world.",
  },
  "ch2.s2": {
    id: "ch2-s2-bar",
    title: "Byzantine Priorities",
    type: "bar",
    labels: ["Dome", "Mosaic", "Icon", "Empire", "Liturgy"],
    values: [5, 5, 5, 4, 4],
    accentColor: "#3D5F96",
    description: "What Byzantine art and architecture emphasize most.",
  },
  "ch2.s3": {
    id: "ch2-s3-bar",
    title: "Pillars of Islamic Culture",
    type: "bar",
    labels: ["Qur'an", "Mosque", "Mihrab", "Calligraphy", "Learning"],
    values: [5, 5, 4, 5, 4],
    accentColor: "#3D6B5A",
    description: "Core forms that structure early Islamic humanities.",
  },
  "ch2.s4": {
    id: "ch2-s4-flow",
    title: "Feudal and Monastic Order",
    type: "flow",
    labels: ["Lord", "Vassal", "Manor", "Monastery", "Pilgrimage"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#7B6B8D",
    description: "How medieval society organized land, memory, and sacred travel.",
  },
  "ch2.s5": {
    id: "ch2-s5-bar",
    title: "Gothic Structure",
    type: "bar",
    labels: ["Pointed Arch", "Rib Vault", "Flying Buttress", "Stained Glass", "Height"],
    values: [5, 5, 5, 5, 5],
    accentColor: "#4A5D8A",
    description: "The structural toolkit that makes Gothic cathedrals possible.",
  },
  "ch2.s6": {
    id: "ch2-s6-line",
    title: "Late Medieval Arc",
    type: "line",
    labels: ["Siena", "Dante", "Giotto", "Plague", "Global"],
    values: [2, 4, 5, 1, 3],
    accentColor: "#8B3A3A",
    description: "A fast arc through late medieval Italy and the wider medieval world.",
  },
};

const MEDIA_FALLBACKS: Record<string, { resources: Array<{ title: string; url: string }>; videos: Array<{ title: string; url: string }> }> = {
  "ch1.s1": {
    resources: [
      { title: "Smarthistory: Prehistoric Art Introduction", url: "https://smarthistory.org/prehistoric-art-an-introduction/" },
      { title: "Britannica: Stonehenge", url: "https://www.britannica.com/topic/Stonehenge" },
      { title: "British Museum Collection", url: "https://www.britishmuseum.org/collection" },
    ],
    videos: [
      { title: "YouTube: Smarthistory Prehistoric Art", url: "https://www.youtube.com/results?search_query=smarthistory+prehistoric+art" },
      { title: "YouTube: Neolithic Revolution Overview", url: "https://www.youtube.com/results?search_query=neolithic+revolution+overview" },
    ],
  },
  "ch1.s2": {
    resources: [
      { title: "Smarthistory: Ancient Mesopotamia", url: "https://smarthistory.org/tag/mesopotamia/" },
      { title: "Smarthistory: Ancient Egypt", url: "https://smarthistory.org/tag/ancient-egypt/" },
      { title: "Louvre: Code of Hammurabi", url: "https://www.louvre.fr/en/explore/the-palace/the-code-of-hammurabi" },
    ],
    videos: [
      { title: "YouTube: Mesopotamia and Egypt Overview", url: "https://www.youtube.com/results?search_query=mesopotamia+and+egypt+overview" },
      { title: "YouTube: Smarthistory Hammurabi", url: "https://www.youtube.com/results?search_query=smarthistory+hammurabi" },
    ],
  },
  "ch1.s3": {
    resources: [
      { title: "Smarthistory: Ancient China", url: "https://smarthistory.org/tag/china/" },
      { title: "Smarthistory: South Asia", url: "https://smarthistory.org/tag/south-asia/" },
      { title: "Smarthistory: Africa", url: "https://smarthistory.org/tag/africa/" },
    ],
    videos: [
      { title: "YouTube: Oracle Bones and Shang China", url: "https://www.youtube.com/results?search_query=oracle+bones+shang+china" },
      { title: "YouTube: Sanchi Stupa Overview", url: "https://www.youtube.com/results?search_query=sanchi+stupa+overview" },
    ],
  },
  "ch1.s6": {
    resources: [],
    videos: [],
  },
  "ch2.s1": {
    resources: [
      { title: "Smarthistory: Early Christian Art", url: "https://smarthistory.org/tag/early-christian/" },
      { title: "Smarthistory: Sarcophagus of Junius Bassus", url: "https://smarthistory.org/sarcophagus-of-junius-bassus/" },
    ],
    videos: [
      { title: "YouTube: Early Christian Art Overview", url: "https://www.youtube.com/results?search_query=smarthistory+early+christian+art" },
    ],
  },
  "ch2.s2": {
    resources: [
      { title: "Smarthistory: Byzantine Art", url: "https://smarthistory.org/tag/byzantine/" },
      { title: "Smarthistory: Hagia Sophia", url: "https://smarthistory.org/hagia-sophia-istanbul/" },
      { title: "Smarthistory: San Vitale", url: "https://smarthistory.org/san-vitale/" },
    ],
    videos: [
      { title: "YouTube: Smarthistory Hagia Sophia", url: "https://www.youtube.com/results?search_query=smarthistory+hagia+sophia" },
      { title: "YouTube: Justinian and Theodora Mosaics", url: "https://www.youtube.com/results?search_query=justinian+theodora+mosaics" },
    ],
  },
  "ch2.s3": {
    resources: [
      { title: "Smarthistory: Islamic Art Introduction", url: "https://smarthistory.org/arts-of-the-islamic-world-an-introduction/" },
      { title: "Smarthistory: Dome of the Rock", url: "https://smarthistory.org/the-dome-of-the-rock/" },
      { title: "Smarthistory: Great Mosque of Córdoba", url: "https://smarthistory.org/the-great-mosque-of-cordoba/" },
    ],
    videos: [
      { title: "YouTube: Dome of the Rock Overview", url: "https://www.youtube.com/results?search_query=smarthistory+dome+of+the+rock" },
      { title: "YouTube: Great Mosque of Córdoba", url: "https://www.youtube.com/results?search_query=smarthistory+great+mosque+cordoba" },
    ],
  },
  "ch2.s4": {
    resources: [
      { title: "Smarthistory: Romanesque Art", url: "https://smarthistory.org/tag/romanesque/" },
      { title: "Smarthistory: Book of Kells", url: "https://smarthistory.org/the-book-of-kells/" },
      { title: "Smarthistory: Bayeux Tapestry", url: "https://smarthistory.org/the-bayeux-tapestry/" },
    ],
    videos: [
      { title: "YouTube: Romanesque Overview", url: "https://www.youtube.com/results?search_query=smarthistory+romanesque" },
      { title: "YouTube: Bayeux Tapestry", url: "https://www.youtube.com/results?search_query=smarthistory+bayeux+tapestry" },
    ],
  },
  "ch2.s5": {
    resources: [
      { title: "Smarthistory: Gothic Art", url: "https://smarthistory.org/tag/gothic/" },
      { title: "Smarthistory: Chartres Cathedral", url: "https://smarthistory.org/chartres-cathedral/" },
      { title: "Smarthistory: Saint-Denis", url: "https://smarthistory.org/abbot-suger-and-the-abbey-church-of-saint-denis/" },
    ],
    videos: [
      { title: "YouTube: Gothic Architecture Overview", url: "https://www.youtube.com/results?search_query=smarthistory+gothic+architecture" },
      { title: "YouTube: Chartres Cathedral", url: "https://www.youtube.com/results?search_query=smarthistory+chartres+cathedral" },
    ],
  },
  "ch2.s6": {
    resources: [
      { title: "Smarthistory: Giotto, Arena Chapel", url: "https://smarthistory.org/giotto-arena-scrovegni-chapel/" },
      { title: "Smarthistory: Late Gothic Italy", url: "https://smarthistory.org/tag/late-gothic/" },
      { title: "Smarthistory: Song Dynasty Landscape", url: "https://smarthistory.org/tag/song-dynasty/" },
    ],
    videos: [
      { title: "YouTube: Giotto Arena Chapel", url: "https://www.youtube.com/results?search_query=smarthistory+giotto+arena+chapel" },
      { title: "YouTube: Song Dynasty Painting", url: "https://www.youtube.com/results?search_query=smarthistory+song+dynasty+painting" },
    ],
  },
};

let cachedCourse: EditorialCourse | null = null;

function sanitizeForLog(value: string) {
  return value.replace(/[\r\n\t]/g, " ").trim();
}

function normalizePathForComparison(value: string) {
  return path.resolve(value).replace(/\\/g, "/").toLowerCase();
}

function isPathWithinRoots(candidate: string, roots: readonly string[]) {
  const normalizedCandidate = normalizePathForComparison(candidate);
  return roots.some((root) => {
    const normalizedRoot = normalizePathForComparison(root);
    return normalizedCandidate === normalizedRoot || normalizedCandidate.startsWith(`${normalizedRoot}/`);
  });
}

function getWorkspaceRoots() {
  return [
    path.resolve(
      /* turbopackIgnore: true */ process.cwd(),
    ),
    path.resolve(
      /* turbopackIgnore: true */ process.cwd(),
      "..",
      "..",
    ),
  ] as const;
}

function getSourcePath(sourceFiles: readonly string[], sourceEnvVar?: string) {
  const workspaceRoots = getWorkspaceRoots();
  const envPath = sourceEnvVar ? (process.env[sourceEnvVar] ?? "") : "";
  const directEnvPath = envPath
    ? path.isAbsolute(envPath)
      ? envPath
      : path.resolve(
          /* turbopackIgnore: true */ process.cwd(),
          envPath,
        )
    : "";

  if (directEnvPath && !isPathWithinRoots(directEnvPath, workspaceRoots)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[editorial-course] ignored source override outside workspace: ${sanitizeForLog(envPath)}`);
    }
    return null;
  }

  const candidates = [directEnvPath, ...sourceFiles.flatMap((sourceFile) => [
    path.resolve(
      /* turbopackIgnore: true */ process.cwd(),
      sourceFile,
    ),
    path.resolve(
      /* turbopackIgnore: true */ process.cwd(),
      "..",
      "..",
      sourceFile,
    ),
  ])]
    .filter(Boolean)
    .filter((candidate): candidate is string => isPathWithinRoots(candidate, workspaceRoots));

  const uniqueCandidates = [...new Set(candidates)];

  for (const candidate of uniqueCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getSourceTexts(sourceFile: string, sourceEnvVar?: string, sourceFallbackFiles: readonly string[] = []) {
  const primaryPath = getSourcePath([sourceFile], sourceEnvVar);
  const fallbackPaths = sourceFallbackFiles
    .map((fallbackFile) => getSourcePath([fallbackFile]))
    .filter((value): value is string => Boolean(value));

  const candidatePaths = [...new Set([primaryPath, ...fallbackPaths].filter((value): value is string => Boolean(value)))];
  return candidatePaths.map((sourcePath) => ({
    sourcePath,
    text: fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n"),
  }));
}

function cleanText(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function paragraphize(value: string) {
  return cleanText(value)
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function findLastIndexOfAny(source: string, anchors: readonly string[]) {
  return anchors.reduce((max, anchor) => {
    const index = source.lastIndexOf(anchor);
    return index > max ? index : max;
  }, -1);
}

function findSectionStartIndex(source: string, meta: EditorialSectionMeta) {
  if (meta.canonicalHeader) {
    const headerIndex = source.indexOf(meta.canonicalHeader);
    if (headerIndex >= 0) {
      return headerIndex;
    }
  }

  return findLastIndexOfAny(source, meta.anchors);
}

function getSectionSlices(source: string, sectionMeta: readonly EditorialSectionMeta[]) {
  const starts = sectionMeta.map((meta) => {
    const index = findSectionStartIndex(source, meta);
    if (index < 0) {
      throw new Error(`Could not find marker for ${meta.id}.`);
    }
    return { ...meta, index };
  }).sort((left, right) => left.index - right.index);

  return starts.map((meta, index) => {
    const next = starts[index + 1];
    return {
      ...meta,
      raw: source.slice(meta.index, next ? next.index : source.length),
    };
  });
}

function extractNumberedBlock(raw: string, number: number, nextNumbers: number[] = []) {
  const startRegex = new RegExp(`(?:^|\\n)${number}\\)\\s+[^\\n]*\\n`, "i");
  const startMatch = raw.match(startRegex);
  if (!startMatch || startMatch.index === undefined) {
    return "";
  }

  const start = startMatch.index + startMatch[0].length;
  const remainder = raw.slice(start);

  if (!nextNumbers.length) {
    return cleanText(remainder);
  }

  const endRegex = new RegExp(
    `(?:^|\\n)(?:${nextNumbers.map((value) => `${value}\\)`).join("|")})\\s+[^\\n]*\\n`,
    "im",
  );
  const endMatch = remainder.match(endRegex);
  return cleanText(endMatch && endMatch.index !== undefined ? remainder.slice(0, endMatch.index) : remainder);
}

function extractNumberedBlockRaw(raw: string, number: number, nextNumbers: number[] = []) {
  const startRegex = new RegExp(`(?:^|\\n)${number}\\)\\s+[^\\n]*\\n`, "i");
  const startMatch = raw.match(startRegex);
  if (!startMatch || startMatch.index === undefined) {
    return "";
  }

  const start = startMatch.index + startMatch[0].length;
  const remainder = raw.slice(start);

  if (!nextNumbers.length) {
    return remainder.trim();
  }

  const endRegex = new RegExp(
    `(?:^|\\n)(?:${nextNumbers.map((value) => `${value}\\)`).join("|")})\\s+[^\\n]*\\n`,
    "im",
  );
  const endMatch = remainder.match(endRegex);

  return (endMatch && endMatch.index !== undefined ? remainder.slice(0, endMatch.index) : remainder).trim();
}

interface NumberedHeading {
  title: string;
  start: number;
  contentStart: number;
}

function getNumberedHeadings(raw: string): NumberedHeading[] {
  const headings: NumberedHeading[] = [];
  const regex = /(?:^|\n)(\d+)\)\s+([^\n]*)\n/gi;

  for (const match of raw.matchAll(regex)) {
    if (match.index === undefined) {
      continue;
    }

    headings.push({
      title: match[2]?.trim() ?? "",
      start: match.index + (match[0].startsWith("\n") ? 1 : 0),
      contentStart: match.index + match[0].length,
    });
  }

  return headings;
}

function extractHeadingBlocks(raw: string, titlePattern: RegExp) {
  const headings = getNumberedHeadings(raw);
  return headings
    .map((heading, index) => {
      const next = headings[index + 1];
      return {
        title: heading.title,
        block: cleanText(raw.slice(heading.contentStart, next ? next.start : raw.length)),
      };
    })
    .filter((entry) => titlePattern.test(entry.title));
}

function extractPurpose(raw: string) {
  const block =
    extractNumberedBlock(raw, 1, [2]) ||
    extractNumberedBlock(raw, 1, [3]) ||
    extractNumberedBlock(raw, 1, [4]);
  return paragraphize(block).slice(0, 2).join(" ");
}

function extractFoundationalContext(raw: string) {
  const blocks = [
    extractNumberedBlock(raw, 1, [2]),
    extractNumberedBlock(raw, 2, [3]),
    extractNumberedBlock(raw, 3, [4]),
    extractNumberedBlock(raw, 4, [5]),
  ].filter(Boolean);

  return paragraphize(blocks.join("\n\n"));
}

function humanizeTag(tag: string) {
  return tag
    .replace(/^\w+\./, "")
    .replace(/^rome\./, "")
    .replace(/^s\d+\./, "")
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeObjectiveTag(tag: string, sectionId: string) {
  // Normalize legacy "classical.rome." → "classical.s6."
  if (sectionId === "s6" && tag.startsWith("classical.rome.")) {
    return tag.replace("classical.rome.", "classical.s6.");
  }

  return tag;
}

function parseObjectives(raw: string, sectionId: string): EditorialObjective[] {
  const block =
    extractNumberedBlock(raw, 4, [5]) ||
    extractNumberedBlock(raw, 4, [6]) ||
    extractNumberedBlock(raw, 5, [6]);
  const lines = block.split("\n");
  const objectives: EditorialObjective[] = [];
  let currentId = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const tabColumns = trimmed.split(/\t+/).map((part) => part.trim()).filter(Boolean);
    const spacedColumns = tabColumns.length > 1
      ? tabColumns
      : trimmed.split(/\s{2,}/).map((part) => part.trim()).filter(Boolean);
    const objectiveFromTable = spacedColumns[0]?.match(/^\w+\.s\d+\.[\w.-]+$/i) ? {
      id: normalizeObjectiveTag(spacedColumns[0], sectionId),
      label: spacedColumns[1] ?? "",
    } : null;

    if (objectiveFromTable?.label) {
      objectives.push(objectiveFromTable);
      continue;
    }

    if (/^(\w+\.s\d+\.[\w.-]+|M\d-S\d-OBJ-\d+)\b/.test(trimmed)) {
      currentId = normalizeObjectiveTag(trimmed.split(/\s+/)[0], sectionId);
      continue;
    }

    if (/^(Plain-English objective|Objective)/i.test(trimmed)) {
      const label = trimmed.replace(/^(Plain-English objective|Objective):?\s*/i, "").trim();
      if (currentId && label) {
        objectives.push({ id: currentId, label });
        currentId = "";
      }
    }
  }

  if (objectives.length) {
    return objectives;
  }

  const tags = new Set<string>();
  for (const match of raw.matchAll(/\w+\.(?:rome|s\d)\.[\w.-]+/g)) {
    tags.add(normalizeObjectiveTag(match[0], sectionId));
  }

  return [...tags].slice(0, 10).map((tag) => ({
    id: tag,
    label: humanizeTag(tag),
  }));
}

function parseBigIdeas(raw: string) {
  const block = extractNumberedBlock(raw, 2, [3]);
  const chunks = cleanText(block)
    .split(/(?=Big Idea \d+)/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks.map((chunk, index) => {
    const lines = paragraphize(chunk);
    const titleLine = lines[0] ?? "";
    const title = titleLine.replace(/^Big Idea \d+\s*[-—:]\s*/i, "").trim() || `Big Idea ${index + 1}`;
    const bodyLines = lines.slice(1).filter((l) => !/^Big Idea \d+/i.test(l));
    const text = bodyLines[0]?.trim() || "";
    const tones: EditorialCallout["tone"][] = ["beginner", "exam", "why", "recognition", "compare", "info"];

    return {
      title,
      text,
      tone: tones[index % tones.length] ?? "info",
    };
  });
}

function splitIntoGroups<T>(items: T[], groups: number) {
  if (items.length <= groups) {
    return Array.from({ length: groups }, (_, index) => (index < items.length ? [items[index]] : []));
  }

  const result: T[][] = Array.from({ length: groups }, () => []);
  items.forEach((item, index) => {
    result[Math.min(groups - 1, Math.floor((index / items.length) * groups))].push(item);
  });
  return result;
}

function extractTextbook(raw: string) {
  const candidates = [
    extractNumberedBlock(raw, 5, [6, 7]),
    extractNumberedBlock(raw, 5, [10]),
    extractNumberedBlock(raw, 5, [8]),
  ];

  return cleanText(candidates.find(Boolean) ?? "");
}

function extractTextbookRaw(raw: string) {
  const candidates = [
    extractNumberedBlockRaw(raw, 5, [6, 7]),
    extractNumberedBlockRaw(raw, 5, [10]),
    extractNumberedBlockRaw(raw, 5, [8]),
  ];

  return candidates.find(Boolean) ?? "";
}

function extractStudentGuide(raw: string) {
  const textbookRaw = extractTextbookRaw(raw);
  if (!textbookRaw) {
    return "";
  }

  const h1Index = textbookRaw.search(/(?:^|\n)H1\s*[-—–:]/i);
  return cleanText(h1Index >= 0 ? textbookRaw.slice(h1Index) : textbookRaw);
}

function parseTakeaways(block: string) {
  const matches = [...block.matchAll(/Key Takeaways Box\s*\n([\s\S]*?)(?=(?:\nH2\s+[-—–]\s+)|$)/gi)];
  return matches.map((match) =>
    paragraphize(match[1])
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean),
  );
}

function parseMnemonics(raw: string): EditorialMnemonic[] {
  const block =
    extractNumberedBlock(raw, 20, [21, 22]) ||
    extractNumberedBlock(raw, 18, [19, 20]) ||
    extractNumberedBlock(raw, 17, [18, 19]);
  const lines = block.split("\n");
  const mnemonics: EditorialMnemonic[] = [];
  let current: EditorialMnemonic | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (/^[A-Z][A-Z0-9\s-]{1,20}$/.test(trimmed) && !trimmed.startsWith("Part ")) {
      if (current) {
        mnemonics.push(current);
      }
      current = {
        label: trimmed,
        purpose: "",
        lines: [],
      };
      continue;
    }

    if (current && !current.purpose) {
      current.purpose = trimmed;
      continue;
    }

    if (current) {
      current.lines.push(trimmed);
    }
  }

  if (current) {
    mnemonics.push(current);
  }

  return mnemonics.filter((mnemonic) => mnemonic.label && mnemonic.purpose);
}

function parseFlashcards(raw: string, sectionId: string): EditorialFlashcard[] {
  const lines = raw.split("\n");
  const cards: EditorialFlashcard[] = [];
  let deck: "core" | "extra" = "core";
  let pendingFront = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^Core 10$/i.test(trimmed)) {
      deck = "core";
      continue;
    }
    if (/^Extra 10$/i.test(trimmed)) {
      deck = "extra";
      continue;
    }
    if (/^Front:/i.test(trimmed)) {
      pendingFront = trimmed.replace(/^Front:\s*/i, "").trim();
      continue;
    }
    if (/^Back:/i.test(trimmed) && pendingFront) {
      cards.push({
        id: `${sectionId}-${deck}-${cards.length + 1}`,
        front: pendingFront,
        back: trimmed.replace(/^Back:\s*/i, "").trim(),
        deck,
      });
      pendingFront = "";
    }
  }

  return cards;
}

function parseAnswerEntries(block: string) {
  const lines = block.split("\n");
  const entries: Array<{ answer: string; explanation: string }> = [];
  let current: { answer: string; explanation: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const numbered = trimmed.match(/^\d+[.)]\s*([A-E])(?:\s*[-—]\s*(.*))?$/i);
    const plain = trimmed.match(/^([A-E])\s*[-—]\s*(.*)$/i);
    const match = numbered ?? plain;

    if (match) {
      if (current) {
        entries.push(current);
      }
      current = {
        answer: match[1].toUpperCase(),
        explanation: match[2]?.trim() ?? "",
      };
      continue;
    }

    if (current) {
      current.explanation = `${current.explanation} ${trimmed}`.trim();
    }
  }

  if (current) {
    entries.push(current);
  }

  return entries;
}

function parseQuestionBlock(
  block: string,
  answers: Array<{ answer: string; explanation: string }>,
  sectionId: string,
) {
  const lines = block.split("\n");
  const questions: EditorialQuestion[] = [];
  let questionLines: string[] = [];
  let options: string[] = [];
  let tags: string[] = [];
  let inlineAnswer = "";

  const flushQuestion = () => {
    if (!questionLines.length || options.length < 2) {
      questionLines = [];
      options = [];
      tags = [];
      inlineAnswer = "";
      return;
    }

    const answerEntry = answers[questions.length];
    const correctLetter = (answerEntry?.answer ?? inlineAnswer ?? "A").toUpperCase();
    const correct = "ABCDE".indexOf(correctLetter);

    questions.push({
      id: questions.length + 1,
      text: questionLines.join(" "),
      options,
      correct: correct >= 0 ? correct : 0,
      explanation: answerEntry?.explanation || "Review the linked lesson material and try again.",
      objectiveTags: tags,
      reviewMaterialIds: [],
    });

    questionLines = [];
    options = [];
    tags = [];
    inlineAnswer = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (options.length) {
        flushQuestion();
      }
      continue;
    }

    if (/^(Objective|Tags?):/i.test(trimmed)) {
      tags = trimmed
        .replace(/^(Objective|Tags?):/i, "")
        .split(",")
        .map((tag) => normalizeObjectiveTag(tag.trim(), sectionId))
        .filter(Boolean);
      continue;
    }

    const inlineAnswerMatch = trimmed.match(/^Answer:\s*([A-E])\b/i);
    if (inlineAnswerMatch) {
      inlineAnswer = inlineAnswerMatch[1].toUpperCase();
      continue;
    }

    const numberedQuestion = trimmed.match(/^\d+[.)]\s*(.+)$/);
    if (numberedQuestion) {
      if (options.length) {
        flushQuestion();
      } else {
        questionLines = [];
        tags = [];
        inlineAnswer = "";
      }

      questionLines = [numberedQuestion[1].trim()];
      continue;
    }

    const optionMatch = trimmed.match(/^[A-E][.)]\s+(.+)$/);
    if (optionMatch) {
      if (!questionLines.length) {
        questionLines = [`Question ${questions.length + 1}`];
      }
      options.push(optionMatch[1].trim());
      continue;
    }

    if (!options.length) {
      questionLines.push(trimmed);
    }
  }

  if (options.length) {
    flushQuestion();
  }

  return questions;
}

function getReviewMaterials(sectionId: string, tags: string[]) {
  const joined = tags.join(" ").toLowerCase();
  const mapping: Record<string, Array<[RegExp, EditorialMaterialId[]]>> = {
    s1: [
      [/(humanities|prehistoric|symbolic)/, ["learn-1"]],
      [/(paleolithic|neolithic|settlement|myth|surplus|agriculture)/, ["learn-2"]],
      [/(civilization|writing|memory|specialization|record)/, ["learn-3"]],
      [/(mesopotamia|egypt|classical_world|arc)/, ["learn-4"]],
    ],
    s2: [
      [/(mesopotamia|cuneiform|gilgamesh|ziggurat|sumer)/, ["learn-1", "learn-2"]],
      [/(egypt|pharaoh|maat|afterlife|pyramid)/, ["learn-3"]],
      [/(compare|object_recognition|monumentality)/, ["learn-4"]],
    ],
    s3: [
      [/(china|oracle|confucian|dao|qin|han)/, ["learn-1", "learn-2"]],
      [/(india|dharma|vedic|buddhist|hindu|maurya)/, ["learn-2", "learn-3"]],
      [/(africa|nok|ife|kingdom|compare)/, ["learn-4"]],
    ],
    s4: [
      [/(cycladic|minoan|crete|aegean)/, ["learn-1", "learn-2"]],
      [/(mycenaean|homer|heroic)/, ["learn-3"]],
      [/(polis|sanctuary|kouros|athens|democracy)/, ["learn-4"]],
    ],
    s5: [
      [/(polis|citizenship|democracy|agora|athens)/, ["learn-1"]],
      [/(acropolis|parthenon|orders|erechtheion)/, ["learn-2"]],
      [/(drama|tragedy|comedy|theater)/, ["learn-3"]],
      [/(philosophy|plato|aristotle|sculpture|hellenistic)/, ["learn-4"]],
    ],
    s6: [
      [/(roots|etruscan|pietas|republic|duty)/, ["learn-1"]],
      [/(portraiture|forum|public|augustus)/, ["learn-2"]],
      [/(engineering|arch|vault|concrete|colosseum|pantheon)/, ["learn-3"]],
      [/(literature|rome|empire|pompeii|self_definition)/, ["learn-4"]],
    ],
  };

  const matched = new Set<EditorialMaterialId>();
  for (const [pattern, materialIds] of mapping[sectionId] ?? []) {
    if (pattern.test(joined)) {
      for (const materialId of materialIds) {
        matched.add(materialId);
      }
    }
  }

  return (matched.size ? [...matched] : ["learn-1"]) as EditorialMaterialId[];
}

function parseQuiz(raw: string, sectionId: string) {
  const quizBlocks = extractHeadingBlocks(
    raw,
    /^(Practice Quiz|10-?Question(?:s)? Section Quiz|Section Quiz(?:\s*\(10 Questions\))?|10-QUESTION SECTION QUIZ)$/i,
  );
  const answerBlocks = extractHeadingBlocks(
    raw,
    /^(Answer Key(?: with (?:Full Teaching )?Explanations?)?|Detailed Answer Key|ANSWER KEY WITH EXPLANATIONS)$/i,
  );

  let bestQuestions: EditorialQuestion[] = [];
  for (const quizBlock of quizBlocks) {
    for (const answerBlock of answerBlocks.length ? answerBlocks : [{ title: "", block: "" }]) {
      const candidate = parseQuestionBlock(
        quizBlock.block,
        parseAnswerEntries(answerBlock.block),
        sectionId,
      ).map((question) => ({
        ...question,
        reviewMaterialIds: getReviewMaterials(sectionId, question.objectiveTags),
      }));

      if (candidate.length > bestQuestions.length) {
        bestQuestions = candidate;
      }
    }
  }

  return {
    questions: bestQuestions.slice(0, 10),
    passThreshold: 8,
  };
}

function parseHardTest(raw: string, sectionId: string, quizQuestions: EditorialQuestion[]) {
  const testBlocks = extractHeadingBlocks(
    raw,
    /^(10 (?:LATER )?(?:Later )?Test Questions|Challenge Questions(?:\s*\(10\))?|Hard Test(?:\s*\(10 Questions\))?)$/i,
  );
  const bestTestBlock = testBlocks.reduce((best, current) =>
    current.block.length > best.length ? current.block : best,
  "");

  if (!/[A-E][.)]\s+/.test(bestTestBlock)) {
    return {
      questions: quizQuestions.map((question) => ({
        ...question,
        id: question.id + 100,
      })),
      passThreshold: 8,
    };
  }

  const answers = [...bestTestBlock.matchAll(/Answer:\s*([A-E])/gi)].map((match) => ({
    answer: match[1].toUpperCase(),
    explanation: "Use the related lesson page and flashcards to reinforce this harder concept.",
  }));
  const strippedBlock = bestTestBlock.replace(/\nAnswer:\s*[A-E]\n?/gi, "\n");

  const questions: EditorialQuestion[] = parseQuestionBlock(strippedBlock, answers, sectionId).map(
    (question, index) => ({
      ...question,
      id: index + 101,
      reviewMaterialIds: getReviewMaterials(sectionId, question.objectiveTags),
    }),
  );

  return {
    questions: questions.length
      ? questions.slice(0, 10)
      : quizQuestions.map((question) => ({ ...question, id: question.id + 100 })),
    passThreshold: 8,
  };
}

function youtubeEmbedUrl(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function titleFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "");
    const pathPart = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
    const slug = decodeURIComponent(pathPart)
      .replace(/[-_]+/g, " ")
      .replace(/\.[a-z0-9]+$/i, "")
      .trim();

    if (slug) {
      return `${host}: ${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
    }

    return host;
  } catch {
    return "Reference";
  }
}

function sanitizeMediaTitle(title: string, url: string, fallbackPrefix: string, index: number) {
  const cleaned = title
    .replace(/^\[\d+\]\s*/g, "")
    .replace(/^[-*]\s*/g, "")
    .trim();

  if (!cleaned || /^(Reference|Resource\s*\d+|Video\s*\d+)$/i.test(cleaned)) {
    const fromUrl = titleFromUrl(url);
    return fromUrl && fromUrl !== "Reference" ? fromUrl : `${fallbackPrefix} ${index + 1}`;
  }

  return cleaned;
}

function scoreHeadingBlockForSection(block: string, sectionId: string) {
  const urlCount = (block.match(/https?:\/\//gi) ?? []).length;
  const supportTagRegex = sectionId === "s6"
    ? /\w+\.(?:s6|rome)\./gi
    : new RegExp(`\\w+\\.${sectionId}\\.`, "gi");
  const supportTagCount = (block.match(supportTagRegex) ?? []).length;
  const hintCount = (block.match(/\b(Link|Watch-for|Why|Supports|Linked)\b/gi) ?? []).length;
  return urlCount * 20 + supportTagCount * 5 + hintCount;
}

function parseEntriesWithExplicitLinks(block: string) {
  const entries = block
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => /(Link|URL|Source):/i.test(chunk));

  return entries.map((entry, index) => {
    const lines = entry.split("\n").map((line) => line.trim()).filter(Boolean);
    const title = lines[0] ?? `Resource ${index + 1}`;
    const linkLine = lines.find((line) => /^(Link|URL|Source):/i.test(line)) ?? "";
    const descriptionLine =
      lines.find((line) => /^(Why it matters|Why useful|Look at|Watch-for|What to notice):/i.test(line)) ?? "";

    return {
      title,
      url: linkLine.replace(/^(Link|URL|Source):\s*/i, "").trim(),
      description: descriptionLine.replace(/^(Why it matters|Why useful|Look at|Watch-for|What to notice):\s*/i, "").trim(),
    };
  });
}

function parseEntriesWithInlineUrls(block: string) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const entries: Array<{ title: string; url: string; description: string }> = [];

  for (const line of lines) {
    const urlMatch = line.match(/https?:\/\/\S+/i);
    if (!urlMatch) {
      continue;
    }

    const url = urlMatch[0].replace(/[).,;]+$/, "");
    const rawTitle = line
      .slice(0, urlMatch.index)
      .replace(/^[-*]\s*/, "")
      .replace(/[:\-–—]\s*$/, "")
      .trim();
    const title = sanitizeMediaTitle(rawTitle, url, "Reference", entries.length);

    entries.push({
      title,
      url,
      description: "",
    });
  }

  return entries;
}

function parseResourceSection(raw: string, sectionId: string, headerRegex: RegExp, kind: "image" | "resource") {
  const blocks = extractHeadingBlocks(raw, headerRegex);
  const bestBlock = blocks.reduce((best, current) => {
    const bestUrlCount = (best.match(/https?:\/\//gi) ?? []).length;
    const currentUrlCount = (current.block.match(/https?:\/\//gi) ?? []).length;
    if (currentUrlCount !== bestUrlCount) {
      return currentUrlCount > bestUrlCount ? current.block : best;
    }

    return scoreHeadingBlockForSection(current.block, sectionId) > scoreHeadingBlockForSection(best, sectionId)
      ? current.block
      : best;
  }, "");
  const parsedEntries = [
    ...parseEntriesWithExplicitLinks(bestBlock),
    ...parseEntriesWithInlineUrls(bestBlock),
  ];
  const seenUrls = new Set<string>();

  return parsedEntries
    .filter((entry) => {
      if (!entry.url || seenUrls.has(entry.url)) {
        return false;
      }
      seenUrls.add(entry.url);
      return true;
    })
    .map((entry, index) => {
      const title = sanitizeMediaTitle(entry.title, entry.url, "Resource", index);

    return {
      id: `${kind}-${index + 1}`,
      title,
      url: entry.url,
      source: title.includes("Smarthistory")
        ? "Smarthistory"
        : title.includes("British Museum")
          ? "British Museum"
          : title.includes("UNESCO")
            ? "UNESCO"
            : "Reference",
      description: entry.description,
      kind,
    };
  });
}

function parseVideos(raw: string, sectionId: string): EditorialVideo[] {
  const blocks = extractHeadingBlocks(raw, /^Link Videos(?: to Embed)?$/i);
  const bestBlock = blocks.reduce((best, current) => {
    const bestUrlCount = (best.match(/https?:\/\//gi) ?? []).length;
    const currentUrlCount = (current.block.match(/https?:\/\//gi) ?? []).length;
    if (currentUrlCount !== bestUrlCount) {
      return currentUrlCount > bestUrlCount ? current.block : best;
    }

    return scoreHeadingBlockForSection(current.block, sectionId) > scoreHeadingBlockForSection(best, sectionId)
      ? current.block
      : best;
  }, "");
  if (!bestBlock) {
    return [];
  }

  const parsedEntries = [
    ...parseEntriesWithExplicitLinks(bestBlock),
    ...parseEntriesWithInlineUrls(bestBlock),
  ];
  const seenUrls = new Set<string>();

  return parsedEntries
    .filter((entry) => {
      if (!entry.url || seenUrls.has(entry.url)) {
        return false;
      }
      seenUrls.add(entry.url);
      return true;
    })
    .map((entry, index) => {
      const title = sanitizeMediaTitle(entry.title, entry.url, "Video", index);
      const watchFor = entry.description;

      return {
        id: `video-${index + 1}`,
        title,
        url: entry.url,
        embedUrl: youtubeEmbedUrl(entry.url),
        watchFor: watchFor || "Watch for the main ideas and the terms that tie back to the lesson.",
      };
    });
}

function parseCheatSheet(raw: string) {
  const block =
    extractNumberedBlock(raw, 21, [22]) ||
    extractNumberedBlock(raw, 19, [20]) ||
    extractNumberedBlock(raw, 18, [19]);
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const filteredHighlights = lines.filter(
    (line) =>
      !/^(Part [AB]|Fast Cheat Sheet|App Implementation Guide|quick list|show 10-question|present the 10-question)/i.test(line),
  );
  const summaryLine =
    filteredHighlights.find((line) => /^(1-line|One-line|Summary)/i.test(line)) ??
    filteredHighlights[filteredHighlights.length - 1] ??
    "";

  return {
    summaryLine: summaryLine.replace(/^(1-line|One-line|Summary):?\s*/i, "").trim(),
    highlights: filteredHighlights
      .filter((line) => !/^(1-line|One-line|Summary|Mnemonic)/i.test(line))
      .slice(0, 7),
    mnemonics: parseMnemonics(raw).map((mnemonic) => `${mnemonic.label}: ${mnemonic.purpose}`),
  };
}

function parseRawUrls(raw: string) {
  const entries: Array<{ title: string; url: string }> = [];
  const lines = raw.split("\n").map((line) => line.trim());

  for (const line of lines) {
    const urlMatch = line.match(/https?:\/\/\S+/i);
    if (!urlMatch) {
      continue;
    }

    const url = urlMatch[0].replace(/[).,;]+$/, "");
    const rawTitle = line
      .slice(0, urlMatch.index)
      .replace(/^[-*]\s*/, "")
      .replace(/[:\-–—]\s*$/, "")
      .trim();
    const title = sanitizeMediaTitle(rawTitle, url, "Reference", entries.length);

    entries.push({ title, url });
  }

  return entries;
}

function ensureSectionMedia(
  raw: string,
  chapterId: string,
  sectionId: string,
  resources: EditorialResource[],
  videos: EditorialVideo[],
) {
  const resultResources = [...resources];
  const resultVideos = [...videos];
  const seenResourceUrls = new Set(resultResources.map((item) => item.url));
  const seenVideoUrls = new Set(resultVideos.map((item) => item.url));
  const resourceKind = (sectionId === "s6" ? "resource" : "image") as EditorialResource["kind"];

  for (const entry of parseRawUrls(raw)) {
    const isVideo = /youtube\.com|youtu\.be/i.test(entry.url);
    if (isVideo && !seenVideoUrls.has(entry.url) && resultVideos.length < 8) {
      resultVideos.push({
        id: `video-${resultVideos.length + 1}`,
        title: entry.title,
        url: entry.url,
        embedUrl: youtubeEmbedUrl(entry.url),
        watchFor: "Watch for how this example connects to section objectives.",
      });
      seenVideoUrls.add(entry.url);
      continue;
    }

    if (!isVideo && !seenResourceUrls.has(entry.url) && resultResources.length < 12) {
      resultResources.push({
        id: `image-${resultResources.length + 1}`,
        title: entry.title,
        url: entry.url,
        source: "Reference",
        description: "",
        kind: resourceKind,
      });
      seenResourceUrls.add(entry.url);
    }
  }

  const fallback = MEDIA_FALLBACKS[`${chapterId}.${sectionId}`];
  if (fallback) {
    for (const resource of fallback.resources) {
      if (resultResources.length >= 6 || seenResourceUrls.has(resource.url)) {
        continue;
      }
      resultResources.push({
        id: `image-${resultResources.length + 1}`,
        title: resource.title,
        url: resource.url,
        source: "Reference",
        description: "",
        kind: resourceKind,
      });
      seenResourceUrls.add(resource.url);
    }

    for (const video of fallback.videos) {
      if (resultVideos.length >= 3 || seenVideoUrls.has(video.url)) {
        continue;
      }
      resultVideos.push({
        id: `video-${resultVideos.length + 1}`,
        title: video.title,
        url: video.url,
        embedUrl: youtubeEmbedUrl(video.url),
        watchFor: "Watch for how this support material reinforces key section concepts.",
      });
      seenVideoUrls.add(video.url);
    }
  }

  return {
    resources: resultResources,
    videos: resultVideos,
  };
}

function buildCallout(text: string, index: number): EditorialCallout {
  const tones: EditorialCallout["tone"][] = ["beginner", "exam", "why", "recognition", "compare", "info"];
  const tone = tones[index % tones.length] ?? "info";
  const labels: Record<EditorialCallout["tone"], { label: string; emoji: string }> = {
    beginner: { label: "BEGINNER TIP", emoji: "💡" },
    exam: { label: "EXAM CLUE", emoji: "🎯" },
    why: { label: "WHY IT MATTERS", emoji: "⚡" },
    recognition: { label: "RECOGNITION CUE", emoji: "👁️" },
    compare: { label: "COMPARE", emoji: "⚖️" },
    info: { label: "STUDY NOTE", emoji: "📝" },
  };

  return {
    tone,
    label: labels[tone].label,
    emoji: labels[tone].emoji,
    text,
  };
}

interface TextbookH2Block {
  heading: string;
  bodyBlocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "subheading"; text: string }
  >;
  takeaways: string[];
}

interface SectionPagePlan {
  title: string;
  headingKeywords: string[];
}

const OUT_OF_PLACE_PARAGRAPH_PATTERNS = [
  /^INVOKE THIS NOW:?/i,
  /^THE STUDENT-VOICE RULES/i,
  /^THE\s+\d+\s+MANDATORY CONSTRAINTS/i,
  /^REQUIRED OUTPUT COMPONENTS/i,
  /^No\s+"Teacher Talk"/i,
  /^Role:\s+/i,
  /^Mission:\s+/i,
  /^Stopped thinking$/i,
  /^Quick answer$/i,
  /^Pasted text/i,
  /^Document$/i,
];

const SECTION_PAGE_ARCHITECTURE: Record<string, SectionPagePlan[]> = {
  "ch1.s1": [
    { title: "Meaning and Symbols", headingKeywords: ["humanities", "prehistory", "symbol", "paleolithic"] },
    { title: "Settlement and Civilization", headingKeywords: ["neolithic", "agriculture", "civilization", "megalith"] },
    { title: "Writing and Foundations", headingKeywords: ["writing", "mesopotamia", "egypt"] },
    { title: "Classical Long Arc", headingKeywords: ["classical", "long development", "long arc"] },
  ],
  "ch1.s2": [
    { title: "River Civilizations", headingKeywords: ["river", "surplus", "city-state", "temple"] },
    { title: "Mesopotamian Systems", headingKeywords: ["mesopotamia", "ziggurat", "hammurabi", "ur"] },
    { title: "Egyptian Systems", headingKeywords: ["egypt", "pharaoh", "pyramid", "afterlife", "maat"] },
    { title: "Power and Comparison", headingKeywords: ["compare", "contrast", "kingship", "divine", "state"] },
  ],
  "ch1.s3": [
    { title: "China Foundations", headingKeywords: ["china", "shang", "oracle", "confucian", "dao"] },
    { title: "India Foundations", headingKeywords: ["india", "dharma", "gita", "stupa", "nataraja"] },
    { title: "Africa Foundations", headingKeywords: ["africa", "nok", "ife", "zimbabwe"] },
    { title: "Cross-Civilization Logic", headingKeywords: ["compare", "shared", "cross", "civilization"] },
  ],
  "ch1.s4": [
    { title: "Aegean Beginnings", headingKeywords: ["aegean", "cycladic", "trade", "island"] },
    { title: "Minoan and Mycenaean", headingKeywords: ["minoan", "mycenaean", "knossos", "lion gate"] },
    { title: "Myth and Memory", headingKeywords: ["homer", "iliad", "odyssey", "myth"] },
    { title: "Toward the Polis", headingKeywords: ["polis", "sanctuary", "kouros", "athens"] },
  ],
  "ch1.s5": [
    { title: "Polis and Democracy", headingKeywords: ["polis", "citizenship", "democracy", "agora"] },
    { title: "Architecture and Space", headingKeywords: ["acropolis", "parthenon", "order", "erechtheion"] },
    { title: "Drama and Thought", headingKeywords: ["drama", "tragedy", "comedy", "plato", "aristotle", "socrates"] },
    { title: "Classical Forms", headingKeywords: ["contrapposto", "doryphoros", "diskobolos", "sculpture"] },
  ],
  "ch1.s6": [
    { title: "Roman Identity", headingKeywords: ["rome", "roots", "identity", "pietas", "patronage"] },
    { title: "Public Space and Power", headingKeywords: ["forum", "colosseum", "spectacle", "public"] },
    { title: "Engineering and Architecture", headingKeywords: ["arch", "vault", "concrete", "pantheon"] },
    { title: "Literature and Legacy", headingKeywords: ["aeneid", "virgil", "law", "legacy", "empire"] },
  ],
  "ch2.s1": [
    { title: "Rome Transforms", headingKeywords: ["late rome", "roman setting", "roman world"] },
    { title: "Jewish Foundations", headingKeywords: ["judaism", "jewish", "scripture", "emergence", "christianity"] },
    { title: "Public Christianity", headingKeywords: ["constantine", "public christianity", "basilica"] },
    { title: "Art and Thought", headingKeywords: ["iconography", "symbol", "augustine", "boethius", "christian mind"] },
  ],
  "ch2.s2": [
    { title: "Eastern Capital", headingKeywords: ["constantinople", "eastern roman", "byzantine empire"] },
    { title: "Imperial Vision", headingKeywords: ["justinian", "theodora", "ravenna", "san vitale", "imperial"] },
    { title: "Hagia Sophia", headingKeywords: ["hagia sophia", "pendentive", "dome", "structure", "light"] },
    { title: "Images and Conflict", headingKeywords: ["mosaic", "icon", "iconoclasm", "sacred image"] },
  ],
  "ch2.s3": [
    { title: "Foundations of Islam", headingKeywords: ["muhammad", "revelation", "birth of islam", "hijra"] },
    { title: "Qur'an and Word", headingKeywords: ["qur'an", "quran", "arabic", "prestige of writing"] },
    { title: "Sacred Space", headingKeywords: ["mosque", "mihrab", "minbar", "dome of the rock", "córdoba", "cordoba"] },
    { title: "Learning and Culture", headingKeywords: ["al-andalus", "islamic spain", "scholarship", "literary culture"] },
  ],
  "ch2.s4": [
    { title: "Feudal Order", headingKeywords: ["lord", "vassal", "feudal", "medieval society"] },
    { title: "Monastic Life", headingKeywords: ["monastery", "scriptorium", "memory", "carolingian"] },
    { title: "Manuscripts and Epic", headingKeywords: ["manuscript", "medieval book", "heroic", "kells", "beowulf", "roland"] },
    { title: "Pilgrimage and Castle", headingKeywords: ["pilgrimage", "relic", "romanesque", "saint-sernin", "castle", "courtly", "bayeux"] },
  ],
  "ch2.s5": [
    { title: "Birth of Gothic", headingKeywords: ["saint-denis", "suger", "birth of gothic"] },
    { title: "Gothic Structure", headingKeywords: ["pointed arch", "rib vault", "flying buttress"] },
    { title: "Cathedrals", headingKeywords: ["chartres", "sculpture", "stained glass", "cathedral", "urban"] },
    { title: "Thought and Universities", headingKeywords: ["university", "scholasticism", "aquinas", "thomas"] },
  ],
  "ch2.s6": [
    { title: "Italian Cities", headingKeywords: ["siena", "florence", "urban turn"] },
    { title: "Dante and Giotto", headingKeywords: ["dante", "vernacular", "giotto", "sacred narrative", "moral"] },
    { title: "Plague and Fragility", headingKeywords: ["black death", "plague", "fragility"] },
    { title: "Global Medieval", headingKeywords: ["china", "japan", "africa", "americas", "before 1400", "global"] },
  ],
};

function extractTextbookH2Blocks(textbook: string): TextbookH2Block[] {
  const normalized = cleanText(textbook);
  if (!normalized) {
    return [];
  }

  const structuredChunks = normalized
    .replace(/^H1\s*[-:\u2014\u2013]\s+.+$/im, "")
    .trim()
    .split(/(?=^H2\s+[-:\u2014\u2013]\s+)/gim)
    .filter(Boolean);

  return structuredChunks.map((chunk) => {
    const parsedHeadingMatch = chunk.match(/^H2\s+[-:\u2014\u2013]\s+(.+)$/im);
    const parsedBody = cleanText(
      chunk
        .replace(/^H2\s+[-:\u2014\u2013]\s+.+$/im, "")
        .replace(/\nKey Takeaways Box\s*\n[\s\S]*$/i, ""),
    );
    const heading = parsedHeadingMatch?.[1]?.trim() ?? inferFallbackHeadingFromBody(parsedBody);
    const takeaways = parseTakeaways(chunk).flat();
    return {
      heading,
      bodyBlocks: paragraphize(parsedBody).flatMap((paragraph) => {
        const lines = paragraph
          .split("\n")
          .map((line) => cleanText(line))
          .filter(Boolean);
        const firstLine = lines[0] ?? "";
        const h3Match = firstLine.match(/^H3\s*[-:\u2014\u2013]\s+(.+)$/i);

        if (!h3Match) {
          return [{ type: "paragraph" as const, text: cleanText(lines.join("\n")) }];
        }

        const blocks: TextbookH2Block["bodyBlocks"] = [{ type: "subheading", text: h3Match[1].trim() }];
        const remainder = cleanText(lines.slice(1).join("\n"));
        if (remainder) {
          blocks.push({ type: "paragraph", text: remainder });
        }
        return blocks;
      }),
      takeaways,
    };
  });
}

function isOutOfPlaceParagraph(paragraph: string) {
  const trimmed = paragraph.trim();
  return OUT_OF_PLACE_PARAGRAPH_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function sanitizeParagraphsForLearnFlow(paragraphs: string[]) {
  return paragraphs
    .map((paragraph) => cleanText(paragraph))
    .filter(Boolean)
    .filter((paragraph) => !isOutOfPlaceParagraph(paragraph));
}

function inferFallbackHeadingFromBody(body: string) {
  const text = cleanText(body).toLowerCase();
  const headingRules: Array<{ pattern: RegExp; heading: string }> = [
    { pattern: /(humanities|symbolic|prehistory|paleolithic|neolithic)/, heading: "Meaning and Foundations" },
    { pattern: /(agriculture|settlement|surplus|civilization|city-state)/, heading: "Social Organization and Systems" },
    { pattern: /(writing|cuneiform|record|administration|law)/, heading: "Writing, Law, and Memory" },
    { pattern: /(mesopotamia|egypt|pharaoh|ziggurat|pyramid)/, heading: "Civilizational Case Studies" },
    { pattern: /(china|india|africa|confucian|dao|dharma|nok|ife)/, heading: "Regional Cultural Foundations" },
    { pattern: /(myth|homer|iliad|odyssey|drama|tragedy|comedy)/, heading: "Narrative and Cultural Memory" },
    { pattern: /(polis|democracy|agora|forum|citizen|public)/, heading: "Civic and Political Life" },
    { pattern: /(architecture|sculpture|parthenon|pantheon|arch|vault|engineering)/, heading: "Art, Space, and Built Form" },
    { pattern: /(rome|imperial|empire|augustus|aeneid)/, heading: "Roman Identity and Legacy" },
  ];

  const matchedRule = headingRules.find((rule) => rule.pattern.test(text));
  return matchedRule?.heading ?? "Section Focus";
}

function splitSingleBlockAcrossPages(block: TextbookH2Block, pagePlan: SectionPagePlan[]) {
  const paragraphs = block.bodyBlocks
    .filter((bodyBlock): bodyBlock is { type: "paragraph"; text: string } => bodyBlock.type === "paragraph")
    .map((bodyBlock) => bodyBlock.text);
  const groupedParagraphs = splitIntoGroups(paragraphs, pagePlan.length);
  const groupedTakeaways = splitIntoGroups(block.takeaways, pagePlan.length);

  return pagePlan.map((plan, index) => ({
    title: plan.title,
    blocks: [{
      heading: `${plan.title} Focus`,
      bodyBlocks: (groupedParagraphs[index] ?? []).map((paragraph) => ({
        type: "paragraph" as const,
        text: paragraph,
      })),
      takeaways: groupedTakeaways[index] ?? [],
    }],
  }));
}

function buildSectionPageGroups(scopedSectionKey: string, textbookBlocks: TextbookH2Block[]) {
  const pagePlan = SECTION_PAGE_ARCHITECTURE[scopedSectionKey] ?? [
    { title: "Foundations", headingKeywords: [] },
    { title: "Core Concepts", headingKeywords: [] },
    { title: "Applications", headingKeywords: [] },
    { title: "Synthesis", headingKeywords: [] },
  ];

  const pageGroups = pagePlan.map((plan) => ({
    title: plan.title,
    blocks: [] as TextbookH2Block[],
  }));

  if (textbookBlocks.length === 1) {
    return splitSingleBlockAcrossPages(textbookBlocks[0], pagePlan);
  }

  for (const block of textbookBlocks) {
    const normalizedHeading = block.heading.toLowerCase();
    let bestIndex = -1;
    let bestScore = -1;

    pagePlan.forEach((plan, index) => {
      const score = plan.headingKeywords.reduce((acc, keyword) =>
        normalizedHeading.includes(keyword.toLowerCase()) ? acc + 1 : acc,
      0);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    if (bestIndex >= 0 && bestScore > 0) {
      pageGroups[bestIndex]?.blocks.push(block);
      continue;
    }

    const lightestPage = pageGroups.reduce((best, current, index, array) =>
      current.blocks.length < (array[best]?.blocks.length ?? Number.MAX_SAFE_INTEGER) ? index : best,
    0);
    pageGroups[lightestPage]?.blocks.push(block);
  }

  return pageGroups;
}

function getTextbookHeading(raw: string) {
  const textbook = extractTextbook(raw);
  const match = textbook.match(/^H1\s*[-:\u2014\u2013]\s+(.+)$/im);
  return cleanText(match?.[1] ?? "");
}

function countMeaningfulBlocks(blocks: EditorialLearnPage["blocks"]) {
  return blocks.filter((block) => {
    if (block.type === "paragraph") return Boolean(block.text.trim());
    if (block.type === "callout") return Boolean(block.callout.text.trim());
    if (block.type === "key-takeaways") return block.takeaway.items.length > 0;
    if (block.type === "resource") return true;
    return false;
  }).length;
}

function compactLearnPages(pages: EditorialLearnPage[]) {
  const compacted: EditorialLearnPage[] = [];

  for (const page of pages) {
    const meaningfulCount = countMeaningfulBlocks(page.blocks);
    if (meaningfulCount > 0) {
      compacted.push(page);
      continue;
    }

    const previous = compacted[compacted.length - 1];
    if (previous) {
      previous.blocks.push(...page.blocks);
    }
  }

  // Merge very light pages into the previous page to avoid micro-lessons that feel empty.
  const balanced = compacted.reduce<EditorialLearnPage[]>((result, page) => {
    const meaningfulCount = countMeaningfulBlocks(page.blocks);
    const previous = result[result.length - 1];
    if (previous && meaningfulCount < 3 && result.length >= 1) {
      previous.blocks.push(...page.blocks);
      return result;
    }

    result.push(page);
    return result;
  }, []);

  return balanced.map((page, index) => ({
    ...page,
    id: `learn-${index + 1}` as EditorialLearnPage["id"],
  }));
}

function buildSectionMaterials(learnPages: EditorialLearnPage[]): EditorialMaterial[] {
  const learnMaterials = learnPages.map((page) => ({
    id: page.id,
    title: page.title,
    emoji: page.emoji,
    type: "learn" as const,
  }));

  return [
    MATERIALS[0]!,
    ...learnMaterials,
    ...BASE_MATERIALS_AFTER_LEARN,
  ];
}

function buildLearnPages(
  chapterId: string,
  sectionId: string,
  raw: string,
  mnemonics: EditorialMnemonic[],
): EditorialLearnPage[] {
  const scopedKey = `${chapterId}.${sectionId}`;
  const textbook = extractTextbook(raw);
  const textbookBlocks = extractTextbookH2Blocks(textbook);
  const groupedBlocks = buildSectionPageGroups(scopedKey, textbookBlocks).filter((group) =>
    group.blocks.some((block) => block.bodyBlocks.length || block.takeaways.length),
  );
  const bigIdeas = parseBigIdeas(raw);
  const pageCount = Math.max(groupedBlocks.length, 1);
  const groupedMnemonics = splitIntoGroups(mnemonics, pageCount);
  const groupedBigIdeas = splitIntoGroups(bigIdeas, pageCount);

  const pages = groupedBlocks.map((group, pageIndex) => {
    const blocks: EditorialLearnPage["blocks"] = [];

    // Distribute big ideas as labeled callouts across pages
    for (const [ideaIndex, idea] of (groupedBigIdeas[pageIndex] ?? []).entries()) {
      if (!idea.text) continue;
      const callout = buildCallout(idea.text, pageIndex + ideaIndex);
      callout.label = idea.title.toUpperCase();
      blocks.push({ type: "callout", callout });
    }

    for (const groupBlock of group.blocks) {
      blocks.push({
        type: "heading",
        level: 2,
        text: groupBlock.heading,
      });

      for (const bodyBlock of groupBlock.bodyBlocks) {
        if (bodyBlock.type === "subheading") {
          blocks.push({ type: "heading", level: 3, text: bodyBlock.text });
          continue;
        }

        const paragraph = cleanText(bodyBlock.text);
        const h2Heading = paragraph.match(/^H2\s*[-:\u2014\u2013]\s+(.+)$/i);
        if (h2Heading) {
          blocks.push({ type: "heading", level: 2, text: h2Heading[1].trim() });
          continue;
        }

        const h3Heading = paragraph.match(/^H3\s*[-:\u2014\u2013]\s+(.+)$/i);
        if (h3Heading) {
          blocks.push({ type: "heading", level: 3, text: h3Heading[1].trim() });
          continue;
        }
        const bigIdeaParagraph = paragraph.match(/^Big Idea\s+(\d+)\s*[-—:]\s*(.+)$/i);
        if (bigIdeaParagraph) {
          blocks.push({ type: "heading", level: 3, text: `Big Idea ${bigIdeaParagraph[1]}` });
          blocks.push({ type: "paragraph", text: bigIdeaParagraph[2].trim() });
          continue;
        }

        const whatToNotice = paragraph.match(/^What you might not notice\s*[:—-]?\s*(.*)$/i);
        if (whatToNotice) {
          blocks.push({ type: "heading", level: 3, text: "What You Might Not Notice" });
          const detail = whatToNotice[1]?.trim();
          if (detail) {
            blocks.push({ type: "paragraph", text: detail });
          }
          continue;
        }

        if (/^(\w+\.s\d+\.\S+|M\d-S\d-OBJ|Plain-English|Skill type:|Exam task|Answer:)/i.test(paragraph.trim())) continue;

        // Inline image reference: [See: Title | URL]
        const inlineImage = paragraph.match(/^\[See:\s*(.+?)\s*\|\s*(https?:\/\/\S+)\s*\]$/i);
        if (inlineImage) {
          const imgTitle = inlineImage[1].trim();
          const imgUrl = inlineImage[2].trim();
          blocks.push({
            type: "resource",
            resource: {
              id: `inline-${blocks.length}`,
              title: imgTitle,
              url: imgUrl,
              source: titleFromUrl(imgUrl).split(":")[0] ?? "Reference",
              description: "",
              kind: "image",
            },
          });
          continue;
        }

        blocks.push({ type: "paragraph", text: paragraph });
      }

      if (!groupBlock.takeaways.length) {
        continue;
      }

      blocks.push({
        type: "key-takeaways",
        takeaway: {
          title: "Key Takeaways",
          items: sanitizeParagraphsForLearnFlow(groupBlock.takeaways),
        },
      });
    }

    if (DIAGRAMS[scopedKey] && pageIndex === 0) {
      blocks.push({
        type: "diagram",
        diagram: DIAGRAMS[scopedKey],
      });
    }

    for (const mnemonic of groupedMnemonics[pageIndex] ?? []) {
      blocks.push({
        type: "mnemonic",
        mnemonic,
      });
    }

    return {
      id: `learn-${pageIndex + 1}` as EditorialLearnPage["id"],
      title: group.title,
      emoji: "📖",
      blocks,
    };
  });

  return compactLearnPages(pages);
}

function buildSection(raw: string, chapterId: string, sectionId: string, title: string, emoji: string): EditorialSection {
  const parsedResources = [
    ...parseResourceSection(raw, sectionId, /^Link Images(?: That Help)?$/i, "image"),
    ...parseResourceSection(raw, sectionId, /^References?$/i, "resource"),
  ];
  const parsedVideos = parseVideos(raw, sectionId);
  const { resources, videos } = ensureSectionMedia(raw, chapterId, sectionId, parsedResources, parsedVideos);
  const mnemonics = parseMnemonics(raw);
  const objectives = parseObjectives(raw, sectionId);
  const quiz = parseQuiz(raw, sectionId);
  const hardTest = parseHardTest(raw, sectionId, quiz.questions);
  const learnPages = buildLearnPages(chapterId, sectionId, raw, mnemonics);

  if (process.env.NODE_ENV !== "production") {
    // Only warn when the raw text has real numbered-block content.
    // Placeholder / empty sections (e.g. "[PASTE … HERE]") have no numbered
    // headings and would always trigger false-positive warnings.
    const hasNumberedBlocks = /(?:^|\n)\d+\)\s+[^\n]+\n/.test(raw);
    if (hasNumberedBlocks) {
      const warnings: string[] = [];
      if (!objectives.length) warnings.push("objectives");
      if (!quiz.questions.length) warnings.push("quiz");
      if (!hardTest.questions.length) warnings.push("hard-test");
      if (!resources.length) warnings.push("resources");
      if (!videos.length) warnings.push("videos");
      if (warnings.length) {
        console.warn(`[editorial-course] ${sectionId} has missing parsed blocks: ${warnings.join(", ")}`);
      }
    }
  }

  return {
    id: sectionId,
    title,
    textbookHeading: getTextbookHeading(raw) || title,
    emoji,
    purpose: extractPurpose(raw),
    studentGuide: extractStudentGuide(raw),
    materials: buildSectionMaterials(learnPages),
    objectives,
    learnPages,
    flashcards: parseFlashcards(raw, sectionId),
    videos,
    resources,
    quiz,
    hardTest,
    cheatSheet: parseCheatSheet(raw),
  };
}

function buildChapterFromBlueprint(blueprint: EditorialChapterBlueprint): EditorialChapter {
  const sectionMeta = blueprint.sectionMeta ?? [];

  if (!blueprint.sourceFile || !sectionMeta.length) {
    return {
      id: blueprint.id,
      title: blueprint.title,
      emoji: blueprint.emoji,
      color: blueprint.color,
      locked: blueprint.locked,
      sections: [],
    };
  }

  const sourceTexts = getSourceTexts(blueprint.sourceFile, blueprint.sourceEnvVar, blueprint.sourceFallbackFiles ?? []);
  if (!sourceTexts.length) {
    return {
      id: blueprint.id,
      title: blueprint.title,
      emoji: blueprint.emoji,
      color: blueprint.color,
      locked: true,
      sections: [],
    };
  }

  try {
    const sectionRawById = new Map<string, string[]>();
    for (const sourceText of sourceTexts) {
      try {
        const slices = getSectionSlices(sourceText.text, sectionMeta);
        for (const slice of slices) {
          const existing = sectionRawById.get(slice.id) ?? [];
          existing.push(slice.raw);
          sectionRawById.set(slice.id, existing);
        }
      } catch {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[editorial-course] could not slice source file ${sanitizeForLog(path.basename(sourceText.sourcePath))}`);
        }
      }
    }

    const sections = sectionMeta.map((meta) => {
      const mergedRaw = (sectionRawById.get(meta.id) ?? []).join("\n\n");
      return buildSection(mergedRaw, blueprint.id, meta.id, meta.title, meta.emoji);
    });

    const locked = sections.length
      ? blueprint.unlockWhenSectionsReady
        ? false
        : blueprint.locked
      : true;

    return {
      id: blueprint.id,
      title: blueprint.title,
      emoji: blueprint.emoji,
      color: blueprint.color,
      locked,
      sections,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const errorMessage = error instanceof Error ? sanitizeForLog(error.message) : "unknown error";
      console.warn(`[editorial-course] failed to build chapter ${sanitizeForLog(blueprint.id)}: ${errorMessage}`);
    }
    return {
      id: blueprint.id,
      title: blueprint.title,
      emoji: blueprint.emoji,
      color: blueprint.color,
      locked: true,
      sections: [],
    };
  }
}

export function getEditorialCourse(): EditorialCourse {
  if (cachedCourse) {
    return cachedCourse;
  }

  cachedCourse = {
    chapters: EDITORIAL_CHAPTER_BLUEPRINTS.map((blueprint) => buildChapterFromBlueprint(blueprint)),
  };

  return cachedCourse;
}

export default {
  getEditorialCourse,
};
