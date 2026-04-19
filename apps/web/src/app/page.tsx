import { Dashboard } from "@/components/editorial/Dashboard";
import { getEditorialCourse } from "@/content/editorial-course";

export default function Home() {
  const course = getEditorialCourse();

  return <Dashboard course={course} />;
}
