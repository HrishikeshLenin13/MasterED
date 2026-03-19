const adaptiveToggle = document.getElementById("adaptive-toggle");

const moduleDefs = [
  { key: "rw1", max: 27, section: "rw", weight: 0.42 },
  { key: "rw2", max: 27, section: "rw", weight: 0.58 },
  { key: "m1", max: 22, section: "math", weight: 0.42 },
  { key: "m2", max: 22, section: "math", weight: 0.58 },
];

const inputs = Object.fromEntries(
  moduleDefs.map((module) => [module.key, document.getElementById(`${module.key}-input`)])
);

const ranges = Object.fromEntries(
  moduleDefs.map((module) => [module.key, document.getElementById(`${module.key}-range`)])
);

const totalScoreEl = document.getElementById("total-score");
const rwScoreEl = document.getElementById("rw-score");
const mathScoreEl = document.getElementById("math-score");

const sectionConfig = {
  rw: {
    threshold: 19,
    easierCeiling: 620,
    fullRangeMax: 800,
    easierCurve: [
      [0.0, 200],
      [0.15, 260],
      [0.3, 340],
      [0.45, 420],
      [0.6, 500],
      [0.75, 570],
      [0.9, 610],
      [1.0, 620],
    ],
    harderCurve: [
      [0.0, 200],
      [0.15, 310],
      [0.3, 420],
      [0.45, 540],
      [0.6, 650],
      [0.75, 730],
      [0.9, 780],
      [1.0, 800],
    ],
  },
  math: {
    threshold: 15,
    easierCeiling: 700,
    fullRangeMax: 800,
    easierCurve: [
      [0.0, 200],
      [0.15, 280],
      [0.3, 370],
      [0.45, 470],
      [0.6, 560],
      [0.75, 640],
      [0.9, 690],
      [1.0, 700],
    ],
    harderCurve: [
      [0.0, 200],
      [0.15, 320],
      [0.3, 440],
      [0.45, 560],
      [0.6, 670],
      [0.75, 745],
      [0.9, 790],
      [1.0, 800],
    ],
  },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundToTen(value) {
  return Math.round(value / 10) * 10;
}

function interpolateCurve(curve, value) {
  if (value <= curve[0][0]) {
    return curve[0][1];
  }

  for (let index = 1; index < curve.length; index += 1) {
    const [rightX, rightY] = curve[index];
    const [leftX, leftY] = curve[index - 1];

    if (value <= rightX) {
      const span = rightX - leftX || 1;
      const progress = (value - leftX) / span;
      return leftY + (rightY - leftY) * progress;
    }
  }

  return curve[curve.length - 1][1];
}

function getModuleValue(key) {
  const value = Number(inputs[key].value);
  const max = moduleDefs.find((module) => module.key === key).max;
  return clamp(Number.isFinite(value) ? value : 0, 0, max);
}

function scoreSection(module1, module2, max1, max2, adaptive, sectionKey) {
  const config = sectionConfig[sectionKey];
  const pct1 = module1 / max1;
  const pct2 = module2 / max2;
  const rawTotal = module1 + module2;
  const maxTotal = max1 + max2;
  const weighted = pct1 * 0.44 + pct2 * 0.56;
  const routeGain = Math.max(-0.08, Math.min(0.12, pct2 - pct1));

  if (!adaptive) {
    const blended = rawTotal / maxTotal;
    const estimated = interpolateCurve(config.harderCurve, blended * 0.92) - 20;
    return clamp(roundToTen(estimated), 200, 800);
  }

  const hardRoute = module1 >= config.threshold;

  if (hardRoute) {
    const harderScore = interpolateCurve(config.harderCurve, weighted) + routeGain * 120;
    return clamp(roundToTen(harderScore), 200, config.fullRangeMax);
  }

  const easierScore = interpolateCurve(config.easierCurve, weighted) + routeGain * 55;
  return clamp(roundToTen(easierScore), 200, config.easierCeiling);
}

function syncPair(key, source) {
  const max = moduleDefs.find((module) => module.key === key).max;
  const value = clamp(Number(source.value) || 0, 0, max);
  inputs[key].value = value;
  ranges[key].value = value;
}

function updateScores() {
  const adaptive = adaptiveToggle.checked;
  const rw1 = getModuleValue("rw1");
  const rw2 = getModuleValue("rw2");
  const m1 = getModuleValue("m1");
  const m2 = getModuleValue("m2");

  const rwScore = scoreSection(rw1, rw2, 27, 27, adaptive, "rw");
  const mathScore = scoreSection(m1, m2, 22, 22, adaptive, "math");
  const total = rwScore + mathScore;

  rwScoreEl.textContent = rwScore;
  mathScoreEl.textContent = mathScore;
  totalScoreEl.textContent = total;
}

function applyTheme(theme, accentColor) {
  document.body.dataset.theme = theme === "dark" ? "dark" : "light";
  if (accentColor) {
    document.documentElement.style.setProperty("--blue", accentColor);
  }
}

moduleDefs.forEach((module) => {
  inputs[module.key].addEventListener("input", (event) => {
    syncPair(module.key, event.target);
    updateScores();
  });

  ranges[module.key].addEventListener("input", (event) => {
    syncPair(module.key, event.target);
    updateScores();
  });
});

adaptiveToggle.addEventListener("change", updateScores);

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.data?.type !== "mastered-theme") {
    return;
  }

  applyTheme(event.data.payload?.theme, event.data.payload?.accentColor);
});

window.parent.postMessage({ type: "calculator-ready" }, window.location.origin);
updateScores();
