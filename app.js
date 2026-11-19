"use strict";

const STORAGE_KEY = "wan-on-one-records-v2";
const DRAFT_KEY = "wan-on-one-draft-v2";

const moods = [
  { value: "とてもいい", emoji: "😄", comment: "いい表情だワン！今日はうれしかったことから聞かせてね。" },
  { value: "いい感じ", emoji: "🙂", comment: "いい感じだワン！その調子で、ゆっくり話していこう。" },
  { value: "ふつう", emoji: "😐", comment: "教えてくれてありがとう。気になることから話してみよう。" },
  { value: "ちょっと疲れた", emoji: "😟", comment: "おつかれさま。今日は無理せず、ゆっくり話そうね。" },
  { value: "疲れている", emoji: "😵", comment: "ここに来てくれてありがとう。ひと息つきながらで大丈夫だワン。" }
];

const questions = [
  {
    kicker: "GOOD NEWS",
    text: "最近よかったことは？",
    intro: "うれしかったこと、聞かせてほしいワン！",
    options: [
      option("仕事がうまくいった", "💼", "いいね！何がうまくいったのか、もう少し聞きたいワン！", "happy"),
      option("新しいことができた", "🌱", "新しい一歩だワン！チャレンジした自分をほめよう。", "happy"),
      option("誰かにほめられた・感謝された", "👏", "うれしいね！あなたの良さがちゃんと届いたんだワン。", "happy"),
      option("プライベートでいいことがあった", "☀️", "それは素敵だワン！そのうれしさ、大事にしたいね。", "happy"),
      option("小さな達成があった", "✅", "小さな一歩も立派な前進だワン！", "happy"),
      otherOption()
    ]
  },
  {
    kicker: "CHALLENGE",
    text: "最近ちょっと困っていることは？",
    intro: "一人で抱えなくて大丈夫。近いものを選んでね。",
    options: [
      option("仕事が多い", "📚", "それは大変だワン。減らせることや優先順位を一緒に考えてみよう。", "gentle"),
      option("時間が足りない", "⏰", "忙しいんだね。まず一番大事なことを一つ決めてみようか。", "gentle"),
      option("人間関係が気になる", "🤝", "話してくれてありがとう。どんな場面が気になるか聞いてみたいワン。", "gentle"),
      option("やり方がわからない", "🧭", "わからないと言えるのは大切だワン。必要な情報や相談相手を探そう。", "gentle"),
      option("特にない", "👌", "了解だワン！今のよい状態を続けるためにできることも話してみよう。", "normal"),
      otherOption()
    ]
  },
  {
    kicker: "TODAY'S TOPIC",
    text: "今、一番話したいことは？",
    intro: "今日の時間で大事にしたいテーマを選んでね。",
    options: [
      option("今の仕事について", "📝", "今の仕事のどこを一番話したい？一緒に整理するワン。", "normal"),
      option("今後のキャリア", "🚀", "未来の話、いいね！どんな自分になりたいか聞かせてほしいワン。", "happy"),
      option("チームについて", "👥", "チームをもっとよくするヒントが見つかるといいね。", "normal"),
      option("新しく挑戦したいこと", "✨", "わくわくするワン！最初の小さな一歩を考えてみよう。", "happy"),
      option("ちょっと相談したいこと", "💬", "もちろんだワン。結論を急がず、まずはゆっくり聞かせてね。", "gentle"),
      otherOption()
    ]
  },
  {
    kicker: "ASK",
    text: "相手に聞いてみたいことは？",
    intro: "聞いてみたい気持ちを、会話のきっかけにしよう。",
    options: [
      option("最近の様子を聞きたい", "🌤️", "相手を知ろうとする気持ち、素敵だワン！", "happy"),
      option("今後の予定を確認したい", "📅", "予定が見えると安心だね。一緒に確認してみよう。", "normal"),
      option("仕事の進め方を聞きたい", "🛠️", "よいヒントが見つかりそうだワン。具体的な場面から聞いてみよう。", "normal"),
      option("アドバイスがほしい", "💡", "頼るのも大切な力だワン。何に迷っているか伝えてみよう。", "normal"),
      option("特にない", "👌", "了解だワン！話を聞く中で思いついたら、いつでも聞いてね。", "normal"),
      otherOption()
    ]
  },
  {
    kicker: "SUPPORT",
    text: "何かサポートしてほしいことは？",
    intro: "必要な助けを言葉にしてみよう。選ぶだけでも大丈夫。",
    options: [
      option("一緒に考えてほしい", "🧩", "もちろんだワン！答えを急がず、一緒に整理してみよう。", "normal"),
      option("アドバイスがほしい", "💡", "どんなアドバイスが役立ちそうか、まず聞かせてほしいワン。", "normal"),
      option("誰かを紹介してほしい", "🔗", "つながりが力になるかも！どんな人が必要か考えてみよう。", "happy"),
      option("時間を作ってほしい", "🕰️", "時間が必要なんだね。いつ・どれくらい必要か相談してみよう。", "gentle"),
      option("今は大丈夫", "👌", "了解だワン！必要になったらいつでも話してね。", "normal"),
      otherOption()
    ]
  },
  {
    kicker: "NEXT STEP",
    text: "次の1on1までにやってみたいことは？",
    intro: "最後に、小さな一歩を一つ選んでみよう！",
    options: [
      option("新しいことにチャレンジする", "🚀", "いいね！応援してるワン。最初の一歩を小さく決めよう！", "happy"),
      option("今の仕事を一つ終わらせる", "✅", "ゴールがはっきりしていていいワン！終わったら一緒に喜ぼう。", "happy"),
      option("誰かに相談してみる", "🤝", "一人で抱えない選択、素敵だワン。誰に話すか決めよう。", "normal"),
      option("勉強してみる", "📖", "学ぼうとする気持ち、かっこいいワン！時間も少し確保しよう。", "happy"),
      option("少し休む・余裕を作る", "☕", "休むのも大事だワン。無理しすぎないでね。", "gentle"),
      otherOption()
    ]
  }
];

function option(label, icon, comment, tone) {
  return { label, icon, comment, tone, other: false };
}

function otherOption() {
  return { label: "その他", icon: "✏️", comment: "", tone: "normal", other: true };
}

const blankDraft = () => ({
  yourName: "",
  partnerName: "",
  mood: "",
  answers: questions.map(() => ({ choice: "", otherText: "", comment: "", tone: "normal" })),
  insight: "",
  nextAction: "",
  nextTopic: "",
  questionIndex: 0,
  updatedAt: ""
});

let draft = loadDraft();
let currentScreen = "home-screen";
let recordToDelete = null;
let commentTimer = null;

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  renderMoods();
  renderHistory();
  if (draft.yourName && draft.updatedAt) {
    const startButtons = document.querySelectorAll('[data-action="start"]');
    startButtons.forEach((button, index) => {
      if (index === 0) button.textContent = "🐶 続きからはじめる";
    });
  }
});

function cacheElements() {
  Object.assign(elements, {
    setupForm: document.querySelector("#setup-form"),
    yourName: document.querySelector("#your-name"),
    partnerName: document.querySelector("#partner-name"),
    setupError: document.querySelector("#setup-error"),
    moodOptions: document.querySelector("#mood-options"),
    moodComment: document.querySelector("#mood-comment"),
    moodNext: document.querySelector("#mood-next"),
    questionBack: document.querySelector("#question-back"),
    questionNext: document.querySelector("#question-next"),
    progressLabel: document.querySelector("#progress-label"),
    progressPercent: document.querySelector("#progress-percent"),
    progressBar: document.querySelector("#progress-bar"),
    questionKicker: document.querySelector("#question-kicker"),
    questionTitle: document.querySelector("#question-title"),
    answerOptions: document.querySelector("#answer-options"),
    otherWrap: document.querySelector("#other-wrap"),
    otherAnswer: document.querySelector("#other-answer"),
    otherCount: document.querySelector("#other-count"),
    questionDog: document.querySelector("#question-dog"),
    dogSpeech: document.querySelector("#dog-speech"),
    reviewBack: document.querySelector("#review-back"),
    reviewSubtitle: document.querySelector("#review-subtitle"),
    reviewAnswers: document.querySelector("#review-answers"),
    insight: document.querySelector("#insight"),
    nextAction: document.querySelector("#next-action"),
    nextTopic: document.querySelector("#next-topic"),
    saveRecord: document.querySelector("#save-record"),
    historySearch: document.querySelector("#history-search"),
    historyList: document.querySelector("#history-list"),
    historyEmpty: document.querySelector("#history-empty"),
    detailContent: document.querySelector("#detail-content"),
    toast: document.querySelector("#toast"),
    confirmDialog: document.querySelector("#confirm-dialog")
  });
}

function bindEvents() {
  document.addEventListener("click", handleGlobalAction);
  elements.setupForm.addEventListener("submit", handleSetup);
  elements.moodNext.addEventListener("click", () => {
    if (!draft.mood) return;
    draft.questionIndex = 0;
    saveDraft();
    renderQuestion();
    showScreen("question-screen");
  });
  elements.questionBack.addEventListener("click", goBackFromQuestion);
  elements.questionNext.addEventListener("click", goNextFromQuestion);
  elements.otherAnswer.addEventListener("input", handleOtherInput);
  elements.reviewBack.addEventListener("click", () => {
    draft.questionIndex = questions.length - 1;
    renderQuestion();
    showScreen("question-screen");
  });
  [elements.insight, elements.nextAction, elements.nextTopic].forEach((field) => {
    field.addEventListener("input", saveReflectionDraft);
  });
  elements.saveRecord.addEventListener("click", saveRecord);
  elements.historySearch.addEventListener("input", () => renderHistory(elements.historySearch.value));
  elements.confirmDialog.addEventListener("close", confirmDelete);
}

function handleGlobalAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "home") showScreen("home-screen");
  if (action === "history") {
    renderHistory(elements.historySearch?.value || "");
    showScreen("history-screen");
  }
  if (action === "setup") {
    fillSetup();
    showScreen("setup-screen");
  }
  if (action === "start") startOrResume();
  if (action === "save-exit") {
    saveDraft();
    showScreen("home-screen");
    showToast("途中の内容をこのブラウザーに保存しました");
  }
  if (action === "open-record") openRecord(button.dataset.id);
  if (action === "delete-record") askDelete(button.dataset.id);
  if (action === "edit-answer") {
    draft.questionIndex = Number(button.dataset.index);
    renderQuestion();
    showScreen("question-screen");
  }
}

function startOrResume() {
  if (draft.yourName && draft.updatedAt) {
    fillSetup();
    if (!draft.mood) {
      showScreen("mood-screen");
      renderMoodSelection();
    } else if (draft.answers.some((answer) => !answer.choice)) {
      draft.questionIndex = Math.max(0, draft.answers.findIndex((answer) => !answer.choice));
      renderQuestion();
      showScreen("question-screen");
    } else {
      renderReview();
      showScreen("review-screen");
    }
    return;
  }
  draft = blankDraft();
  fillSetup();
  showScreen("setup-screen");
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("is-active", screen.id === id));
  currentScreen = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = document.querySelector(`#${id} h1, #${id} h2`);
  setTimeout(() => (heading || document.querySelector("#main-content")).focus?.({ preventScroll: true }), 60);
}

function fillSetup() {
  elements.yourName.value = draft.yourName || "";
  elements.partnerName.value = draft.partnerName || "";
  elements.setupError.textContent = "";
}

function handleSetup(event) {
  event.preventDefault();
  const yourName = elements.yourName.value.trim();
  const partnerName = elements.partnerName.value.trim();
  if (!yourName || !partnerName) {
    elements.setupError.textContent = "二人の名前を入力してください。";
    (!yourName ? elements.yourName : elements.partnerName).focus();
    return;
  }
  draft.yourName = yourName;
  draft.partnerName = partnerName;
  saveDraft();
  renderMoodSelection();
  showScreen("mood-screen");
}

function renderMoods() {
  elements.moodOptions.replaceChildren();
  moods.forEach((mood) => {
    const button = createButton("mood-option", `${mood.emoji} ${mood.value}`);
    button.type = "button";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(draft.mood === mood.value));
    button.innerHTML = `<span class="mood-emoji" aria-hidden="true">${mood.emoji}</span><span class="mood-label">${mood.value}</span>`;
    button.addEventListener("click", () => chooseMood(mood));
    elements.moodOptions.append(button);
  });
}

function renderMoodSelection() {
  renderMoods();
  const selected = moods.find((mood) => mood.value === draft.mood);
  elements.moodNext.disabled = !selected;
  if (selected) {
    elements.moodComment.hidden = false;
    elements.moodComment.querySelector("p").textContent = selected.comment;
  } else {
    elements.moodComment.hidden = true;
  }
}

function chooseMood(mood) {
  draft.mood = mood.value;
  saveDraft();
  renderMoodSelection();
}

function renderQuestion() {
  const index = draft.questionIndex;
  const question = questions[index];
  const answer = draft.answers[index];
  const percent = Math.round(((index + 1) / questions.length) * 100);

  elements.progressLabel.textContent = `${index + 1} / ${questions.length}`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBar.style.width = `${percent}%`;
  elements.questionKicker.textContent = question.kicker;
  elements.questionTitle.textContent = question.text;
  elements.dogSpeech.textContent = answer.comment || question.intro;
  elements.answerOptions.replaceChildren();

  question.options.forEach((item) => {
    const selected = answer.choice === item.label;
    const button = createButton("answer-option", item.label);
    button.type = "button";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(selected));
    button.innerHTML = `<span class="option-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span><span class="option-check" aria-hidden="true"></span>`;
    button.addEventListener("click", () => chooseAnswer(item));
    elements.answerOptions.append(button);
  });

  const isOther = answer.choice === "その他";
  elements.otherWrap.hidden = !isOther;
  elements.otherAnswer.value = answer.otherText || "";
  elements.otherCount.textContent = String((answer.otherText || "").length);
  elements.questionNext.disabled = !isAnswerComplete(answer);
  elements.questionNext.firstChild.textContent = index === questions.length - 1 ? "振り返りへ " : "次へ ";
  elements.questionDog.className = "dog-stage dog-thinking";
}

function chooseAnswer(item) {
  const answer = draft.answers[draft.questionIndex];
  answer.choice = item.label;
  answer.tone = item.tone;
  if (item.other) {
    answer.comment = otherComment(answer.otherText);
  } else {
    answer.otherText = "";
    answer.comment = item.comment;
  }
  saveDraft();
  renderQuestion();
  reactDog(item.tone, answer.comment || "自由に書いてね。ちゃんと聞いているワン！");
  if (item.other) setTimeout(() => elements.otherAnswer.focus(), 80);
}

function handleOtherInput() {
  const answer = draft.answers[draft.questionIndex];
  answer.otherText = elements.otherAnswer.value;
  answer.comment = otherComment(answer.otherText);
  answer.tone = detectTone(answer.otherText);
  elements.otherCount.textContent = String(answer.otherText.length);
  elements.questionNext.disabled = !isAnswerComplete(answer);
  saveDraft();
  clearTimeout(commentTimer);
  commentTimer = setTimeout(() => reactDog(answer.tone, answer.comment), 420);
}

function otherComment(text) {
  const value = text.trim();
  if (!value) return "自由に書いてね。ちゃんと聞いているワン！";
  const tone = detectTone(value);
  if (tone === "gentle") return `「${shorten(value)}」なんだね。話してくれてありがとう。無理せず一緒に考えよう。`;
  if (tone === "happy") return `「${shorten(value)}」って素敵だワン！もう少し詳しく聞かせてほしいな。`;
  return `「${shorten(value)}」なんだね。大事なことを教えてくれてありがとう。`;
}

function shorten(text) {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 28 ? `${compact.slice(0, 28)}…` : compact;
}

function detectTone(text) {
  const value = text.toLowerCase();
  if (/疲|つら|辛|困|不安|悩|忙|難|できない|失敗|しんど/.test(value)) return "gentle";
  if (/嬉|うれ|楽|成功|できた|達成|よかった|良かった|楽し|挑戦/.test(value)) return "happy";
  return "normal";
}

function reactDog(tone, comment) {
  elements.dogSpeech.textContent = comment;
  elements.questionDog.className = `dog-stage is-reacting reaction-${tone}`;
  window.clearTimeout(elements.questionDog._reactionTimer);
  elements.questionDog._reactionTimer = window.setTimeout(() => {
    elements.questionDog.className = "dog-stage dog-thinking";
  }, 2400);
}

function isAnswerComplete(answer) {
  return Boolean(answer.choice && (answer.choice !== "その他" || answer.otherText.trim()));
}

function goBackFromQuestion() {
  if (draft.questionIndex === 0) {
    renderMoodSelection();
    showScreen("mood-screen");
    return;
  }
  draft.questionIndex -= 1;
  saveDraft();
  renderQuestion();
}

function goNextFromQuestion() {
  const answer = draft.answers[draft.questionIndex];
  if (!isAnswerComplete(answer)) return;
  if (draft.questionIndex < questions.length - 1) {
    draft.questionIndex += 1;
    saveDraft();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    saveDraft();
    renderReview();
    showScreen("review-screen");
  }
}

function renderReview() {
  elements.reviewSubtitle.textContent = `${draft.yourName}さんと${draft.partnerName}さんの会話を振り返ろう。`;
  elements.reviewAnswers.replaceChildren();
  questions.forEach((question, index) => {
    const answer = draft.answers[index];
    const card = document.createElement("article");
    card.className = "review-answer";

    const number = document.createElement("span");
    number.className = "review-number";
    number.textContent = String(index + 1);

    const body = document.createElement("div");
    const questionText = document.createElement("p");
    questionText.className = "review-question";
    questionText.textContent = question.text;
    const choice = document.createElement("p");
    choice.className = "review-choice";
    choice.textContent = answer.choice === "その他" ? answer.otherText : answer.choice;
    body.append(questionText, choice);

    const edit = createButton("edit-answer", "編集");
    edit.type = "button";
    edit.dataset.action = "edit-answer";
    edit.dataset.index = String(index);
    card.append(number, body, edit);
    elements.reviewAnswers.append(card);
  });
  elements.insight.value = draft.insight || "";
  elements.nextAction.value = draft.nextAction || "";
  elements.nextTopic.value = draft.nextTopic || "";
}

function saveReflectionDraft() {
  draft.insight = elements.insight.value;
  draft.nextAction = elements.nextAction.value;
  draft.nextTopic = elements.nextTopic.value;
  saveDraft();
}

function saveRecord() {
  saveReflectionDraft();
  const records = loadRecords();
  const now = new Date();
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `record-${Date.now()}`,
    createdAt: now.toISOString(),
    dateLabel: formatDate(now),
    yourName: draft.yourName,
    partnerName: draft.partnerName,
    mood: draft.mood,
    answers: draft.answers.map((answer, index) => ({
      question: questions[index].text,
      choice: answer.choice,
      answer: answer.choice === "その他" ? answer.otherText : answer.choice,
      comment: answer.comment
    })),
    insight: draft.insight.trim(),
    nextAction: draft.nextAction.trim(),
    nextTopic: draft.nextTopic.trim()
  };
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  localStorage.removeItem(DRAFT_KEY);
  draft = blankDraft();
  renderHistory();
  showScreen("history-screen");
  showToast("わんおーわんの記録を保存しました 🐾");
}

function renderHistory(query = "") {
  const records = loadRecords();
  const keyword = query.trim().toLowerCase();
  const filtered = keyword
    ? records.filter((record) => JSON.stringify(record).toLowerCase().includes(keyword))
    : records;

  elements.historyList.replaceChildren();
  elements.historyEmpty.hidden = filtered.length > 0;
  if (!filtered.length && keyword) {
    elements.historyEmpty.querySelector("h3").textContent = "一致する記録がありません";
    elements.historyEmpty.querySelector("p").textContent = "別の言葉で検索してみてください。";
    elements.historyEmpty.querySelector("button").hidden = true;
  } else {
    elements.historyEmpty.querySelector("h3").textContent = "まだ記録がありません";
    elements.historyEmpty.querySelector("p").textContent = "最初のわんおーわんを始めてみよう。";
    elements.historyEmpty.querySelector("button").hidden = false;
  }

  filtered.forEach((record) => {
    const card = document.createElement("article");
    card.className = "history-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.action = "open-record";
    card.dataset.id = record.id;

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = record.dateLabel || formatDate(new Date(record.createdAt));
    const title = document.createElement("h3");
    title.textContent = `${record.yourName} × ${record.partnerName}`;
    const mood = document.createElement("p");
    mood.className = "history-mood";
    mood.textContent = `気分：${moodEmoji(record.mood)} ${record.mood}`;
    const preview = document.createElement("p");
    preview.className = "history-preview";
    preview.textContent = record.answers?.[2]?.answer || record.nextTopic || "今日の会話を記録しました。";
    const open = document.createElement("span");
    open.className = "history-open";
    open.textContent = "記録を見る →";
    card.append(date, title, mood, preview, open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRecord(record.id);
      }
    });
    elements.historyList.append(card);
  });
}

function openRecord(id) {
  const record = loadRecords().find((item) => item.id === id);
  if (!record) return;
  elements.detailContent.replaceChildren();

  const hero = document.createElement("div");
  hero.className = "detail-hero";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = record.dateLabel || formatDate(new Date(record.createdAt));
  const title = document.createElement("h2");
  title.id = "detail-title";
  title.textContent = `${record.yourName} × ${record.partnerName}`;
  const meta = document.createElement("p");
  meta.className = "detail-meta";
  meta.textContent = `その日の気分：${moodEmoji(record.mood)} ${record.mood}`;
  hero.append(eyebrow, title, meta);

  const list = document.createElement("div");
  list.className = "detail-list";
  (record.answers || []).forEach((answer) => {
    list.append(detailItem(answer.question, answer.answer));
  });

  const reflections = document.createElement("div");
  reflections.className = "detail-reflections";
  reflections.append(
    detailItem("気づいたこと", record.insight || "未記入"),
    detailItem("次にやること", record.nextAction || "未記入"),
    detailItem("次回話したいこと", record.nextTopic || "未記入")
  );

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const deleteButton = createButton("danger-button", "この記録を削除");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete-record";
  deleteButton.dataset.id = record.id;
  actions.append(deleteButton);

  elements.detailContent.append(hero, list, reflections, actions);
  showScreen("detail-screen");
}

function detailItem(heading, text) {
  const item = document.createElement("article");
  item.className = "detail-item";
  const h3 = document.createElement("h3");
  h3.textContent = heading;
  const p = document.createElement("p");
  p.textContent = text;
  item.append(h3, p);
  return item;
}

function askDelete(id) {
  recordToDelete = id;
  if (typeof elements.confirmDialog.showModal === "function") {
    elements.confirmDialog.showModal();
  } else if (window.confirm("この記録を削除しますか？")) {
    deleteRecord(id);
  }
}

function confirmDelete() {
  if (elements.confirmDialog.returnValue === "confirm" && recordToDelete) deleteRecord(recordToDelete);
  recordToDelete = null;
}

function deleteRecord(id) {
  const records = loadRecords().filter((record) => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  renderHistory(elements.historySearch.value);
  showScreen("history-screen");
  showToast("記録を削除しました");
}

function loadRecords() {
  return safeParse(localStorage.getItem(STORAGE_KEY), []);
}

function loadDraft() {
  const stored = safeParse(localStorage.getItem(DRAFT_KEY), null);
  if (!stored || !Array.isArray(stored.answers) || stored.answers.length !== questions.length) return blankDraft();
  return { ...blankDraft(), ...stored };
}

function saveDraft() {
  draft.updatedAt = new Date().toISOString();
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function moodEmoji(value) {
  return moods.find((mood) => mood.value === value)?.emoji || "🐾";
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function createButton(className, label) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = label;
  return button;
}

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 3000);
}
