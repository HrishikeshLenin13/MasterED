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
  math: generateMathQuestions(),
  rw: generateReadingWritingQuestions()
};

export const QUESTION_COUNTS = {
  math: QUESTION_BANK.math.length,
  rw: QUESTION_BANK.rw.length
};
