const CONFIG_PATHS = {
  sections: "./scaffolds/sections.v1.json",
  questions: "./scaffolds/questions.v1.json",
  followups: "./scaffolds/followups.v1.json",
  preferences: "./scaffolds/interaction_preferences.v1.json",
};

const state = {
  config: null,
  preferences: null,
  sectionIndex: 0,
  questionIndex: 0,
  responses: {},
  rephraseMode: "default",
  exampleVisible: false,
  helpVisible: false,
  currentView: "welcome",
  questionTypingTimer: null,
  typingHintDismissed: false,
  lastRenderedQuestionId: null,
  speechRecognition: null,
  isListening: false,
};

const els = {
  screen: document.querySelector("#screen-container"),
  progressBlock: document.querySelector("#progress-block"),
  sectionProgress: document.querySelector("#section-progress"),
  questionProgress: document.querySelector("#question-progress"),
  progressFill: document.querySelector("#progress-fill"),
  tone: document.querySelector("#pref-tone"),
  length: document.querySelector("#pref-length"),
  pace: document.querySelector("#pref-pace"),
  examples: document.querySelector("#pref-examples"),
  fontSize: document.querySelector("#pref-font-size"),
  questionTyping: document.querySelector("#pref-question-typing"),
  questionTypingSpeed: document.querySelector("#pref-question-typing-speed"),
  pauseToggle: document.querySelector("#pause-toggle"),
  prefsToggle: document.querySelector("#prefs-toggle"),
  prefsDialog: document.querySelector("#prefs-dialog"),
  pauseDialog: document.querySelector("#pause-dialog"),
};

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

function indexBy(items, key) {
  return Object.fromEntries(items.map((item) => [item[key], item]));
}

async function initialize() {
  try {
    const [sections, questions, followups, preferences] = await Promise.all([
      loadJson(CONFIG_PATHS.sections),
      loadJson(CONFIG_PATHS.questions),
      loadJson(CONFIG_PATHS.followups),
      loadJson(CONFIG_PATHS.preferences),
    ]);

    state.config = {
      sections,
      questions,
      followups,
      sectionMap: indexBy(sections, "section_id"),
      questionMap: indexBy(questions, "question_id"),
    };
    state.preferences = { ...preferences.defaults };

    wirePreferenceControls(preferences.options);
    wireDialog();
    wireKeyboardNavigation();
    applyFontSizePreference();
    render();
  } catch (error) {
    els.screen.innerHTML = `
      <div class="screen-layout">
        <div class="screen-head">
          <h2>Prototype could not start</h2>
          <div class="helper-box">
            <p>${error.message}</p>
            <p>Run this from a local web server such as <code>python3 -m http.server 8000</code> at the project root.</p>
          </div>
        </div>
      </div>
    `;
  }
}

function wirePreferenceControls(options) {
  populateSelect(els.tone, options.tone_style, state.preferences.tone_style);
  populateSelect(els.length, options.prompt_length, state.preferences.prompt_length);
  populateSelect(els.pace, options.pace, state.preferences.pace);
  populateSelect(
    els.examples,
    options.offer_examples_mode,
    state.preferences.offer_examples_mode,
  );
  populateSelect(els.fontSize, options.font_size, state.preferences.font_size);
  populateSelect(
    els.questionTyping,
    options.question_typing_effect,
    state.preferences.question_typing_effect,
  );
  populateSelect(
    els.questionTypingSpeed,
    options.question_typing_speed,
    state.preferences.question_typing_speed,
  );

  els.tone.addEventListener("change", (event) => {
    state.preferences.tone_style = event.target.value;
    render();
  });
  els.length.addEventListener("change", (event) => {
    state.preferences.prompt_length = event.target.value;
    render();
  });
  els.pace.addEventListener("change", (event) => {
    state.preferences.pace = event.target.value;
    render();
  });
  els.examples.addEventListener("change", (event) => {
    state.preferences.offer_examples_mode = event.target.value;
    render();
  });
  els.fontSize.addEventListener("change", (event) => {
    state.preferences.font_size = event.target.value;
    applyFontSizePreference();
    render();
  });
  els.questionTyping.addEventListener("change", (event) => {
    state.preferences.question_typing_effect = event.target.value;
    render();
  });
  els.questionTypingSpeed.addEventListener("change", (event) => {
    state.preferences.question_typing_speed = event.target.value;
    render();
  });
}

function wireDialog() {
  els.prefsToggle.addEventListener("click", () => {
    els.prefsDialog.showModal();
    els.prefsToggle.setAttribute("aria-expanded", "true");
  });

  els.prefsDialog.addEventListener("close", () => {
    els.prefsToggle.setAttribute("aria-expanded", "false");
  });

  els.pauseToggle.addEventListener("click", () => {
    if (state.currentView === "welcome") return;
    els.pauseDialog.showModal();
  });
}

function ensureSpeechRecognition() {
  if (state.speechRecognition) return state.speechRecognition;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart = () => {
    state.isListening = true;
    updateSttButtonState();
  };

  recognition.onend = () => {
    state.isListening = false;
    updateSttButtonState();
  };

  recognition.onerror = () => {
    state.isListening = false;
    updateSttButtonState();
  };

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim();
    if (!transcript) return;

    const textField = document.querySelector("#question-response");
    if (!textField) return;

    const existing = textField.value.trim();
    textField.value = existing ? `${existing} ${transcript}` : transcript;
    textField.focus();
  };

  state.speechRecognition = recognition;
  return recognition;
}

function updateSttButtonState() {
  const sttTrigger = document.querySelector("#stt-trigger");
  if (!sttTrigger) return;

  sttTrigger.textContent = state.isListening ? "Listening..." : "Speak";
  sttTrigger.setAttribute(
    "aria-label",
    state.isListening ? "Listening for speech input" : "Start speech to text",
  );
}

function startSpeechToText() {
  const recognition = ensureSpeechRecognition();
  if (!recognition) {
    window.alert("Speech to text is not available in this browser.");
    return;
  }

  if (state.isListening) {
    recognition.stop();
    return;
  }

  try {
    recognition.start();
  } catch {
    // Ignore duplicate start attempts from rapid clicks.
  }
}

function stopSpeechToText() {
  if (state.speechRecognition && state.isListening) {
    state.speechRecognition.stop();
  }
}

function readQuestionAloud(text) {
  if (!window.speechSynthesis) {
    window.alert("Read aloud is not available in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

function wireKeyboardNavigation() {
  document.addEventListener("keydown", (event) => {
    if (state.currentView === "welcome") {
      if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        state.currentView = "intake";
        render();
      }
      return;
    }

    const activeTag = document.activeElement?.tagName;
    const isTypingTarget = activeTag === "TEXTAREA" || activeTag === "INPUT" || activeTag === "SELECT";
    if (isTypingTarget) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goBack();
      return;
    }

    if (event.key === "ArrowRight") {
      const submitButton = document.querySelector("#submit-answer");
      if (submitButton) {
        event.preventDefault();
        submitButton.click();
      }
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const skipButton = document.querySelector("#action-skip");
      if (skipButton && !skipButton.disabled) {
        event.preventDefault();
        skipButton.click();
      }
    }
  });
}

function populateSelect(select, options, selected) {
  select.innerHTML = options
    .map((option) => {
      const label = toLabel(option);
      const isSelected = option === selected ? "selected" : "";
      return `<option value="${option}" ${isSelected}>${label}</option>`;
    })
    .join("");
}

function getCurrentSection() {
  return state.config.sections[state.sectionIndex] || null;
}

function getCurrentQuestion() {
  const section = getCurrentSection();
  if (!section) return null;
  const questionId = section.question_ids[state.questionIndex];
  return state.config.questionMap[questionId] || null;
}

function getQuestionText(question) {
  if (state.rephraseMode === "plain" && question.plain_language_variant) {
    return question.plain_language_variant;
  }
  if (state.rephraseMode === "short" && question.short_variant) {
    return question.short_variant;
  }
  return question.prompt_text;
}

function render(options = {}) {
  const { animateQuestion = true } = options;

  if (animateQuestion) {
    clearQuestionTyping();
  }

  if (state.currentView === "welcome") {
    renderWelcome();
    return;
  }

  const section = getCurrentSection();
  const question = getCurrentQuestion();

  if (!section || !question) {
    renderReview();
    return;
  }

  els.prefsToggle.hidden = false;
  els.pauseToggle.hidden = false;
  els.progressBlock.classList.remove("hidden");
  els.sectionProgress.textContent = section.title;
  els.questionProgress.textContent = `${state.questionIndex + 1} of ${section.question_ids.length}`;
  updateProgress(section, question);

  const questionText = getQuestionText(question);
  const existingResponse = state.responses[question.question_id];
  const firstQuestionHint = isFirstQuestion() && !state.typingHintDismissed
    ? `<div class="question-hint"><span>Toggle the typing effect in Preferences!</span><button class="question-hint-dismiss" type="button" id="dismiss-typing-hint">Okay</button></div>`
    : "";
  const helper = question.help_text
    && state.helpVisible
    ? `
      <div class="helper-box">
        <strong>Help</strong>
        <p>${question.help_text}</p>
      </div>
    `
    : "";

  const exampleBox =
    state.exampleVisible && question.example_starters?.length
      ? `
        <div class="example-box">
          <strong>Starter ideas</strong>
          ${question.response_type === "free_text"
            ? `<div class="example-actions">${question.example_starters
                .map(
                  (item, index) => `<button class="example-choice" type="button" data-example-index="${index}">${item}</button>`,
                )
                .join("")}</div>`
            : `<ul>${question.example_starters.map((item) => `<li>${item}</li>`).join("")}</ul>`}
        </div>
      `
      : "";

  els.screen.innerHTML = `
    <div class="screen-layout">
      <div class="screen-head">
        <div class="question-copy">
          <h2><span id="question-heading" class="typed-question"></span></h2>
          <div class="question-audio-row">
            <button class="audio-trigger" type="button" id="tts-trigger" aria-label="Read question aloud" title="Read question aloud">Read Aloud</button>
          </div>
          ${firstQuestionHint}
        </div>
      </div>

      <div class="response-area">
        ${renderResponseControl(question, existingResponse)}
        ${exampleBox}
        ${helper}
      </div>

      <div class="footer-actions">
        <div class="subtle-actions secondary">
          <button class="text-button" type="button" id="action-rephrase">Rephrase</button>
          <button class="text-button" type="button" id="action-example">${state.exampleVisible ? "Hide example" : "Show example"}</button>
          ${question.help_text ? `<button class="text-button" type="button" id="action-help">${state.helpVisible ? "Hide help" : "Show help"}</button>` : ""}
        </div>
      </div>

      <div class="footer-actions nav-footer">
        <div class="nav-cluster">
          <button class="arrow-button" type="button" id="nav-back" ${hasPreviousQuestion() ? "" : "disabled"} aria-label="Go back">←</button>
          <button class="nav-skip" type="button" id="action-skip" ${question.is_skippable ? "" : "disabled"}>Skip</button>
          <button class="arrow-button next-button" type="button" id="submit-answer" aria-label="Next">Next →</button>
        </div>
      </div>
    </div>
  `;

  renderQuestionHeading(question.question_id, questionText, animateQuestion);

  document.querySelector("#tts-trigger").addEventListener("click", () => {
    readQuestionAloud(questionText);
  });
  document.querySelector("#submit-answer").addEventListener("click", () => {
    saveCurrentAnswer(question);
  });
  const backButton = document.querySelector("#nav-back");
  if (backButton) {
    backButton.addEventListener("click", () => {
      goBack();
    });
  }
  document.querySelector("#action-rephrase").addEventListener("click", () => {
    state.rephraseMode =
      state.rephraseMode === "default"
        ? "plain"
        : state.rephraseMode === "plain"
          ? "short"
          : "default";
    render();
  });
  document.querySelector("#action-example").addEventListener("click", () => {
    state.exampleVisible = !state.exampleVisible;
    render({ animateQuestion: false });
  });
  const dismissHintButton = document.querySelector("#dismiss-typing-hint");
  if (dismissHintButton) {
    dismissHintButton.addEventListener("click", () => {
      state.typingHintDismissed = true;
      render({ animateQuestion: false });
    });
  }
  const helpButton = document.querySelector("#action-help");
  if (helpButton) {
    helpButton.addEventListener("click", () => {
      state.helpVisible = !state.helpVisible;
      render({ animateQuestion: false });
    });
  }

  const exampleButtons = document.querySelectorAll("[data-example-index]");
  exampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const textField = document.querySelector("#question-response");
      if (!textField) return;
      textField.value = question.example_starters[Number(button.dataset.exampleIndex)] || "";
      textField.focus();
    });
  });

  const sttTrigger = document.querySelector("#stt-trigger");
  if (sttTrigger) {
    sttTrigger.addEventListener("click", () => {
      startSpeechToText();
    });
    updateSttButtonState();
  }

  const skipButton = document.querySelector("#action-skip");
  if (skipButton) skipButton.addEventListener("click", () => skipCurrentQuestion());
}

function renderQuestionHeading(questionId, text, animateQuestion) {
  const heading = document.querySelector("#question-heading");
  if (!heading) return;

  const shouldAnimate =
    animateQuestion
    && state.preferences.question_typing_effect === "on"
    && state.lastRenderedQuestionId !== questionId;

  state.lastRenderedQuestionId = questionId;

  if (!shouldAnimate) {
    heading.textContent = text;
    heading.classList.remove("is-typing");
    return;
  }

  heading.textContent = "";
  heading.classList.add("is-typing");

  let index = 0;
  const step = () => {
    if (!document.body.contains(heading)) {
      clearQuestionTyping();
      return;
    }

    heading.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      state.questionTypingTimer = window.setTimeout(step, getTypingDelay());
      return;
    }

    heading.classList.remove("is-typing");
    clearQuestionTyping();
  };

  step();
}

function clearQuestionTyping() {
  if (state.questionTypingTimer) {
    window.clearTimeout(state.questionTypingTimer);
    state.questionTypingTimer = null;
  }
}

function getTypingDelay() {
  const speed = state.preferences.question_typing_speed;
  if (speed === "standard") return 22;
  if (speed === "slower") return 42;
  return 31;
}

function renderWelcome() {
  els.prefsToggle.hidden = true;
  els.pauseToggle.hidden = true;
  els.progressBlock.classList.add("hidden");

  els.screen.innerHTML = `
    <section class="welcome-screen">
      <div class="welcome-inner">
        <h2 class="welcome-title">Welcome</h2>
        <button class="primary-button" id="welcome-start" type="button">Get started</button>
      </div>
    </section>
  `;

  document.querySelector("#welcome-start").addEventListener("click", () => {
    state.currentView = "intake";
    render();
  });
}

function renderResponseControl(question, existingResponse) {
  if (question.response_type === "single_select" && question.response_options?.length) {
    const useCardLayout = question.section_id === "intro_and_preferences";
    return `
      <div class="option-list ${useCardLayout ? "compact-grid" : ""}">
        ${question.response_options
          .map((option) => {
            const checked = existingResponse?.raw_response === option ? "checked" : "";
            const description = describeOption(question.question_id, option);
            return `
              <label class="option-item ${useCardLayout ? "card-option" : ""}">
                <input type="radio" name="question-response" value="${option}" ${checked} />
                <div class="option-copy">
                  <span class="option-title">${toLabel(option)}</span>
                  ${description ? `<span class="option-description">${description}</span>` : ""}
                </div>
              </label>
            `;
          })
          .join("")}
      </div>
    `;
  }

  return `
    <div class="text-response-wrap">
      <textarea
        id="question-response"
        placeholder="Type your answer here..."
      >${existingResponse?.raw_response || ""}</textarea>
      <button class="stt-trigger" type="button" id="stt-trigger" aria-label="Start speech to text" title="Start speech to text">Speak</button>
    </div>
  `;
}

function saveCurrentAnswer(question) {
  let rawResponse = "";

  if (question.response_type === "single_select" && question.response_options?.length) {
    const checked = document.querySelector('input[name="question-response"]:checked');
    rawResponse = checked?.value || "";
  } else {
    rawResponse = document.querySelector("#question-response")?.value.trim() || "";
  }

  if (!rawResponse && !question.is_skippable) {
    return;
  }

  state.responses[question.question_id] = {
    question_id: question.question_id,
    section_id: question.section_id,
    raw_response: rawResponse,
    normalized_response: rawResponse,
    was_skipped: false,
  };

  advance();
}

function skipCurrentQuestion() {
  const question = getCurrentQuestion();
  if (!question || !question.is_skippable) return;

  state.responses[question.question_id] = {
    question_id: question.question_id,
    section_id: question.section_id,
    raw_response: "",
    normalized_response: "",
    was_skipped: true,
  };

  advance();
}

function hasPreviousQuestion() {
  if (state.questionIndex > 0) return true;
  return state.sectionIndex > 0;
}

function isFirstQuestion() {
  return state.sectionIndex === 0 && state.questionIndex === 0;
}

function goBack() {
  if (!hasPreviousQuestion()) return;

  if (window.speechSynthesis) window.speechSynthesis.cancel();
  stopSpeechToText();
  state.helpVisible = false;
  state.exampleVisible = false;
  state.rephraseMode = "default";

  if (state.questionIndex > 0) {
    state.questionIndex -= 1;
    render();
    return;
  }

  state.sectionIndex -= 1;
  const previousSection = getCurrentSection();
  state.questionIndex = Math.max(previousSection.question_ids.length - 1, 0);
  render();
}

function advance() {
  const section = getCurrentSection();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  stopSpeechToText();
  state.exampleVisible = state.preferences.offer_examples_mode === "proactive";
  state.rephraseMode = "default";
  state.helpVisible = false;

  if (state.questionIndex < section.question_ids.length - 1) {
    state.questionIndex += 1;
    render();
    return;
  }

  if (section.summary_enabled) {
    renderSectionSummary(section);
    return;
  }

  moveToNextSection();
}

function renderSectionSummary(section) {
  const responses = section.question_ids.map((id) => state.responses[id]).filter(Boolean);
  const items = responses
    .map((response) => {
      const question = state.config.questionMap[response.question_id];
      const answer = response.was_skipped ? "Skipped" : response.raw_response || "No answer";
      return `<li><strong>${question.short_variant || question.prompt_text}</strong>: ${answer}</li>`;
    })
    .join("");

  els.screen.innerHTML = `
    <div class="screen-layout">
      <div class="screen-head">
        <p class="eyebrow">Section Review</p>
        <h2>${section.title}</h2>
        <div class="summary-box">
          <strong>Here is what the prototype captured.</strong>
          <ul>${items}</ul>
        </div>
      </div>

      <div class="footer-actions">
        <div class="subtle-actions">
          <button class="text-button" type="button" id="summary-edit">Review this section again</button>
        </div>
        <div class="action-row">
          <button class="primary-button" id="summary-confirm" type="button">Continue</button>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#summary-confirm").addEventListener("click", () => moveToNextSection());
  document.querySelector("#summary-edit").addEventListener("click", () => {
    state.questionIndex = 0;
    render();
  });
}

function moveToNextSection() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  stopSpeechToText();
  state.sectionIndex += 1;
  state.questionIndex = 0;
  state.helpVisible = false;
  render();
}

function renderReview() {
  els.prefsToggle.hidden = false;
  els.pauseToggle.hidden = false;
  els.progressBlock.classList.add("hidden");

  const sections = state.config.sections
    .map((section) => {
      const answers = section.question_ids
        .map((questionId) => {
          const question = state.config.questionMap[questionId];
          const response = state.responses[questionId];
          const answer = !response
            ? "Not answered"
            : response.was_skipped
              ? "Skipped"
              : response.raw_response || "No answer";
          return `<li><strong>${question.short_variant || question.prompt_text}</strong>: ${answer}</li>`;
        })
        .join("");

      return `
        <article class="review-item">
          <h3>${section.title}</h3>
          <ul>${answers}</ul>
        </article>
      `;
    })
    .join("");

  els.screen.innerHTML = `
    <div class="screen-layout">
      <div class="screen-head">
        <p class="eyebrow">Complete</p>
        <h2>Review what was captured</h2>
        <div class="intro-copy">
          <p>This prototype keeps the review step separate so the intake stays low-clutter while each question is being answered.</p>
        </div>
      </div>

      <div class="review-list">${sections}</div>

      <div class="summary-box">
        <strong>Structured output preview</strong>
        <pre>${escapeHtml(JSON.stringify(buildReportPayload(), null, 2))}</pre>
      </div>

      <div class="footer-actions">
        <div></div>
        <div class="action-row">
          <button class="primary-button" id="review-finish" type="button">Finish</button>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#review-finish").addEventListener("click", () => {
    renderCompletion();
  });
}

function renderCompletion() {
  els.prefsToggle.hidden = false;
  els.pauseToggle.hidden = false;
  els.progressBlock.classList.add("hidden");
  if (els.progressFill) els.progressFill.style.width = "100%";
  els.screen.innerHTML = `
    <div class="screen-layout">
      <div class="screen-head">
        <p class="eyebrow">Thank You</p>
        <h2>Thank you for filling out the form</h2>
        <div class="intro-copy">
          <p>Your intake has been submitted successfully.</p>
          <p>You will be contacted soon with next steps.</p>
        </div>
      </div>

      <div class="resource-list">
        <h3>While you wait</h3>
        <ul>
          <li>You may want to write down anything else you would like the team to understand about communication preferences, sensory needs, or support needs.</li>
          <li>If you need support in the meantime, you could connect with a trusted person, existing care team, or local support service. This is placeholder content for now.</li>
          <li>A member of the team will review your intake and contact you soon. Final wording and resources can be updated later.</li>
        </ul>
      </div>

      <p class="brand-subtitle">Placeholder resources are being used for this prototype and can be replaced with approved clinic-specific information later.</p>
    </div>
  `;
}

function buildReportPayload() {
  return {
    generated_at: new Date().toISOString(),
    interaction_preferences_snapshot: { ...state.preferences },
    responses: Object.values(state.responses),
  };
}

function applyFontSizePreference() {
  if (!state.preferences) return;

  const size = state.preferences.font_size;
  const root = document.documentElement;

  if (size === "large") {
    root.style.setProperty("--question-size", "clamp(2rem, 3.2vw, 2.9rem)");
    root.style.setProperty("--body-size", "1.05rem");
    root.style.setProperty("--control-size", "1.05rem");
    return;
  }

  if (size === "extra_large") {
    root.style.setProperty("--question-size", "clamp(2.15rem, 3.5vw, 3.1rem)");
    root.style.setProperty("--body-size", "1.1rem");
    root.style.setProperty("--control-size", "1.1rem");
    return;
  }

  root.style.setProperty("--question-size", "clamp(1.7rem, 2.8vw, 2.5rem)");
  root.style.setProperty("--body-size", "1rem");
  root.style.setProperty("--control-size", "1rem");
}

function updateProgress(section, question) {
  if (!els.progressFill) return;

  const sectionIndex = state.config.sections.findIndex(
    (item) => item.section_id === section.section_id,
  );
  const totalQuestions = state.config.sections.reduce(
    (sum, item) => sum + item.question_ids.length,
    0,
  );
  const completedBeforeSection = state.config.sections
    .slice(0, sectionIndex)
    .reduce((sum, item) => sum + item.question_ids.length, 0);
  const questionIndexInSection = section.question_ids.findIndex((id) => id === question.question_id);
  const currentPosition = completedBeforeSection + questionIndexInSection + 1;
  const progress = Math.max(0, Math.min(100, (currentPosition / totalQuestions) * 100));

  els.progressFill.style.width = `${progress}%`;
}

function toLabel(value) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function describeOption(questionId, option) {
  const descriptions = {
    answer_mode_001: {
      self: "The participant answers directly for themselves.",
      caregiver_supported: "A support person helps with communication or completion.",
      together: "The participant and support person answer together.",
    },
    input_mode_001: {
      text: "Questions and answers stay written.",
      voice: "Spoken input is preferred when available.",
      mixed: "Switch between typing and speaking as needed.",
    },
    prompt_style_001: {
      short_simple: "Shorter prompts with less extra explanation.",
      neutral_clear: "Direct, calm phrasing with minimal tone shaping.",
      warm_supportive: "Softer, more reassuring phrasing.",
      structured_concise: "Highly organized prompts with a clear format.",
    },
    read_aloud_001: {
      yes: "Questions are read aloud by default.",
      no: "Prompts stay text only unless changed later.",
      maybe_later: "Keep it off for now and revisit later.",
    },
  };

  return descriptions[questionId]?.[option] || "";
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

initialize();
