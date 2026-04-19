import type {
  AssessmentBundle,
  AssessmentQuestion,
  Flashcard,
  ModuleBundle,
  ModuleSummary,
  Objective,
  Section,
  SourceRef,
} from "../lib/types";
import {
  module2Objectives,
  module2Sections,
  module2SourceRefs,
  module2Summary,
} from "./module-2";

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

const baseObjectives: Objective[] = [
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
        "Ancient Greece is the starting point for Western humanities because the Greeks were the first civilization to treat public life — politics, religion, art, and philosophy — as deeply interconnected rather than separate domains. The basic unit of Greek society was the polis (city-state): a small, self-governing community where citizens participated directly in both government and culture. In a city like Athens, attending tragedy at the Festival of Dionysus was a civic duty as much as a cultural event — the state funded the plays and citizens were expected to attend. Philosophers like Socrates held conversations in the agora (public marketplace), and Athenian democracy meant citizens debated policy openly in the assembly rather than deferring to kings or priests. The exam consistently treats these habits — democratic debate, theatrical festival, philosophical inquiry — as expressions of a single Greek civic spirit rather than as separate facts to memorize in isolation.",
      keyExample:
        "Athens is the central example: the city funded theater festivals as public civic institutions, citizens voted in the assembly on the Pnyx hillside, and Socrates conducted philosophy by questioning anyone willing to speak in the agora — politics, drama, and inquiry shared the same public space and the same participants.",
      examClue:
        "If a CLEP question links early Western civic participation, reasoned public debate, tragic festivals, or democratic ideals to a single cultural source, the answer is almost always Ancient Greece and Athens in particular — and the key phrase is that all these activities belonged to one civic culture, not separate departments.",
      compareContrast:
        "Greece is the culture of small-scale experimentation and reflective inquiry — intense, civic, and questioning; Rome, by contrast, is the culture of administration, law, and imperial scale, adapting Greek ideas to govern a vast multi-ethnic empire. Greek theater asked what justice is; Roman theater mostly entertained. Greek philosophers debated the ideal city; Roman lawyers codified how to run the actual one.",
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
        url: "https://www.youtube.com/watch?v=gFRxmi4uCGo",
        watchFor:
          "Watch for how politics, philosophy, and drama are described as parts of one culture.",
        retrievalPrompt:
          "After the video, explain why Greek democracy and Greek theater belong in the same study section.",
      },
      {
        id: "vid-civic-2",
        title: "The Persians & Greeks: Crash Course World History #5",
        url: "https://www.youtube.com/watch?v=Q-mkVSasZIM",
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
        "The Homeric epics — the Iliad and the Odyssey — are the oldest major works in the Western literary tradition, and they set the template for heroism, war, identity, and journey that later writers returned to for centuries. Homer (traditionally described as a blind bard) recorded oral traditions that had circulated in performance for generations before being written down, roughly in the 8th century BC. The Iliad is set during the Trojan War and focuses on the warrior Achilles: his rage after being dishonored by the general Agamemnon drives him to withdraw from battle, and his return comes only after his closest companion Patroclus is killed by the Trojan hero Hector. The poem explores pride, honor, grief, and the brutal cost of war. The Odyssey follows a different kind of hero — Odysseus, whose ten-year voyage home from Troy is shaped not by martial power but by cleverness, disguise, endurance, and the longing for home. Each episode tests Odysseus differently: the Cyclops, the Sirens, Circe, the land of the dead — all demand intelligence and adaptability rather than brute strength.",
      keyExample:
        "The Iliad's emotional core is Achilles' grief over the death of Patroclus and his choice to re-enter battle knowing it will lead to his own death — a meditation on honor, loss, and mortal glory. The Odyssey's most famous episodes include the Cyclops (outwitted by 'Nobody') and Odysseus' return home disguised as a beggar, proving himself by stringing his great bow.",
      examClue:
        "On the CLEP, when a question describes a hero defined by cleverness, endurance, and a difficult sea voyage home, the answer is the Odyssey and Odysseus. When it describes martial honor, rage, and battlefield glory at Troy, the answer is the Iliad and Achilles. Both epics are attributed to Homer.",
      compareContrast:
        "Achilles is the supreme warrior whose flaw is honor-rage — he is the greatest fighter but nearly destroys his own side through pride. Odysseus is the supreme survivor whose virtue is intelligence — he wins not by being the strongest but by being the most adaptable. Greek literature treats both as heroic ideals, for different reasons and in different contexts.",
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
        url: "https://www.youtube.com/watch?v=MS4jk5kavy4",
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
        "Greek tragedy was not entertainment in the modern sense — it was a civic and religious institution performed at state-funded festivals in honor of the god Dionysus. Tragedies were staged outdoors in large stone amphitheaters before as many as 15,000 Athenian citizens at once, making them a form of collective public reflection on fate, power, and moral responsibility. The typical tragic structure follows a protagonist of high status (a king, hero, or noble) who is brought low by a fatal error or flaw (hamartia), often through a combination of pride, mistaken identity, or divine will. The chorus — a group of singers and dancers who remained on stage throughout — commented on the action and voiced the community's moral response. Aristotle's Poetics, written roughly a century after the great tragedians, defined the emotional effect of tragedy as catharsis: a purging or release of pity and fear in the audience caused by witnessing the hero's suffering. The three great tragedians are Aeschylus (who invented tragedy and added a second actor), Sophocles (who added a third actor and is considered the structural master), and Euripides (more psychologically modern and controversial).",
      keyExample:
        "Sophocles' Oedipus Rex is the definitive CLEP tragedy example: Oedipus, king of Thebes, learns through investigation that he has unwittingly killed his own father and married his mother, fulfilling the exact fate a prophecy foretold. His recognition (anagnorisis) — realizing the truth — leads to horror, self-blinding, and exile. The audience knows the truth before Oedipus does, creating profound dramatic irony and cathartic emotional release.",
      examClue:
        "If a CLEP question mentions pity and fear, the emotional purging produced by watching a hero's downfall, or a noble figure destroyed by a fatal flaw or mistaken identity, the answer category is catharsis and the form is Greek tragedy. The word catharsis is Aristotle's, not Sophocles' — it describes the audience's experience.",
      compareContrast:
        "Epic follows a hero's action across years and vast geography, celebrating strength and endurance in an open world. Tragedy compresses action to a day or two inside a city, and instead of celebrating the hero, it strips away everything — power, identity, certainty — until the protagonist is left with only recognition of what has happened. Epic is expansive and triumphant; tragedy is closed and devastating.",
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
        url: "https://quizlet.com/512903721/clep-humanities-ancient-greece-and-rome-flash-cards/",
        resourceType: "reference",
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
        "Greek philosophy begins not with books but with conversation. Socrates (469–399 BC) wrote nothing; instead he questioned Athenian citizens in public — exposing the limits of their assumed knowledge through a method called the elenchus, or Socratic questioning. Accused of corrupting youth and impiety, he was tried by a jury of 500 and chose death rather than exile, making his death one of the most discussed events in intellectual history. His student Plato (428–347 BC) preserved Socratic ideas in dramatic dialogues and added his own theory of Forms: real things in the physical world are imperfect shadows of perfect, eternal ideal types that exist in a higher realm of thought. Plato's Republic argues for government by philosopher-kings and contains the Allegory of the Cave — prisoners in a cave mistake shadows projected on a wall for reality, just as ordinary people mistake appearances for truth without philosophical education. Aristotle (384–322 BC), Plato's greatest student, rejected the separate realm of Forms and instead studied the actual world methodically — classifying animals, political systems, forms of tragedy, and ethical principles in a body of work that shaped Western science, logic, and literary criticism for two millennia. He tutored Alexander the Great and founded his own school, the Lyceum.",
      keyExample:
        "Plato's Allegory of the Cave, from the Republic, is the most important single philosophy passage for the CLEP: prisoners chained underground see only shadows of objects passing behind them and mistake the shadows for reality — philosophy frees the prisoner to turn around, leave the cave, and see the sun (truth) directly. This image of education as turning toward the light is one of the most quoted passages in Western thought.",
      examClue:
        "Match authors to works: Plato → Republic (the Cave, justice, philosopher-kings); Aristotle → Poetics (catharsis, tragic structure) and Nicomachean Ethics (virtue as the mean). If the question asks who tutored Alexander the Great, classified drama systematically, or applied logic to biology and politics, the answer is Aristotle.",
      compareContrast:
        "Plato tends upward and inward — away from appearances toward ideal, eternal forms; his philosophy is visionary and mathematical. Aristotle tends outward and downward — into the actual world to observe, classify, and find causes; his philosophy is empirical and systematic. Both are critical for the CLEP, but they represent opposite temperaments that recur throughout intellectual history.",
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
        url: "https://www.youtube.com/watch?v=gFRxmi4uCGo",
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
        "Ancient Greek temples were built according to highly standardized architectural systems called the orders, each specifying the proportions, surface decoration, and visual character of the entire building — but the fastest identifier for each order is always the column capital (the carved block at the top of the column). Doric is the oldest and most austere: thick, sturdy columns with no base, a plain square capital, and an overall feeling of powerful simplicity. Ionic is more slender and elegant, with a base beneath each column and a capital bearing two horizontal scroll-shapes called volutes on each side. Corinthian is the most ornate, with a capital densely covered in carved acanthus leaves arranged around a small central core — rarely used by the Greeks but adopted enthusiastically by Rome. Beyond the column type, it is essential to understand what a Greek temple actually was: not a congregation hall but a house for a cult statue of the deity. Worshippers gathered outside for ritual; the interior naos held the image of the god. The whole building was designed to be seen from the outside, its proportions calculated mathematically to appear perfectly harmonious.",
      keyExample:
        "The Parthenon on the Athenian Acropolis (447–432 BC, architects Ictinus and Callicrates) is the supreme example of classical Greek architecture — primarily Doric with Ionic friezes on the outer wall. Its proportions were minutely calculated to compensate for optical illusions (the columns swell slightly in the middle and lean inward) so that the building appears perfectly straight to the human eye.",
      examClue:
        "The fastest CLEP rule for Greek orders: scroll capitals = Ionic; leafy carved capitals = Corinthian; plain, sturdy rectangular capitals with thick columns = Doric. Any image question showing column capitals can usually be answered by this rule alone, even without knowing the building's name.",
      compareContrast:
        "Greek temples are designed as objects to be seen from outside — marble, columns, carved decoration, and human-scale proportion emphasizing visual harmony. Roman imperial buildings borrow the orders as decoration but combine them with concrete, arches, vaults, and domes that create vast enclosed interiors — Roman architecture is experienced from inside as much as outside, and it operates at far larger scale.",
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
        url: "https://www.khanacademy.org/humanities/ap-art-history/ancient-mediterranean-ap/greece-etruria-rome/a/greek-architectural-orders",
        resourceType: "reference",
        watchFor:
          "Watch for the visual difference in capitals and proportions; this is pure image-question prep.",
        retrievalPrompt:
          "After reviewing, identify the single fastest visual cue for each Greek order.",
      },
      {
        id: "vid-orders-2",
        title: "Greek ruins and site tours",
        url: "https://artsandculture.google.com/project/talking-tours",
        resourceType: "reference",
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
        "Greek sculpture developed through three clearly distinct phases, each representing an evolving understanding of the human body and what sculpture is for. Archaic Greek sculpture (700–480 BC) is stiff and frontal: the kouros (nude male youth) figures stand rigidly with one foot slightly forward, arms at sides, and a fixed, slightly upturned expression called the 'archaic smile' — they resemble Egyptian models and feel symbolic rather than lifelike. The Classical period (480–323 BC) breaks through this rigidity by discovering naturalism and idealization simultaneously: bodies show correct anatomy, muscles, and bone; the weight shifts naturally from one leg to the other in a pose called contrapposto; and the face carries calm, idealized dignity rather than the archaic smile. This weight shift — one hip dropping as the standing leg relaxes — is called contrapposto, and it became the foundational language of Western figurative sculpture. Hellenistic sculpture (323–31 BC), following Alexander the Great's conquests, pushes emotion, drama, and psychological intensity: figures writhe in agony, reach dramatically into space, or collapse in defeat. For the CLEP, the Classical period's calm idealism is the central anchor.",
      keyExample:
        "The Doryphoros (Spear-Bearer) by the sculptor Polykleitos (c. 450 BC, known only through Roman marble copies) is the canonical Classical sculpture: it demonstrates contrapposto and Polykleitos' kanon — a mathematical system for ideal human proportions. The figure looks alive and balanced, standing as though about to take a step but at rest, ideal without being stiff.",
      examClue:
        "If a sculpture shows a natural weight shift (hips not level, shoulders tilted opposite to hips), calm and idealized features, and anatomical realism without emotional excess, it belongs to the Classical Greek period. Rage, writhing, or extreme theatrical distortion signals Hellenistic.",
      compareContrast:
        "Archaic sculpture is symbolic and rigid — a geometric body wearing a human surface. Classical sculpture is balanced, idealized, and anatomically real — a human body perfected but calm. Hellenistic sculpture is emotionally theatrical — a human body in crisis, caught in suffering or dramatic action. Each period is a deliberate development beyond the previous one, and the CLEP frequently asks you to place an image in the right phase.",
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
        "Roman architecture is distinguished above all by engineering ambition, made possible by the Romans' mastery of concrete — opus caementicium — a material they could pour into any mold, that set hard without firing, and that was far cheaper and more versatile than cut stone. Concrete liberated Roman builders from the post-and-lintel logic of Greek temples, where spans are limited to what a stone or wooden beam can bridge. Combined with the round arch (adapted from Etruscan models), concrete enabled the barrel vault (a long, tunnel-shaped ceiling of continuous arched masonry), the groin vault (two barrel vaults intersecting at right angles), and ultimately the dome — the most structurally impressive form in the ancient world. The Pantheon in Rome (rebuilt under Emperor Hadrian, dedicated 128 AD) has an unreinforced concrete dome spanning 43.3 meters from pier to pier, lit through a central opening — the oculus — 9 meters in diameter. This structural feat was not surpassed in unreinforced concrete for over 1,300 years. The Colosseum (Flavian Amphitheater, 70–80 AD) used the same arched system at colossal scale to seat 50,000–80,000 spectators for gladiatorial games, animal hunts, and public spectacles — the largest arena in the Roman world.",
      keyExample:
        "The Pantheon is the masterpiece of Roman engineering: its hemispherical dome rests on a circular drum of concrete walls, and as the dome rises it gradually thins in thickness, using lighter and lighter aggregate (pumice near the top) to reduce weight. The oculus at the apex is the only light source, and its beam moves across the interior through the day like a sundial — one of the most sophisticated spatial experiences in architectural history.",
      examClue:
        "If a CLEP question mentions a dome with a central round opening at the top, the answer is the Pantheon. If it asks about gladiatorial combat and massive tiered seating, the answer is the Colosseum or amphitheater. If it asks what structural system made Roman large-scale buildings possible, the answer is concrete and the arch.",
      compareContrast:
        "Greek architecture is about proportion, exterior beauty, and the idealized surface of marble columns — buildings designed to be contemplated from outside. Roman imperial architecture is about interior space, structural engineering, and the experience of enclosed grandeur — buildings whose interiors were the main event. A Roman dome is an inside-out statement; a Greek temple is an outside statement.",
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
        url: "https://www.youtube.com/watch?v=Z_5Cl9nK-qA",
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
        "Roman literature of the Augustan Age (31 BC–14 AD) represents a conscious effort by Roman writers — with the patronage of Emperor Augustus — to build a national literary culture equal to Greece's, but with a distinctly Roman moral and political vision. Virgil (70–19 BC) is the supreme figure: his Aeneid is a twelve-book epic modeled on both the Iliad (books 1–6, war and wandering) and the Odyssey (books 7–12, arrival and struggle), but its hero Aeneas is defined not by wrath or cleverness but by pietas — duty to gods, family, and the Roman state. Aeneas carries his elderly father from burning Troy, leads his people across the sea, and founds the line that will eventually become Rome, sacrificing his own desires for a destiny he will not live to see complete. Horace (65–8 BC) gave Rome its lyric poetry — elegant, reflective odes in Latin that matched Greek lyric masters while expressing Roman temperament. Ovid (43 BC–17 AD) took a more playful approach: his Metamorphoses weaves together 250 Greek and Roman mythological stories unified by the theme of transformation, from the creation of the world to the deification of Julius Caesar — it became one of the most influential sourcebooks for later Western art, literature, and visual culture.",
      keyExample:
        "The founding scene of the Aeneid — Aeneas carrying his father Anchises on his back while leading his young son Iulus by the hand out of burning Troy — is perhaps the most famous image of Roman pietas in all of literature. It pictures the Roman hero as one who sacrifices personal desire and safety for family obligation and divine mission, not for personal glory.",
      examClue:
        "If a CLEP question asks about the Roman national epic, the hero Aeneas, or the founding of Rome, the answer is Virgil and the Aeneid. If it asks about myths of transformation in a collected narrative, the answer is Ovid and Metamorphoses. If it asks about polished, philosophical Roman lyric poetry, think Horace and the Odes.",
      compareContrast:
        "Homer's Odysseus is driven home by personal longing — to see his wife, reclaim his house, and reassert his identity. Virgil's Aeneas is driven forward by divine duty — toward a Rome he will never see, for a people not yet born. Greek epic celebrates the heroic individual; Latin epic conscripts heroism into service of the state and history — an important distinction for understanding how Roman culture adapted and transformed its Greek inheritance.",
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

function clipText(text: string, maxLength = 220) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function buildSupplementalFlashcard(objective: Objective, index: number): Flashcard {
  const clue = clipText(objective.learn.examClue, 200);
  const core = clipText(objective.learn.conciseExplanation, 220);
  const example = clipText(objective.learn.keyExample, 220);
  const compare = clipText(objective.learn.compareContrast, 220);
  const tagHint = objective.tags.slice(0, 4).join(", ");
  const variant = index % 6;

  if (variant === 0) {
    return {
      id: `fc-auto-${sanitizeId(objective.id)}-${index}`,
      front: `What is the core takeaway for ${objective.title}?`,
      back: core,
      direction: "concept",
    };
  }

  if (variant === 1) {
    return {
      id: `fc-auto-${sanitizeId(objective.id)}-${index}`,
      front: `Which key example should you remember for ${objective.title}?`,
      back: example,
      direction: "feature_to_term",
    };
  }

  if (variant === 2) {
    return {
      id: `fc-auto-${sanitizeId(objective.id)}-${index}`,
      front: `What exam clue best identifies ${objective.title}?`,
      back: clue,
      direction: "term_to_feature",
    };
  }

  if (variant === 3) {
    return {
      id: `fc-auto-${sanitizeId(objective.id)}-${index}`,
      front: `How does ${objective.title} compare with a nearby concept?`,
      back: compare,
      direction: "concept",
    };
  }

  if (variant === 4) {
    return {
      id: `fc-auto-${sanitizeId(objective.id)}-${index}`,
      front: `Which tags are strongest anchors for ${objective.title}?`,
      back: tagHint || objective.title,
      direction: "feature_to_term",
    };
  }

  return {
    id: `fc-auto-${sanitizeId(objective.id)}-${index}`,
    front: `What CLEP task type does ${objective.title} train?`,
    back: `This objective trains ${objective.examTaskType.replace(/_/g, " ")} through ${objective.skillType.replace(/_/g, " ")} practice.`,
    direction: "concept",
  };
}

function ensureSectionFlashcardMinimum(
  objectives: Objective[],
  sections: Section[],
  minimumPerSection: number,
): Objective[] {
  const objectiveMap = new Map(
    objectives.map((objective) => [
      objective.id,
      {
        ...objective,
        flashcards: [...objective.flashcards],
      },
    ]),
  );

  for (const section of sections) {
    const sectionObjectives = section.objectiveIds
      .map((objectiveId) => objectiveMap.get(objectiveId))
      .filter((objective): objective is Objective => Boolean(objective));

    if (!sectionObjectives.length) continue;

    const currentCount = sectionObjectives.reduce(
      (total, objective) => total + objective.flashcards.length,
      0,
    );

    let needed = minimumPerSection - currentCount;
    let turn = 0;

    while (needed > 0) {
      const objective = sectionObjectives[turn % sectionObjectives.length];
      const cardIndex = objective.flashcards.length + 1;
      objective.flashcards.push(buildSupplementalFlashcard(objective, cardIndex));
      needed -= 1;
      turn += 1;
    }
  }

  return objectives.map((objective) => objectiveMap.get(objective.id) ?? objective);
}

const objectives = ensureSectionFlashcardMinimum(baseObjectives, sections, 20);

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
