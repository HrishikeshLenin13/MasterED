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

const STORAGE_KEY = "mastered-shell-settings-v2";

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
const calculatorScreen = document.getElementById("screen-calculator");
const settingsScreen = document.getElementById("screen-settings");
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
const qbankCurrentTitle = document.getElementById("qbank-current-title");
const qbankCurrentCopy = document.getElementById("qbank-current-copy");
const qbankStartButton = document.getElementById("qbank-start-button");

let authMode = "signin";
let splashFinished = false;
let resolvedUser = null;
let currentQuestionBankTopic = "";

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

function setActiveNav(activeButton) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item === activeButton);
  });
}

function hideAllScreens() {
  homeScreen.classList.remove("active");
  blankScreen.classList.remove("active");
  questionBankScreen.classList.remove("active");
  calculatorScreen.classList.remove("active");
  settingsScreen.classList.remove("active");
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

function updateQuestionBankSelection(topic, description) {
  currentQuestionBankTopic = topic;
  qbankCurrentTitle.textContent = topic;
  qbankCurrentCopy.textContent = description;
}

function showCalculator(activeButton) {
  setActiveNav(activeButton);
  hideAllScreens();
  calculatorScreen.classList.add("active");
  syncCalculatorTheme();
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
    button.classList.toggle("active");
  });
});

qbankTopicRows.forEach((button) => {
  button.addEventListener("click", () => {
    setSingleActiveButton(qbankTopicRows, button);
    updateQuestionBankSelection(
      button.dataset.topic || button.querySelector("span")?.textContent || "Focused topic",
      "This topic is selected. Question inventory is still empty right now, but the workflow, filters, and pacing surface are ready for real content."
    );
  });
});

qbankTopicPanelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const panelTitle = button.closest(".topic-panel")?.querySelector("h2")?.textContent || "All topics";
    updateQuestionBankSelection(
      `${panelTitle} overview`,
      `Browsing the full ${panelTitle.toLowerCase()} map. As questions are added, this panel can open every topic in one focused drill flow.`
    );
  });
});

qbankStartButton.addEventListener("click", () => {
  if (!currentQuestionBankTopic) {
    updateQuestionBankSelection(
      "Choose a topic first",
      "Select any topic row or subject overview to build a focused set. Right now the question counts are intentionally at zero until the bank is loaded."
    );
    return;
  }

  updateQuestionBankSelection(
    `${currentQuestionBankTopic} ready`,
    "The question-bank shell is prepared for this set. Once content is loaded, this button can launch directly into the matching practice session."
  );
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
});

onAuthStateChanged(auth, (user) => {
  resolvedUser = user;
  updateProfileUI(user);
  finishSplashIfReady();
});

setAuthMode("signin");
applySettings();
window.setInterval(updateCountdown, 1000);
window.setTimeout(() => {
  body.dataset.phase = "splash";
  splashScreen.classList.add("fade-out");
  splashFinished = true;
  finishSplashIfReady();
}, 1550);
