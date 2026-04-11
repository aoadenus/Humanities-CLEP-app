import { getModuleSummaries } from "@/content/course";
import { StudyShell } from "@/components/study-shell";

export default function Home() {
  return <StudyShell initialModules={getModuleSummaries()} />;
}
