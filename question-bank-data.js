function shuffleOptions(correct, distractors) {
  const options = [correct, ...distractors];
  return options.map((option, index) => ({
    id: String.fromCharCode(65 + index),
    text: option,
    correct: option === correct
  }));
}

function createMathQuestion({ id, domain, skill, scoreBand, difficulty, prompt, answer, explanation, choices, calculator = true }) {
  return {
    id,
    subject: "math",
    domain,
    skill,
    scoreBand,
    difficulty,
    format: choices ? "multiple-choice" : "student-response",
    prompt,
    answer: String(answer),
    choices,
    calculator,
    explanation,
    platformAccuracy: Math.max(41, 87 - difficulty * 5)
  };
}

function createRwQuestion({ id, domain, skill, scoreBand, difficulty, passage, prompt, answer, choices, explanation }) {
  return {
    id,
    subject: "rw",
    domain,
    skill,
    scoreBand,
    difficulty,
    format: "multiple-choice",
    passage,
    prompt,
    answer,
    choices,
    calculator: false,
    explanation,
    platformAccuracy: Math.max(44, 89 - difficulty * 5)
  };
}

function createCuratedMathQuestions() {
  return [
    createMathQuestion({
      id: "M-CUR-1",
      domain: "Algebra",
      skill: "Linear equations in one variable",
      scoreBand: 6,
      difficulty: 6,
      prompt:
        "In the equation (3x + 18) / 6 = k(x - 1), k is a constant. If the equation has infinitely many solutions, what is the value of k?",
      answer: "1/2",
      explanation:
        "For infinitely many solutions, both sides must be equivalent for every x. The left side simplifies to x/2 + 3, so k must equal 1/2.",
      choices: shuffleOptions("1/2", ["1/3", "2", "3"])
    }),
    createMathQuestion({
      id: "M-CUR-2",
      domain: "Advanced Math",
      skill: "Nonlinear functions",
      scoreBand: 6,
      difficulty: 5,
      prompt:
        "A quadratic function f has zeros at x = -3 and x = 5. Which expression could define f(x)?",
      answer: "(x + 3)(x - 5)",
      explanation:
        "A quadratic with zeros at -3 and 5 factors as (x + 3)(x - 5), up to a nonzero constant multiple.",
      choices: shuffleOptions("(x + 3)(x - 5)", ["(x - 3)(x + 5)", "(x + 3)(x + 5)", "(x - 3)(x - 5)"])
    }),
    createMathQuestion({
      id: "M-CUR-3",
      domain: "Problem-Solving and Data Analysis",
      skill: "Ratios, rates, proportional relationships, and units",
      scoreBand: 5,
      difficulty: 5,
      prompt:
        "A recipe uses flour and sugar in the ratio 5:2. If a baker uses 35 cups of flour, how many cups of sugar are needed to keep the ratio the same?",
      answer: "14",
      explanation:
        "Since 35 is 7 times 5, multiply the sugar part 2 by 7. The baker needs 14 cups of sugar.",
      choices: shuffleOptions("14", ["12", "10", "17"])
    }),
    createMathQuestion({
      id: "M-CUR-4",
      domain: "Geometry and Trigonometry",
      skill: "Area and volume",
      scoreBand: 4,
      difficulty: 4,
      prompt:
        "A cylinder has radius 3 and height 8. What is the volume of the cylinder, in terms of pi?",
      answer: "72pi",
      explanation:
        "The volume of a cylinder is pi r^2 h. So the volume is pi(3^2)(8) = 72pi.",
      choices: shuffleOptions("72pi", ["24pi", "48pi", "144pi"])
    }),
    createMathQuestion({
      id: "M-CUR-5",
      domain: "Algebra",
      skill: "Systems of two linear equations",
      scoreBand: 6,
      difficulty: 6,
      prompt:
        "If 2x + y = 13 and x - y = 2, what is the value of x?",
      answer: "5",
      explanation:
        "Add the equations to eliminate y: 3x = 15, so x = 5.",
      choices: shuffleOptions("5", ["3", "4", "6"])
    }),
    createMathQuestion({
      id: "M-CUR-6",
      domain: "Advanced Math",
      skill: "Equivalent expressions",
      scoreBand: 5,
      difficulty: 5,
      prompt:
        "Which expression is equivalent to 4x^2 - 25?",
      answer: "(2x - 5)(2x + 5)",
      explanation:
        "This is a difference of squares: 4x^2 - 25 = (2x)^2 - 5^2 = (2x - 5)(2x + 5).",
      choices: shuffleOptions("(2x - 5)(2x + 5)", ["(4x - 5)(x + 5)", "(2x - 5)^2", "(4x + 5)(x - 5)"])
    }),
    createMathQuestion({
      id: "M-CUR-7",
      domain: "Geometry and Trigonometry",
      skill: "Right triangles and trigonometry",
      scoreBand: 5,
      difficulty: 5,
      prompt:
        "A right triangle has legs 9 and 12. What is the length of the hypotenuse?",
      answer: "15",
      explanation:
        "Use the Pythagorean theorem: c = sqrt(9^2 + 12^2) = sqrt(225) = 15.",
      choices: shuffleOptions("15", ["13", "14", "21"])
    }),
    createMathQuestion({
      id: "M-CUR-8",
      domain: "Problem-Solving and Data Analysis",
      skill: "Percentages",
      scoreBand: 4,
      difficulty: 4,
      prompt:
        "The price of a jacket is reduced by 20% from $75. What is the sale price of the jacket?",
      answer: "60",
      explanation:
        "Twenty percent of 75 is 15. Subtract 15 from 75 to get 60.",
      choices: shuffleOptions("60", ["55", "65", "70"])
    })
  ];
}

function createCuratedRwQuestions() {
  return [
    createRwQuestion({
      id: "RW-CUR-1",
      domain: "Craft and Structure",
      skill: "Words in Context",
      scoreBand: 6,
      difficulty: 5,
      passage:
        "In her review of the exhibit, Morales notes that the curator's arrangement is restrained rather than flashy: each room highlights one visual idea, allowing visitors to notice subtle connections among the works.",
      prompt: 'As used in the text, "restrained" most nearly means',
      answer: "carefully controlled",
      choices: shuffleOptions("carefully controlled", ["poorly funded", "widely admired", "strictly prohibited"]),
      explanation:
        'The passage contrasts "restrained" with "flashy," so the best meaning is "carefully controlled."'
    }),
    createRwQuestion({
      id: "RW-CUR-2",
      domain: "Information and Ideas",
      skill: "Command of Evidence",
      scoreBand: 6,
      difficulty: 5,
      passage:
        "Researchers studying a wetland restoration project found that native bird populations rose steadily over four years. The increase began only after water levels became more stable and dense shoreline plants returned.",
      prompt:
        "Which choice best states the main support for the claim that the restoration improved habitat quality?",
      answer: "Bird populations increased after stable water levels and shoreline plants returned.",
      choices: shuffleOptions(
        "Bird populations increased after stable water levels and shoreline plants returned.",
        [
          "The wetland project lasted four years.",
          "Researchers visited the wetland every month.",
          "Some birds had previously migrated through the area."
        ]
      ),
      explanation:
        "The passage directly connects the return of habitat features with a sustained increase in bird populations."
    }),
    createRwQuestion({
      id: "RW-CUR-3",
      domain: "Expression of Ideas",
      skill: "Transitions",
      scoreBand: 4,
      difficulty: 4,
      passage:
        "Nadia originally planned to study only the bridge's exterior design. She later added an analysis of how the bridge changed commuting patterns in nearby neighborhoods. ___, her final paper discussed both engineering and local history.",
      prompt: "Which choice completes the text with the most logical transition?",
      answer: "As a result",
      choices: shuffleOptions("As a result", ["For instance", "Nevertheless", "Instead"]),
      explanation:
        "The second sentence describes a change in scope that leads to the broader final paper, so a result transition is appropriate."
    }),
    createRwQuestion({
      id: "RW-CUR-4",
      domain: "Standard English Conventions",
      skill: "Boundaries",
      scoreBand: 4,
      difficulty: 4,
      passage:
        "The astronomer reviewed the latest images from the observatory. She concluded that the newly identified object was not a comet but a distant galaxy.",
      prompt:
        "Which choice completes the sentence so that it conforms to the conventions of Standard English? The astronomer reviewed the latest images from the observatory; she concluded that the newly identified object was not a comet ___ a distant galaxy.",
      answer: "but rather",
      choices: shuffleOptions("but rather", ["but, rather", "but rather,", "rather but"]),
      explanation:
        'The idiomatic and grammatically complete construction is "not ... but rather ..."'
    }),
    createRwQuestion({
      id: "RW-CUR-5",
      domain: "Expression of Ideas",
      skill: "Rhetorical Synthesis",
      scoreBand: 5,
      difficulty: 5,
      passage:
        "A student is writing about a school robotics team. The notes say the team introduced peer mentoring, doubled membership in one year, and won an award for community outreach.",
      prompt:
        "Which choice most effectively uses the notes to emphasize the team's growth and community impact?",
      answer:
        "After introducing peer mentoring, the robotics team doubled its membership and later earned recognition for its community outreach.",
      choices: shuffleOptions(
        "After introducing peer mentoring, the robotics team doubled its membership and later earned recognition for its community outreach.",
        [
          "The robotics team met after school and participated in several competitions during the year.",
          "Although the robotics team won an award, its membership stayed about the same.",
          "Peer mentoring was one of many ideas discussed by the robotics team over the year."
        ]
      ),
      explanation:
        "The correct choice integrates all three notes while focusing on both growth and community impact."
    }),
    createRwQuestion({
      id: "RW-CUR-6",
      domain: "Information and Ideas",
      skill: "Central Ideas and Details",
      scoreBand: 6,
      difficulty: 6,
      passage:
        "Historian Mei Chen argues that the port city's significance came not from its size alone but from the unusual mix of traders who passed through it. Because merchants carried legal customs, design ideas, and scientific tools as well as goods, the city became a place where local practices changed quickly.",
      prompt: "Which choice best states the main idea of the text?",
      answer:
        "The city's importance came from cultural exchange created by the variety of merchants who traveled there.",
      choices: shuffleOptions(
        "The city's importance came from cultural exchange created by the variety of merchants who traveled there.",
        [
          "The city was historically important because it was larger than neighboring ports.",
          "The city declined after merchants stopped carrying scientific tools there.",
          "The city resisted change because local customs remained stronger than outside influence."
        ]
      ),
      explanation:
        "The passage focuses on how diverse merchants brought more than goods, causing rapid cultural and practical change."
    }),
    createRwQuestion({
      id: "RW-CUR-7",
      domain: "Craft and Structure",
      skill: "Text Structure and Purpose",
      scoreBand: 5,
      difficulty: 5,
      passage:
        "The first paragraph introduces an older theory about coral growth. The next paragraph describes a recent study that explains why the older theory could not account for growth patterns during unusually warm years.",
      prompt: "What is the primary function of the second paragraph?",
      answer: "To present evidence that revises an earlier explanation",
      choices: shuffleOptions(
        "To present evidence that revises an earlier explanation",
        [
          "To provide a historical background unrelated to the theory",
          "To summarize the methods used in every coral study",
          "To argue that the older theory remains fully correct"
        ]
      ),
      explanation:
        "The second paragraph introduces a study that changes how the earlier theory should be understood."
    }),
    createRwQuestion({
      id: "RW-CUR-8",
      domain: "Standard English Conventions",
      skill: "Form, Structure, and Sense",
      scoreBand: 5,
      difficulty: 5,
      passage:
        "The novelist's earliest drafts were expansive and loosely organized. The published version, however, is concise, carefully paced, and far more ___ for readers encountering the story for the first time.",
      prompt: "Which choice completes the text so that it conforms to the conventions of Standard English?",
      answer: "accessible",
      choices: shuffleOptions("accessible", ["access", "accessibly", "accessing"]),
      explanation:
        'After "far more," the sentence needs an adjective describing the published version, so "accessible" is correct.'
    })
  ];
}

function generateMathQuestions() {
  const questions = [];
  let idCounter = 1;

  for (let n = 6; n <= 55; n += 1) {
    const rhs = 2 * n + 9;
    const answer = n;
    const prompt = `Solve for x: 2x + 9 = ${rhs}.`;
    questions.push(
      createMathQuestion({
        id: `M-LIN-${idCounter++}`,
        domain: "Algebra",
        skill: "Linear equations in one variable",
        scoreBand: 4,
        difficulty: 2 + (n % 4),
        prompt,
        answer,
        explanation: `Subtract 9 from both sides to get 2x = ${rhs - 9}, then divide by 2 to get x = ${answer}.`,
        choices: shuffleOptions(String(answer), [String(answer + 1), String(answer - 1), String(answer + 3)])
      })
    );
  }

  for (let a = 2; a <= 16; a += 1) {
    for (let b = 3; b <= 8; b += 1) {
      const x = a + b;
      const y = a - 1;
      questions.push(
        createMathQuestion({
          id: `M-SYS-${idCounter++}`,
          domain: "Algebra",
          skill: "Systems of two linear equations",
          scoreBand: 5,
          difficulty: 3 + ((a + b) % 4),
          prompt: `The system x + y = ${x + y} and x - y = ${x - y} has solution (x, y). What is the value of x?`,
          answer: x,
          explanation: `Add the equations. You get 2x = ${(x + y) + (x - y)}, so x = ${x}.`,
          choices: shuffleOptions(String(x), [String(x + 2), String(y), String(x - 2)])
        })
      );
    }
  }

  for (let m = 2; m <= 31; m += 1) {
    const b = (m % 7) + 1;
    const input = (m % 5) + 2;
    const answer = m * input + b;
    questions.push(
      createMathQuestion({
        id: `M-FUN-${idCounter++}`,
        domain: "Advanced Math",
        skill: "Linear functions",
        scoreBand: 4,
        difficulty: 2 + (m % 5),
        prompt: `A function is defined by f(x) = ${m}x + ${b}. What is the value of f(${input})?`,
        answer,
        explanation: `Substitute ${input} for x. Then f(${input}) = ${m}(${input}) + ${b} = ${answer}.`,
        choices: shuffleOptions(String(answer), [String(answer + m), String(answer - b), String(m + b)])
      })
    );
  }

  for (let root1 = 2; root1 <= 21; root1 += 1) {
    const root2 = (root1 % 6) + 1;
    const sum = root1 + root2;
    const product = root1 * root2;
    questions.push(
      createMathQuestion({
        id: `M-QUAD-${idCounter++}`,
        domain: "Advanced Math",
        skill: "Quadratic equations",
        scoreBand: 6,
        difficulty: 4 + (root1 % 3),
        prompt: `If x^2 - ${sum}x + ${product} = 0, one solution is ${root1}. What is the other solution?`,
        answer: root2,
        explanation: `For x^2 - ${sum}x + ${product}, the roots multiply to ${product} and add to ${sum}. Since one root is ${root1}, the other must be ${root2}.`,
        choices: shuffleOptions(String(root2), [String(sum), String(product), String(root1 + 1)])
      })
    );
  }

  for (let percent = 10; percent <= 59; percent += 1) {
    const original = 80 + percent * 3;
    const answer = (original * percent) / 100;
    questions.push(
      createMathQuestion({
        id: `M-PDA-${idCounter++}`,
        domain: "Problem-Solving and Data Analysis",
        skill: "Percentages",
        scoreBand: 4,
        difficulty: 2 + (percent % 5),
        prompt: `What is ${percent}% of ${original}?`,
        answer,
        explanation: `Convert ${percent}% to ${percent / 100}, then multiply by ${original} to get ${answer}.`,
        choices: shuffleOptions(String(answer), [String(answer + 10), String(answer - 10), String(original + percent)])
      })
    );
  }

  for (let ratioA = 2; ratioA <= 21; ratioA += 1) {
    const ratioB = (ratioA % 5) + 3;
    const total = (ratioA + ratioB) * 4;
    const answer = (ratioA / (ratioA + ratioB)) * total;
    questions.push(
      createMathQuestion({
        id: `M-RAT-${idCounter++}`,
        domain: "Problem-Solving and Data Analysis",
        skill: "Ratios, rates, proportional relationships, and units",
        scoreBand: 5,
        difficulty: 3 + (ratioA % 4),
        prompt: `In a ratio of ${ratioA}:${ratioB}, the total number of items is ${total}. How many items belong to the first part of the ratio?`,
        answer,
        explanation: `There are ${ratioA + ratioB} equal parts total. Each part is ${total} / ${ratioA + ratioB} = 4, so the first part is ${ratioA} × 4 = ${answer}.`,
        choices: shuffleOptions(String(answer), [String(answer + 4), String(answer - 4), String(total / 2)])
      })
    );
  }

  for (let side = 4; side <= 53; side += 1) {
    const answer = side * side;
    questions.push(
      createMathQuestion({
        id: `M-GEO-${idCounter++}`,
        domain: "Geometry and Trigonometry",
        skill: "Area and volume",
        scoreBand: 3,
        difficulty: 2 + (side % 4),
        prompt: `A square has side length ${side}. What is its area?`,
        answer,
        explanation: `The area of a square is side^2. So the area is ${side}^2 = ${answer}.`,
        choices: shuffleOptions(String(answer), [String(side * 4), String(answer + side), String(side + side)])
      })
    );
  }

  for (let a = 3; a <= 32; a += 1) {
    const b = a + 4;
    const c = Math.round(Math.sqrt(a * a + b * b));
    questions.push(
      createMathQuestion({
        id: `M-TRI-${idCounter++}`,
        domain: "Geometry and Trigonometry",
        skill: "Right triangles and trigonometry",
        scoreBand: 6,
        difficulty: 4 + (a % 3),
        prompt: `A right triangle has legs ${a} and ${b}. Which value is closest to the hypotenuse?`,
        answer: c,
        explanation: `Use the Pythagorean theorem: c = sqrt(${a}^2 + ${b}^2) = sqrt(${a * a + b * b}), which is about ${c}.`,
        choices: shuffleOptions(String(c), [String(c + 2), String(c - 2), String(a + b)])
      })
    );
  }

  while (questions.length < 1000) {
    const seed = questions.length + 1;
    const a = 2 + (seed % 9);
    const b = 3 + (seed % 7);
    const x = a * b;
    questions.push(
      createMathQuestion({
        id: `M-MIX-${idCounter++}`,
        domain: seed % 2 === 0 ? "Algebra" : "Advanced Math",
        skill: seed % 2 === 0 ? "Equivalent expressions" : "Nonlinear functions",
        scoreBand: 5 + (seed % 2),
        difficulty: 3 + (seed % 4),
        prompt: `If y = ${a}x and x = ${b}, what is the value of y?`,
        answer: x,
        explanation: `Substitute x = ${b} into y = ${a}x. Then y = ${a}(${b}) = ${x}.`,
        choices: shuffleOptions(String(x), [String(x + a), String(x - b), String(a + b)])
      })
    );
  }

  return questions;
}

const vocabPairs = [
  ["precise", "exact"],
  ["candid", "frank"],
  ["obscure", "unclear"],
  ["mitigate", "lessen"],
  ["bolster", "support"],
  ["pragmatic", "practical"],
  ["convey", "communicate"],
  ["subtle", "delicate"],
  ["vivid", "striking"],
  ["sustain", "continue"]
];

function generateReadingWritingQuestions() {
  const questions = [];
  let idCounter = 1;

  for (let i = 0; i < 200; i += 1) {
    const [word, meaning] = vocabPairs[i % vocabPairs.length];
    const topic = ["marine biology", "urban design", "planetary science", "public policy", "literary criticism"][i % 5];
    const passage = `A short report on ${topic} notes that the lead researcher chose a ${word} phrase rather than a dramatic one because the evidence was still limited. In context, the author uses "${word}" to emphasize careful interpretation instead of exaggeration.`;
    const choices = shuffleOptions(
      meaning,
      ["ancient", "humorous", "crowded"]
    );
    questions.push(
      createRwQuestion({
        id: `RW-VOC-${idCounter++}`,
        domain: "Craft and Structure",
        skill: "Words in Context",
        scoreBand: 5,
        difficulty: 3 + (i % 4),
        passage,
        prompt: `As used in the passage, "${word}" most nearly means`,
        answer: meaning,
        choices,
        explanation: `The passage contrasts the word with "dramatic" and links it to careful interpretation, so "${meaning}" is the best match.`
      })
    );
  }

  const transitionSets = [
    ["However", "contrast"],
    ["Therefore", "result"],
    ["For example", "example"],
    ["Meanwhile", "time shift"],
    ["Similarly", "comparison"]
  ];

  for (let i = 0; i < 200; i += 1) {
    const [answer, relation] = transitionSets[i % transitionSets.length];
    const passage = `The first draft of the school garden proposal focused only on student volunteers. The final draft added partnerships with neighborhood groups. ___, the later draft presented the project as a broader community effort.`;
    const choices = shuffleOptions(answer, ["Instead", "Specifically", "Nevertheless"]);
    questions.push(
      createRwQuestion({
        id: `RW-TRA-${idCounter++}`,
        domain: "Expression of Ideas",
        skill: "Transitions",
        scoreBand: 4,
        difficulty: 2 + (i % 5),
        passage,
        prompt: `Which choice completes the text with the most logical transition?`,
        answer,
        choices,
        explanation: `The second sentence shows an expanded result of the revision, so the correct transition signals ${relation}.`
      })
    );
  }

  for (let i = 0; i < 200; i += 1) {
    const subject = ["novelist", "physicist", "architect", "botanist", "composer"][i % 5];
    const passage = `In a profile of one ${subject}, the writer argues that the subject's most important achievement was not a single famous work but a long pattern of experimentation. According to the passage, the subject's career mattered because each project refined methods that later influenced others.`;
    const correct = "It emphasizes the subject's long-term influence rather than a lone success.";
    const choices = shuffleOptions(correct, [
      "It claims the subject's work was popular mainly because it was easy to copy.",
      "It suggests the subject became well known despite rarely finishing projects.",
      "It argues the subject avoided experimentation in order to protect a reputation."
    ]);
    questions.push(
      createRwQuestion({
        id: `RW-INF-${idCounter++}`,
        domain: "Information and Ideas",
        skill: "Central Ideas and Details",
        scoreBand: 5,
        difficulty: 3 + (i % 4),
        passage,
        prompt: `Which choice best states the main idea of the text?`,
        answer: correct,
        choices,
        explanation: `The passage stresses the pattern of experimentation and later influence, so the answer about long-term influence is best supported.`
      })
    );
  }

  for (let i = 0; i < 200; i += 1) {
    const passage = `The student writer wants to introduce a set of notes about a city library renovation. The notes say the library added sunlight, created quiet study corners, and increased teen attendance within three months.`;
    const correct = "After its renovation, the city library became brighter and more appealing to students, leading to a quick rise in teen attendance.";
    const choices = shuffleOptions(correct, [
      "Because the city library had already been popular, the renovation did not change how students used the building.",
      "The library renovation focused on replacing books rather than improving the building itself.",
      "Although the library gained more sunlight, attendance fell during the first three months after the renovation."
    ]);
    questions.push(
      createRwQuestion({
        id: `RW-SYN-${idCounter++}`,
        domain: "Expression of Ideas",
        skill: "Rhetorical Synthesis",
        scoreBand: 4,
        difficulty: 2 + (i % 4),
        passage,
        prompt: `Which choice most effectively uses the notes to accomplish the student's goal?`,
        answer: correct,
        choices,
        explanation: `The correct choice accurately combines the renovation details with the outcome in a concise summary.`
      })
    );
  }

  for (let i = 0; i < 200; i += 1) {
    const correct = "scientists, however,";
    const passage = `Some readers expected the early telescope images to settle every debate immediately. Many scientists recognized that more observations would still be needed.`;
    const choices = shuffleOptions(correct, [
      "scientists however",
      "scientists however,",
      "scientists; however"
    ]);
    questions.push(
      createRwQuestion({
        id: `RW-CON-${idCounter++}`,
        domain: "Standard English Conventions",
        skill: "Boundaries",
        scoreBand: 3,
        difficulty: 2 + (i % 4),
        passage,
        prompt: `Which choice completes the sentence so that it conforms to the conventions of Standard English? Some readers expected the early telescope images to settle every debate immediately; many ___ recognized that more observations would still be needed.`,
        answer: correct,
        choices,
        explanation: `The interrupter "however" should be set off with commas in this sentence.`
      })
    );
  }

  return questions;
}

export const QUESTION_BANK = {
  math: [...createCuratedMathQuestions(), ...generateMathQuestions()].slice(0, 1000),
  rw: [...createCuratedRwQuestions(), ...generateReadingWritingQuestions()].slice(0, 1000)
};

export const QUESTION_COUNTS = {
  math: QUESTION_BANK.math.length,
  rw: QUESTION_BANK.rw.length
};
