import fs from "node:fs";
import path from "node:path";

import editorialCourse from "../src/content/editorial-course";

function fail(message: string): never {
  console.error(`[check:content] ${message}`);
  process.exit(1);
}

const CANONICAL_SOURCE_FILE = "src/content/sources/CHAPTER 1 SECTION 1-6.CANONICAL.txt";
const CANONICAL_SECTION_HEADERS = [
  "## Section 1 (Canonical)",
  "## Section 2 (Canonical)",
  "## Section 3 (Canonical)",
  "## Section 4 (Canonical)",
  "## Section 5 (Canonical)",
  "## Section 6 (Canonical)",
];

const sourcePath = path.resolve(process.cwd(), CANONICAL_SOURCE_FILE);
if (!fs.existsSync(sourcePath)) {
  fail(`Primary source file not found at ${sourcePath}`);
}

const sourceText = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

for (let index = 0; index < CANONICAL_SECTION_HEADERS.length; index += 1) {
  const sectionHeader = CANONICAL_SECTION_HEADERS[index]!;
  const sectionId = `s${index + 1}`;

  const start = sourceText.indexOf(sectionHeader);
  if (start < 0) {
    fail(`Missing section header in source: ${sectionHeader}`);
  }

  const nextSectionHeaders = CANONICAL_SECTION_HEADERS.filter((header) => header !== sectionHeader);

  const nextStartCandidates = nextSectionHeaders
    .map((header) => sourceText.indexOf(header, start + sectionHeader.length))
    .filter((index) => index > start)
    .sort((a, b) => a - b);
  const end = nextStartCandidates[0] ?? sourceText.length;
  const raw = sourceText.slice(start, end);

  const hasNarrativeHeading =
    /\nH1\s*[-—–:]/i.test(raw) ||
    /\n\d+\)\s*(?:DETAILED STORY-LIKE LESSON NOTES|Detailed lesson notes|THE FULL TEXTBOOK SECTION)/i.test(raw);
  if (!hasNarrativeHeading) {
    fail(`Section ${sectionId} is missing a narrative textbook heading.`);
  }

  if (!/(Key Takeaways Box|What to Remember)/i.test(raw)) {
    fail(`Section ${sectionId} is missing takeaways guidance.`);
  }

  if (!/Core 10/i.test(raw) || !/Extra 10/i.test(raw)) {
    fail(`Section ${sectionId} is missing Core 10 / Extra 10 flashcard decks.`);
  }
}

const chapter1 = editorialCourse.getEditorialCourse().chapters.find((chapter) => chapter.id === "ch1");
if (!chapter1) {
  fail("Parsed course is missing Chapter 1.");
}

if (chapter1.sections.length !== 6) {
  fail(`Expected 6 sections, got ${chapter1.sections.length}.`);
}

for (const section of chapter1.sections) {
  if (section.learnPages.length < 4) {
    fail(`Section ${section.id} has fewer than 4 learn pages.`);
  }

  if (section.flashcards.length < 20) {
    fail(`Section ${section.id} has fewer than 20 flashcards.`);
  }

  if (section.quiz.questions.length !== 10) {
    fail(`Section ${section.id} quiz question count is ${section.quiz.questions.length}, expected 10.`);
  }

  if (section.hardTest.questions.length !== 10) {
    fail(`Section ${section.id} hard-test question count is ${section.hardTest.questions.length}, expected 10.`);
  }

  if (section.resources.length < 1) {
    fail(`Section ${section.id} has no resources.`);
  }

  if (section.videos.length < 1) {
    fail(`Section ${section.id} has no videos.`);
  }
}

console.log("[check:content] Chapter 1 content contract passed.");
