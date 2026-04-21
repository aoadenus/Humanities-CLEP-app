import editorialCourseModule from "../src/content/editorial-course.ts";

type RenderIssue = {
  chapterId: string;
  sectionId: string;
  pageId: string;
  blockType: string;
  snippet: string;
  issue: "leaked-heading-token" | "odd-characters";
};

function inspectText(value: string) {
  const text = String(value ?? "").trim();
  const issues: Array<RenderIssue["issue"]> = [];

  if (/^\s*H[23]\s*[\-:\u2014\u2013]?\s*/i.test(text)) {
    issues.push("leaked-heading-token");
  }

  if (/[\uFFFD]|ΓÇ|Γå|â€|â†|Ã./.test(text)) {
    issues.push("odd-characters");
  }

  return { text, issues };
}

const getCourse = editorialCourseModule.getEditorialCourse;
if (typeof getCourse !== "function") {
  throw new Error("Could not resolve getEditorialCourse from editorial-course module.");
}

const course = getCourse();
const renderIssues: RenderIssue[] = [];

for (const chapter of course.chapters) {
  for (const section of chapter.sections) {
    for (const page of section.learnPages) {
      for (const block of page.blocks) {
        if (block.type === "paragraph") {
          const result = inspectText(block.text);
          for (const issue of result.issues) {
            renderIssues.push({
              chapterId: chapter.id,
              sectionId: section.id,
              pageId: page.id,
              blockType: block.type,
              snippet: result.text.slice(0, 160),
              issue,
            });
          }
        }

        if (block.type === "heading") {
          const result = inspectText(block.text);
          for (const issue of result.issues.filter((x) => x === "odd-characters")) {
            renderIssues.push({
              chapterId: chapter.id,
              sectionId: section.id,
              pageId: page.id,
              blockType: block.type,
              snippet: result.text.slice(0, 160),
              issue,
            });
          }
        }
      }
    }
  }
}

const ch3Issues = renderIssues.filter((issue) => issue.chapterId === "ch3");

console.log("Total parsed issues (all chapters):", renderIssues.length);
console.log("Parsed issues (ch3):", ch3Issues.length);

if (ch3Issues.length > 0) {
  console.log("--- Sample ch3 issues ---");
  for (const issue of ch3Issues.slice(0, 20)) {
    console.log(
      `[${issue.issue}] ${issue.chapterId}/${issue.sectionId}/${issue.pageId}/${issue.blockType} :: ${issue.snippet}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log("Chapter 3 parsed output clean: no leaked H2/H3 tokens and no odd-character patterns detected.");
}
