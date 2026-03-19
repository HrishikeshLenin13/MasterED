import {
  auth,
  createUserWithEmailAndPassword,
  googleProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "./firebase-config.js";
import { QUESTION_BANK, QUESTION_COUNTS } from "./question-bank-data.js";

const STORAGE_KEY = "mastered-shell-settings-v2";
const ANALYTICS_KEY = "mastered-analytics-v1";

const satSchedule = [
  { value: "auto", label: "Automatic next official SAT" },
  { value: "2026-05-02", label: "May 2, 2026 SAT" },
  { value: "2026-06-06", label: "June 6, 2026 SAT" },
  { value: "2026-08-15", label: "August 15, 2026 SAT" },
  { value: "2026-09-12", label: "September 12, 2026 SAT" },
  { value: "2026-10-03", label: "October 3, 2026 SAT" },
  { value: "2026-11-07", label: "November 7, 2026 SAT" },
  { value: "2026-12-05", label: "December 5, 2026 SAT" },
  { value: "2027-03-13", label: "March 13, 2027 SAT" },
  { value: "2027-05-01", label: "May 1, 2027 SAT" },
  { value: "2027-06-05", label: "June 5, 2027 SAT" }
];

const defaults = {
  theme: "light",
  accentColor: "#23b1ec",
  navPosition: "left",
  iconsOnlyTabs: false,
  hideCountdown: false,
  selectedSat: "auto"
};

function createSatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 7, 45, 0, 0);
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const merged = saved ? { ...defaults, ...saved } : { ...defaults };
    merged.theme = merged.theme === "dark" ? "dark" : "light";
    return merged;
  } catch (error) {
    return { ...defaults };
  }
}

const settings = loadSettings();
const satDates = satSchedule.filter((item) => item.value !== "auto").map((item) => createSatDate(item.value));

const body = document.body;
const splashScreen = document.getElementById("splash-screen");
const authView = document.getElementById("auth-view");
const appShell = document.getElementById("app-shell");
const logoButton = document.getElementById("logo-button");
const heroLogoButton = document.getElementById("hero-logo-button");
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const homeScreen = document.getElementById("screen-home");
const blankScreen = document.getElementById("screen-blank");
const questionBankScreen = document.getElementById("screen-question-bank");
const practiceScreen = document.getElementById("screen-practice");
const calculatorScreen = document.getElementById("screen-calculator");
const settingsScreen = document.getElementById("screen-settings");
const statsLiveScreen = document.getElementById("screen-stats-live");
const countdownLabel = document.getElementById("next-sat-countdown");
const countdownPill = document.querySelector(".countdown-pill");
const profileTrigger = document.getElementById("profile-trigger");
const profileDropdown = document.getElementById("profile-dropdown");
const profileSettingsButton = document.getElementById("profile-settings-button");
const changeNameButton = document.getElementById("change-name-button");
const profileInitials = document.getElementById("profile-initials");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const signOutButton = document.getElementById("sign-out-button");
const themeSelect = document.getElementById("theme-select");
const accentColorInput = document.getElementById("accent-color-input");
const navPositionSelect = document.getElementById("nav-position-select");
const iconsOnlyToggle = document.getElementById("icons-only-toggle");
const hideCountdownToggle = document.getElementById("hide-countdown-toggle");
const satDateSelect = document.getElementById("sat-date-select");
const calculatorFrame = document.getElementById("score-calculator-frame");

const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const authSubmit = document.getElementById("auth-submit");
const googleAuthLabel = document.getElementById("google-auth-label");
const authFooterLabel = document.getElementById("auth-footer-label");
const authSwitchLink = document.getElementById("auth-switch-link");
const googleAuthButton = document.getElementById("google-auth-button");
const signInModeButton = document.getElementById("sign-in-mode");
const signUpModeButton = document.getElementById("sign-up-mode");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const jumpQuestionBankButton = document.getElementById("jump-question-bank");
const suggestedNextCard = document.getElementById("suggested-next-card");
const qbankUtilityButtons = Array.from(document.querySelectorAll(".qbank-utility"));
const qbankFilterButtons = Array.from(document.querySelectorAll(".filter-pill"));
const qbankTopicRows = Array.from(document.querySelectorAll(".topic-row"));
const qbankTopicPanelButtons = Array.from(document.querySelectorAll(".topic-panel-button"));
const qbankClusterButtons = Array.from(document.querySelectorAll(".cluster-toggle"));
const qbankSubjectButtons = Array.from(document.querySelectorAll(".subject-toggle"));
const qbankCurrentTitle = document.getElementById("qbank-current-title");
const qbankCurrentCopy = document.getElementById("qbank-current-copy");
const qbankStartButton = document.getElementById("qbank-start-button");
const qbankSelectionPills = document.getElementById("selection-pills");
const difficultyTrigger = document.getElementById("difficulty-trigger");
const difficultyPanel = document.getElementById("difficulty-panel");
const difficultyMin = document.getElementById("difficulty-min");
const difficultyMax = document.getElementById("difficulty-max");
const difficultyRangeLabel = document.getElementById("difficulty-range-label");
const mathCountLabel = document.getElementById("math-count-label");
const rwCountLabel = document.getElementById("rw-count-label");
const qbankTotalCount = document.getElementById("qbank-total-count");
const qbankReviewCount = document.getElementById("qbank-review-count");
const qbankCompleteCount = document.getElementById("qbank-complete-count");
const practiceBackButton = document.getElementById("practice-back-button");
const practiceTimer = document.getElementById("practice-timer");
const practiceSubjectLabel = document.getElementById("practice-subject-label");
const practiceSkillLabel = document.getElementById("practice-skill-label");
const practiceIndexBadge = document.getElementById("practice-index-badge");
const practicePassage = document.getElementById("practice-passage");
const practicePrompt = document.getElementById("practice-prompt");
const practiceChoiceList = document.getElementById("practice-choice-list");
const practiceAnswerInput = document.getElementById("practice-answer-input");
const practiceFeedback = document.getElementById("practice-feedback");
const questionInfoCard = document.getElementById("question-info-card");
const questionInfoButton = document.getElementById("question-info-button");
const lockAiButton = document.getElementById("lock-ai-button");
const explanationButton = document.getElementById("explanation-button");
const checkAnswerButton = document.getElementById("check-answer-button");
const nextQuestionButton = document.getElementById("next-question-button");
const practiceTools = Array.from(document.querySelectorAll(".practice-tool"));
const toolPanes = {
  calculator: document.getElementById("tool-pane-calculator"),
  reference: document.getElementById("tool-pane-reference")
};
const calcSwitches = Array.from(document.querySelectorAll(".tool-switch[data-calc-mode]"));
const desmosFrame = document.getElementById("desmos-frame");
const toolPopoutButton = document.getElementById("tool-popout-button");
const practiceFullscreenButton = document.getElementById("practice-fullscreen-button");
const practiceThemeButton = document.getElementById("practice-theme-button");
const accuracyBars = document.getElementById("accuracy-bars");
const timelineBars = document.getElementById("timeline-bars");
const statsCalendar = document.getElementById("stats-calendar");
const skillStatsList = document.getElementById("skill-stats-list");
const lockPanel = document.getElementById("lock-panel");
const lockTabs = document.getElementById("lock-tabs");
const lockCopy = document.getElementById("lock-copy");

let authMode = "signin";
let splashFinished = false;
let resolvedUser = null;
let currentQuestionBankTopic = "";
const selectedSubjects = new Set(["rw", "math"]);
const selectedTopics = new Set();
let practiceSet = [];
let currentQuestionIndex = 0;
let currentQuestion = null;
let selectedChoiceId = "";
let currentCalcMode = "graphing";
let timerInterval = null;
let questionStartTime = 0;
let questionSolved = false;
let analytics = loadAnalytics();

function loadAnalytics() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || "null");
    return parsed || { attempts: [] };
  } catch (error) {
    return { attempts: [] };
  }
}

function saveAnalytics() {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

function getUserName(user) {
  return user?.displayName || user?.email?.split("@")[0] || "MasterED User";
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return "ME";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function updateProfileUI(user) {
  const name = getUserName(user);
  profileName.textContent = name;
  profileEmail.textContent = user?.email || "No email";
  profileInitials.textContent = getInitials(name);
}

function closeProfileMenu() {
  profileDropdown.classList.add("hidden");
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function getAutomaticNextSat() {
  const now = new Date();
  return satDates.find((date) => date.getTime() > now.getTime()) || null;
}

function getSelectedSatDate() {
  if (settings.selectedSat === "auto") {
    return getAutomaticNextSat();
  }

  const selected = createSatDate(settings.selectedSat);
  if (selected.getTime() > Date.now()) {
    return selected;
  }

  return getAutomaticNextSat();
}

function formatCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Starting now";
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updateCountdown() {
  if (settings.hideCountdown) {
    countdownPill.classList.add("hidden");
    return;
  }

  countdownPill.classList.remove("hidden");
  const nextSat = getSelectedSatDate();
  countdownLabel.textContent = nextSat ? formatCountdown(nextSat) : "Schedule unavailable";
}

function syncSettingsUI() {
  themeSelect.value = settings.theme;
  accentColorInput.value = settings.accentColor;
  navPositionSelect.value = settings.navPosition;
  iconsOnlyToggle.checked = settings.iconsOnlyTabs;
  hideCountdownToggle.checked = settings.hideCountdown;
  satDateSelect.innerHTML = satSchedule.map((item) => `<option value="${item.value}">${item.label}</option>`).join("");

  if (!satSchedule.some((item) => item.value === settings.selectedSat)) {
    settings.selectedSat = "auto";
  }

  satDateSelect.value = settings.selectedSat;
}

function syncCalculatorTheme() {
  calculatorFrame.contentWindow?.postMessage(
    {
      type: "mastered-theme",
      payload: {
        theme: settings.theme,
        accentColor: settings.accentColor
      }
    },
    window.location.origin
  );
}

function applySettings() {
  body.dataset.theme = settings.theme;
  body.dataset.navPosition = settings.navPosition;
  body.dataset.navLabels = settings.iconsOnlyTabs ? "icons" : "full";
  document.documentElement.style.setProperty("--accent", settings.accentColor);
  updateCountdown();
  syncSettingsUI();
  saveSettings();
  syncCalculatorTheme();
}

function formatTimerValue(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startQuestionTimer() {
  window.clearInterval(timerInterval);
  questionStartTime = Date.now();
  practiceTimer.textContent = "00:00";
  timerInterval = window.setInterval(() => {
    if (questionSolved) {
      return;
    }
    const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
    practiceTimer.textContent = formatTimerValue(elapsed);
  }, 1000);
}

function stopQuestionTimer() {
  const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
  practiceTimer.textContent = formatTimerValue(elapsed);
  window.clearInterval(timerInterval);
  return elapsed;
}

function getFilteredQuestionPool() {
  const pools = Array.from(selectedSubjects).flatMap((subject) => QUESTION_BANK[subject] || []);
  const minDifficulty = Number(difficultyMin.value);
  const maxDifficulty = Number(difficultyMax.value);

  return pools.filter((question) => {
    const matchesDifficulty = question.difficulty >= minDifficulty && question.difficulty <= maxDifficulty;
    const matchesTopic =
      selectedTopics.size === 0 ||
      selectedTopics.has(question.domain) ||
      selectedTopics.has(question.skill);
    return matchesDifficulty && matchesTopic;
  });
}

function renderQuestionInfo(question) {
  questionInfoCard.innerHTML = `
    <div class="info-grid">
      <div><span>Section</span><strong>${question.subject === "math" ? "Math" : "Reading and Writing"}</strong></div>
      <div><span>Difficulty</span><strong>${question.difficulty}</strong></div>
      <div><span>Score Band</span><strong>${question.scoreBand}</strong></div>
      <div><span>Domain</span><strong>${question.domain}</strong></div>
      <div><span>Skill</span><strong>${question.skill}</strong></div>
      <div><span>Platform Accuracy</span><strong>${question.platformAccuracy}%</strong></div>
    </div>
  `;
}

function renderLockContent(mode) {
  if (!currentQuestion) {
    return;
  }

  const subjectName = currentQuestion.subject === "math" ? "Math" : "Reading and Writing";
  const tabs =
    currentQuestion.subject === "math"
      ? [
          { id: "ask", label: "Ask Lock" },
          { id: "concept", label: "Conceptual" },
          { id: "desmos", label: "Desmos Quick Solve" }
        ]
      : [
          { id: "ask", label: "Ask Lock" },
          { id: "explain", label: "Fast Explanation" }
        ];

  lockTabs.innerHTML = tabs
    .map((tab) => `<button class="lock-tab${tab.id === mode ? " active" : ""}" data-lock-tab="${tab.id}" type="button">${tab.label}</button>`)
    .join("");

  const bodyByMode = {
    ask: `Lock AI sees this as a ${subjectName.toLowerCase()} question in ${currentQuestion.domain}. Start by identifying the exact skill: ${currentQuestion.skill}. Then focus only on the line that determines the answer, not every detail at once.`,
    concept: `Conceptually, this question is testing ${currentQuestion.skill}. The fastest route is to identify the relationship being tested, set up the structure, and only then compute. ${currentQuestion.explanation}`,
    desmos: `For a Desmos-style solve, translate the important expression into the calculator first, then compare the graph or numeric output to the answer target. ${currentQuestion.explanation}`,
    explain: `The fastest English solve is to identify what the question is actually asking, eliminate any choice that changes the meaning, and keep the answer tied to the exact wording of the passage. ${currentQuestion.explanation}`
  };

  lockCopy.textContent = bodyByMode[mode] || currentQuestion.explanation;

  Array.from(lockTabs.querySelectorAll(".lock-tab")).forEach((button) => {
    button.addEventListener("click", () => renderLockContent(button.dataset.lockTab));
  });
}

function openLockPanel(defaultMode = "ask") {
  lockPanel.classList.add("active");
  renderLockContent(defaultMode);
}

function recordAttempt(question, wasCorrect, secondsSpent) {
  analytics.attempts.push({
    id: question.id,
    subject: question.subject,
    domain: question.domain,
    skill: question.skill,
    date: new Date().toISOString(),
    correct: wasCorrect,
    secondsSpent
  });
  analytics.attempts = analytics.attempts.slice(-1000);
  saveAnalytics();
  renderStats();
}

function checkCurrentAnswer() {
  if (!currentQuestion || questionSolved) {
    return;
  }

  let userAnswer = "";
  if (currentQuestion.format === "multiple-choice") {
    const selected = currentQuestion.choices.find((choice) => choice.id === selectedChoiceId);
    userAnswer = selected?.text || "";
  } else {
    userAnswer = practiceAnswerInput.value.trim();
  }

  const correct = userAnswer === currentQuestion.answer;
  questionSolved = correct;
  const elapsed = stopQuestionTimer();
  practiceFeedback.textContent = correct ? "Correct. Timer stopped." : "Not quite yet. You can review the explanation or try again.";
  practiceFeedback.className = `answer-feedback ${correct ? "correct" : "incorrect"}`;
  if (correct) {
    recordAttempt(currentQuestion, true, elapsed);
  } else {
    recordAttempt(currentQuestion, false, elapsed);
  }
}

function renderPracticeQuestion() {
  currentQuestion = practiceSet[currentQuestionIndex];
  if (!currentQuestion) {
    showQuestionBank();
    return;
  }

  selectedChoiceId = "";
  questionSolved = false;
  practiceIndexBadge.textContent = String(currentQuestionIndex + 1);
  practiceSubjectLabel.textContent = currentQuestion.subject === "math" ? "Math" : "Reading and Writing";
  practiceSkillLabel.textContent = `${currentQuestion.domain} · ${currentQuestion.skill}`;
  practicePrompt.textContent = currentQuestion.prompt;
  practiceFeedback.textContent = "";
  practiceFeedback.className = "answer-feedback";
  renderQuestionInfo(currentQuestion);

  if (currentQuestion.passage) {
    practicePassage.classList.remove("hidden");
    practicePassage.textContent = currentQuestion.passage;
  } else {
    practicePassage.classList.add("hidden");
    practicePassage.textContent = "";
  }

  if (currentQuestion.format === "multiple-choice") {
    practiceChoiceList.classList.remove("hidden");
    practiceAnswerInput.classList.add("hidden");
    practiceChoiceList.innerHTML = currentQuestion.choices
      .map(
        (choice) => `
          <button class="choice-button" data-choice-id="${choice.id}" type="button">
            <span class="choice-letter">${choice.id}</span>
            <span>${choice.text}</span>
          </button>
        `
      )
      .join("");
    Array.from(practiceChoiceList.querySelectorAll(".choice-button")).forEach((button) => {
      button.addEventListener("click", () => {
        selectedChoiceId = button.dataset.choiceId || "";
        Array.from(practiceChoiceList.querySelectorAll(".choice-button")).forEach((choiceButton) => {
          choiceButton.classList.toggle("active", choiceButton === button);
        });
      });
    });
  } else {
    practiceChoiceList.classList.add("hidden");
    practiceChoiceList.innerHTML = "";
    practiceAnswerInput.classList.remove("hidden");
    practiceAnswerInput.value = "";
  }

  renderLockContent(currentQuestion.subject === "math" ? "ask" : "ask");
  startQuestionTimer();
}

function openPracticeSet() {
  practiceSet = getFilteredQuestionPool().slice(0, 40);
  if (!practiceSet.length) {
    qbankCurrentTitle.textContent = "No questions match yet";
    qbankCurrentCopy.textContent = "Try widening the difficulty band or selecting fewer filters.";
    return;
  }
  currentQuestionIndex = 0;
  hideAllScreens();
  practiceScreen.classList.add("active");
  renderPracticeQuestion();
}

function renderStats() {
  const attempts = analytics.attempts;
  const bySubject = ["rw", "math"].map((subject) => {
    const subset = attempts.filter((attempt) => attempt.subject === subject);
    const accuracy = subset.length ? Math.round((subset.filter((attempt) => attempt.correct).length / subset.length) * 100) : 0;
    return { label: subject === "rw" ? "Reading & Writing" : "Math", accuracy };
  });

  accuracyBars.innerHTML = bySubject
    .map(
      (row) => `
        <div class="stats-bar-row">
          <span>${row.label}</span>
          <div class="stats-bar-track"><div class="stats-bar-fill" style="width:${row.accuracy}%"></div></div>
          <strong>${row.accuracy}%</strong>
        </div>
      `
    )
    .join("");

  const dayMap = new Map();
  attempts.forEach((attempt) => {
    const day = new Date(attempt.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  });
  const dayRows = Array.from(dayMap.entries()).slice(-7);
  timelineBars.innerHTML = dayRows
    .map(
      ([day, total]) => `
        <div class="timeline-row">
          <span>${day}</span>
          <div class="timeline-track"><div class="timeline-fill" style="width:${Math.min(100, total * 12)}%"></div></div>
          <strong>${total}</strong>
        </div>
      `
    )
    .join("");

  const cells = [];
  for (let i = 27; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const count = attempts.filter((attempt) => attempt.date.slice(0, 10) === key).length;
    cells.push(`<div class="calendar-cell${count ? " active" : ""}" title="${key}: ${count} questions"></div>`);
  }
  statsCalendar.innerHTML = cells.join("");

  const skillMap = new Map();
  attempts.forEach((attempt) => {
    const current = skillMap.get(attempt.skill) || { total: 0, correct: 0 };
    current.total += 1;
    current.correct += attempt.correct ? 1 : 0;
    skillMap.set(attempt.skill, current);
  });
  skillStatsList.innerHTML = Array.from(skillMap.entries())
    .slice(-8)
    .map(([skill, stat]) => {
      const accuracy = Math.round((stat.correct / stat.total) * 100);
      return `
        <div class="skill-stat-row">
          <span>${skill}</span>
          <div class="stats-bar-track"><div class="stats-bar-fill" style="width:${accuracy}%"></div></div>
          <strong>${accuracy}%</strong>
        </div>
      `;
    })
    .join("");
}

function setActiveNav(activeButton) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item === activeButton);
  });
}

function hideAllScreens() {
  homeScreen.classList.remove("active");
  blankScreen.classList.remove("active");
  questionBankScreen.classList.remove("active");
  practiceScreen.classList.remove("active");
  calculatorScreen.classList.remove("active");
  settingsScreen.classList.remove("active");
  statsLiveScreen.classList.remove("active");
}

function showHome() {
  setActiveNav(navItems.find((item) => item.dataset.view === "home"));
  hideAllScreens();
  homeScreen.classList.add("active");
}

function showBlank(activeButton) {
  setActiveNav(activeButton);
  hideAllScreens();
  blankScreen.classList.add("active");
}

function showQuestionBank(activeButton) {
  setActiveNav(activeButton || navItems.find((item) => item.dataset.view === "question-bank"));
  hideAllScreens();
  questionBankScreen.classList.add("active");
}

function setSingleActiveButton(buttons, activeButton) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function syncDifficultyRange() {
  let minValue = Number(difficultyMin.value);
  let maxValue = Number(difficultyMax.value);

  if (minValue > maxValue) {
    if (document.activeElement === difficultyMin) {
      maxValue = minValue;
      difficultyMax.value = String(maxValue);
    } else {
      minValue = maxValue;
      difficultyMin.value = String(minValue);
    }
  }

  difficultyRangeLabel.textContent = `${minValue} - ${maxValue}`;
}

function renderQuestionBankSelection() {
  const subjectLabels = Array.from(selectedSubjects).map((subject) =>
    subject === "rw" ? "Reading & Writing" : "Math"
  );
  const topicLabels = Array.from(selectedTopics);
  const difficultyText = difficultyRangeLabel.textContent;
  const matchingCount = getFilteredQuestionPool().length;
  const matchingAttempts = analytics.attempts.filter((attempt) => {
    const sameSubject = selectedSubjects.has(attempt.subject);
    const sameTopic = !selectedTopics.size || selectedTopics.has(attempt.domain) || selectedTopics.has(attempt.skill);
    return sameSubject && sameTopic;
  });

  qbankTotalCount.textContent = matchingCount.toLocaleString();
  qbankReviewCount.textContent = String(matchingAttempts.filter((attempt) => !attempt.correct).length);
  qbankCompleteCount.textContent = String(matchingAttempts.filter((attempt) => attempt.correct).length);

  qbankSelectionPills.innerHTML = [
    ...subjectLabels.map((label) => `<span class="subject-pill">${label}</span>`),
    ...topicLabels.map((label) => `<span>${label}</span>`),
    `<span>Difficulty ${difficultyText}</span>`
  ].join("");

  if (!subjectLabels.length && !topicLabels.length) {
    currentQuestionBankTopic = "";
    qbankCurrentTitle.textContent = "Nothing selected yet";
    qbankCurrentCopy.textContent =
      "Pick a topic to build a clean practice block. Timed mode, mistakes, and review all stay in the same flow.";
    return;
  }

  currentQuestionBankTopic = topicLabels[topicLabels.length - 1] || subjectLabels.join(" + ");
  qbankCurrentTitle.textContent = currentQuestionBankTopic;
  qbankCurrentCopy.textContent =
    `Subjects: ${subjectLabels.length ? subjectLabels.join(", ") : "none"} · Topics: ${
      topicLabels.length ? topicLabels.join(", ") : "none"
    } · Difficulty ${difficultyText}.`;
}

function showCalculator(activeButton) {
  setActiveNav(activeButton);
  hideAllScreens();
  calculatorScreen.classList.add("active");
  syncCalculatorTheme();
}

function showStats(activeButton) {
  setActiveNav(activeButton || navItems.find((item) => item.dataset.view === "stats"));
  hideAllScreens();
  statsLiveScreen.classList.add("active");
  renderStats();
}

function showSettings() {
  navItems.forEach((item) => item.classList.remove("active"));
  hideAllScreens();
  settingsScreen.classList.add("active");
  closeProfileMenu();
}

function setAuthMode(mode) {
  authMode = mode;
  const signingUp = mode === "signup";

  signInModeButton.classList.toggle("active", !signingUp);
  signUpModeButton.classList.toggle("active", signingUp);
  authTitle.textContent = signingUp ? "Create your account" : "Welcome back";
  authSubtitle.textContent = signingUp
    ? "Sign up with email and password or continue with Google."
    : "Use your email and password or continue with Google.";
  authSubmit.textContent = signingUp ? "Sign up" : "Sign in";
  googleAuthLabel.textContent = signingUp ? "Sign up with Google" : "Continue with Google";
  authFooterLabel.textContent = signingUp ? "Already have an account?" : "Need an account?";
  authSwitchLink.textContent = signingUp ? "Sign in" : "Create one";
}

function showAuth() {
  body.dataset.phase = "auth";
  authView.classList.remove("hidden");
  appShell.classList.add("hidden");
}

function showApp() {
  body.dataset.phase = "app";
  authView.classList.add("hidden");
  appShell.classList.remove("hidden");
  showHome();
  applySettings();
}

function finishSplashIfReady() {
  if (!splashFinished) {
    return;
  }

  splashScreen.classList.add("hidden");

  if (resolvedUser) {
    showApp();
    return;
  }

  showAuth();
}

async function completeAuth(provider) {
  try {
    if (provider === "google") {
      await signInWithPopup(auth, googleProvider);
      return;
    }

    const emailValue = authEmail.value.trim();
    const passwordValue = authPassword.value.trim();

    if (!emailValue || !passwordValue) {
      authSubtitle.textContent = "Enter both your email and password.";
      return;
    }

    if (authMode === "signup") {
      await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
      return;
    }

    await signInWithEmailAndPassword(auth, emailValue, passwordValue);
  } catch (error) {
    authSubtitle.textContent = error.message.replace("Firebase: ", "").replace(/\(auth\/(.+)\)\.?$/, "");
  }
}

logoButton.addEventListener("click", showHome);
heroLogoButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

profileTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  profileDropdown.classList.toggle("hidden");
});

profileSettingsButton.addEventListener("click", showSettings);

changeNameButton.addEventListener("click", async () => {
  closeProfileMenu();
  if (!auth.currentUser) {
    return;
  }

  const nextName = window.prompt("Enter your name", getUserName(auth.currentUser));
  if (!nextName || !nextName.trim()) {
    return;
  }

  await updateProfile(auth.currentUser, { displayName: nextName.trim() });
  updateProfileUI({ ...auth.currentUser, displayName: nextName.trim() });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.dataset.view === "home") {
      showHome();
      return;
    }

    if (item.dataset.view === "question-bank") {
      showQuestionBank(item);
      return;
    }

    if (item.dataset.view === "predictor") {
      showCalculator(item);
      return;
    }

    if (item.dataset.view === "stats") {
      showStats(item);
      return;
    }

    showBlank(item);
  });
});

jumpQuestionBankButton.addEventListener("click", () => {
  showQuestionBank();
});

suggestedNextCard.addEventListener("click", () => {
  showQuestionBank();
});

qbankUtilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setSingleActiveButton(qbankUtilityButtons, button);
  });
});

qbankFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button === difficultyTrigger) {
      difficultyPanel.classList.toggle("hidden");
      button.classList.toggle("active", !difficultyPanel.classList.contains("hidden"));
      return;
    }

    button.classList.toggle("active");
  });
});

qbankTopicRows.forEach((button) => {
  button.addEventListener("click", () => {
    const topic = button.dataset.topic || button.querySelector("span")?.textContent || "Focused topic";
    if (selectedTopics.has(topic)) {
      selectedTopics.delete(topic);
      button.classList.remove("active");
    } else {
      selectedTopics.add(topic);
      button.classList.add("active");
    }
    renderQuestionBankSelection();
  });
});

qbankTopicPanelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelTitle = button.closest(".topic-panel")?.querySelector("h2")?.textContent || "All topics";
    const subjectKey = panelTitle.toLowerCase().includes("math") ? "math" : "rw";
    if (selectedSubjects.has(subjectKey) && selectedSubjects.size === 1) {
      selectedSubjects.add(subjectKey);
    } else if (selectedSubjects.has(subjectKey)) {
      selectedSubjects.delete(subjectKey);
    } else {
      selectedSubjects.add(subjectKey);
    }
    qbankSubjectButtons.forEach((subjectButton) => {
      subjectButton.classList.toggle("active", selectedSubjects.has(subjectButton.dataset.subject));
    });
    renderQuestionBankSelection();
  });
});

qbankClusterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const topic = button.dataset.topic;
    if (selectedTopics.has(topic)) {
      selectedTopics.delete(topic);
      button.classList.remove("active");
    } else {
      selectedTopics.add(topic);
      button.classList.add("active");
    }
    renderQuestionBankSelection();
  });
});

qbankSubjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const subject = button.dataset.subject;
    if (selectedSubjects.has(subject) && selectedSubjects.size > 1) {
      selectedSubjects.delete(subject);
      button.classList.remove("active");
    } else if (!selectedSubjects.has(subject)) {
      selectedSubjects.add(subject);
      button.classList.add("active");
    }
    renderQuestionBankSelection();
  });
});

difficultyMin.addEventListener("input", () => {
  syncDifficultyRange();
  renderQuestionBankSelection();
});

difficultyMax.addEventListener("input", () => {
  syncDifficultyRange();
  renderQuestionBankSelection();
});

qbankStartButton.addEventListener("click", () => {
  if (!currentQuestionBankTopic) {
    qbankCurrentTitle.textContent = "Choose a topic first";
    qbankCurrentCopy.textContent =
      "Select any topic row, skill family, or subject area to build a focused set. Right now the question counts are intentionally at zero until the bank is loaded.";
    return;
  }

  qbankCurrentTitle.textContent = `${currentQuestionBankTopic} ready`;
  qbankCurrentCopy.textContent =
    "The question-bank shell is prepared for this set. Once content is loaded, this button can launch directly into the matching practice session.";
  openPracticeSet();
});

practiceBackButton.addEventListener("click", () => {
  window.clearInterval(timerInterval);
  showQuestionBank();
});

practiceTools.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "practice-fullscreen-button") {
      document.documentElement.requestFullscreen?.();
      return;
    }

    if (button.id === "practice-theme-button") {
      settings.theme = settings.theme === "dark" ? "light" : "dark";
      applySettings();
      return;
    }

    const tab = button.dataset.toolTab;
    if (!tab) {
      return;
    }
    practiceTools.forEach((tool) => tool.classList.toggle("active", tool === button));
    Object.entries(toolPanes).forEach(([key, pane]) => {
      pane.classList.toggle("active", key === tab);
    });
  });
});

calcSwitches.forEach((button) => {
  button.addEventListener("click", () => {
    currentCalcMode = button.dataset.calcMode || "graphing";
    calcSwitches.forEach((switchButton) => switchButton.classList.toggle("active", switchButton === button));
    desmosFrame.src = currentCalcMode === "scientific" ? "https://www.desmos.com/scientific" : "https://www.desmos.com/calculator";
  });
});

toolPopoutButton.addEventListener("click", () => {
  window.open(currentCalcMode === "scientific" ? "https://www.desmos.com/scientific" : "https://www.desmos.com/calculator", "_blank", "noopener");
});

questionInfoButton.addEventListener("click", () => {
  practiceTools.forEach((tool) => tool.classList.toggle("active", tool.dataset.toolTab === "reference"));
  toolPanes.calculator.classList.remove("active");
  toolPanes.reference.classList.add("active");
});

lockAiButton.addEventListener("click", () => openLockPanel("ask"));
explanationButton.addEventListener("click", () => openLockPanel(currentQuestion?.subject === "math" ? "concept" : "explain"));
checkAnswerButton.addEventListener("click", checkCurrentAnswer);
nextQuestionButton.addEventListener("click", () => {
  if (!practiceSet.length) {
    return;
  }
  currentQuestionIndex = (currentQuestionIndex + 1) % practiceSet.length;
  renderPracticeQuestion();
});

signOutButton.addEventListener("click", async () => {
  closeProfileMenu();
  await signOut(auth);
});
signInModeButton.addEventListener("click", () => setAuthMode("signin"));
signUpModeButton.addEventListener("click", () => setAuthMode("signup"));
authSwitchLink.addEventListener("click", () => setAuthMode(authMode === "signin" ? "signup" : "signin"));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await completeAuth("email");
});

googleAuthButton.addEventListener("click", async () => {
  await completeAuth("google");
});

themeSelect.addEventListener("change", (event) => {
  settings.theme = event.target.value;
  applySettings();
});

accentColorInput.addEventListener("input", (event) => {
  settings.accentColor = event.target.value;
  applySettings();
});

navPositionSelect.addEventListener("change", (event) => {
  settings.navPosition = event.target.value;
  applySettings();
});

iconsOnlyToggle.addEventListener("change", (event) => {
  settings.iconsOnlyTabs = event.target.checked;
  applySettings();
});

hideCountdownToggle.addEventListener("change", (event) => {
  settings.hideCountdown = event.target.checked;
  applySettings();
});

satDateSelect.addEventListener("change", (event) => {
  settings.selectedSat = event.target.value;
  applySettings();
});

calculatorFrame.addEventListener("load", syncCalculatorTheme);
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.data?.type !== "calculator-ready") {
    return;
  }

  syncCalculatorTheme();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".profile-menu")) {
    closeProfileMenu();
  }
  if (!event.target.closest(".lock-panel") && !event.target.closest("#lock-ai-button") && !event.target.closest("#explanation-button")) {
    lockPanel.classList.remove("active");
  }
});

onAuthStateChanged(auth, (user) => {
  resolvedUser = user;
  updateProfileUI(user);
  finishSplashIfReady();
});

setAuthMode("signin");
applySettings();
syncDifficultyRange();
renderQuestionBankSelection();
mathCountLabel.textContent = `${QUESTION_COUNTS.math.toLocaleString()} questions`;
rwCountLabel.textContent = `${QUESTION_COUNTS.rw.toLocaleString()} questions`;
renderStats();
window.setInterval(updateCountdown, 1000);
window.setTimeout(() => {
  body.dataset.phase = "splash";
  splashScreen.classList.add("fade-out");
  splashFinished = true;
  finishSplashIfReady();
}, 1550);
