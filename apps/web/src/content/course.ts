import type {
  AssessmentBundle,
  AssessmentQuestion,
  ModuleBundle,
  ModuleSummary,
  Objective,
  Section,
  SourceRef,
} from "@/lib/types";
import {
  module2Objectives,
  module2Sections,
  module2SourceRefs,
  module2Summary,
} from "@/content/module-2";

const sourceRefs: SourceRef[] = [
  {
    id: "cb-aag",
    label: "CLEP Humanities At a Glance",
    kind: "college_board",
    citation:
      "Official exam blueprint: ~140 questions in 90 minutes, 50/50 literature-arts, 50/30/20 skill weighting.",
    localPath: "CLEP_Humanities_AAG.pdf",
  },
  {
    id: "sample-set",
    label: "Sample Question Anchor Set",
    kind: "study_note",
    citation:
      "Sample-style anchors for work identification, symbol recognition, instrument recognition, and cultural-role questions.",
    localPath: "docs/notes/samplequestions.txt",
  },
  {
    id: "practice-bank",
    label: "Practice Question Seed Bank",
    kind: "study_note",
    citation:
      "Module checkpoint patterns and question phrasing used to seed local objective-level assessments.",
    localPath: "docs/notes/practice.txt",
  },
  {
    id: "classical-unit",
    label: "Modern States Classical Module Overview",
    kind: "modern_states",
    citation:
      "Module 1 topic tree covering Ancient Greece, Homer, democracy, philosophy, tragedy, Rome, Virgil, Horace, and Ovid.",
    localPath: "01_unit-01/01_unit-1-the-classical-period.html",
  },
  {
    id: "classical-transcript",
    label: "Classical Module Transcript",
    kind: "transcript",
    citation: "Transcript for the imported Modern States classical module introduction.",
    localPath: "docs/transcripts/unit-1/Humanities_1_0T.pdf",
  },
  {
    id: "timeline-import",
    label: "Humanities Master Timeline",
    kind: "html_import",
    citation:
      "Locally authored timeline spanning art, literature, and music from classical antiquity to the present.",
    localPath: "content/reference/html-guides/01_timeline.html",
  },
  {
    id: "architecture-import",
    label: "Architecture Style Visual Guide",
    kind: "html_import",
    citation:
      "Locally authored visual comparison of Greek orders, Romanesque vs. Gothic, and modern architecture.",
    localPath: "content/reference/html-guides/03_architecture.html",
  },
  {
    id: "links-classical",
    label: "Curated Classical Links",
    kind: "study_note",
    citation: "Classical-era support links and museum/article references for the course.",
    localPath: "docs/notes/helpfullinks.txt",
  },
  {
    id: "videos-playlist",
    label: "Curated Video Playlist",
    kind: "study_note",
    citation: "YouTube study playlist grouped by chapter and ready for embedding.",
    localPath: "docs/notes/videos.txt",
  },
  {
    id: "sayre-vol-1",
    label: "Sayre Volume I",
    kind: "textbook",
    citation:
      "Primary textbook spine for early civilizations through early modernity; used as a learning-content source, not runtime media.",
    localPath:
      "pdfs/The Humanities_ Culture, Continuity and Change, Volume I_ -- Sayre, Henry M_, 1948- -- 2nd ed_, Boston, Massachusetts, 2012 -- Boston _ Prentice Hall -- isbn13 9780205012602 -- 2033150b950b54a7a1751d9f6ce7d07f -- A.pdf",
  },
  {
    id: "ocr-backlog",
    label: "Unprocessed Video and Web Source PDFs",
    kind: "backlog",
    citation:
      "Added source bundles exist locally but require OCR or manual tagging before they can become normalized runtime content.",
    localPath: "pdfs/videos.pdf / pdfs/websources.pdf",
  },
  ...module2SourceRefs,
];

const moduleSummaries: ModuleSummary[] = [
  {
    id: "module-1-classical",
    title: "Classical World",
    shortTitle: "Classical",
    order: 1,
    state: "ready",
    description:
      "The Greek and Roman foundations of literature, philosophy, civic thought, sculpture, architecture, and epic identity.",
    officialBuckets: ["classical"],
    focus: "Launch module with full objective bundles and assessments.",
  },
  {
    ...module2Summary,
  },
  {
    id: "module-3-renaissance",
    title: "Renaissance",
    shortTitle: "Renaissance",
    order: 3,
    state: "shell",
    description:
      "Humanism, perspective, portraiture, secular drama, sonnet culture, and the rebirth of classical learning.",
    officialBuckets: ["medieval_renaissance"],
    focus: "Shell only until objective bundles are approved.",
  },
  {
    id: "module-4-baroque-enlightenment",
    title: "Baroque and Enlightenment",
    shortTitle: "Baroque + Enlightenment",
    order: 4,
    state: "shell",
    description:
      "Baroque drama, empirical philosophy, satire, Rococo, Neoclassicism, opera, oratorio, and the public sphere.",
    officialBuckets: ["seventeenth_eighteenth"],
    focus: "Shell only until objective bundles are approved.",
  },
  {
    id: "module-5-romanticism-realism",
    title: "Romanticism and Realism",
    shortTitle: "Romanticism + Realism",
    order: 5,
    state: "shell",
    description:
      "Emotion, the sublime, social truth, nationalism, nineteenth-century fiction, opera, and modern visual movements.",
    officialBuckets: ["nineteenth"],
    focus: "Shell only until objective bundles are approved.",
  },
  {
    id: "module-6-modern-contemporary",
    title: "Twentieth and Twenty-First Centuries",
    shortTitle: "Modern + Contemporary",
    order: 6,
    state: "shell",
    description:
      "Modernism, postmodernism, abstract and conceptual art, experimental literature, film, design, and global culture.",
    officialBuckets: ["twentieth_twentyfirst"],
    focus: "Shell only until objective bundles are approved.",
  },
];

const sections: Section[] = [
  {
    id: "section-1-greek-world",
    moduleId: "module-1-classical",
    title: "Greek Civic and Epic Foundations",
    description:
      "How Greek public life, epic poetry, and heroic values set up later literature and political thought.",
    objectiveIds: [
      "classical.lit.civic_imagination",
      "classical.lit.homeric_epic",
    ],
    estimatedMinutes: 25,
  },
  {
    id: "section-2-tragedy-philosophy",
    moduleId: "module-1-classical",
    title: "Tragedy and Philosophical Inquiry",
    description:
      "Greek tragedy, catharsis, and the rise of systematic philosophical analysis.",
    objectiveIds: [
      "classical.lit.greek_tragedy",
      "classical.lit.philosophical_reasoning",
    ],
    estimatedMinutes: 25,
  },
  {
    id: "section-3-architecture-sculpture",
    moduleId: "module-1-classical",
    title: "Architecture and Sculpture Recognition",
    description:
      "Greek orders, temple logic, contrapposto, and the classical ideal in art.",
    objectiveIds: [
      "classical.art.greek_orders",
      "classical.art.classical_sculpture",
    ],
    estimatedMinutes: 30,
  },
  {
    id: "section-4-rome-legacy",
    moduleId: "module-1-classical",
    title: "Roman Adaptation and Imperial Legacy",
    description:
      "Roman engineering, public spectacle, and literary identity from Virgil to Horace and Ovid.",
    objectiveIds: [
      "classical.art.roman_engineering",
      "classical.lit.roman_literary_identity",
    ],
    estimatedMinutes: 30,
  },
  ...module2Sections,
];

const objectives: Objective[] = [
  {
    id: "classical.lit.civic_imagination",
    moduleId: "module-1-classical",
    sectionId: "section-1-greek-world",
    title: "Greek civic imagination and public culture",
    officialPeriodBucket: "classical",
    discipline: "literature",
    subtype: "nonfiction/philosophy",
    skillType: "factual",
    examTaskType: "explain_cultural_role",
    masteryWeight: 1,
    tags: ["greece", "democracy", "public-life", "philosophy"],
    sourceRefIds: ["cb-aag", "classical-unit", "classical-transcript", "sayre-vol-1"],
    learn: {
      conciseExplanation:
        "Ancient Greece matters on the CLEP because it joins politics, theater, and philosophy in one public culture. The exam often treats democracy, debate, and inquiry as connected habits rather than isolated facts.",
      keyExample:
        "Athens is the core example: democratic participation, public theater festivals, and philosophical debate all lived in the same civic world.",
      examClue:
        "If a question links public life, reasoned debate, or civic identity to an early Western source, Greece is often the anchor.",
      compareContrast:
        "Compare Greece with Rome: Greece is often the model of experimentation and inquiry, while Rome is more often the model of adaptation, law, and imperial scale.",
    },
    flashcards: [
      {
        id: "fc-civic-1",
        front: "Why does Ancient Greece matter so much on the Humanities CLEP?",
        back: "Because it joins democracy, philosophy, theater, and public debate into one foundational civic culture.",
        direction: "concept",
      },
      {
        id: "fc-civic-2",
        front: "Athens on the CLEP usually signals what kind of cultural pattern?",
        back: "A civic culture of democratic participation, argument, theater, and philosophical inquiry.",
        direction: "concept",
      },
      {
        id: "fc-civic-3",
        front: "Greek public festivals and drama are tied to what broader idea?",
        back: "That literature and performance were public civic acts, not just private entertainment.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-civic-1",
        title: "Ancient Greece in 18 Minutes",
        url: "http://www.youtube.com/watch?v=gFRxmi4uCGo",
        watchFor:
          "Watch for how politics, philosophy, and drama are described as parts of one culture.",
        retrievalPrompt:
          "After the video, explain why Greek democracy and Greek theater belong in the same study section.",
      },
      {
        id: "vid-civic-2",
        title: "The Persians & Greeks: Crash Course World History #5",
        url: "http://www.youtube.com/watch?v=Q-mkVSasZIM",
        watchFor:
          "Watch for the historical rise of Greek city-states and how that context shapes public culture.",
        retrievalPrompt:
          "How did the city-state structure help create a public culture of argument and performance?",
      },
    ],
    quizVariants: [
      {
        id: "q-civic-1",
        prompt:
          "Which description best captures why Ancient Greece is foundational in the humanities?",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "It focused mainly on monastic life and manuscript copying.",
          "It unified civic debate, philosophy, theater, and literary expression in public life.",
          "It replaced myth entirely with modern scientific method.",
          "It produced only military and legal achievements.",
        ],
        answer:
          "It unified civic debate, philosophy, theater, and literary expression in public life.",
        explanation:
          "The CLEP repeatedly treats Greek politics, philosophy, and drama as parts of one formative civic culture.",
      },
      {
        id: "q-civic-2",
        prompt:
          "A CLEP question links democratic participation, public festivals, and philosophical inquiry. Which culture is the strongest fit?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["Ancient Greece", "Imperial Rome", "Byzantium", "Enlightenment France"],
        answer: "Ancient Greece",
        explanation:
          "Those clues point to Greek civic culture, especially Athens, where public debate, theater, and philosophy overlap.",
      },
    ],
    testVariant: {
      id: "t-civic-1",
      prompt:
        "A humanities survey describes a culture where citizens gathered for debate, dramatic festivals, and philosophical argument. What larger humanities idea does that culture most strongly model?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "The fusion of public life and cultural production",
        "The dominance of feudal hierarchy",
        "The rejection of performance as civic ritual",
        "The isolation of literature from politics",
      ],
      answer: "The fusion of public life and cultural production",
      explanation:
        "Greek civic culture is important because public life and artistic/intellectual production were closely connected.",
    },
  },
  {
    id: "classical.lit.homeric_epic",
    moduleId: "module-1-classical",
    sectionId: "section-1-greek-world",
    title: "Homeric epic and the heroic code",
    officialPeriodBucket: "classical",
    discipline: "literature",
    subtype: "epic",
    skillType: "factual",
    examTaskType: "identify_work",
    masteryWeight: 1.1,
    tags: ["homer", "iliad", "odyssey", "epic", "heroism"],
    sourceRefIds: ["cb-aag", "sample-set", "classical-unit", "videos-playlist"],
    learn: {
      conciseExplanation:
        "Homer anchors classical literature because the CLEP treats the Iliad and Odyssey as major templates for heroism, memory, war, and journey. You need to recognize both titles and the values they dramatize.",
      keyExample:
        "The Iliad centers on rage, honor, and war; the Odyssey centers on return, endurance, and cunning.",
      examClue:
        "When a question describes a long heroic journey, clever survival, or a homecoming after war, the Odyssey is often the best fit.",
      compareContrast:
        "Compare Odysseus to Achilles: Odysseus is defined by strategy and endurance, Achilles by martial honor and rage.",
    },
    flashcards: [
      {
        id: "fc-homer-1",
        front: "Which Homeric work centers on the long return journey of Odysseus?",
        back: "The Odyssey.",
        direction: "work_to_creator",
      },
      {
        id: "fc-homer-2",
        front: "The Iliad is centered on what emotional and social code?",
        back: "Rage, honor, and the warrior code in the Trojan War.",
        direction: "concept",
      },
      {
        id: "fc-homer-3",
        front: "Odysseus is most defined by what quality?",
        back: "Cleverness and strategic endurance.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-homer-1",
        title: "The Odyssey: Crash Course Literature 201",
        url: "http://www.youtube.com/watch?v=MS4jk5kavy4",
        watchFor:
          "Watch for how the Odyssey turns homecoming and cunning into literary identity.",
        retrievalPrompt:
          "Why is Odysseus easier to identify from strategy than from brute strength?",
      },
    ],
    quizVariants: [
      {
        id: "q-homer-1",
        prompt: "Which work is traditionally attributed to Homer?",
        mode: "checkpoint",
        variantType: "recall",
        choices: ["The Odyssey", "The Aeneid", "Metamorphoses", "The Republic"],
        answer: "The Odyssey",
        explanation: "The Odyssey is one of the two major Homeric epics.",
      },
      {
        id: "q-homer-2",
        prompt:
          "A question describes a hero defined by cunning, endurance, and a difficult voyage home. Which work is the best match?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["The Iliad", "The Odyssey", "The Aeneid", "Oedipus Rex"],
        answer: "The Odyssey",
        explanation:
          "Journey, homecoming, and clever survival point to Odysseus and the Odyssey.",
      },
    ],
    testVariant: {
      id: "t-homer-1",
      prompt:
        "Why does the Odyssey often appear on a humanities exam as more than a plot question?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "It models the epic hero as only a military conqueror.",
        "It turns intelligence, endurance, and identity after war into a major literary pattern.",
        "It is the first realist novel.",
        "It rejects the role of myth in culture.",
      ],
      answer:
        "It turns intelligence, endurance, and identity after war into a major literary pattern.",
      explanation:
        "The Odyssey matters because it defines a hero through cunning, endurance, and return, not just battlefield strength.",
    },
  },
  {
    id: "classical.lit.greek_tragedy",
    moduleId: "module-1-classical",
    sectionId: "section-2-tragedy-philosophy",
    title: "Greek tragedy, chorus, and catharsis",
    officialPeriodBucket: "classical",
    discipline: "literature",
    subtype: "drama",
    skillType: "recognition_style",
    examTaskType: "identify_medium_or_form",
    masteryWeight: 1,
    tags: ["tragedy", "chorus", "catharsis", "sophocles", "aristotle"],
    sourceRefIds: ["cb-aag", "sample-set", "practice-bank", "links-classical"],
    learn: {
      conciseExplanation:
        "Greek tragedy is exam-critical because it combines dramatic form with philosophical language about human error, fate, and emotional release. Catharsis and the chorus are recurring recognition cues.",
      keyExample:
        "Sophocles' Oedipus Rex is a standard anchor for tragic downfall, recognition, and the consequences of human blindness.",
      examClue:
        "If a question asks about pity and fear, catharsis is the answer pattern to expect.",
      compareContrast:
        "Compare tragedy with epic: epic follows extended heroic action, while tragedy compresses crisis, error, and emotional recognition into staged drama.",
    },
    flashcards: [
      {
        id: "fc-tragedy-1",
        front: "In Greek tragedy, what is catharsis?",
        back: "The purging or release of pity and fear through the audience's experience of tragedy.",
        direction: "term_to_feature",
      },
      {
        id: "fc-tragedy-2",
        front: "What was the primary function of the Greek chorus?",
        back: "To comment on the action and frame its moral or emotional meaning.",
        direction: "feature_to_term",
      },
      {
        id: "fc-tragedy-3",
        front: "Which playwright wrote Oedipus Rex?",
        back: "Sophocles.",
        direction: "work_to_creator",
      },
    ],
    videos: [
      {
        id: "vid-tragedy-1",
        title: "Quizlet: Ancient Greek Drama & Philosophy",
        url: "https://www.google.com/search?q=https://quizlet.com/512903721/clep-humanities-ancient-greece-and-rome-flash-cards/",
        watchFor:
          "Use this as a quick recognition review for tragedy vocabulary and key figures.",
        retrievalPrompt:
          "After reviewing, define catharsis and explain why the chorus matters.",
      },
    ],
    quizVariants: [
      {
        id: "q-tragedy-1",
        prompt: 'In Greek tragedy, "catharsis" refers to',
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "a comic reversal",
          "emotional purging through pity and fear",
          "the use of stock masks",
          "a purely musical refrain",
        ],
        answer: "emotional purging through pity and fear",
        explanation:
          "Aristotle uses catharsis for the emotional release produced by tragedy.",
      },
      {
        id: "q-tragedy-2",
        prompt:
          "A drama uses a chorus to comment on events and moves toward a noble figure's downfall. Which tradition does this most strongly match?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Greek tragedy",
          "Roman satire",
          "Medieval mystery play",
          "Modern absurdist theater",
        ],
        answer: "Greek tragedy",
        explanation:
          "The chorus, noble fall, and cathartic structure are standard Greek tragic markers.",
      },
    ],
    testVariant: {
      id: "t-tragedy-1",
      prompt:
        "Why is catharsis a more useful CLEP term than merely memorizing a play title?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Because it helps identify how Greek tragedy affects an audience.",
        "Because it refers to Greek architecture rather than literature.",
        "Because it is another word for epic simile.",
        "Because it explains Roman political law.",
      ],
      answer: "Because it helps identify how Greek tragedy affects an audience.",
      explanation:
        "The CLEP often tests dramatic concepts and audience effect, not just title recall.",
    },
  },
  {
    id: "classical.lit.philosophical_reasoning",
    moduleId: "module-1-classical",
    sectionId: "section-2-tragedy-philosophy",
    title: "Philosophical reasoning from Socrates to Aristotle",
    officialPeriodBucket: "classical",
    discipline: "literature",
    subtype: "philosophy",
    skillType: "factual",
    examTaskType: "identify_creator",
    masteryWeight: 1.1,
    tags: ["plato", "aristotle", "socrates", "republic", "poetics"],
    sourceRefIds: ["cb-aag", "practice-bank", "classical-unit", "sayre-vol-1"],
    learn: {
      conciseExplanation:
        "Classical philosophy appears on the CLEP as both authors-and-works knowledge and as a style of reasoning. You need to distinguish Plato's ideal inquiry from Aristotle's more analytic, classificatory approach.",
      keyExample:
        "Plato's Allegory of the Cave belongs to the Republic; Aristotle's Poetics defines tragedy and catharsis.",
      examClue:
        "If the question asks who analyzed drama systematically or tutored Alexander the Great, Aristotle is the likely answer.",
      compareContrast:
        "Compare Plato and Aristotle: Plato often points upward toward ideals; Aristotle often organizes concrete forms, causes, and genres.",
    },
    flashcards: [
      {
        id: "fc-phil-1",
        front: "Plato's Allegory of the Cave appears in what work?",
        back: "The Republic.",
        direction: "work_to_creator",
      },
      {
        id: "fc-phil-2",
        front: "Which philosopher wrote the Poetics and is associated with catharsis?",
        back: "Aristotle.",
        direction: "feature_to_term",
      },
      {
        id: "fc-phil-3",
        front: "Which philosopher tutored Alexander the Great?",
        back: "Aristotle.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-phil-1",
        title: "Ancient Greece in 18 Minutes",
        url: "http://www.youtube.com/watch?v=gFRxmi4uCGo",
        watchFor:
          "Focus on the segments that connect philosophers to the larger Greek public world.",
        retrievalPrompt:
          "How is philosophical inquiry presented as part of Greek culture rather than a separate specialty?",
      },
    ],
    quizVariants: [
      {
        id: "q-phil-1",
        prompt: 'Plato\'s "Allegory of the Cave" appears in',
        mode: "checkpoint",
        variantType: "recall",
        choices: ["Poetics", "The Republic", "Nicomachean Ethics", "Confessions"],
        answer: "The Republic",
        explanation: "The Allegory of the Cave is one of the Republic's most famous passages.",
      },
      {
        id: "q-phil-2",
        prompt:
          "Which figure is most associated with classifying drama, ethics, and politics in a systematic way?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["Virgil", "Aristotle", "Dante", "Voltaire"],
        answer: "Aristotle",
        explanation:
          "Aristotle is the best fit for systematic analysis across ethics, politics, and drama.",
      },
    ],
    testVariant: {
      id: "t-phil-1",
      prompt:
        "A question asks you to connect the Poetics, tragic structure, and analytical classification. Which thinker best fits all three clues?",
      mode: "module_test",
      variantType: "interpretation",
      choices: ["Plato", "Sophocles", "Aristotle", "Horace"],
      answer: "Aristotle",
      explanation:
        "Aristotle's Poetics and his analytic method make him the best match for those combined clues.",
    },
  },
  {
    id: "classical.art.greek_orders",
    moduleId: "module-1-classical",
    sectionId: "section-3-architecture-sculpture",
    title: "Greek architectural orders and temple recognition",
    officialPeriodBucket: "classical",
    discipline: "arts",
    subtype: "architecture",
    skillType: "recognition_style",
    examTaskType: "recognize_style",
    masteryWeight: 1.2,
    tags: ["doric", "ionic", "corinthian", "parthenon", "temple"],
    sourceRefIds: ["cb-aag", "practice-bank", "architecture-import", "links-classical"],
    learn: {
      conciseExplanation:
        "Greek architecture is heavily testable because style recognition works well in image questions. The fastest win is mastering Doric, Ionic, and Corinthian capitals, plus knowing the temple as a house for the gods rather than a modern congregation hall.",
      keyExample:
        "The Parthenon is the signature classical Greek temple and is commonly paired with questions about columns, proportion, and civic-religious identity.",
      examClue:
        "Scroll capitals indicate Ionic; leafy capitals indicate Corinthian; sturdy plain capitals indicate Doric.",
      compareContrast:
        "Compare Greek temples with Roman engineering: Greek style emphasizes order and proportion, while Rome is more often associated with arches, domes, and concrete scale.",
    },
    flashcards: [
      {
        id: "fc-orders-1",
        front: "Which Greek order has scroll-like capitals?",
        back: "Ionic.",
        direction: "term_to_feature",
      },
      {
        id: "fc-orders-2",
        front: "Which Greek order has the plainest, sturdiest capital?",
        back: "Doric.",
        direction: "feature_to_term",
      },
      {
        id: "fc-orders-3",
        front: "Leafy, ornate capitals signal which order?",
        back: "Corinthian.",
        direction: "feature_to_term",
      },
      {
        id: "fc-orders-4",
        front: "What was the main function of Greek temples?",
        back: "They were houses for the gods and centers of ritual worship.",
        direction: "concept",
      },
    ],
    videos: [
      {
        id: "vid-orders-1",
        title: "The Three Greek Orders",
        url: "https://www.google.com/search?q=https://www.khanacademy.org/humanities/ap-art-history/ancient-mediterranean-ap/greece-etruria-rome/a/greek-architectural-orders",
        watchFor:
          "Watch for the visual difference in capitals and proportions; this is pure image-question prep.",
        retrievalPrompt:
          "After reviewing, identify the single fastest visual cue for each Greek order.",
      },
      {
        id: "vid-orders-2",
        title: "Greek ruins and site tours",
        url: "https://www.google.com/search?q=https://artsandculture.google.com/project/talking-tours",
        watchFor:
          "Use the site view to connect the order labels to actual temple settings rather than isolated diagrams.",
        retrievalPrompt:
          "How does seeing a temple in context help you remember its purpose and scale?",
      },
    ],
    quizVariants: [
      {
        id: "q-orders-1",
        prompt: "The Greek architectural order with scroll-like capitals is",
        mode: "checkpoint",
        variantType: "recall",
        choices: ["Doric", "Ionic", "Corinthian", "Tuscan"],
        answer: "Ionic",
        explanation: "Ionic capitals are recognized by their scroll-like volutes.",
      },
      {
        id: "q-orders-2",
        prompt: "What was the primary function of Greek temples?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Public debate halls",
          "Houses for the gods and ritual worship",
          "Military training spaces",
          "Market exchange centers",
        ],
        answer: "Houses for the gods and ritual worship",
        explanation:
          "Greek temples housed cult images and ritual activity; they were not primarily congregational interiors.",
      },
    ],
    testVariant: {
      id: "t-orders-1",
      prompt:
        "A reproduced building shows balanced proportions and a column capital with carved leaves. Which identification is strongest?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Doric Greek order",
        "Ionic Greek order",
        "Corinthian Greek order",
        "Romanesque pier system",
      ],
      answer: "Corinthian Greek order",
      explanation:
        "Leafy capitals are the key recognition cue for Corinthian columns.",
    },
  },
  {
    id: "classical.art.classical_sculpture",
    moduleId: "module-1-classical",
    sectionId: "section-3-architecture-sculpture",
    title: "Classical sculpture, ideal proportion, and contrapposto",
    officialPeriodBucket: "classical",
    discipline: "arts",
    subtype: "visual art",
    skillType: "recognition_style",
    examTaskType: "recognize_style",
    masteryWeight: 1,
    tags: ["contrapposto", "classical", "sculpture", "idealism", "hellenistic"],
    sourceRefIds: ["cb-aag", "timeline-import", "architecture-import", "practice-bank"],
    learn: {
      conciseExplanation:
        "Classical sculpture often appears as a style-recognition problem. The core idea is idealized balance: calm proportion, anatomical order, and the believable shift of weight called contrapposto.",
      keyExample:
        "A standing figure whose weight settles into one hip is the standard visual for contrapposto and for the move away from stiff frontality.",
      examClue:
        "If the figure looks balanced, idealized, and calm rather than wildly emotional, think Classical Greece rather than Hellenistic drama.",
      compareContrast:
        "Compare Classical and Hellenistic sculpture: Classical favors calm balance and ideal proportion; Hellenistic pushes emotion, motion, and theatrical intensity.",
    },
    flashcards: [
      {
        id: "fc-sculpt-1",
        front: "What does contrapposto mean in sculpture?",
        back: "A natural shift of weight that makes the figure look balanced and alive.",
        direction: "term_to_feature",
      },
      {
        id: "fc-sculpt-2",
        front: "Classical Greek sculpture is most associated with what larger visual ideal?",
        back: "Idealized proportion and calm balance.",
        direction: "concept",
      },
      {
        id: "fc-sculpt-3",
        front: "What major mood difference separates Classical from Hellenistic sculpture?",
        back: "Classical is calmer and more balanced; Hellenistic is more emotional and dramatic.",
        direction: "feature_to_term",
      },
    ],
    videos: [],
    quizVariants: [
      {
        id: "q-sculpt-1",
        prompt: "Contrapposto in sculpture refers to",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "rigid frontality",
          "a natural shift of body weight",
          "purely decorative patterning",
          "extreme emotional distortion",
        ],
        answer: "a natural shift of body weight",
        explanation:
          "Contrapposto gives the figure a natural, balanced posture through weight shift.",
      },
      {
        id: "q-sculpt-2",
        prompt:
          "A sculpture emphasizes ideal proportion, calm posture, and restrained emotion. Which style is the best fit?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Classical Greek",
          "Hellenistic Greek",
          "Baroque Italian",
          "Abstract Expressionist",
        ],
        answer: "Classical Greek",
        explanation:
          "Calm balance and ideal proportion are the signature cues of Classical Greek sculpture.",
      },
    ],
    testVariant: {
      id: "t-sculpt-1",
      prompt:
        "If an exam image shows a figure with a believable weight shift but little emotional excess, what distinction is it most likely testing?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Classical balance versus Hellenistic drama",
        "Gothic versus Romanesque architecture",
        "Epic versus lyric poetry",
        "Baroque versus Rococo ornament",
      ],
      answer: "Classical balance versus Hellenistic drama",
      explanation:
        "Contrapposto plus calm idealization is a strong clue for Classical rather than Hellenistic sculpture.",
    },
  },
  {
    id: "classical.art.roman_engineering",
    moduleId: "module-1-classical",
    sectionId: "section-4-rome-legacy",
    title: "Roman engineering, spectacle, and public architecture",
    officialPeriodBucket: "classical",
    discipline: "arts",
    subtype: "architecture",
    skillType: "factual",
    examTaskType: "identify_medium_or_form",
    masteryWeight: 1.1,
    tags: ["rome", "pantheon", "arch", "concrete", "colosseum"],
    sourceRefIds: ["cb-aag", "practice-bank", "timeline-import", "architecture-import"],
    learn: {
      conciseExplanation:
        "Roman art and architecture often appear as engineering recognition. The quick identifiers are the arch, vault, dome, concrete construction, and large public spaces such as the amphitheater.",
      keyExample:
        "The Pantheon is the signature Roman dome question; the Colosseum is the signature spectacle/amphitheater question.",
      examClue:
        "If a question mentions dome mastery or an oculus, think Pantheon. If it mentions gladiatorial contests, think amphitheater/Colosseum.",
      compareContrast:
        "Compare Greece and Rome: Greece is more often tested through proportional temple orders; Rome through arches, domes, concrete, and imperial scale.",
    },
    flashcards: [
      {
        id: "fc-rome-1",
        front: "Which Roman structure is especially famous for its dome and oculus?",
        back: "The Pantheon.",
        direction: "work_to_creator",
      },
      {
        id: "fc-rome-2",
        front: "Roman engineering is especially associated with what materials and forms?",
        back: "Concrete, the arch, the vault, and the dome.",
        direction: "concept",
      },
      {
        id: "fc-rome-3",
        front: "A building for gladiatorial contests is called what?",
        back: "An amphitheater.",
        direction: "term_to_feature",
      },
    ],
    videos: [
      {
        id: "vid-rome-1",
        title: "Rise & Fall of Ancient Greece",
        url: "http://www.youtube.com/watch?v=Z_5Cl9nK-qA",
        watchFor:
          "Use this for chronological context so Roman adaptation lands in sequence after Greek foundations.",
        retrievalPrompt:
          "What changes when power moves from Greek civic culture to Roman imperial scale?",
      },
    ],
    quizVariants: [
      {
        id: "q-rome-1",
        prompt:
          "Roman engineering is especially associated with the extensive use of",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "flying buttresses",
          "concrete and the arch",
          "pointed arches",
          "steel framing",
        ],
        answer: "concrete and the arch",
        explanation:
          "Concrete, arches, vaults, and domes are the central Roman engineering markers.",
      },
      {
        id: "q-rome-2",
        prompt:
          "Which building name is the strongest match for gladiatorial spectacle in ancient Rome?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["Basilica", "Amphitheater", "Forum", "Temple"],
        answer: "Amphitheater",
        explanation:
          "Amphitheaters, especially the Colosseum, are tied to Roman public spectacle.",
      },
    ],
    testVariant: {
      id: "t-rome-1",
      prompt:
        "An exam image shows a massive interior dome lit by a central opening. Which Roman work is the strongest identification?",
      mode: "module_test",
      variantType: "interpretation",
      choices: ["Parthenon", "Pantheon", "Chartres Cathedral", "St. Peter's Basilica"],
      answer: "Pantheon",
      explanation:
        "The dome plus oculus combination is the classic Pantheon recognition pattern.",
    },
  },
  {
    id: "classical.lit.roman_literary_identity",
    moduleId: "module-1-classical",
    sectionId: "section-4-rome-legacy",
    title: "Roman literary identity from Virgil to Horace and Ovid",
    officialPeriodBucket: "classical",
    discipline: "literature",
    subtype: "poetry",
    skillType: "factual",
    examTaskType: "identify_creator",
    masteryWeight: 1.1,
    tags: ["virgil", "aeneid", "ovid", "horace", "rome"],
    sourceRefIds: ["cb-aag", "classical-unit", "practice-bank", "sample-set"],
    learn: {
      conciseExplanation:
        "Rome often appears in literature questions through Virgil, Ovid, and Horace. The exam expects you to know how Roman literature adapts Greek models while asserting Roman duty, empire, transformation, and cultivated poetic voice.",
      keyExample:
        "Virgil's Aeneid is the Roman national epic and emphasizes duty, destiny, and sacrifice for a larger civic mission.",
      examClue:
        "If the question describes the Roman national epic or its hero Aeneas, the answer is Virgil or the Aeneid.",
      compareContrast:
        "Compare Homer and Virgil: Homeric epic centers older Greek heroic traditions, while Virgil reshapes epic into a Roman story of mission, empire, and duty.",
    },
    flashcards: [
      {
        id: "fc-romanlit-1",
        front: "Which Roman poet wrote the Aeneid?",
        back: "Virgil.",
        direction: "work_to_creator",
      },
      {
        id: "fc-romanlit-2",
        front: "Who is the central hero of the Aeneid?",
        back: "Aeneas.",
        direction: "concept",
      },
      {
        id: "fc-romanlit-3",
        front: "Ovid's Metamorphoses is centered on what broad theme?",
        back: "Myths of transformation.",
        direction: "concept",
      },
      {
        id: "fc-romanlit-4",
        front: "What larger value is most emphasized in the Aeneid?",
        back: "Duty and sacrifice for the greater good.",
        direction: "concept",
      },
    ],
    videos: [],
    quizVariants: [
      {
        id: "q-romanlit-1",
        prompt: "The Roman poet Virgil is best known for",
        mode: "checkpoint",
        variantType: "recall",
        choices: ["The Aeneid", "The Iliad", "The Republic", "Metamorphoses"],
        answer: "The Aeneid",
        explanation:
          "Virgil is the Roman epic poet most strongly associated with the Aeneid.",
      },
      {
        id: "q-romanlit-2",
        prompt:
          "A question emphasizes duty, destiny, and sacrifice in a Roman national epic. Which answer is strongest?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["The Odyssey", "The Aeneid", "Oedipus Rex", "Candide"],
        answer: "The Aeneid",
        explanation:
          "Roman duty and national mission point directly to Virgil's Aeneid.",
      },
    ],
    testVariant: {
      id: "t-romanlit-1",
      prompt:
        "Why is the Aeneid more useful on the CLEP than simply knowing one Roman title?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "It models how Rome adapts Greek epic into a civic and imperial identity story.",
        "It proves that Roman poetry rejected all Greek influence.",
        "It is the earliest medieval romance.",
        "It is a dramatic theory text like the Poetics.",
      ],
      answer:
        "It models how Rome adapts Greek epic into a civic and imperial identity story.",
      explanation:
        "The Aeneid is central because it transforms inherited epic form into a specifically Roman vision of duty and destiny.",
    },
  },
  ...module2Objectives,
];

const objectiveById = new Map(objectives.map((objective) => [objective.id, objective]));
const sourceRefById = new Map(sourceRefs.map((sourceRef) => [sourceRef.id, sourceRef]));

function buildAssessmentQuestions(
  objectiveIds: string[],
  mode: AssessmentBundle["mode"],
  limit: number,
  includeTestVariants = mode === "module_test",
): AssessmentQuestion[] {
  const pool = objectiveIds.flatMap((objectiveId) => {
    const objective = objectiveById.get(objectiveId);

    if (!objective) {
      return [];
    }

    const variants = includeTestVariants
      ? [objective.testVariant, ...objective.quizVariants]
      : objective.quizVariants;

    return variants.map((variant) => ({
      ...variant,
      mode,
      objectiveId,
      objectiveTitle: objective.title,
    }));
  });

  return pool.slice(0, limit);
}

function buildShellBundle(
  summary: ModuleSummary,
  shellSections: Array<{ title: string; description: string }>,
): ModuleBundle {
  return {
    ...summary,
    sections: [],
    objectives: [],
    checkpoints: [],
    moduleQuiz: null,
    moduleTest: null,
    cumulativeAssessments,
    shellSections,
  };
}

function buildModuleBundle(moduleSummary: ModuleSummary): ModuleBundle {
  const moduleSections = sections.filter((section) => section.moduleId === moduleSummary.id);
  const allObjectiveIds = moduleSections.flatMap((section) => section.objectiveIds);
  const moduleSlug = moduleSummary.id.replace(/^module-\d+-/, "");

  return {
    ...moduleSummary,
    sections: moduleSections,
    objectives: objectives.filter((objective) => objective.moduleId === moduleSummary.id),
    checkpoints: moduleSections.map((section) => ({
      id: `checkpoint-${section.id}`,
      title: `${section.title} checkpoint`,
      description:
        "Five short questions with immediate feedback. Pass at 70% to keep moving through the module.",
      mode: "checkpoint",
      tier: "checkpoint",
      feedback: "immediate",
      passingScore: 70,
      scopeModuleIds: [moduleSummary.id],
      questions: buildAssessmentQuestions(section.objectiveIds, "checkpoint", 5),
    })),
    moduleQuiz: {
      id: `module-quiz-${moduleSlug}`,
      title: `${moduleSummary.shortTitle} module quiz`,
      description:
        "Twelve immediate-feedback questions that sample every objective before the formal module test unlocks.",
      mode: "module_quiz",
      tier: "module_quiz",
      feedback: "immediate",
      passingScore: 75,
      scopeModuleIds: [moduleSummary.id],
      questions: buildAssessmentQuestions(allObjectiveIds, "module_quiz", 12),
    },
    moduleTest: {
      id: `module-test-${moduleSlug}`,
      title: `${moduleSummary.shortTitle} module test`,
      description:
        "Twenty delayed-feedback questions mixing direct recall, style recognition, and interpretation.",
      mode: "module_test",
      tier: "module_test",
      feedback: "deferred",
      passingScore: 75,
      scopeModuleIds: [moduleSummary.id],
      questions: buildAssessmentQuestions(allObjectiveIds, "module_test", 20),
    },
    cumulativeAssessments,
  };
}

function getObjectiveIdsForModules(moduleIds: string[]) {
  return sections
    .filter((section) => moduleIds.includes(section.moduleId))
    .flatMap((section) => section.objectiveIds);
}

function buildCourseReviewBundle({
  id,
  title,
  description,
  tier,
  feedback,
  questionCount,
  passingScore,
  moduleIds,
  timeLimitMinutes,
  minimumPassed,
  includeTestVariants = feedback === "deferred",
}: {
  id: string;
  title: string;
  description: string;
  tier: AssessmentBundle["tier"];
  feedback: AssessmentBundle["feedback"];
  questionCount: number;
  passingScore: number;
  moduleIds: string[];
  timeLimitMinutes?: number;
  minimumPassed: number;
  includeTestVariants?: boolean;
}): AssessmentBundle {
  return {
    id,
    title,
    description,
    mode: "review",
    tier,
    feedback,
    passingScore,
    scopeModuleIds: moduleIds,
    timeLimitMinutes,
    unlockRule: {
      type: "modules_passed",
      moduleIds,
      minimumPassed,
      label:
        minimumPassed === moduleIds.length
          ? `Unlock after ${moduleIds.length} modules are passed.`
          : `Unlock after ${minimumPassed} of ${moduleIds.length} required modules are passed.`,
    },
    questions: buildAssessmentQuestions(
      getObjectiveIdsForModules(moduleIds),
      "review",
      questionCount,
      includeTestVariants,
    ),
  };
}

const cumulativeAssessments: AssessmentBundle[] = [
  buildCourseReviewBundle({
    id: "midpoint-review-quiz",
    title: "Midpoint review quiz",
    description:
      "Twenty-four immediate-feedback questions covering the first three modules before the midpoint test.",
    tier: "midpoint_quiz",
    feedback: "immediate",
    questionCount: 24,
    passingScore: 75,
    moduleIds: [
      "module-1-classical",
      "module-2-middle-ages",
      "module-3-renaissance",
    ],
    minimumPassed: 3,
    includeTestVariants: false,
  }),
  buildCourseReviewBundle({
    id: "midpoint-review-test",
    title: "Midpoint review test",
    description:
      "Forty delayed-feedback questions mixing work recognition, style recognition, and interpretation across Modules 1 through 3.",
    tier: "midpoint_test",
    feedback: "deferred",
    questionCount: 40,
    passingScore: 75,
    moduleIds: [
      "module-1-classical",
      "module-2-middle-ages",
      "module-3-renaissance",
    ],
    minimumPassed: 3,
  }),
  buildCourseReviewBundle({
    id: "final-review-quiz",
    title: "Final cumulative quiz",
    description:
      "Thirty immediate-feedback questions spanning all six modules as a final readiness check.",
    tier: "final_quiz",
    feedback: "immediate",
    questionCount: 30,
    passingScore: 75,
    moduleIds: moduleSummaries.map((summary) => summary.id),
    minimumPassed: 6,
    includeTestVariants: false,
  }),
  buildCourseReviewBundle({
    id: "mock-exam-final",
    title: "Final 140-question mock exam",
    description:
      "A 90-minute deferred-feedback mock exam built from the same objective map as the rest of the course.",
    tier: "mock_exam",
    feedback: "deferred",
    questionCount: 140,
    passingScore: 75,
    moduleIds: moduleSummaries.map((summary) => summary.id),
    minimumPassed: 6,
    timeLimitMinutes: 90,
  }),
];

const moduleBundles: Record<string, ModuleBundle> = {
  "module-1-classical": buildModuleBundle(moduleSummaries[0]),
  "module-2-middle-ages": buildModuleBundle(moduleSummaries[1]),
  "module-3-renaissance": buildShellBundle(moduleSummaries[2], [
    {
      title: "Humanism and literary self-fashioning",
      description:
        "Will cover Petrarch, Erasmus, Shakespeare, Machiavelli, and the dignity of the individual.",
    },
    {
      title: "Perspective, portraiture, and High Renaissance art",
      description:
        "Will cover perspective, sfumato, chiaroscuro, portraiture, and the major Italian and Northern artists.",
    },
  ]),
  "module-4-baroque-enlightenment": buildShellBundle(moduleSummaries[3], [
    {
      title: "Baroque theatricality",
      description:
        "Will cover Caravaggio, Bernini, Bach, Handel, opera, and visual drama.",
    },
    {
      title: "Reason, satire, and public culture",
      description:
        "Will cover Locke, Rousseau, Voltaire, Swift, Neoclassicism, and Enlightenment social critique.",
    },
  ]),
  "module-5-romanticism-realism": buildShellBundle(moduleSummaries[4], [
    {
      title: "Romantic emotion and the sublime",
      description:
        "Will cover Byron, Keats, Wordsworth, Delacroix, Turner, Beethoven, and program music.",
    },
    {
      title: "Realism and nineteenth-century social truth",
      description:
        "Will cover Dickens, Flaubert, Tolstoy, Courbet, and the move toward ordinary life and critique.",
    },
  ]),
  "module-6-modern-contemporary": buildShellBundle(moduleSummaries[5], [
    {
      title: "Modernist fracture",
      description:
        "Will cover Joyce, Woolf, Eliot, Stravinsky, Cubism, Surrealism, and early twentieth-century experimentation.",
    },
    {
      title: "Postmodern and contemporary culture",
      description:
        "Will cover Beckett, Borges, magical realism, Pop Art, conceptual practice, and global contemporary concerns.",
    },
  ]),
};

export function getModuleSummaries(): ModuleSummary[] {
  return moduleSummaries;
}

export function getModuleBundle(moduleId: string): ModuleBundle | null {
  return moduleBundles[moduleId] ?? null;
}

export function getCumulativeAssessments(): AssessmentBundle[] {
  return cumulativeAssessments;
}

export function findAssessmentById(assessmentId: string): AssessmentBundle | null {
  for (const bundle of Object.values(moduleBundles)) {
    const assessment = [
      ...bundle.checkpoints,
      ...(bundle.moduleQuiz ? [bundle.moduleQuiz] : []),
      ...(bundle.moduleTest ? [bundle.moduleTest] : []),
      ...bundle.cumulativeAssessments,
    ].find((candidate) => candidate.id === assessmentId);

    if (assessment) {
      return assessment;
    }
  }

  return null;
}

export function getObjective(objectiveId: string): Objective | null {
  return objectiveById.get(objectiveId) ?? null;
}

export function getSourceRef(sourceRefId: string): SourceRef | null {
  return sourceRefById.get(sourceRefId) ?? null;
}

export function getSourceRefsForObjective(objective: Objective): SourceRef[] {
  return objective.sourceRefIds
    .map((sourceRefId) => sourceRefById.get(sourceRefId))
    .filter((sourceRef): sourceRef is SourceRef => Boolean(sourceRef));
}

export function getCoachContext(moduleId: string, objectiveId?: string) {
  const bundle = getModuleBundle(moduleId);

  if (!bundle) {
    return null;
  }

  if (!objectiveId) {
    return {
      module: {
        id: bundle.id,
        title: bundle.title,
        description: bundle.description,
      },
      objectives: bundle.objectives.map((objective) => ({
        id: objective.id,
        title: objective.title,
        learn: objective.learn,
        tags: objective.tags,
      })),
    };
  }

  const objective = bundle.objectives.find((candidate) => candidate.id === objectiveId);

  if (!objective) {
    return null;
  }

  return {
    module: {
      id: bundle.id,
      title: bundle.title,
      description: bundle.description,
    },
    objective: {
      id: objective.id,
      title: objective.title,
      learn: objective.learn,
      flashcards: objective.flashcards,
      tags: objective.tags,
      sourceRefs: getSourceRefsForObjective(objective),
    },
  };
}
