import fs from "node:fs";
import path from "node:path";

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

const SECTION_META = [
  {
    id: "s1",
    title: "From Survival to Culture",
    emoji: "🌍",
    anchors: [
      "I rebuilt this to match your locked Chapter 1 — Classical, Section 1 — From Survival to Culture scope",
      "Chapter 1 — Classical, Section 1 — From Survival to Culture",
    ],
  },
  {
    id: "s2",
    title: "Mesopotamia and Egypt",
    emoji: "🗿",
    anchors: [
      "Rebuilt for your current student-facing textbook engine: Chapter 1 — Classical, Section 2 — Mesopotamia and Egypt",
      "Section 2 — Mesopotamia and Egypt\n1) Section Relevance and Stakes",
    ],
  },
  {
    id: "s3",
    title: "Early Civilizations Beyond the Mediterranean",
    emoji: "🌏",
    anchors: [
      "Using your student-facing textbook engine and the verified-links-only rule, here is the rebuilt Chapter 1, Section 3",
      "Section 3 — China, India, and Africa: Early Civilizations\n1) Section Relevance and Stakes",
      "Section 3 — Early Civilizations Beyond the Mediterranean\n1) Section Relevance and Stakes",
    ],
  },
  {
    id: "s4",
    title: "The Aegean World and Greek Beginnings",
    emoji: "🌀",
    anchors: [
      "Section: Section 4 — The Aegean World and Greek Beginnings",
      "Section 4 — The Aegean World and Greek Beginnings\n1) Section Relevance and Stakes",
    ],
  },
  {
    id: "s5",
    title: "Classical Greece",
    emoji: "🏛️",
    anchors: [
      "Section 5 — Classical Greece\n1) Section Relevance and Stakes",
      "Chapter 1, Section 5 = Classical Greece",
    ],
  },
  {
    id: "s6",
    title: "Rome",
    emoji: "🦅",
    anchors: [
      "Absolutely — here is a full redo of Chapter 1, Section 6 rebuilt around Rome: Urban Life and Imperial Majesty",
      "Chapter 1, Section 6\nRome: Urban Life and Imperial Majesty",
      "Section 6 — Rome\n1) Section Relevance and Stakes",
    ],
  },
] as const;

const DIAGRAMS: Record<string, EditorialDiagramDefinition> = {
  s1: {
    id: "s1-flow",
    title: "From Symbol to Civilization",
    type: "flow",
    labels: ["Symbol", "Settlement", "Surplus", "Systems", "Civilization"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#5B4A3F",
    description: "The core progression from symbolic thought to organized culture.",
  },
  s2: {
    id: "s2-compare",
    title: "Mesopotamia vs Egypt",
    type: "bar",
    labels: ["Writing", "Kingship", "Monumentality", "Law", "Afterlife"],
    values: [4, 5, 5, 4, 3],
    accentColor: "#4A6FA5",
    description: "A study comparison of the two major river-valley systems.",
  },
  s3: {
    id: "s3-world",
    title: "China / India / Africa Foundations",
    type: "bar",
    labels: ["Writing", "Ritual", "Sacred Art", "Political Order", "Memory"],
    values: [5, 4, 5, 4, 4],
    accentColor: "#7B6B8D",
    description: "Shared civilization-building themes across three regions.",
  },
  s4: {
    id: "s4-aegean",
    title: "Cycladic → Minoan → Mycenaean",
    type: "line",
    labels: ["Cycladic", "Minoan", "Mycenaean", "Homeric", "Polis"],
    values: [1, 3, 4, 3, 5],
    accentColor: "#4A7C59",
    description: "A fast timeline of the early Greek world.",
  },
  s5: {
    id: "s5-athens",
    title: "Athens Civic System",
    type: "flow",
    labels: ["Polis", "Agora", "Drama", "Philosophy", "Sculpture"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#A3443A",
    description: "How public life and cultural forms reinforce one another in Athens.",
  },
  s6: {
    id: "s6-rome",
    title: "Roman Systems",
    type: "flow",
    labels: ["Duty", "Law", "Forum", "Engineering", "Empire"],
    values: [1, 2, 3, 4, 5],
    accentColor: "#D4A843",
    description: "A quick map of Rome as organized public culture.",
  },
};

let cachedCourse: EditorialCourse | null = null;

function getSourcePath() {
  const directPath = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    "CHAPTER 1 SECTION 1-6.txt",
  );
  const workspacePath = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    "..",
    "..",
    "CHAPTER 1 SECTION 1-6.txt",
  );
  const candidates = [directPath, workspacePath];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("Could not find CHAPTER 1 SECTION 1-6.txt.");
}

function getSourceText() {
  return fs.readFileSync(getSourcePath(), "utf8").replace(/\r\n/g, "\n");
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

function getSectionSlices(source: string) {
  const starts = SECTION_META.map((meta) => {
    const index = findLastIndexOfAny(source, meta.anchors);
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
    .replace(/^classical\./, "")
    .replace(/^rome\./, "")
    .replace(/^s\d+\./, "")
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeObjectiveTag(tag: string, sectionId: string) {
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

    if (/^(classical\.[\w.-]+|M\d-S\d-OBJ-\d+)\b/.test(trimmed)) {
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
  for (const match of raw.matchAll(/classical\.(?:rome|s\d)\.[\w.-]+/g)) {
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
    const text = lines.slice(1).join(" ").trim() || titleLine.trim();
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

    const numbered = trimmed.match(/^\d+\.\s*([A-E])(?:\s*[-—]\s*(.*))?$/i);
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
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index]?.trim() ?? "";
    if (!currentLine) {
      index += 1;
      continue;
    }

    const questionStart = currentLine.match(/^\d+\.\s*(.+)$/);
    if (!questionStart) {
      index += 1;
      continue;
    }

    const questionLines = [questionStart[1].trim()];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index]?.trim() ?? "";
      if (!nextLine) {
        index += 1;
        break;
      }
      if (/^[A-E][.)]\s+/.test(nextLine)) {
        break;
      }
      questionLines.push(nextLine);
      index += 1;
    }

    const options: string[] = [];
    while (index < lines.length) {
      const optionLine = lines[index]?.trim() ?? "";
      if (!/^[A-E][.)]\s+/.test(optionLine)) {
        break;
      }
      options.push(optionLine.replace(/^[A-E][.)]\s+/, "").trim());
      index += 1;
    }

    let tags: string[] = [];
    while (index < lines.length) {
      const tagLine = lines[index]?.trim() ?? "";
      if (!tagLine) {
        index += 1;
        break;
      }
      if (/^(Objective|Tags?):/i.test(tagLine)) {
        tags = tagLine
          .replace(/^(Objective|Tags?):/i, "")
          .split(",")
          .map((tag) => normalizeObjectiveTag(tag.trim(), sectionId))
          .filter(Boolean);
      }
      index += 1;
    }

    if (!options.length) {
      continue;
    }

    const answerEntry = answers[questions.length];
    const correctLetter = answerEntry?.answer ?? "A";
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
  const quizBlock =
    raw.match(/(?:^|\n)(?:9|10|14)\)\s+(?:Practice Quiz|10-Question Section Quiz)(?:\s*\(10 Questions\))?\n([\s\S]*?)(?=(?:\n(?:10|11|15)\)\s+Answer Key))/i)?.[1] ??
    "";
  const answersBlock =
    raw.match(/(?:^|\n)(?:10|11|15)\)\s+Answer Key(?: with (?:Full Teaching )?Explanations?)?\n([\s\S]*?)(?=(?:\n(?:11|12|16)\)\s+(?:10 Later Test Questions|Challenge Questions)))/i)?.[1] ??
    "";

  const questions: EditorialQuestion[] = parseQuestionBlock(
    quizBlock,
    parseAnswerEntries(answersBlock),
    sectionId,
  ).map((question) => ({
      ...question,
      reviewMaterialIds: getReviewMaterials(sectionId, question.objectiveTags),
    }));

  return {
    questions: questions.slice(0, 10),
    passThreshold: 8,
  };
}

function parseHardTest(raw: string, sectionId: string, quizQuestions: EditorialQuestion[]) {
  const laterTestBlock =
    raw.match(/(?:^|\n)(?:12|16)\)\s+(?:10 Later Test Questions|Challenge Questions(?:\s*\(10\))?)\n([\s\S]*?)(?=(?:\n(?:13|17)\)\s+Weakness Review Map))/i)?.[1] ??
    "";

  if (!/[A-E][.)]\s+/.test(laterTestBlock)) {
    return {
      questions: quizQuestions.map((question) => ({
        ...question,
        id: question.id + 100,
      })),
      passThreshold: 8,
    };
  }

  const answers = [...laterTestBlock.matchAll(/Answer:\s*([A-E])/gi)].map((match) => ({
    answer: match[1].toUpperCase(),
    explanation: "Use the related lesson page and flashcards to reinforce this harder concept.",
  }));
  const strippedBlock = laterTestBlock.replace(/\nAnswer:\s*[A-E]\n?/gi, "\n");

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

function parseResourceSection(raw: string, headerRegex: RegExp, kind: "image" | "resource") {
  const headerMatch = raw.match(headerRegex);
  if (!headerMatch || headerMatch.index === undefined) {
    return [] as EditorialResource[];
  }

  const remainder = raw.slice(headerMatch.index + headerMatch[0].length);
  const untilNext = remainder.match(/(?=\n(?:1[3-9]|2[0-2])\)\s+)/m);
  const block = cleanText(untilNext && untilNext.index !== undefined ? remainder.slice(0, untilNext.index) : remainder);
  const entries = block
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => /Link:/i.test(chunk));

  return entries.map((entry, index) => {
    const lines = entry.split("\n").map((line) => line.trim()).filter(Boolean);
    const title = lines[0] ?? `Resource ${index + 1}`;
    const linkLine = lines.find((line) => /^Link:/i.test(line)) ?? "";
    const descriptionLine =
      lines.find((line) => /^(Why it matters|Why useful|Look at|Watch-for|What to notice):/i.test(line)) ?? "";

    return {
      id: `${kind}-${index + 1}`,
      title,
      url: linkLine.replace(/^Link:\s*/i, "").trim(),
      source: title.includes("Smarthistory")
        ? "Smarthistory"
        : title.includes("British Museum")
          ? "British Museum"
          : title.includes("UNESCO")
            ? "UNESCO"
            : "Reference",
      description: descriptionLine.replace(/^(Why it matters|Why useful|Look at|Watch-for|What to notice):\s*/i, "").trim(),
      kind,
    };
  });
}

function parseVideos(raw: string): EditorialVideo[] {
  const headerMatch = raw.match(/(?:^|\n)(?:12|16)\)\s+Link Videos(?: to Embed)?\n/i);
  if (!headerMatch || headerMatch.index === undefined) {
    return [];
  }

  const remainder = raw.slice(headerMatch.index + headerMatch[0].length);
  const untilNext = remainder.match(/(?=\n(?:1[3-9]|2[0-2])\)\s+)/m);
  const block = cleanText(untilNext && untilNext.index !== undefined ? remainder.slice(0, untilNext.index) : remainder);
  const entries = block
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => /Link:/i.test(chunk));

  return entries.map((entry, index) => {
    const lines = entry.split("\n").map((line) => line.trim()).filter(Boolean);
    const title = lines[0] ?? `Video ${index + 1}`;
    const linkLine = lines.find((line) => /^Link:/i.test(line)) ?? "";
    const watchForLine = lines.find((line) => /^Watch-for:/i.test(line)) ?? "";
    const url = linkLine.replace(/^Link:\s*/i, "").trim();

    return {
      id: `video-${index + 1}`,
      title,
      url,
      embedUrl: youtubeEmbedUrl(url),
      watchFor:
        watchForLine.replace(/^Watch-for:\s*/i, "").trim() ||
        "Watch for the main ideas and the terms that tie back to the lesson.",
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

function buildLearnPages(
  sectionId: string,
  raw: string,
  mnemonics: EditorialMnemonic[],
): EditorialLearnPage[] {
  const textbook = extractTextbook(raw);
  const h2Blocks = cleanText(textbook).split(/(?=^H2\s+[-—–]\s+)/gim).filter(Boolean);
  const groupedBlocks = splitIntoGroups(h2Blocks.length ? h2Blocks : paragraphize(textbook), 4);
  const foundationalContext = extractFoundationalContext(raw);
  const groupedBigIdeas = splitIntoGroups(parseBigIdeas(raw), 4);
  const groupedTakeaways = splitIntoGroups(parseTakeaways(textbook), 4);
  const groupedMnemonics = splitIntoGroups(mnemonics, 4);

  return groupedBlocks.map((group, pageIndex) => {
    const blocks: EditorialLearnPage["blocks"] = [];

    const firstHeading = group[0]?.match(/^H2\s+[-—–]\s+(.+)$/im);
    blocks.push({
      type: "heading",
      text: firstHeading?.[1]?.trim() ?? `Learn ${pageIndex + 1}`,
    });

    if (pageIndex === 0 && foundationalContext.length) {
      blocks.push({
        type: "heading",
        text: "Section Foundations",
      });

      for (const paragraph of foundationalContext) {
        blocks.push({ type: "paragraph", text: paragraph });
      }
    }

    for (const [ideaIndex, idea] of (groupedBigIdeas[pageIndex] ?? []).entries()) {
      blocks.push({
        type: "callout",
        callout: buildCallout(`${idea.title}: ${idea.text}`, pageIndex + ideaIndex),
      });
    }

    for (const groupBlock of group) {
      const cleanedBlock = cleanText(
        groupBlock
          .replace(/^H2\s+[-—–]\s+.+$/im, ""),
      );

      for (const paragraph of paragraphize(cleanedBlock)) {
        blocks.push({ type: "paragraph", text: paragraph });
      }
    }

    for (const [takeawayIndex, takeawayItems] of (groupedTakeaways[pageIndex] ?? []).entries()) {
      if (!takeawayItems.length) {
        continue;
      }

      blocks.push({
        type: "key-takeaways",
        takeaway: {
          title: `What to Remember ${groupedTakeaways[pageIndex]!.length > 1 ? `(${takeawayIndex + 1})` : ""}`.trim(),
          items: takeawayItems,
        },
      });
    }

    if (DIAGRAMS[sectionId] && pageIndex === 0) {
      blocks.push({
        type: "diagram",
        diagram: DIAGRAMS[sectionId],
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
      title: `Learn ${pageIndex + 1}`,
      emoji: "📖",
      blocks,
    };
  });
}

function buildSection(raw: string, sectionId: string, title: string, emoji: string): EditorialSection {
  const resources = [
    ...parseResourceSection(raw, /(?:^|\n)(?:15|11)\)\s+Link Images(?: That Help)?\n/i, "image"),
    ...parseResourceSection(raw, /(?:^|\n)(?:15|11)\)\s+References?\n/i, "resource"),
  ];
  const videos = parseVideos(raw);
  const mnemonics = parseMnemonics(raw);
  const objectives = parseObjectives(raw, sectionId);
  const quiz = parseQuiz(raw, sectionId);
  const hardTest = parseHardTest(raw, sectionId, quiz.questions);

  return {
    id: sectionId,
    title,
    emoji,
    purpose: extractPurpose(raw),
    studentGuide: extractStudentGuide(raw),
    materials: MATERIALS,
    objectives,
    learnPages: buildLearnPages(sectionId, raw, mnemonics),
    flashcards: parseFlashcards(raw, sectionId),
    videos,
    resources,
    quiz,
    hardTest,
    cheatSheet: parseCheatSheet(raw),
  };
}

export function getEditorialCourse(): EditorialCourse {
  if (cachedCourse) {
    return cachedCourse;
  }

  const source = getSourceText();
  const sections = getSectionSlices(source).map((slice) =>
    buildSection(slice.raw, slice.id, slice.title, slice.emoji),
  );

  const chapter1: EditorialChapter = {
    id: "ch1",
    title: "Classical",
    emoji: "🏛️",
    color: "var(--ch1-color)",
    locked: false,
    sections,
  };

  cachedCourse = {
    chapters: [
      chapter1,
      { id: "ch2", title: "Medieval", emoji: "⚔️", color: "var(--ch2-color)", locked: true, sections: [] },
      { id: "ch3", title: "Renaissance", emoji: "🎨", color: "var(--ch3-color)", locked: true, sections: [] },
      { id: "ch4", title: "Baroque & Enlightenment", emoji: "💡", color: "var(--ch4-color)", locked: true, sections: [] },
      { id: "ch5", title: "19th Century", emoji: "🏭", color: "var(--ch5-color)", locked: true, sections: [] },
      { id: "ch6", title: "20th Century & Beyond", emoji: "🌐", color: "var(--ch6-color)", locked: true, sections: [] },
    ],
  };

  return cachedCourse;
}
