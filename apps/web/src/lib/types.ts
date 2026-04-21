export type OfficialPeriodBucket =
  | "classical"
  | "medieval_renaissance"
  | "seventeenth_eighteenth"
  | "nineteenth"
  | "twentieth_twentyfirst";

export type Discipline = "literature" | "arts";

export type SkillType = "factual" | "recognition_style" | "interpretation";

export type ExamTaskType =
  | "identify_work"
  | "identify_creator"
  | "recognize_style"
  | "identify_medium_or_form"
  | "interpret_symbol_or_theme"
  | "situate_period"
  | "compare_movements"
  | "explain_cultural_role";

export type ModuleState = "ready" | "shell";

export type AssessmentMode = "checkpoint" | "module_quiz" | "module_test" | "review";

export type AssessmentTier =
  | "checkpoint"
  | "module_quiz"
  | "module_test"
  | "midpoint_quiz"
  | "midpoint_test"
  | "final_quiz"
  | "mock_exam";

export interface SourceRef {
  id: string;
  label: string;
  kind:
    | "college_board"
    | "study_note"
    | "html_import"
    | "modern_states"
    | "transcript"
    | "slide"
    | "textbook"
    | "backlog";
  citation: string;
  localPath?: string;
  notes?: string;
}

export interface LearnBundle {
  conciseExplanation: string;
  keyExample: string;
  examClue: string;
  compareContrast: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  direction: "term_to_feature" | "feature_to_term" | "work_to_creator" | "concept";
}

export interface VideoSupport {
  id: string;
  title: string;
  url: string;
  resourceType?: "video" | "reference";
  watchFor: string;
  retrievalPrompt: string;
}

export interface QuestionVariant {
  id: string;
  prompt: string;
  mode: AssessmentMode;
  variantType: "recall" | "recognition" | "interpretation";
  choices: string[];
  answer: string;
  explanation: string;
}

export interface Objective {
  id: string;
  moduleId: string;
  sectionId: string;
  title: string;
  officialPeriodBucket: OfficialPeriodBucket;
  discipline: Discipline;
  subtype: string;
  skillType: SkillType;
  examTaskType: ExamTaskType;
  masteryWeight: number;
  tags: string[];
  sourceRefIds: string[];
  learn: LearnBundle;
  flashcards: Flashcard[];
  videos: VideoSupport[];
  quizVariants: QuestionVariant[];
  testVariant: QuestionVariant;
}

export interface Section {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  objectiveIds: string[];
  estimatedMinutes: number;
}

export interface ModuleSummary {
  id: string;
  title: string;
  shortTitle: string;
  order: number;
  state: ModuleState;
  description: string;
  officialBuckets: OfficialPeriodBucket[];
  focus: string;
}

export interface AssessmentQuestion extends QuestionVariant {
  objectiveId: string;
  objectiveTitle: string;
}

export interface AssessmentUnlockRule {
  type: "modules_passed";
  moduleIds: string[];
  minimumPassed: number;
  label: string;
}

export interface AssessmentBundle {
  id: string;
  title: string;
  description: string;
  mode: AssessmentMode;
  tier: AssessmentTier;
  feedback: "immediate" | "deferred";
  passingScore: number;
  scopeModuleIds: string[];
  timeLimitMinutes?: number;
  unlockRule?: AssessmentUnlockRule;
  questions: AssessmentQuestion[];
}

export interface ModuleBundle extends ModuleSummary {
  sections: Section[];
  objectives: Objective[];
  checkpoints: AssessmentBundle[];
  moduleQuiz: AssessmentBundle | null;
  moduleTest: AssessmentBundle | null;
  cumulativeAssessments: AssessmentBundle[];
  shellSections?: Array<{ title: string; description: string }>;
}

export interface ObjectiveProgress {
  learned: boolean;
  flashcardsReviewed: boolean;
  averageScore: number;
  attempts: number;
  weaknessWeight: number;
  lastScore?: number;
}

export interface SectionProgress {
  score?: number;
  passed: boolean;
}

export interface ModuleProgress {
  quizScore?: number;
  testScore?: number;
  status: "not_started" | "learning" | "needs_review" | "passed" | "mastered";
}

export interface AssessmentProgress {
  score?: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt?: string;
}

export interface PendingAttempt {
  id: string;
  assessmentId: string;
  assessmentMode: AssessmentMode;
  moduleId?: string | null;
  scopeModuleIds: string[];
  score: number;
  answers: Record<string, string>;
  createdAt: string;
}

export interface LocalProgressState {
  objectiveProgress: Record<string, ObjectiveProgress>;
  sectionProgress: Record<string, SectionProgress>;
  moduleProgress: Record<string, ModuleProgress>;
  assessmentProgress: Record<string, AssessmentProgress>;
  pendingAttempts: PendingAttempt[];
  updatedAt: string;
}

export interface Recommendation {
  title: string;
  detail: string;
  actionLabel: string;
  targetId: string;
  targetType: "objective" | "checkpoint" | "module_quiz" | "module_test" | "review";
}

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

export type EditorialMaterialId =
  | "hub"
  | "learn-1"
  | "learn-2"
  | "learn-3"
  | "learn-4"
  | "flashcards"
  | "videos"
  | "quiz"
  | "results"
  | "hard-test";

export type EditorialCalloutTone =
  | "beginner"
  | "exam"
  | "why"
  | "recognition"
  | "compare"
  | "info";

export type EditorialChartType = "flow" | "bar" | "line";

export interface EditorialCallout {
  tone: EditorialCalloutTone;
  label: string;
  emoji: string;
  text: string;
}

export interface EditorialKeyTakeaway {
  title: string;
  items: string[];
}

export interface EditorialMnemonic {
  label: string;
  purpose: string;
  lines: string[];
}

export interface EditorialDiagramDefinition {
  id: string;
  title: string;
  type: EditorialChartType;
  labels: string[];
  values: number[];
  valueLabel?: string;
  accentColor?: string;
  description?: string;
}

export interface EditorialResource {
  id: string;
  title: string;
  url: string;
  source?: string;
  description: string;
  objectiveTags?: string[];
  kind: "image" | "resource";
}

export interface EditorialVideo {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  watchFor: string;
  objectiveTags?: string[];
}

export interface EditorialFlashcard {
  id: string;
  front: string;
  back: string;
  objectiveTags?: string[];
  deck: "core" | "extra";
}

export interface EditorialQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  objectiveTags: string[];
  reviewMaterialIds: EditorialMaterialId[];
}

export interface EditorialCheatSheet {
  summaryLine: string;
  highlights: string[];
  mnemonics: string[];
}

export type EditorialContentBlock =
  | { type: "heading"; text: string; level: 1 | 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "callout"; callout: EditorialCallout }
  | { type: "key-takeaways"; takeaway: EditorialKeyTakeaway }
  | { type: "mnemonic"; mnemonic: EditorialMnemonic }
  | { type: "resource"; resource: EditorialResource }
  | { type: "diagram"; diagram: EditorialDiagramDefinition };

export interface EditorialLearnPage {
  id: Extract<
    EditorialMaterialId,
    "learn-1" | "learn-2" | "learn-3" | "learn-4"
  >;
  title: string;
  emoji: string;
  blocks: EditorialContentBlock[];
}

export interface EditorialMaterial {
  id: EditorialMaterialId;
  title: string;
  emoji: string;
  type:
    | "hub"
    | "learn"
    | "flashcards"
    | "videos"
    | "quiz"
    | "results"
    | "hard-test";
  lockedUntilQuizPass?: boolean;
}

export interface EditorialObjective {
  id: string;
  label: string;
}

export interface EditorialSection {
  id: string;
  title: string;
  textbookHeading: string;
  emoji: string;
  purpose: string;
  studentGuide: string;
  materials: EditorialMaterial[];
  objectives: EditorialObjective[];
  learnPages: EditorialLearnPage[];
  flashcards: EditorialFlashcard[];
  videos: EditorialVideo[];
  resources: EditorialResource[];
  quiz: {
    questions: EditorialQuestion[];
    passThreshold: number;
  };
  hardTest: {
    questions: EditorialQuestion[];
    passThreshold: number;
  };
  cheatSheet: EditorialCheatSheet;
}

export interface NotebookLmSource {
  label: string;
  kind: "audio" | "video" | "quiz" | "flashcards" | "slides" | "report" | "guide" | "infographic" | "bundle";
  section?: string;
}

export interface EditorialChapter {
  id: string;
  title: string;
  emoji: string;
  color: string;
  locked: boolean;
  notebookLmUrl?: string;
  notebookLmSources?: NotebookLmSource[];
  sections: EditorialSection[];
}

export interface EditorialCourse {
  chapters: EditorialChapter[];
}

export interface EditorialSectionProgress {
  unlocked: boolean;
  completed: boolean;
  visitedMaterials: EditorialMaterialId[];
  flashcardPosition: number;
  starredFlashcards: string[];
  quizAnswers: Record<number, number>;
  quizSubmitted: boolean;
  quizScore: number | null;
  hardTestAnswers: Record<number, number>;
  hardTestSubmitted: boolean;
  hardTestScore: number | null;
}

export interface EditorialChapterProgress {
  unlocked: boolean;
  sections: Record<string, EditorialSectionProgress>;
}

export interface EditorialProgress {
  currentRoute: string;
  chapters: Record<string, EditorialChapterProgress>;
}
