import type { ModuleSummary, Objective, Section, SourceRef } from "@/lib/types";

export const module2Summary: ModuleSummary = {
  id: "module-2-middle-ages",
  title: "Middle Ages",
  shortTitle: "Middle Ages",
  order: 2,
  state: "ready",
  description:
    "Religious institutions, vernacular literature, Romanesque and Gothic architecture, chant, and early polyphony.",
  officialBuckets: ["medieval_renaissance"],
  focus: "Full medieval bundle linking devotional culture, architecture, music, and literature.",
};

export const module2SourceRefs: SourceRef[] = [
  {
    id: "sayre-book-2",
    label: "Sayre Book 2",
    kind: "textbook",
    citation:
      "Support text for medieval cultural structures, vernacular literature, sacred music, and architecture recognition.",
    localPath:
      "pdfs/The Humanities_ Culture, Continuity, and Change, Book 2 -- Henry M_ Sayre -- 1, 2008 -- Pearson Education, Limited -- isbn13 9780205723409 -- d1f9b31fdc4529a4c0da116588285fd4 -- Anna’s Archive.pdf",
  },
  {
    id: "fiero-book-1",
    label: "Fiero Book 1",
    kind: "textbook",
    citation:
      "Alternate medieval source spine for sacred art, feudal society, and devotional practices.",
    localPath:
      "pdfs/The Humanistic Tradition, Book 1_ The First Civilizations -- Fiero, Gloria K -- 6th ed, Boston, 2011 -- Boston _ McGraw-Hill -- isbn13 9780073523972 -- b3b9455521f901e3af10ed5de54b8618 -- Anna’s Archive.pdf",
  },
  {
    id: "medieval-practice",
    label: "Module 2 Practice Seeds",
    kind: "study_note",
    citation:
      "Question stems for courtly love, mystery plays, Romanesque vs. Gothic recognition, Hildegard, and Books of Hours.",
    localPath: "docs/notes/practice.txt",
  },
  {
    id: "art-movements-import",
    label: "Art Movement Comparison Guide",
    kind: "html_import",
    citation:
      "Locally authored style guide useful for medieval-to-Renaissance visual comparisons.",
    localPath: "content/reference/html-guides/02_art_movements.html",
  },
];

export const module2Sections: Section[] = [
  {
    id: "section-5-feudal-literary-culture",
    moduleId: module2Summary.id,
    title: "Feudal and Courtly Literary Culture",
    description:
      "How courtly ideals, Latin learning, and philosophical consolation shaped medieval reading habits.",
    objectiveIds: [
      "medieval.lit.courtly_love",
      "medieval.lit.scholastic_latinity",
    ],
    estimatedMinutes: 25,
  },
  {
    id: "section-6-devotional-reading-performance",
    moduleId: module2Summary.id,
    title: "Devotional Reading and Performance",
    description:
      "Biblical drama, saint narratives, and private devotional books for medieval audiences.",
    objectiveIds: [
      "medieval.lit.devotional_drama",
      "medieval.art.illuminated_manuscripts",
    ],
    estimatedMinutes: 25,
  },
  {
    id: "section-7-stone-light-structure",
    moduleId: module2Summary.id,
    title: "Stone, Light, and Structural Recognition",
    description:
      "Romanesque heaviness versus Gothic height, light, and engineering confidence.",
    objectiveIds: [
      "medieval.art.romanesque_architecture",
      "medieval.art.gothic_cathedrals",
    ],
    estimatedMinutes: 30,
  },
  {
    id: "section-8-sacred-sound-vernacular",
    moduleId: module2Summary.id,
    title: "Sacred Sound and Vernacular Imagination",
    description:
      "From monophonic chant to polyphony, and from Latin authority to Dante and Chaucer in the vernacular.",
    objectiveIds: [
      "medieval.music.chant_polyphony",
      "medieval.lit.dante_vernacular_journey",
    ],
    estimatedMinutes: 30,
  },
];

export const module2Objectives: Objective[] = [
  {
    id: "medieval.lit.courtly_love",
    moduleId: module2Summary.id,
    sectionId: "section-5-feudal-literary-culture",
    title: "Courtly love and the troubadour ideal",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "literature",
    subtype: "lyric poetry",
    skillType: "factual",
    examTaskType: "explain_cultural_role",
    masteryWeight: 1,
    tags: ["courtly-love", "troubadours", "vernacular", "lyric"],
    sourceRefIds: ["cb-aag", "sample-set", "medieval-practice", "sayre-book-2"],
    learn: {
      conciseExplanation:
        "Courtly love poetry matters because the exam treats it as a distinct medieval social script: refined desire, noble service, and longing for an often unattainable beloved. Troubadours are the cultural-role clue.",
      keyExample:
        "Troubadour lyrics from southern France present love as disciplined devotion rather than straightforward marriage or household realism.",
      examClue:
        "If a question emphasizes noble, stylized, usually unattainable love, courtly love is the default medieval answer.",
      compareContrast:
        "Compare courtly love with epic heroism: epic focuses public warfare and honor, while courtly lyric focuses private desire, performance, and emotional discipline.",
    },
    flashcards: [
      {
        id: "fc-courtly-1",
        front: "What most clearly distinguishes medieval courtly love poetry?",
        back: "It presents noble, stylized, often unattainable love as a refined code of feeling and service.",
        direction: "concept",
      },
      {
        id: "fc-courtly-2",
        front: "Troubadours are best understood as what kind of cultural figures?",
        back: "Medieval poet-musicians associated with vernacular courtly love traditions.",
        direction: "feature_to_term",
      },
      {
        id: "fc-courtly-3",
        front: "Courtly love lyrics usually celebrate what relationship pattern?",
        back: "Devoted longing for an elevated beloved rather than fulfilled domestic romance.",
        direction: "term_to_feature",
      },
    ],
    videos: [
      {
        id: "vid-courtly-1",
        title: "Medieval Europe: Crash Course European History #1",
        url: "http://www.youtube.com/watch?v=rNCw2MOfnLQ",
        watchFor:
          "Watch for how hierarchy, court culture, and church authority shape everyday medieval life.",
        retrievalPrompt:
          "Explain why courtly love belongs to a feudal court culture rather than to a democratic public sphere.",
      },
    ],
    quizVariants: [
      {
        id: "q-courtly-1",
        prompt: "What distinguishes courtly love poetry of the medieval period?",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "Its anonymous authorship",
          "Its depiction of noble, often unattainable, love",
          "Its emphasis on nationalist pride",
          "Its rejection of musical accompaniment",
        ],
        answer: "Its depiction of noble, often unattainable, love",
        explanation:
          "Courtly love presents desire as refined, elevated, and often unattainable rather than practical or domestic.",
      },
      {
        id: "q-courtly-2",
        prompt:
          "A question asks for the cultural role of troubadours in medieval Europe. Which answer is strongest?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Monastic historians who copied law codes",
          "Poet-musicians shaping courtly love traditions",
          "Architects of Gothic cathedrals",
          "Scholars translating Aristotle into Latin prose",
        ],
        answer: "Poet-musicians shaping courtly love traditions",
        explanation:
          "Troubadours are remembered as performers and poets associated with vernacular courtly love culture.",
      },
    ],
    testVariant: {
      id: "t-courtly-1",
      prompt:
        "A lyric tradition treats love as service to an idealized, socially elevated beloved. What larger medieval pattern is being tested?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Courtly refinement and stylized desire",
        "Monastic withdrawal from worldly feeling",
        "Epic celebration of public warfare",
        "Humanist confidence in self-fashioning",
      ],
      answer: "Courtly refinement and stylized desire",
      explanation:
        "That description fits the medieval courtly love code rather than epic warfare or later Renaissance humanism.",
    },
  },
  {
    id: "medieval.lit.scholastic_latinity",
    moduleId: module2Summary.id,
    sectionId: "section-5-feudal-literary-culture",
    title: "Scholastic Latin culture and Boethian consolation",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "literature",
    subtype: "nonfiction/philosophy",
    skillType: "interpretation",
    examTaskType: "identify_creator",
    masteryWeight: 1,
    tags: ["scholasticism", "latin", "boethius", "philosophy"],
    sourceRefIds: ["cb-aag", "medieval-practice", "sayre-book-2", "fiero-book-1"],
    learn: {
      conciseExplanation:
        "Scholastic culture is tested through language, method, and key authors. Latin is the scholarly medium, and Boethius matters because The Consolation of Philosophy carries classical reasoning into the medieval Christian world.",
      keyExample:
        "Boethius writing in prison becomes an exam anchor for philosophy as disciplined consolation rather than heroic action.",
      examClue:
        "If a question mentions medieval scholastic writing or the language of learned theology, Latin is usually the recognition answer.",
      compareContrast:
        "Compare scholastic argument with courtly lyric: scholastic writing organizes reason and commentary, while courtly lyric stages feeling and performance.",
    },
    flashcards: [
      {
        id: "fc-scholastic-1",
        front: "Which language was most commonly used in medieval scholastic writing?",
        back: "Latin.",
        direction: "concept",
      },
      {
        id: "fc-scholastic-2",
        front: "Who wrote The Consolation of Philosophy while imprisoned?",
        back: "Boethius.",
        direction: "work_to_creator",
      },
      {
        id: "fc-scholastic-3",
        front: "What larger medieval habit does scholasticism represent?",
        back: "Reasoned commentary, dialectical analysis, and the organization of learning.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-scholastic-1",
        title: "The Middle Ages Explained in 10 Minutes",
        url: "http://www.youtube.com/watch?v=H5AVPmAZ8o8",
        watchFor:
          "Watch for how intellectual life remains tied to religious institutions and the preservation of classical learning.",
        retrievalPrompt:
          "After the video, explain why Latin remained central to medieval scholarship even as vernacular literature grew.",
      },
    ],
    quizVariants: [
      {
        id: "q-scholastic-1",
        prompt: "Which of the following languages was most commonly used in medieval scholastic writings?",
        mode: "checkpoint",
        variantType: "recall",
        choices: ["Provençal", "Greek", "Old English", "Latin"],
        answer: "Latin",
        explanation:
          "Latin remained the dominant language of learned commentary, philosophy, and theology in the medieval West.",
      },
      {
        id: "q-scholastic-2",
        prompt:
          "Which medieval thinker wrote The Consolation of Philosophy while imprisoned?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["Augustine", "Boethius", "Abelard", "Thomas Aquinas"],
        answer: "Boethius",
        explanation:
          "Boethius is the standard author-match for The Consolation of Philosophy and its prison setting.",
      },
    ],
    testVariant: {
      id: "t-scholastic-1",
      prompt:
        "A humanities question links learned Latin prose, disciplined reasoning, and philosophy as consolation during suffering. Which identification is strongest?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Boethian scholastic inheritance",
        "Troubadour performance culture",
        "Gothic architectural engineering",
        "Renaissance civic humanism",
      ],
      answer: "Boethian scholastic inheritance",
      explanation:
        "Latin learning, prison consolation, and philosophical order point toward Boethius and the scholastic tradition he helped shape.",
    },
  },
  {
    id: "medieval.lit.devotional_drama",
    moduleId: module2Summary.id,
    sectionId: "section-6-devotional-reading-performance",
    title: "Mystery plays, hagiography, and public devotion",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "literature",
    subtype: "drama",
    skillType: "factual",
    examTaskType: "explain_cultural_role",
    masteryWeight: 1,
    tags: ["mystery-plays", "hagiography", "biblical-drama", "saints"],
    sourceRefIds: ["cb-aag", "medieval-practice", "fiero-book-1", "sayre-book-2"],
    learn: {
      conciseExplanation:
        "Medieval drama often appears through function rather than title recognition. Mystery plays dramatize biblical stories for broad audiences, while hagiographies build models of sanctity through the lives and miracles of saints.",
      keyExample:
        "A pageant staging a biblical episode for townspeople is a mystery play, not secular court drama.",
      examClue:
        "If the question emphasizes biblical scenes performed for popular audiences, mystery play is the right form.",
      compareContrast:
        "Compare mystery plays with hagiography: both are devotional, but one is staged drama and the other is narrative prose or verse about saintly lives.",
    },
    flashcards: [
      {
        id: "fc-devotional-1",
        front: "What was the primary function of medieval mystery plays?",
        back: "To dramatize biblical events for popular audiences.",
        direction: "concept",
      },
      {
        id: "fc-devotional-2",
        front: "What is the literary purpose of hagiographies?",
        back: "To recount the lives and miracles of saints.",
        direction: "term_to_feature",
      },
      {
        id: "fc-devotional-3",
        front: "Mystery plays belong most strongly to what larger medieval pattern?",
        back: "Public devotional teaching through performance.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-devotional-1",
        title: "Early Medieval Art and History",
        url: "http://www.youtube.com/watch?v=2MsMUKI5df0",
        watchFor:
          "Watch for how religion structures artistic and literary production after the fall of Rome.",
        retrievalPrompt:
          "Why do devotional drama and saint narratives make sense in a culture centered on religious instruction?",
      },
    ],
    quizVariants: [
      {
        id: "q-devotional-1",
        prompt: "What was the primary function of medieval mystery plays?",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "Depictions of biblical events for popular audiences",
          "Expression of secular philosophy",
          "Dramatic critiques of feudal power",
          "Reenactments of Roman history",
        ],
        answer: "Depictions of biblical events for popular audiences",
        explanation:
          "Mystery plays are tied to biblical instruction and communal devotional culture.",
      },
      {
        id: "q-devotional-2",
        prompt: "What was the literary purpose of hagiographies?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "To translate classical myths",
          "To recount the lives and miracles of saints",
          "To argue for political reform",
          "To satirize noble courts",
        ],
        answer: "To recount the lives and miracles of saints",
        explanation:
          "Hagiographies create devotional models by narrating saintly lives and miracles.",
      },
    ],
    testVariant: {
      id: "t-devotional-1",
      prompt:
        "A medieval work is designed less for private self-expression than for spiritual teaching before a broad audience. Which pairing best fits?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Mystery play and biblical instruction",
        "Courtly lyric and noble flirtation",
        "Epic and warrior commemoration",
        "Humanist satire and civic critique",
      ],
      answer: "Mystery play and biblical instruction",
      explanation:
        "Mystery plays are a public devotional form built around biblical storytelling and moral instruction.",
    },
  },
  {
    id: "medieval.art.illuminated_manuscripts",
    moduleId: module2Summary.id,
    sectionId: "section-6-devotional-reading-performance",
    title: "Illuminated manuscripts and Books of Hours",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "arts",
    subtype: "visual art",
    skillType: "recognition_style",
    examTaskType: "identify_medium_or_form",
    masteryWeight: 1,
    tags: ["illuminated-manuscripts", "book-of-hours", "calligraphy", "devotion"],
    sourceRefIds: [
      "cb-aag",
      "medieval-practice",
      "art-movements-import",
      "fiero-book-1",
    ],
    learn: {
      conciseExplanation:
        "Medieval manuscript culture is tested through medium recognition. Illuminated manuscripts combine decorated initials, marginal imagery, and calligraphy, while the Book of Hours is the classic private devotional object.",
      keyExample:
        "A small, portable prayer book for lay devotion is the typical Book of Hours recognition pattern.",
      examClue:
        "If an item asks for a portable object used in private devotion, Book of Hours is stronger than cathedral, altarpiece, or chalice.",
      compareContrast:
        "Compare an illuminated manuscript with a cathedral image cycle: both teach devotion, but the manuscript is intimate and portable while cathedral art is public and architectural.",
    },
    flashcards: [
      {
        id: "fc-manuscript-1",
        front: "What art form often decorates illuminated manuscripts?",
        back: "Intricate marginal illustrations and calligraphy.",
        direction: "term_to_feature",
      },
      {
        id: "fc-manuscript-2",
        front: "What was a Book of Hours used for?",
        back: "Private devotional reading and prayer.",
        direction: "concept",
      },
      {
        id: "fc-manuscript-3",
        front: "Why do illuminated manuscripts matter on the exam?",
        back: "They are a medium-recognition clue for medieval literacy, devotion, and visual culture.",
        direction: "feature_to_term",
      },
    ],
    videos: [],
    quizVariants: [
      {
        id: "q-manuscript-1",
        prompt:
          "Which of the following was a portable devotional object used in personal worship?",
        mode: "checkpoint",
        variantType: "recall",
        choices: ["Book of Hours", "Flying buttress", "Altarpiece", "Tympanum"],
        answer: "Book of Hours",
        explanation:
          "The Book of Hours is the standard medieval private devotional book for lay readers.",
      },
      {
        id: "q-manuscript-2",
        prompt: "What art form was often used to decorate illuminated manuscripts?",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Frescoes",
          "Intricate marginal illustrations and calligraphy",
          "Mosaics",
          "Tapestry",
        ],
        answer: "Intricate marginal illustrations and calligraphy",
        explanation:
          "Illuminated manuscripts are recognized by decorated lettering, marginal imagery, and careful calligraphic design.",
      },
    ],
    testVariant: {
      id: "t-manuscript-1",
      prompt:
        "A small manuscript is richly decorated and intended for repeated private prayer. Which identification is strongest?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Book of Hours",
        "Romanesque tympanum",
        "Gothic rose window",
        "Troubadour songbook for public recitation",
      ],
      answer: "Book of Hours",
      explanation:
        "Portable devotion plus illumination points to the Book of Hours and broader manuscript culture.",
    },
  },
  {
    id: "medieval.art.romanesque_architecture",
    moduleId: module2Summary.id,
    sectionId: "section-7-stone-light-structure",
    title: "Romanesque massing, vaults, and tympana",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "arts",
    subtype: "architecture",
    skillType: "recognition_style",
    examTaskType: "recognize_style",
    masteryWeight: 1.1,
    tags: ["romanesque", "rounded-arches", "barrel-vault", "tympanum"],
    sourceRefIds: [
      "cb-aag",
      "medieval-practice",
      "architecture-import",
      "sayre-book-2",
    ],
    learn: {
      conciseExplanation:
        "Romanesque architecture is mostly a recognition problem. Look for rounded arches, thick walls, barrel vaulting, and sculpted tympana over church portals.",
      keyExample:
        "A church facade with a carved biblical relief over the doorway and heavy masonry is a Romanesque clue set.",
      examClue:
        "If the building feels heavy, grounded, and dim compared with Gothic lightness, Romanesque is the stronger answer.",
      compareContrast:
        "Compare Romanesque and Gothic: Romanesque emphasizes solidity and rounded forms; Gothic emphasizes height, pointed arches, and luminous interiors.",
    },
    flashcards: [
      {
        id: "fc-romanesque-1",
        front: "Which of the following is a characteristic of Romanesque architecture?",
        back: "Rounded arches and massive walls.",
        direction: "concept",
      },
      {
        id: "fc-romanesque-2",
        front: "The tympanum in a Romanesque church typically features what?",
        back: "Relief carvings of biblical scenes.",
        direction: "term_to_feature",
      },
      {
        id: "fc-romanesque-3",
        front: "Romanesque churches are usually recognized by what structural feeling?",
        back: "Heavy stone mass, rounded forms, and compact interior light.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-romanesque-1",
        title: "Differences between Romanesque and Gothic Architecture",
        url: "http://www.youtube.com/watch?v=FmRVKHilUiA",
        watchFor:
          "Watch for the visual contrast between Romanesque heaviness and Gothic verticality.",
        retrievalPrompt:
          "After the video, name two features that make a church read as Romanesque before it reads as Gothic.",
      },
    ],
    quizVariants: [
      {
        id: "q-romanesque-1",
        prompt: "Which of the following is a characteristic of Romanesque architecture?",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "Verticality and light",
          "Rounded arches and massive walls",
          "Delicate tracery",
          "Glass domes",
        ],
        answer: "Rounded arches and massive walls",
        explanation:
          "Romanesque churches are recognized by thick masonry, rounded arches, and barrel-vaulted weight.",
      },
      {
        id: "q-romanesque-2",
        prompt: "The tympanum in a Romanesque church typically features",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Abstract floral designs",
          "Relief carvings of biblical scenes",
          "Plain stone panels",
          "Painted images of saints only",
        ],
        answer: "Relief carvings of biblical scenes",
        explanation:
          "A sculpted biblical tympanum is a classic Romanesque church-portal recognition cue.",
      },
    ],
    testVariant: {
      id: "t-romanesque-1",
      prompt:
        "An exam image shows a church with rounded arches, thick walls, and a sculpted portal relief. Which identification is strongest?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Romanesque church",
        "Gothic cathedral",
        "Classical Greek temple",
        "Renaissance basilica",
      ],
      answer: "Romanesque church",
      explanation:
        "Rounded arches plus heavy walls and a tympanum cue Romanesque architecture rather than Gothic height and glass.",
    },
  },
  {
    id: "medieval.art.gothic_cathedrals",
    moduleId: module2Summary.id,
    sectionId: "section-7-stone-light-structure",
    title: "Gothic cathedrals, flying buttresses, and symbolic light",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "arts",
    subtype: "architecture",
    skillType: "recognition_style",
    examTaskType: "identify_medium_or_form",
    masteryWeight: 1.1,
    tags: ["gothic", "flying-buttress", "stained-glass", "pointed-arches"],
    sourceRefIds: [
      "cb-aag",
      "medieval-practice",
      "architecture-import",
      "videos-playlist",
    ],
    learn: {
      conciseExplanation:
        "Gothic architecture is tested through structural innovation and atmosphere. Pointed arches, rib vaults, and flying buttresses make height and large stained-glass windows possible.",
      keyExample:
        "A cathedral that feels vertically stretched and flooded with colored light is usually asking you to say Gothic.",
      examClue:
        "If a question asks what made large stained-glass windows possible, the answer is usually flying buttresses.",
      compareContrast:
        "Compare Gothic and Romanesque: Gothic converts wall weight into skeletal support so more light can enter through glass.",
    },
    flashcards: [
      {
        id: "fc-gothic-1",
        front: "What structural innovation allowed Gothic cathedrals to include large stained-glass windows?",
        back: "Flying buttresses.",
        direction: "concept",
      },
      {
        id: "fc-gothic-2",
        front: "What larger visual effect does Gothic architecture pursue?",
        back: "Verticality, light, and a sense of upward spiritual lift.",
        direction: "feature_to_term",
      },
      {
        id: "fc-gothic-3",
        front: "Gothic architecture is most strongly associated with what arch type?",
        back: "Pointed arches.",
        direction: "term_to_feature",
      },
    ],
    videos: [
      {
        id: "vid-gothic-1",
        title: "Caroline Bruzelius on Animating History",
        url: "http://www.youtube.com/watch?v=Qqz042moH0U",
        watchFor:
          "Watch for how cathedral construction depends on structural planning, not just decoration.",
        retrievalPrompt:
          "How do Gothic structural systems change what the wall can do compared with Romanesque churches?",
      },
    ],
    quizVariants: [
      {
        id: "q-gothic-1",
        prompt:
          "What structural innovation allowed Gothic cathedrals to include large stained-glass windows?",
        mode: "checkpoint",
        variantType: "recall",
        choices: ["Barrel vaults", "Domes", "Flying buttresses", "Post-and-lintel design"],
        answer: "Flying buttresses",
        explanation:
          "Flying buttresses transfer outward thrust and free wall space for taller openings and more stained glass.",
      },
      {
        id: "q-gothic-2",
        prompt: "Stained glass in Gothic cathedrals primarily served to",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Cool the interior",
          "Create symbolic light and teach narratives",
          "Hide structural flaws",
          "Keep out clergy",
        ],
        answer: "Create symbolic light and teach narratives",
        explanation:
          "Gothic stained glass combines theological symbolism with visual storytelling.",
      },
    ],
    testVariant: {
      id: "t-gothic-1",
      prompt:
        "A church interior seems skeletal, vertically ambitious, and filled with colored light. Which distinction is the exam most likely testing?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Gothic light versus Romanesque mass",
        "Baroque drama versus Neoclassical restraint",
        "Classical balance versus Hellenistic emotion",
        "Epic narrative versus lyric intensity",
      ],
      answer: "Gothic light versus Romanesque mass",
      explanation:
        "The verticality and stained-glass emphasis make Gothic the obvious contrast with heavier Romanesque building.",
    },
  },
  {
    id: "medieval.music.chant_polyphony",
    moduleId: module2Summary.id,
    sectionId: "section-8-sacred-sound-vernacular",
    title: "Gregorian chant, Hildegard, and the rise of polyphony",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "arts",
    subtype: "music",
    skillType: "recognition_style",
    examTaskType: "identify_medium_or_form",
    masteryWeight: 1,
    tags: ["gregorian-chant", "hildegard", "monophony", "polyphony"],
    sourceRefIds: ["cb-aag", "medieval-practice", "videos-playlist", "sayre-book-2"],
    learn: {
      conciseExplanation:
        "Medieval music questions often test texture and sacred function. Gregorian chant is monophonic and liturgical, Hildegard of Bingen anchors mystical song, and polyphony signals the move toward multiple independent lines.",
      keyExample:
        "One unaccompanied melodic line in sacred context is chant; several simultaneous lines point toward polyphony.",
      examClue:
        "If the item asks for a single melodic line without harmony, monophony is the answer pattern to expect.",
      compareContrast:
        "Compare chant and polyphony: chant is one line for sacred devotion, while polyphony layers voices and increases musical complexity.",
    },
    flashcards: [
      {
        id: "fc-chant-1",
        front: "Which medieval composer is known for mystical songs and theological writings?",
        back: "Hildegard of Bingen.",
        direction: "work_to_creator",
      },
      {
        id: "fc-chant-2",
        front: "A musical system based on a single melodic line without harmonic accompaniment is called what?",
        back: "Monophony.",
        direction: "term_to_feature",
      },
      {
        id: "fc-chant-3",
        front: "What musical change does polyphony represent compared with chant?",
        back: "Multiple independent lines sounding together instead of one unaccompanied melody.",
        direction: "feature_to_term",
      },
    ],
    videos: [
      {
        id: "vid-chant-1",
        title: "Medieval Europe: Crash Course European History #1",
        url: "http://www.youtube.com/watch?v=rNCw2MOfnLQ",
        watchFor:
          "Watch for how church institutions shape education, art, and music across medieval Europe.",
        retrievalPrompt:
          "Why does chant make sense as the baseline sound of a church-centered culture?",
      },
    ],
    quizVariants: [
      {
        id: "q-chant-1",
        prompt:
          "Which medieval composer is known for her mystical songs and theological writings?",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "Hildegard of Bingen",
          "Boethius",
          "Heloise",
          "Abelard",
        ],
        answer: "Hildegard of Bingen",
        explanation:
          "Hildegard is a standard medieval music anchor because she joins sacred song, theology, and visionary writing.",
      },
      {
        id: "q-chant-2",
        prompt:
          "A musical system based on a single melodic line without harmonic accompaniment is called",
        mode: "module_quiz",
        variantType: "recognition",
        choices: ["Polyphony", "Counterpoint", "Monophony", "Fugue"],
        answer: "Monophony",
        explanation:
          "Monophony is the technical term for one unaccompanied melodic line, as in Gregorian chant.",
      },
    ],
    testVariant: {
      id: "t-chant-1",
      prompt: "Why is Gregorian chant useful on the CLEP as more than just one music term?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "It identifies medieval sacred music through monophonic texture and liturgical function.",
        "It proves medieval music was primarily secular and theatrical.",
        "It introduces Romantic program music.",
        "It marks the rise of jazz improvisation.",
      ],
      answer:
        "It identifies medieval sacred music through monophonic texture and liturgical function.",
      explanation:
        "Chant is a recognition anchor for church-centered medieval music, especially when texture and ritual function are being tested.",
    },
  },
  {
    id: "medieval.lit.dante_vernacular_journey",
    moduleId: module2Summary.id,
    sectionId: "section-8-sacred-sound-vernacular",
    title: "Dante, Chaucer, and the vernacular journey tradition",
    officialPeriodBucket: "medieval_renaissance",
    discipline: "literature",
    subtype: "poetry",
    skillType: "interpretation",
    examTaskType: "identify_work",
    masteryWeight: 1.1,
    tags: ["dante", "chaucer", "vernacular", "pilgrimage", "journey"],
    sourceRefIds: ["cb-aag", "sample-set", "sayre-book-2", "fiero-book-1"],
    learn: {
      conciseExplanation:
        "Dante and Chaucer matter because they bring major literary ambition into vernacular languages. The Divine Comedy organizes a cosmic moral journey, while The Canterbury Tales turns pilgrimage into a frame for multiple voices and social types.",
      keyExample:
        "Dante's movement through Hell, Purgatory, and Paradise is one of the strongest medieval work-recognition patterns on the exam.",
      examClue:
        "If the question describes a journey through Hell, Purgatory, and Paradise, the answer is Dante or The Divine Comedy.",
      compareContrast:
        "Compare Dante and Chaucer: Dante builds a unified moral cosmos, while Chaucer uses pilgrimage to stage a social range of speakers and tales.",
    },
    flashcards: [
      {
        id: "fc-dante-1",
        front: "Dante's Divine Comedy is structured as a journey through what three realms?",
        back: "Hell, Purgatory, and Paradise.",
        direction: "concept",
      },
      {
        id: "fc-dante-2",
        front: "Who wrote The Canterbury Tales?",
        back: "Geoffrey Chaucer.",
        direction: "work_to_creator",
      },
      {
        id: "fc-dante-3",
        front: "What broader literary shift do Dante and Chaucer represent?",
        back: "The rise of ambitious vernacular literature alongside Latin scholarly culture.",
        direction: "feature_to_term",
      },
    ],
    videos: [],
    quizVariants: [
      {
        id: "q-dante-1",
        prompt: "Dante's Divine Comedy is structured as a journey through",
        mode: "checkpoint",
        variantType: "recall",
        choices: [
          "Greece, Rome, and Carthage",
          "Hell, Purgatory, and Paradise",
          "Earth, moon, and sun",
          "Youth, adulthood, and old age",
        ],
        answer: "Hell, Purgatory, and Paradise",
        explanation:
          "The trip through Hell, Purgatory, and Paradise is the defining recognition pattern for Dante's poem.",
      },
      {
        id: "q-dante-2",
        prompt: "Geoffrey Chaucer wrote",
        mode: "module_quiz",
        variantType: "recognition",
        choices: [
          "Paradise Lost",
          "The Decameron",
          "The Canterbury Tales",
          "Utopia",
        ],
        answer: "The Canterbury Tales",
        explanation:
          "Chaucer is the standard author-match for The Canterbury Tales and its pilgrimage frame.",
      },
    ],
    testVariant: {
      id: "t-dante-1",
      prompt:
        "A medieval work uses an otherworldly journey to map the moral order of the universe. Which identification is strongest?",
      mode: "module_test",
      variantType: "interpretation",
      choices: [
        "Dante's Divine Comedy",
        "Chaucer's The Canterbury Tales",
        "Boethius' Consolation of Philosophy",
        "A mystery play cycle",
      ],
      answer: "Dante's Divine Comedy",
      explanation:
        "The cosmic journey structure and moral mapping of the afterlife are the core recognition cues for Dante's poem.",
    },
  },
];
