const toastBox = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  if (!toastBox) return;
  toastBox.textContent = message;
  toastBox.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastBox.classList.remove("show"), 2200);
}
document.querySelectorAll("[data-toast]").forEach((item) =>
  item.addEventListener("click", (event) => {
    if (item.tagName === "A" && item.getAttribute("href")?.startsWith("#"))
      event.preventDefault();
    showToast(`${item.dataset.toast} preview is coming soon`);
  }),
);
const profile = document.getElementById("profileButton");
if (profile)
  profile.addEventListener("click", () =>
    showToast("Account settings are coming soon"),
  );
const themeButton = document.getElementById("themeButton");
if (localStorage.getItem("easyLearnTheme") === "light")
  document.body.classList.add("light");
if (themeButton)
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    localStorage.setItem("easyLearnTheme", light ? "light" : "dark");
    showToast(`${light ? "Light" : "Dark"} mode enabled`);
  });
const todayLabel = document.getElementById("today");
if (todayLabel) {
  const today = new Date();
  todayLabel.textContent = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
    .format(today)
    .toUpperCase();
}
const currentPage = document.querySelector("main[data-current-page]")?.dataset
  .currentPage;
document
  .querySelectorAll(".side-link[data-page]")
  .forEach((link) =>
    link.classList.toggle("active", link.dataset.page === currentPage),
  );
const sidebar = document.getElementById("sidebar"),
  menuButton = document.getElementById("menuButton");
if (menuButton && sidebar)
  menuButton.addEventListener("click", () => sidebar.classList.toggle("open"));
document
  .querySelectorAll(".side-link[data-page]")
  .forEach((link) =>
    link.addEventListener("click", () => sidebar?.classList.remove("open")),
  );
let remaining = 25 * 60,
  focusInterval = null;
const timer = document.getElementById("timer"),
  startButton = document.getElementById("timerStart"),
  timerProgress = document.querySelector(".timer-track span");
function renderTimer() {
  if (!timer) return;
  timer.textContent = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  if (timerProgress)
    timerProgress.style.width = `${((25 * 60 - remaining) / (25 * 60)) * 100}%`;
}
if (startButton)
  startButton.addEventListener("click", () => {
    if (focusInterval) {
      clearInterval(focusInterval);
      focusInterval = null;
      startButton.textContent = "Resume";
    } else {
      focusInterval = setInterval(() => {
        if (remaining > 0) {
          remaining--;
          renderTimer();
        } else {
          clearInterval(focusInterval);
          focusInterval = null;
          startButton.textContent = "Start focus";
          showToast("Focus session complete — nice work!");
        }
      }, 1000);
      startButton.textContent = "Pause";
    }
  });
const timerReset = document.getElementById("timerReset");
if (timerReset)
  timerReset.addEventListener("click", () => {
    clearInterval(focusInterval);
    focusInterval = null;
    remaining = 25 * 60;
    if (startButton) startButton.textContent = "Start focus";
    renderTimer();
  });

// Vocabulary flip-card preview
const vocabFlip = document.getElementById("vocabFlip");
let vocabIsFlipped = false;
if (vocabFlip)
  vocabFlip.addEventListener("click", () => {
    vocabIsFlipped = !vocabIsFlipped;
    document.getElementById("flipLabel").textContent = vocabIsFlipped
      ? "DEFINITION"
      : "TAP TO REVEAL";
    document.getElementById("flipWord").textContent = vocabIsFlipped
      ? "Examine carefully"
      : "Analyze";
    document.getElementById("flipMeaning").textContent = vocabIsFlipped
      ? "To study something closely in order to understand it."
      : "What does this word mean?";
    vocabFlip.setAttribute("aria-pressed", String(vocabIsFlipped));
  });
// Contact form prototype: it does not send or store the entered message.
const contactForm = document.getElementById("contactForm"),
  formFeedback = document.getElementById("formFeedback");
if (contactForm)
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.textContent =
      "Thanks. The message form is ready, but it is not connected to support yet.";
  });
// Local FAQ helper preview for common GED and Easy Learn questions.
const chatMessages = document.getElementById("chatMessages");
function addChatMessage(text, kind) {
  if (!chatMessages) return;
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${kind === "user" ? "user-message" : "bot-message"}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function getChatReply(text) {
  const q = text.toLowerCase();
  if (q.includes("tutorial"))
    return "A tutorial test lets you practice a topic with guidance and explanations as you go.";
  if (q.includes("mock") || q.includes("test"))
    return "Mock tests give you a GED-style practice session so you can check your readiness and review your answers.";
  if (q.includes("vocab") || q.includes("flash") || q.includes("word"))
    return "Vocabulary cards use a flip-card style: think of the meaning first, then flip the card to check your recall.";
  if (q.includes("language") || q.includes("translate"))
    return "Concept explanations are planned in different languages. The available language choices will be shown with each topic.";
  if (q.includes("typing") || q.includes("speed") || q.includes("wpm"))
    return "Typing games use timed rounds and track words per minute (WPM) and accuracy.";
  if (q.includes("ged") || q.includes("self") || q.includes("learn"))
    return "Easy Learn is designed to help GED students practice test skills and study essential concepts at their own pace.";
  return "I can answer general questions about GED practice tests, vocabulary cards, concept explanations, and typing games. Try one of those topics.";
}
function askEasyLearn(text) {
  const clean = text.trim();
  if (!clean) return;
  addChatMessage(clean, "user");
  window.setTimeout(() => addChatMessage(getChatReply(clean), "bot"), 250);
}
const chatForm = document.getElementById("chatForm");
if (chatForm)
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("chatInput");
    askEasyLearn(input.value);
    input.value = "";
    input.focus();
  });
document
  .querySelectorAll("[data-question]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      askEasyLearn(button.dataset.question),
    ),
  );

// GED subject picker with official exam snapshots and activity-specific guidance.
const subjectCards = document.querySelectorAll(".subject-card");
if (subjectCards.length) {
  const activity =
    new URLSearchParams(location.search).get("activity") || "practice";
  const activities = {
    practice: {
      name: "Practice tests",
      label: "GED PRACTICE TESTS",
      action: "Let’s practice",
      focusTitle: "Practice this subject",
      focusText:
        "Choose a tutorial test for guided practice, a mock test to build test-day confidence, or flashcards for a quick review.",
    },
    vocabulary: {
      name: "Vocabulary",
      label: "GED VOCABULARY",
      action: "Study vocabulary",
      focusTitle: "Build subject vocabulary",
      focusText:
        "Use flip-card practice to recall important words and meanings connected to this GED subject.",
    },
    concepts: {
      name: "Concept explanations",
      label: "GED CONCEPT EXPLANATIONS",
      action: "Explore concepts",
      focusTitle: "Understand the foundations",
      focusText:
        "Study the essential ideas behind this subject with step-by-step explanations designed for self-study and different languages.",
    },
  };
  const selectedActivity = activities[activity] || activities.practice;
  const subjects = {
    math: {
      title: "Mathematical Reasoning",
      overview:
        "Apply math concepts, measurements, and equations to solve real-life problems. A formula sheet is available, so you can focus on understanding how to use the math.",
      topics: [
        "Basic Math",
        "Geometry",
        "Basic Algebra",
        "Graphs and Functions",
      ],
      duration: "115 minutes",
      parts: "2 parts",
      price: "$90",
      format:
        "Math formula sheet and on-screen calculator. Question types include multiple choice, drag-and-drop, fill-in-the-blank, select-an-area, and dropdown.",
      note: "Includes 2 minutes for instructions and final review, plus a 3-minute break between parts.",
      url: "https://www.ged.com/en/curriculum/math.html",
    },
    rla: {
      title: "Reasoning Through Language Arts",
      overview:
        "Practice reading for meaning, drawing conclusions, using grammar, and writing clearly. The extended response asks you to compare arguments and support your reasoning with evidence.",
      topics: [
        "Reading for Meaning",
        "Identifying and Creating Arguments",
        "Grammar and Language",
      ],
      duration: "150 minutes",
      parts: "3 sections",
      price: "$90",
      format:
        "Includes one written extended-response essay, multiple choice, drag-and-drop, select-an-area, and dropdown questions.",
      note: "Includes 3 minutes for instructions and final review, a 10-minute break between sections 2 and 3, and 45 minutes for the essay.",
      url: "https://www.ged.com/en/curriculum/language-arts.html",
    },
    science: {
      title: "Science",
      overview:
        "Understand science concepts, read graphs and charts, and use evidence to interpret scientific information. The exam emphasizes reasoning rather than memorizing everything.",
      topics: [
        "Reading for Meaning in Science",
        "Designing and Interpreting Science Experiments",
        "Using Numbers and Graphics in Science",
      ],
      duration: "90 minutes",
      parts: "1 part",
      price: "$90",
      format:
        "On-screen calculator. Question types include multiple choice, fill-in-the-blank, drag-and-drop, hot spot, and dropdown.",
      note: "Includes 2 minutes for instructions and final review. No break.",
      url: "https://www.ged.com/en/curriculum/science.html",
    },
    social: {
      title: "Social Studies",
      overview:
        "Apply social studies ideas, read graphs and charts, and use evidence to interpret information. Focus on reasoning from what you are given rather than memorizing dates or capitals.",
      topics: [
        "Reading for Meaning in Social Studies",
        "Analyzing Historical Events and Arguments in Social Studies",
        "Using Numbers and Graphs in Social Studies",
      ],
      duration: "70 minutes",
      parts: "1 part",
      price: "$90",
      format:
        "On-screen calculator. Question types include multiple choice, drag-and-drop, select-an-area, and dropdown.",
      note: "Includes 2 minutes for instructions and final review. No break.",
      url: "https://www.ged.com/en/about-test/social-studies.html",
    },
  };
  const byId = (id) => document.getElementById(id);
  let activeSubject = subjects.math;
  const subjectAction = byId("subjectAction");
  function renderSubject(id) {
    const selectedId = subjects[id] ? id : "math";
    const subject = subjects[selectedId];
    activeSubject = subject;
    subjectCards.forEach((card) => {
      const active = card.dataset.subject === selectedId;
      card.classList.toggle("selected", active);
      card.setAttribute("aria-pressed", String(active));
    });
    byId("activityTag").textContent = selectedActivity.label;
    byId("subjectsTitle").textContent =
      `Choose a subject for ${selectedActivity.name}`;
    byId("subjectsDescription").textContent =
      "Select a card to see the subject overview, topics, exam format, duration, and official GED links.";
    byId("detailIndex").textContent =
      `GED SUBJECT · ${String(Object.keys(subjects).indexOf(selectedId) + 1).padStart(2, "0")}`;
    byId("detailTitle").textContent = subject.title;
    byId("detailOverview").textContent = subject.overview;
    byId("topicChips").replaceChildren(
      ...subject.topics.map((topic) => {
        const chip = document.createElement("span");
        chip.className = "topic-chip";
        chip.textContent = topic;
        return chip;
      }),
    );
    byId("examDuration").textContent = subject.duration;
    byId("examParts").textContent = subject.parts;
    byId("examPrice").textContent = subject.price;
    byId("examFormat").textContent = subject.format;
    byId("examNote").textContent = subject.note;
    byId("officialDetails").href = subject.url;
    if (subjectAction)
      subjectAction.innerHTML = `${selectedActivity.action}<span>→</span>`;
    byId("activityFocus").innerHTML =
      `<span class="activity-focus-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h9"/><path d="m16 17 2 2 4-5"/></svg></span><span><strong>${selectedActivity.focusTitle}</strong><small>${selectedActivity.focusText}</small></span>`;
  }
  if (subjectAction)
    subjectAction.addEventListener("click", () => {
      const feedback = byId("subjectActionFeedback");
      if (feedback)
        feedback.textContent = `${activeSubject.title} · ${selectedActivity.name} selected.`;
      showToast(`${selectedActivity.name} selected for ${activeSubject.title}`);
    });
  subjectCards.forEach((card) =>
    card.addEventListener("click", () => {
      renderSubject(card.dataset.subject);
      byId("subjectDetails").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }),
  );
  renderSubject(new URLSearchParams(location.search).get("subject") || "math");
}
// Ten progressive typing levels, shared by the level hub and game screen.
const typingLevelData = [
  {
    name: "Warm-up",
    seconds: 30,
    target: 8,
    challenge: "Short everyday words",
    prompt: "Practice typing builds skill.",
  },
  {
    name: "Steady Start",
    seconds: 32,
    target: 10,
    challenge: "A short, complete sentence",
    prompt: "I can grow my speed with steady practice.",
  },
  {
    name: "Find Your Rhythm",
    seconds: 35,
    target: 12,
    challenge: "Sentence case and punctuation",
    prompt: "Read each line carefully, then type it with care.",
  },
  {
    name: "Accuracy First",
    seconds: 38,
    target: 14,
    challenge: "Longer sentence with punctuation",
    prompt: "Build accuracy first; speed follows with practice.",
  },
  {
    name: "Speed Builder",
    seconds: 40,
    target: 16,
    challenge: "More words and longer phrases",
    prompt: "Clear typing helps you share your ideas with confidence.",
  },
  {
    name: "Stay Focused",
    seconds: 43,
    target: 18,
    challenge: "Commas and varied sentence structure",
    prompt: "Practice daily, notice small mistakes, and improve each time.",
  },
  {
    name: "Number Dash",
    seconds: 46,
    target: 20,
    challenge: "Numbers, capitals, and punctuation",
    prompt: "In 2026, steady practice turns new skills into strong habits.",
  },
  {
    name: "Precision Round",
    seconds: 49,
    target: 22,
    challenge: "Longer prompt with precise punctuation",
    prompt:
      "Read the passage, check punctuation, and enter every word precisely.",
  },
  {
    name: "Advanced Flow",
    seconds: 52,
    target: 24,
    challenge: "Complex sentence and semicolon",
    prompt:
      "A focused learner reviews each result, adapts, and keeps moving forward.",
  },
  {
    name: "GED Sprint",
    seconds: 58,
    target: 26,
    challenge: "Full passage with several clauses",
    prompt:
      "GED learners build confidence by practicing consistently, checking accuracy, and increasing speed one challenge at a time.",
  },
];
function readTypingValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}
function saveTypingValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
function getTypingUnlocked() {
  const raw = readTypingValue("easyLearnUnlockedTypingLevel", 1);
  return Math.max(1, Math.min(10, Number(raw) || 1));
}
function typingRank(level) {
  if (level >= 9) return "Master";
  if (level >= 7) return "Speedster";
  if (level >= 5) return "Focused";
  if (level >= 3) return "Explorer";
  return "Beginner";
}
function getTypingHistory() {
  const history = readTypingValue("easyLearnTypingHistory", []);
  return Array.isArray(history) ? history : [];
}
const levelHub = document.getElementById("levelGrid");
if (levelHub) {
  const highest = getTypingUnlocked(),
    history = getTypingHistory(),
    currentRank = typingRank(highest);
  const rankNode = document.getElementById("currentRank"),
    levelNode = document.getElementById("rankLevel"),
    progressNode = document.getElementById("rankProgress"),
    progressText = document.getElementById("rankProgressText"),
    countNode = document.getElementById("unlockedCount");
  if (rankNode) rankNode.textContent = currentRank;
  if (levelNode) levelNode.textContent = `Level ${highest} · ${highest} of 10`;
  if (progressText) progressText.textContent = `Level ${highest} of 10`;
  if (progressNode) progressNode.style.width = `${highest * 10}%`;
  if (countNode) countNode.textContent = `${highest} / 10 unlocked`;
  const passedAll = history.some((item) => item.level === 10 && item.passed);
  const bestWpm = history.reduce(
      (best, item) => Math.max(best, Number(item.wpm) || 0),
      0,
    ),
    bestAccuracy = history.length
      ? history.reduce(
          (best, item) => Math.max(best, Number(item.accuracy) || 0),
          0,
        )
      : null;
  const bestWpmNode = document.getElementById("bestWpm"),
    bestAccNode = document.getElementById("bestAccuracy");
  if (bestWpmNode) bestWpmNode.textContent = String(bestWpm);
  if (bestAccNode)
    bestAccNode.textContent =
      bestAccuracy === null ? "—" : String(bestAccuracy);
  typingLevelData.forEach((level, index) => {
    const number = index + 1,
      available = number <= highest,
      isComplete = number < highest || (number === 10 && passedAll);
    let tile;
    if (available) {
      tile = document.createElement("a");
      tile.href = `typing-play.html?level=${number}`;
    } else {
      tile = document.createElement("button");
      tile.type = "button";
      tile.disabled = true;
    }
    tile.className = `level-tile${number === highest && !isComplete ? " is-current" : ""}${isComplete ? " is-complete" : ""}${!available ? " is-locked" : ""}`;
    tile.setAttribute(
      "aria-label",
      `Level ${number}, ${level.name}, ${available ? "unlocked" : "locked"}`,
    );
    tile.innerHTML = `<span class="level-tile-top"><span class="level-tile-number">${isComplete ? "✓" : number}</span><span class="level-tile-state">${!available ? "Locked" : isComplete ? "Complete" : number === highest ? "Current" : "Unlocked"}</span></span><span class="level-tile-name">${level.name}</span><span class="level-tile-detail">${level.challenge}<br>Goal ${level.target} WPM</span>`;
    levelHub.appendChild(tile);
  });
  const historyNode = document.getElementById("historyList");
  if (historyNode && history.length) {
    historyNode.replaceChildren();
    history.slice(0, 5).forEach((item) => {
      const row = document.createElement("div");
      row.className = "history-row";
      const name = document.createElement("strong");
      name.textContent = `Level ${item.level} · ${typingLevelData[(Number(item.level) || 1) - 1]?.name || "Typing round"}`;
      const speed = document.createElement("span");
      speed.textContent = `${Number(item.wpm) || 0} WPM`;
      const acc = document.createElement("span");
      acc.textContent = `${Number(item.accuracy) || 0}% accuracy`;
      const date = document.createElement("span");
      date.className = "history-date";
      const parsed = new Date(item.date);
      date.textContent = Number.isNaN(parsed.getTime())
        ? "Recent"
        : parsed.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
      const result = document.createElement("span");
      result.className = `history-status ${item.passed ? "pass" : "retry"}`;
      result.textContent = item.passed ? "Level passed" : "Try again";
      row.append(name, speed, acc, date, result);
      historyNode.appendChild(row);
    });
  }
}
// Dedicated timed typing game screen with persistent level unlocks and recent scores.
const gameInput = document.getElementById("gameInput");
if (gameInput) {
  const queryLevel =
      Number(new URLSearchParams(location.search).get("level")) || 1,
    levelNumber = Math.max(1, Math.min(10, queryLevel)),
    level = typingLevelData[levelNumber - 1],
    highest = getTypingUnlocked();
  const locked = document.getElementById("lockedNotice"),
    gameCard = document.getElementById("gameCard");
  if (levelNumber > highest) {
    if (locked) locked.hidden = false;
    if (gameCard) gameCard.hidden = true;
    const title = document.getElementById("gameTitle");
    if (title) title.textContent = `Level ${levelNumber} is locked`;
  } else {
    let secondsLeft = level.seconds,
      startedAt = 0,
      tick = null,
      finished = false;
    const byId = (id) => document.getElementById(id),
      startButton = byId("gameStart"),
      timer = byId("gameTimer"),
      wpmNode = byId("gameWpm"),
      accNode = byId("gameAccuracy"),
      promptNode = byId("gamePrompt"),
      statusNode = byId("gameStatus"),
      resultPanel = byId("roundResult");
    byId("gameTitle").textContent = `Level ${levelNumber} · ${level.name}`;
    byId("gameDescription").textContent =
      `${level.challenge}. Reach ${level.target} WPM with at least 85% accuracy to pass.`;
    byId("gameChallenge").textContent = level.challenge;
    byId("gameTarget").textContent = `${level.target} WPM`;
    byId("gameRank").textContent = typingRank(highest);
    promptNode.textContent = level.prompt;
    timer.textContent = `00:${String(secondsLeft).padStart(2, "0")}`;
    if (levelNumber === 10) byId("nextLevel").textContent = "View your rank →";
    function updateGameMetrics() {
      const typed = gameInput.value,
        correct = Array.from(typed).reduce(
          (sum, char, index) => sum + (char === level.prompt[index] ? 1 : 0),
          0,
        ),
        elapsed = Math.max(1, (Date.now() - startedAt) / 1000),
        speed = Math.round(correct / 5 / (elapsed / 60)),
        accuracy = typed.length
          ? Math.round((correct / typed.length) * 100)
          : 100;
      wpmNode.textContent = String(speed);
      accNode.textContent = String(accuracy);
      return { typed, speed, accuracy };
    }
    function finishTypingRound(timeExpired = false) {
      if (finished) return;
      finished = true;
      if (tick) clearInterval(tick);
      tick = null;
      gameInput.disabled = true;
      const score = updateGameMetrics(),
        passed =
          score.typed === level.prompt &&
          score.accuracy >= 85 &&
          score.speed >= level.target;
      const history = getTypingHistory();
      history.unshift({
        level: levelNumber,
        wpm: score.speed,
        accuracy: score.accuracy,
        passed,
        date: new Date().toISOString(),
      });
      saveTypingValue("easyLearnTypingHistory", history.slice(0, 20));
      let unlocked = getTypingUnlocked();
      if (passed && levelNumber === unlocked && unlocked < 10) {
        unlocked++;
        saveTypingValue("easyLearnUnlockedTypingLevel", unlocked);
      }
      const resultTitle = byId("resultTitle"),
        resultDetail = byId("resultDetail"),
        next = byId("nextLevel");
      resultPanel.hidden = false;
      if (passed) {
        resultTitle.textContent =
          levelNumber === 10 ? "All 10 levels complete!" : "Level passed!";
        resultDetail.textContent =
          levelNumber === 10
            ? `You reached ${score.speed} WPM with ${score.accuracy}% accuracy. You’ve earned the Master rank.`
            : unlocked > levelNumber
              ? `You reached ${score.speed} WPM with ${score.accuracy}% accuracy. Level ${unlocked} is now unlocked.`
              : `You passed at ${score.speed} WPM and ${score.accuracy}% accuracy.`;
        next.hidden = false;
        next.href =
          levelNumber === 10
            ? "typing.html"
            : `typing-play.html?level=${levelNumber + 1}`;
      } else {
        resultTitle.textContent = timeExpired
          ? "Time is up — try again"
          : "Keep practicing";
        resultDetail.textContent = `You reached ${score.speed} WPM with ${score.accuracy}% accuracy. Pass with the full prompt, ${level.target} WPM, and at least 85% accuracy.`;
        next.hidden = true;
      }
      if (statusNode)
        statusNode.textContent = passed
          ? "Round saved to your practice history."
          : "Round saved. Try again when you’re ready.";
      startButton.disabled = false;
      startButton.textContent = passed ? "Play again" : "Try again";
    }
    function beginTypingRound() {
      if (tick) clearInterval(tick);
      secondsLeft = level.seconds;
      startedAt = Date.now();
      finished = false;
      gameInput.value = "";
      gameInput.disabled = false;
      resultPanel.hidden = true;
      wpmNode.textContent = "0";
      accNode.textContent = "100";
      timer.textContent = `00:${String(secondsLeft).padStart(2, "0")}`;
      gameInput.focus();
      startButton.disabled = true;
      startButton.textContent = "Typing…";
      if (statusNode)
        statusNode.textContent = "Go! Type the prompt before time runs out.";
      tick = setInterval(() => {
        secondsLeft--;
        timer.textContent = `00:${String(Math.max(0, secondsLeft)).padStart(2, "0")}`;
        if (secondsLeft <= 0) finishTypingRound(true);
      }, 1000);
    }
    startButton.addEventListener("click", beginTypingRound);
    gameInput.addEventListener("input", () => {
      if (!startedAt || finished) return;
      const score = updateGameMetrics();
      if (score.typed === level.prompt) finishTypingRound(false);
    });
  }
}
