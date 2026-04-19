import type { ModuleSummary, Objective, Section, SourceRef } from "../lib/types";

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
        "Courtly love (fin'amor in Provençal, meaning 'refined love') was a literary code that emerged in 11th–12th century southern France and defined how aristocratic desire should be expressed in poetry and song. The troubadours — wandering poet-musicians attached to noble courts — developed a set of highly stylized conventions: the lover addresses a socially superior or unattainable lady (often married to someone of higher rank); he assumes the posture of a vassal loyally serving a lord; love is a form of emotional discipline and personal refinement rather than domestic fulfillment; and the beloved's unattainability intensifies rather than ends the lover's devotion. The tradition spread north into French trouvères, east into German minnesingers, and south into Italian stilnovo poets before feeding directly into Petrarchan sonnets and Elizabethan love poetry. Courtly love is important not because it describes how medieval people actually felt, but because it created a literary grammar — the idealized lady, the suffering servant-lover, the language of noble service — that dominated European lyric for 400 years and is recognizable in poetry far beyond the medieval period.",
      keyExample:
        "Guillaume de Aquitaine (c. 1071–1127), considered the first troubadour, wrote lyrics in which love is simultaneously a noble obligation and an impossible longing — the beloved is elevated so far above the lover that she functions almost as a divine figure, and the lover's suffering itself becomes a mark of refinement and social standing.",
      examClue:
        "If a CLEP question emphasizes noble, stylized, usually unattainable love between a devoted male poet and an elevated female figure, or if it asks about poet-musicians at aristocratic courts, courtly love is the framework and southern France in the 12th century is the origin point.",
      compareContrast:
        "Courtly lyric is private, emotional, and focused on the individual's inner life of feeling and longing — it is poetry sung to one person. Medieval heroic epic like the Song of Roland is public, collective, and external — duty to king, comrades, and God expressed through battlefield action. Both are aristocratic, but they address completely different dimensions of medieval noble experience.",
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
        url: "https://www.youtube.com/watch?v=rNCw2MOfnLQ",
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
        "After the fall of Rome in the 5th century, the Roman Catholic Church became the primary custodian of classical learning in the West — monasteries copied and stored ancient texts, cathedral schools trained clergy, and eventually universities arose in cities like Bologna, Paris, and Oxford. Across all these institutions, Latin was the universal language: not only the medium of theology and scripture but of law, medicine, philosophy, and all learned discourse, regardless of what vernacular language scholars spoke at home. Scholasticism was the dominant medieval intellectual method: it organized knowledge through a formal procedure of posing a question (quaestio), presenting objections, providing a systematic answer, and replying to each objection in turn. This method, mastered above all by Thomas Aquinas in his Summa Theologica (1265–74), used Aristotle's logic to reconcile ancient philosophy with Christian doctrine. Boethius (480–524 AD) is especially significant for connecting the classical and medieval worlds: writing in prison while awaiting execution on charges of treason, he composed The Consolation of Philosophy entirely in Latin prose and verse, arguing that Fortune's gifts are unstable by nature, but the divine good is constant, and philosophy can teach the mind to rest in that constancy rather than despair at suffering.",
      keyExample:
        "Boethius wrote The Consolation of Philosophy under sentence of death, without access to other texts or conversation, in the prison cell where he awaited execution. The work's central image is Fortune's Wheel — always turning, lifting some up and casting others down — and Boethius' consolation is that attaching happiness to Fortune's gifts is a philosophical error: true good cannot be taken by tyrants.",
      examClue:
        "If a CLEP question mentions medieval scholastic writing, the language of learned theology, or dialectical philosophical method, Latin is the recognition answer. If it mentions a philosopher writing while imprisoned who finds consolation through reason rather than despair, the author is Boethius and the work is The Consolation of Philosophy.",
      compareContrast:
        "Scholastic Latin writing is the official, universal, institutional language of medieval intellectual life — organized, impersonal, and aimed at doctrinal clarity. Courtly vernacular lyric is local, personal, and aimed at emotional persuasion. These two registers — learned Latin and spoken vernacular — coexisted throughout the Middle Ages and represent a fundamental divide between the clerical world and the court world.",
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
        url: "https://www.youtube.com/watch?v=H5AVPmAZ8o8",
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
        "Medieval European drama grew directly out of the liturgy of the church. As early as the 9th century, monks began to dramatize key moments of Easter and Christmas services using sung dialogue — short performances called liturgical drama. By the 12th and 13th centuries, these performances outgrew church interiors and moved to market squares, cathedral steps, and open-air stages, performed in vernacular languages so ordinary townspeople could understand them. Mystery plays (also called Corpus Christi plays or miracle plays) dramatized episodes from the Bible — from the Creation to the Last Judgment — and were organized and performed by trade guilds, each guild responsible for one episode staged on a wheeled wagon. The great English cycles — York (48 plays), Chester (24 plays), and Wakefield/Towneley (32 plays) — were performed over an entire day, with wagons moving through the town so different neighborhoods could see the same performances. Hagiographies served a parallel literary function: prose or verse narratives about the lives, miracles, and martyrdoms of saints — models of Christian virtue written for reading and meditation rather than public performance.",
      keyExample:
        "The Wakefield Second Shepherd's Play (from the Towneley cycle, c. 1400s) opens with three shepherds complaining about winter cold, taxes, and nagging wives before a sheep-stealing subplot interrupts them — then the Nativity of Christ arrives as the resolution. It is the most cited example of how mystery plays combined broad popular comedy with sacred subject matter in a single performance.",
      examClue:
        "If the CLEP question emphasizes biblical scenes performed outdoors for popular audiences, guild-organized religious drama, or the cycle format of multiple episodes, mystery play is the correct term. If it describes a saint's miracles and holy life in narrative form, hagiography is the answer.",
      compareContrast:
        "Mystery plays are public, communal, and theatrical — performed by craftsmen for crowds in the open air, teaching scripture through spectacle and sometimes through comedy. Hagiographies are textual and contemplative — written to be read alone or in small groups as devotional meditation. Together they show how medieval culture delivered religious meaning to every level of society, literate and illiterate alike.",
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
        url: "https://www.youtube.com/watch?v=2MsMUKI5df0",
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
        "Before the printing press, every book was made by hand, and in the Middle Ages the most prestigious books were also works of visual art. Manuscript illumination was the art of decorating handwritten texts with painted miniatures, ornate initial letters, intricate marginal border illustrations, and the application of gold leaf or gold paint — which caught the candlelight and appeared to illuminate (light up) the page, giving the art form its name. Monastic scriptoria (writing rooms) produced illuminated liturgical texts, gospel books, and biblical commentaries; from the 12th century onward, secular commercial workshops produced books for wealthy lay patrons. The most important type of privately owned illuminated manuscript was the Book of Hours: a devotional book organized around the 'hours' of the canonical day, containing prayers, psalms, a calendar of saints' feast days, and richly painted miniatures illustrating the Virgin's life, the Labors of the Months (scenes of peasants working through the seasons), and biblical episodes. Small enough to hold in one hand, the Book of Hours was the most personal luxury object a medieval aristocrat could own — used for daily private prayer and carried everywhere.",
      keyExample:
        "The Tr\u00e8s Riches Heures du Duc de Berry (c. 1410–16), illuminated by the Limbourg Brothers for the Duke of Berry, is the most famous Book of Hours: its calendar miniatures show the twelve months of the year in brilliantly colored scenes of aristocratic and peasant life, with the Duke's ch\u00e2teaux visible in the backgrounds — a window into both medieval visual art and court culture simultaneously.",
      examClue:
        "If a CLEP question describes a small, portable, richly decorated book used for personal daily prayer, the answer is Book of Hours. If it describes hand-painted manuscripts with decorated initials, marginal illustration, and gold-leaf ornament, the medium is illuminated manuscripts.",
      compareContrast:
        "An illuminated manuscript is intimate and portable: held in one reader's hands, made for private devotion, treasured as a personal object. A cathedral's stained glass or tympanum sculpture is monumental and public: experienced by hundreds of worshippers simultaneously in a communal liturgical space. Both teach Christian doctrine through visual image, but at opposite scales of intimacy.",
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
        "Romanesque architecture (roughly 900–1200 AD) was the first coherent architectural style to spread across Western Europe after the collapse of Roman building traditions, and it grew from a specific social context: pilgrimage. Thousands of Christian pilgrims traveled inland routes to shrines — most famously to the tomb of St. James at Santiago de Compostela in Spain — and great Romanesque churches were built along these routes to house the pilgrims, display the relics, and support the monastic communities that maintained the roads. The structural logic of Romanesque is determined by weight: the heavy stone barrel vault pressing down on the walls required thick walls with few and small windows to contain the outward thrust, producing dim, cave-like interiors with a sense of safety and enclosure. Key exterior features include rounded arches over windows and doorways, blind arcading on outer walls, and the tympanum — the carved semicircular stone panel positioned above the main church entrance, typically depicting the Last Judgment, Christ in Majesty, or scenes of heaven and hell, designed to awe and instruct worshippers before they even stepped inside.",
      keyExample:
        "The tympanum of Autun Cathedral in Burgundy, France (c. 1130), carved by the sculptor Gislebertus, is one of the most powerful examples of Romanesque sculpture: an enormous Last Judgment scene with Christ enthroned at the center, angels guiding the saved, and demons dragging the damned into Hell — a morally instructive image placed where no one entering the church could avoid it.",
      examClue:
        "If a CLEP image shows thick stone walls, small windows, rounded arches (not pointed), barrel-vaulted ceilings, and a sculpted relief panel above the main entrance, the style is Romanesque. The rounded arch is the single fastest cue: pointed arch immediately signals the later Gothic style.",
      compareContrast:
        "Romanesque architecture feels like a cave or fortress: thick walls, deep shadows, round forms pressing downward, sculpture that emerges from stone mass. Gothic architecture feels like a glass skeleton: walls thinned to narrow stone ribs supporting vast windows, pointed arches pulling upward, light flooding every surface. They are not just stylistically different — they represent opposite answers to the same question of how to build in stone.",
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
        url: "https://www.youtube.com/watch?v=FmRVKHilUiA",
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
        "Gothic architecture began with a theological idea and an engineering problem. Abbot Suger of Saint-Denis, near Paris, believed that beautiful material light could lift the human soul toward the divine — he called the radiant interior of his rebuilt abbey church lux nova, 'new light.' To fill the church with that light, builders had to find a way to eliminate the Romanesque stone wall. The solution came from three structural innovations working together. First, the pointed arch distributes the load from the vault more steeply downward, reducing the outward push compared to a round arch. Second, the ribbed vault concentrates the vault's thrust at specific points (the ribs) rather than evenly along the whole wall. Third, the flying buttress — a half-arch of stone springing from a free-standing pier outside the building — catches the concentrated thrust at exactly those points and carries it safely to the ground outside the wall. With the wall freed from structural duty, it could be dissolved into vast surfaces of stained glass, flooding the interior with colored light that medieval writers described as a foretaste of heaven. The result was architecture of soaring vertical ambition: pointed arches drawing the eye upward, ribbed vaults multiplying overhead, clustered columns rising uninterrupted from floor to vault.",
      keyExample:
        "Chartres Cathedral (completed c. 1220, France) is the most complete surviving Gothic cathedral: two asymmetrical towers, three elaborately sculpted triple porches, 176 stained-glass windows covering over 2,000 square meters, and an interior whose walls seem to be almost entirely glass — the definitive experience of Gothic light and vertical space.",
      examClue:
        "If a CLEP question asks what structural innovation made large stained-glass windows possible in Gothic cathedrals, the answer is flying buttresses. If an image shows a church with pointed arches, soaring height, and light-filled stained glass, the style is Gothic. The pointed arch plus light-flooding interior is the fastest recognition pair.",
      compareContrast:
        "Gothic converts the Romanesque wall from a load-bearing mass into a transparent skeleton — the structural weight is carried outside the building by flying buttresses, so the wall between the interior columns can be glass instead of stone. Romanesque is about enclosure and earth-bound solidity; Gothic is about ascent and light. Both use the same material (stone) to achieve completely opposite spatial experiences.",
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
        url: "https://www.youtube.com/watch?v=Qqz042moH0U",
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
        "Medieval music is almost entirely sacred music, and its history is the history of the sound of the medieval Church. Gregorian chant — named for Pope Gregory I (reigned 590–604 AD), though the repertoire was actually codified over several centuries — is the monophonic, unaccompanied liturgical song that filled churches, monasteries, and cathedrals across Western Europe for over a thousand years. Monophonic means one voice: everyone sings the same single melody in unison, with no harmonic support, in a free, text-following rhythm (not a metered beat) set to Latin liturgical texts. Hildegard of Bingen (1098–1179) was a German abbess, mystic, theologian, and composer who wrote an entire body of sacred song — the Symphonia armonie celestium revelationum (Symphony of the Harmony of Celestial Revelations) — that is more melodically soaring and expressively adventurous than typical chant; her musical visions are tied directly to her mystical writings. The next great development was polyphony: music with multiple independent melodic lines sounding simultaneously rather than in unison. The Notre Dame school in Paris (c. 1150–1250), principally the composers L\u00e9onin and P\u00e9rotin, developed the earliest measured polyphony (organum), layering additional voices above the chant in precise rhythmic patterns — the beginning of the Western tradition of composed, multi-voice music.",
      keyExample:
        "Hildegard of Bingen's O Virga ac Diadema (O Branch and Diadem) is a vivid example of her distinctive style: a single soprano melody that leaps dramatically in range, filled with the imagery of blossoming vines, dew, and divine light, tied to her visionary theology — unmistakably more personal and adventurous than functional liturgical chant.",
      examClue:
        "One unaccompanied melody, all voices singing the same line = monophony, Gregorian chant. Multiple independent melodic lines sounding simultaneously = polyphony. If the CLEP mentions a specific medieval woman composer of sacred song, the answer is always Hildegard of Bingen.",
      compareContrast:
        "Gregorian chant serves the words: melody follows the rhythm and meaning of the Latin text, with no harmony competing for attention. Polyphony begins to give music its own structural logic independent of the text — multiple voices weave against each other according to compositional rules. This tension between text-service and musical autonomy defines the entire next 500 years of Western vocal music development.",
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
        url: "https://www.youtube.com/watch?v=rNCw2MOfnLQ",
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
        "By the 13th and 14th centuries, two of the most ambitious literary works in the Western tradition were being composed not in Latin but in vernacular languages: the everyday spoken tongues that were becoming vehicles for serious literary culture for the first time. Dante Alighieri (1265–1321) wrote the Divine Comedy in Tuscan Italian — a dialect that his poem effectively shaped into a literary standard for the entire Italian language. The poem is organized as a first-person journey through three spiritual realms: Inferno (Hell, 34 cantos), Purgatorio (Purgatory, 33 cantos), and Paradiso (Paradise, 33 cantos), with the Roman poet Virgil serving as guide through Hell and Purgatory, and Beatrice (Dante's idealized love, now in Paradise) guiding him through the heavenly spheres. Each realm maps the moral order of medieval Christian theology — punishments fitting the sins, penance purging impurity, and Paradise representing degrees of divine love. The poem is simultaneously a personal autobiography, a political satire (Dante places his enemies in various circles of Hell), and a metaphysical encyclopedia. Geoffrey Chaucer (c. 1343–1400) used Middle English — the English of London and the royal court — for his Canterbury Tales: a frame narrative in which 31 pilgrims traveling to the shrine of St. Thomas Becket at Canterbury each agree to tell stories for entertainment. The result is a portrait of medieval English society from every rank, from the Knight and the Prioress to the Miller and the Wife of Bath, ranging in tone from chivalric romance to bawdy comedy to moral allegory.",
      keyExample:
        "In Inferno Canto V, Dante encounters Paolo and Francesca — two lovers condemned for adultery who float eternally in a whirlwind together, never touching. Francesca narrates how a single reading of a courtly romance about Lancelot and Guinevere moved them to kiss, and that was the beginning of their doom. It is simultaneously a tribute to the power of literature and a judgment on it — Dante the pilgrim faints from pity, but Dante the poet places them in Hell.",
      examClue:
        "A journey through Hell, Purgatory, and Paradise in a vernacular poem = Dante's Divine Comedy. A pilgrimage frame with multiple social-class storytellers in English = Chaucer's Canterbury Tales. Both signal the 14th-century emergence of ambitious vernacular literature.",
      compareContrast:
        "Dante builds a unified, vertically organized moral cosmos — one narrator descending and ascending through three realms, every detail architecturally precise and theologically systematic; it is a medieval summa expressed as a journey. Chaucer builds a horizontal, socially diverse panorama — many narrators moving along a road together, each bringing a different class, profession, and genre to bear; it is a sociological portrait expressed as a party. Together they define the breadth of what vernacular literature could do in the late Middle Ages.",
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
