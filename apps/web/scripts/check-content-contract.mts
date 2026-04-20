import fs from "node:fs";
import path from "node:path";

import editorialCourse from "../src/content/editorial-course";

function fail(message: string): never {
  console.error(`[check:content] ${message}`);
  process.exit(1);
}

const CHAPTERS_TO_CHECK: Array<{ id: string; sourceFile: string }> = [
  { id: "ch1", sourceFile: "src/content/sources/CHAPTER 1 SECTION 1-6.CANONICAL.txt" },
  { id: "ch2", sourceFile: "src/content/sources/CHAPTER 2 SECTION 1-6.CANONICAL.txt" },
  { id: "ch3", sourceFile: "src/content/sources/CHAPTER 3 SECTION 1-6.CANONICAL.txt" },
];

const CANONICAL_SECTION_HEADERS = [
  "## Section 1 (Canonical)",
  "## Section 2 (Canonical)",
  "## Section 3 (Canonical)",
  "## Section 4 (Canonical)",
  "## Section 5 (Canonical)",
  "## Section 6 (Canonical)",
];

for (const chapterSpec of CHAPTERS_TO_CHECK) {
  const sourcePath = path.resolve(process.cwd(), chapterSpec.sourceFile);
  if (!fs.existsSync(sourcePath)) {
    fail(`Primary source file not found at ${sourcePath}`);
  }

  const sourceText = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

  for (let index = 0; index < CANONICAL_SECTION_HEADERS.length; index += 1) {
    const sectionHeader = CANONICAL_SECTION_HEADERS[index]!;
    const sectionId = `s${index + 1}`;

    const start = sourceText.indexOf(sectionHeader);
    if (start < 0) {
      fail(`${chapterSpec.id}: missing section header in source: ${sectionHeader}`);
    }

    const nextSectionHeaders = CANONICAL_SECTION_HEADERS.filter((header) => header !== sectionHeader);

    const nextStartCandidates = nextSectionHeaders
      .map((header) => sourceText.indexOf(header, start + sectionHeader.length))
      .filter((index) => index > start)
      .sort((a, b) => a - b);
    const end = nextStartCandidates[0] ?? sourceText.length;
    const raw = sourceText.slice(start, end);

    const hasNarrativeHeading =
      /(?:^|\n)H1\b/i.test(raw) ||
      /\n\d+\)\s*(?:DETAILED STORY-LIKE LESSON NOTES|Detailed lesson notes|THE FULL TEXTBOOK SECTION)/i.test(raw);
    if (!hasNarrativeHeading) {
      fail(`${chapterSpec.id} ${sectionId} is missing a narrative textbook heading.`);
    }

    if (!/(Key Takeaways Box|What to Remember|CLEP Keys)/i.test(raw)) {
      fail(`${chapterSpec.id} ${sectionId} is missing takeaways guidance.`);
    }

    if (!/Core 10/i.test(raw) || !/Extra 10/i.test(raw)) {
      fail(`${chapterSpec.id} ${sectionId} is missing Core 10 / Extra 10 flashcard decks.`);
    }
  }

  const chapter = editorialCourse.getEditorialCourse().chapters.find((c) => c.id === chapterSpec.id);
  if (!chapter) {
    fail(`Parsed course is missing ${chapterSpec.id}.`);
  }

  if (chapter.sections.length !== 6) {
    fail(`${chapterSpec.id}: expected 6 sections, got ${chapter.sections.length}.`);
  }

  for (const section of chapter.sections) {
    if (section.learnPages.length < 1) {
      fail(`${chapterSpec.id} ${section.id} has no learn pages.`);
    }

    if (section.learnPages.length > 4) {
      fail(`${chapterSpec.id} ${section.id} has ${section.learnPages.length} learn pages, expected at most 4.`);
    }

    if (section.flashcards.length < 20) {
      fail(`${chapterSpec.id} ${section.id} has fewer than 20 flashcards.`);
    }

    if (section.quiz.questions.length !== 10) {
      fail(`${chapterSpec.id} ${section.id} quiz question count is ${section.quiz.questions.length}, expected 10.`);
    }

    if (section.hardTest.questions.length !== 10) {
      fail(`${chapterSpec.id} ${section.id} hard-test question count is ${section.hardTest.questions.length}, expected 10.`);
    }

    if (section.resources.length < 1) {
      fail(`${chapterSpec.id} ${section.id} has no resources.`);
    }

    if (section.videos.length < 1) {
      fail(`${chapterSpec.id} ${section.id} has no videos.`);
    }
  }

  console.log(`[check:content] ${chapterSpec.id} content contract passed.`);
}
