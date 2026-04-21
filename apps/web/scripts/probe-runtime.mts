import mod from "../src/content/editorial-course.ts";

const getCourse = mod.getEditorialCourse;
if (typeof getCourse !== "function") {
  throw new Error("getEditorialCourse not found");
}

const c = getCourse();

for (const chId of ["ch1", "ch2", "ch3"]) {
  const ch = c.chapters.find((x) => x.id === chId);
  if (!ch) {
    console.log(`${chId}: NOT FOUND IN OUTPUT`);
    continue;
  }
  const sCount = ch.sections.length;
  const s1 = ch.sections[0];
  const s1BlockCount = s1?.learnPages?.flatMap((p) => p.blocks).length ?? 0;
  const s1WordSample = s1?.learnPages?.[0]?.blocks
    ?.find((b) => b.type === "paragraph")
    // @ts-ignore
    ?.text?.slice(0, 80) ?? "(no paragraph block)";

  console.log(`\n=== ${chId} ===`);
  console.log(`  notebookLmUrl: ${ch.notebookLmUrl ?? "(MISSING)"}`);
  console.log(`  sections parsed: ${sCount}`);
  console.log(`  s1 total blocks: ${s1BlockCount}`);
  console.log(`  s1 first paragraph snippet: ${s1WordSample}`);
}
