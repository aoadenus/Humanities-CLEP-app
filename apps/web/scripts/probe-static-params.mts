import { getMaterialStaticParams } from "../src/lib/editorial-static-params";

const params = getMaterialStaticParams();
const ch3 = params.filter((x) => x.chapterId === "ch3");
const ch1 = params.filter((x) => x.chapterId === "ch1");
const ch2 = params.filter((x) => x.chapterId === "ch2");

console.log("ch1 static material routes:", ch1.length);
console.log("ch2 static material routes:", ch2.length);
console.log("ch3 static material routes:", ch3.length);

if (ch3.length) {
  console.log("\nSample ch3 routes:");
  console.log(JSON.stringify(ch3.slice(0, 8), null, 2));
} else {
  console.log("\nWARNING: No ch3 static routes generated — pages won't exist at build time.");
}
