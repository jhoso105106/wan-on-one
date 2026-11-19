(() => {
  'use strict';

  const STORAGE_KEY = 'wan-on-one-records-v1';
  const DRAFT_KEY = 'wan-on-one-draft-v1';

  const questions = [
    { text: '最近よかったことは？', expression: 'happy', hint: '小さなことでも大丈夫。うれしかったことを思い出してみよう。' },
    { text: '最近ちょっと困っていることは？', expression: 'thinking', hint: 'まとまっていなくても大丈夫。気になっていることを書いてみよう。' },
    { text: '今、一番話したいことは？', expression: 'normal', hint: '今日の時間で、特に話しておきたいことは何だろう？' },
    { text: '相手に聞いてみたいことは？', expression: 'thinking', hint: '相手の考えや経験を知りたいことを書いてみよう。' },
    { text: '何かサポートしてほしいことは？', expression: 'cheer', hint: '具体的なお願いでも、ただ聞いてほしいことでも大丈夫。' },
    { text: '次の1on1までにやってみたいことは？', expression: 'cheer', hint: '無理のない、小さな一歩を決めてみよう。' }
  ];

  const moods = [
    { id: 'great', emoji: '😄', label: 'とてもいい', reaction: 'いい感じだワン！何かいいことあった？', expression: 'happy' },
    { id: 'good', emoji: '🙂', label: 'いい感じ', reaction: 'いいね！その調子で、今日も気軽に話そう🐾', expression: 'happy' },
    { id: 'neutral', emoji: '😐', label: 'ふつう', reaction: '教えてくれてありがとう。ゆっくり言葉にしていこう。', expression: 'normal' },
    { id: 'low', emoji: '😟', label: 'ちょっと疲れた', reaction: 'おつかれさま。今日はゆっくり話そうね🐾', expression: 'tired' },
    { id: 'tired', emoji: '😵', label: '疲れている', reaction: '来てくれただけでも十分だワン。無理せず、話せることからで大丈夫。', expression: 'tired' }
  ];

  const sampleRecord = {
    id: 'sample-wan-on-one',
    date: '2026-11-12T10:00:00.000Z',
    personA: '佐藤さん',
    personB: '田中さん',
    mood: 'good',
    answers: [
      'チームで準備していた資料を予定より早く完成できたこと。',
      '複数の依頼が重なり、優先順位に少し迷っている。',
      '来月のプロジェクトで担当する役割について相談したい。',
      'どのタスクを優先するとチーム全体が進めやすいか聞いてみたい。',
      '週の途中で一度、進捗を確認してもらえると安心。',
      '優先順位を整理して、最初のタスクに着手する。'
    ],
    reflection: {
      insight: '抱えている仕事を見える化して、早めに相談することが大切。',
      nextAction: '優先順位を整理して、最初のタスクに着手する。',
      nextTopic: '新しい担当業務の進め方と、必要なサポートについて。'
    },
    sample: true
  };

  const initialDraft = {
    personA: '', personB: '', mood: '', answers: Array(6).fill(''), questionIndex: 0,
    reflection: { insight: '', nextAction: '', nextTopic: '' }
  };

  let state = {
    screen: 'home',
    draft: loadDraft(),
    records: loadRecords(),
    activeRecordId: null
  };

  const main = document.getElementById('main');
  const modalRoot = document.getElementById('modalRoot');
  const homeButton = document.getElementById('homeButton');
  const historyButton = document.getElementById('historyButton');

  function loadRecords() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (error) {
      console.warn('履歴を読み込めませんでした。', error);
    }
    return [sampleRecord];
  }

  function loadDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (saved && Array.isArray(saved.answers)) {
        return {
          ...initialDraft,
          ...saved,
          answers: questions.map((_, index) => saved.answers[index] || ''),
          reflection: { ...initialDraft.reflection, ...(saved.reflection || {}) }
        };
      }
    } catch (error) {
      console.warn('下書きを読み込めませんでした。', error);
    }
    return structuredCloneSafe(initialDraft);
  }

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function persistDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state.draft));
  }

  function persistRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' })[char]);
  }

  function dogMarkup(expression = 'normal') {
    return `<div class="dog ${escapeHTML(expression)}" role="img" aria-label="${dogLabel(expression)}表情のワンちゃん">
      <span class="dog-ear left"></span><span class="dog-ear right"></span>
      <span class="dog-head"><span class="dog-eye left"></span><span class="dog-eye right"></span><span class="dog-cheek left"></span><span class="dog-cheek right"></span><span class="dog-muzzle"></span><span class="dog-nose"></span><span class="dog-mouth"></span></span>
      <span class="dog-collar"></span><span class="dog-tag"></span>
    </div>`;
  }

  function dogLabel(expression) {
    return ({ happy:'うれしい', cheer:'応援している', thinking:'考えている', tired:'おつかれさまの', normal:'やさしい' })[expression] || 'やさしい';
  }

  function flowSteps(active) {
    const screens = ['names','mood','session','review'];
    const current = screens.indexOf(active);
    return `<div class="flow-steps" aria-label="1on1の進捗">${screens.map((_, i) => `<span class="flow-step ${i === current ? 'active' : i < current ? 'done' : ''}"></span>`).join('')}</div>`;
  }

  function navigate(screen) {
    state.screen = screen;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => main.focus({ preventScroll: true }), 30);
  }

  function render() {
    modalRoot.innerHTML = '';
    const views = { home: renderHome, names: renderNames, mood: renderMood, session: renderSession, review: renderReview, history: renderHistory };
    main.innerHTML = (views[state.screen] || renderHome)();
    bindScreenEvents();
  }

  function renderHome() {
    const hasDraft = state.draft.personA || state.draft.personB || state.draft.answers.some(Boolean);
    return `<section class="hero" aria-labelledby="hero-title">
      <div class="hero-content">
        <p class="eyebrow"><span>🐾</span> ワンちゃんが進める1on1</p>
        <h1 id="hero-title"><span class="paw-title">🐾</span>わんおーわん</h1>
        <p class="hero-copy">話そう。聞こう。<br>わんこと一緒に。</p>
        <p class="hero-subcopy">堅苦しい面談じゃなくて、ほっとできる対話の時間を。ワンちゃんが一問ずつ、ふたりの会話をやさしくガイドします。</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-large" id="startButton" type="button">🐶 ${hasDraft ? '1on1をつづける' : '1on1をはじめる'} <span aria-hidden="true">→</span></button>
          <button class="btn btn-secondary btn-large" id="homeHistoryButton" type="button">◷ これまでの記録</button>
        </div>
      </div>
      <div class="hero-visual" aria-label="向かい合う二人と、その間で会話を手伝うワンちゃんのイラスト">
        <div class="scene-card">
          <span class="window"></span><span class="plant">🪴</span><span class="floor-line"></span>
          <div class="people-scene">
            <div class="person person-left"><span class="hair"></span><span class="head"></span><span class="face">••</span><span class="body"></span><span class="arm"></span><span class="leg"></span></div>
            <div class="person person-right"><span class="hair"></span><span class="head"></span><span class="face">••</span><span class="body"></span><span class="arm"></span><span class="leg"></span></div>
          </div>
          <span class="mini-table"></span><div class="hero-dog-wrap">${dogMarkup('happy')}</div>
          <div class="float-note">今日は何から話す？<br>ぼくが一緒に考えるワン。</div>
        </div>
      </div>
    </section>`;
  }

  function renderNames() {
    return `<section class="screen">
      ${flowSteps('names')}
      <div class="page-heading"><span class="kicker">Step 1</span><h1>まずは、ふたりのことを教えてね</h1><p>名前を入れたら、今日のわんおーわんを始めましょう。</p></div>
      <div class="conversation-layout">
        <aside class="guide-pane">${dogMarkup('normal')}<div class="guide-label">YOUR FACILITATOR</div></aside>
        <form class="form-card" id="namesForm">
          <div class="speech">こんにちは！<br>今日もわんおーわんを始めよう！</div>
          <div class="form-grid">
            <div class="field"><label for="personA">あなたの名前</label><input class="input" id="personA" name="personA" type="text" placeholder="例：佐藤さん" autocomplete="name" maxlength="40" required value="${escapeHTML(state.draft.personA)}" /></div>
            <div class="field"><label for="personB">お話しする相手の名前</label><input class="input" id="personB" name="personB" type="text" placeholder="例：田中さん" maxlength="40" required value="${escapeHTML(state.draft.personB)}" /></div>
          </div>
          <div class="form-actions"><button class="btn btn-primary btn-large" type="submit">はじめる <span aria-hidden="true">→</span></button></div>
        </form>
      </div>
    </section>`;
  }

  function renderMood() {
    const selected = moods.find(m => m.id === state.draft.mood);
    return `<section class="screen">
      ${flowSteps('mood')}
      <div class="page-heading"><span class="kicker">Step 2</span><h1>今の気分は、どれに近い？</h1><p>まずは自分の状態をそっと確認。正解はないので、いちばん近いものを選んでください。</p></div>
      <div class="form-card" style="max-width:920px;margin:0 auto">
        <div class="mood-grid" role="radiogroup" aria-label="現在の気分">
          ${moods.map(m => `<button class="mood-option ${m.id === state.draft.mood ? 'selected' : ''}" type="button" role="radio" aria-checked="${m.id === state.draft.mood}" data-mood="${m.id}"><span class="mood-emoji">${m.emoji}</span><span class="mood-label">${m.label}</span></button>`).join('')}
        </div>
        <div class="mood-reaction ${selected ? '' : 'placeholder'}" id="moodReaction"><span style="font-size:25px">🐶</span><span>${selected ? escapeHTML(selected.reaction) : '気分を選ぶと、ワンちゃんからメッセージが届くよ。'}</span></div>
        <div class="question-actions"><button class="btn btn-ghost" id="backToNames" type="button">← 名前入力へ</button><button class="btn btn-primary" id="startQuestions" type="button" ${selected ? '' : 'disabled'}>質問へ進む →</button></div>
      </div>
    </section>`;
  }

  function renderSession() {
    const index = Math.min(Math.max(state.draft.questionIndex, 0), questions.length - 1);
    const q = questions[index];
    const progress = ((index + 1) / questions.length) * 100;
    return `<section class="screen">
      ${flowSteps('session')}
      <div class="session-top">
        <div class="session-meta"><span class="people-pill">👤 ${escapeHTML(state.draft.personA)} <span aria-hidden="true">×</span> ${escapeHTML(state.draft.personB)}</span><strong>${index + 1} / ${questions.length}</strong></div>
        <div class="progress-track" role="progressbar" aria-label="質問の進捗" aria-valuemin="1" aria-valuemax="6" aria-valuenow="${index + 1}"><div class="progress-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="question-layout">
        <div class="question-card">
          <div class="question-dog-row">${dogMarkup(q.expression)}<div class="question-bubble"><div class="question-number">QUESTION ${String(index + 1).padStart(2,'0')}</div><h1>${q.text}</h1></div></div>
          <label class="answer-label" for="answer"><span>ふたりで話したことをメモ</span><span class="autosave">✓ 入力内容は自動保存</span></label>
          <textarea class="textarea" id="answer" maxlength="1200" placeholder="${escapeHTML(q.hint)}">${escapeHTML(state.draft.answers[index])}</textarea>
          <div class="question-actions">
            <button class="btn btn-ghost" id="previousQuestion" type="button">← 前へ</button>
            <button class="btn btn-primary" id="nextQuestion" type="button">${index === questions.length - 1 ? '振り返る 🐾' : '次へ →'}</button>
          </div>
        </div>
      </div>
    </section>`;
  }

  function buildTalkingSummary() {
    const filled = state.draft.answers.slice(0, 3).filter(value => value.trim());
    return filled.length ? filled.map(value => `・${value.trim()}`).join('\n') : 'まだメモはありません。';
  }

  function prepareReflection() {
    if (!state.draft.reflection.insight) state.draft.reflection.insight = state.draft.answers[3] || '';
    if (!state.draft.reflection.nextAction) state.draft.reflection.nextAction = state.draft.answers[5] || '';
    if (!state.draft.reflection.nextTopic) state.draft.reflection.nextTopic = state.draft.answers[4] || '';
    persistDraft();
  }

  function renderReview() {
    prepareReflection();
    return `<section class="screen">
      ${flowSteps('review')}
      <div class="page-heading"><span class="kicker">Reflection</span><h1>今日のわんおーわん</h1><p>${escapeHTML(state.draft.personA)}さんと${escapeHTML(state.draft.personB)}さんの会話を、次につながる形で残しましょう。</p></div>
      <div class="review-layout">
        <div class="review-dog">${dogMarkup('happy')}<div class="review-message">今日もいっぱい話せたね！<br>大事なことを、いっしょに振り返ろう🐾</div></div>
        <div class="summary-grid">
          <article class="summary-card"><div class="summary-icon">💬</div><h2>今日話したこと</h2><p>${escapeHTML(buildTalkingSummary())}</p></article>
          <article class="summary-card"><div class="summary-icon">💡</div><h2>気づいたこと</h2><textarea class="textarea reflection-input" data-field="insight" placeholder="会話を通じて気づいたこと">${escapeHTML(state.draft.reflection.insight)}</textarea></article>
          <article class="summary-card"><div class="summary-icon">✓</div><h2>次にやること</h2><textarea class="textarea reflection-input" data-field="nextAction" placeholder="次の1on1までの小さな一歩">${escapeHTML(state.draft.reflection.nextAction)}</textarea></article>
          <article class="summary-card"><div class="summary-icon">📅</div><h2>次回話したいこと</h2><textarea class="textarea reflection-input" data-field="nextTopic" placeholder="次の1on1で話したいテーマ">${escapeHTML(state.draft.reflection.nextTopic)}</textarea></article>
        </div>
        <div class="review-actions"><button class="btn btn-ghost" id="backToQuestions" type="button">← 質問に戻る</button><button class="btn btn-primary btn-large" id="saveSession" type="button">🐾 記録を保存する</button></div>
      </div>
    </section>`;
  }

  function renderHistory() {
    const records = [...state.records].sort((a,b) => new Date(b.date) - new Date(a.date));
    return `<section class="screen">
      <div class="page-heading"><span class="kicker">History</span><h1>これまでのわんおーわん</h1><p>ふたりで積み重ねた会話を、いつでも振り返れます。</p></div>
      <div class="history-toolbar"><span class="history-count">${records.length}件の記録</span><button class="btn btn-primary" id="newSessionButton" type="button">＋ 新しい1on1</button></div>
      ${records.length ? `<div class="history-list">${records.map(historyCardMarkup).join('')}</div>` : `<div class="empty-card">${dogMarkup('thinking')}<h2>まだ記録がありません</h2><p>最初のわんおーわんを始めて、<br>大切な会話を残してみましょう。</p><button class="btn btn-primary" id="emptyStartButton" type="button">1on1をはじめる</button></div>`}
    </section>`;
  }

  function historyCardMarkup(record) {
    const date = new Date(record.date);
    const mood = moods.find(m => m.id === record.mood) || moods[2];
    const theme = record.answers?.[2] || record.answers?.find(Boolean) || '話した内容のメモはありません';
    return `<button type="button" class="history-card" data-record-id="${escapeHTML(record.id)}">
      <span class="history-date">${date.toLocaleDateString('ja-JP',{year:'numeric',month:'short'})}<strong>${date.getDate()}日</strong></span>
      <span><span class="history-names">${escapeHTML(record.personA)} <span aria-hidden="true">×</span> ${escapeHTML(record.personB)}</span><span class="history-theme">${escapeHTML(theme)}</span></span>
      <span class="history-mood">${mood.emoji} ${mood.label}</span>
    </button>`;
  }

  function bindScreenEvents() {
    const on = (selector, event, handler) => document.querySelector(selector)?.addEventListener(event, handler);

    on('#startButton', 'click', () => {
      const hasNames = state.draft.personA && state.draft.personB;
      navigate(hasNames ? (state.draft.mood ? 'session' : 'mood') : 'names');
    });
    on('#homeHistoryButton', 'click', () => navigate('history'));
    on('#namesForm', 'submit', event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      state.draft.personA = String(form.get('personA') || '').trim();
      state.draft.personB = String(form.get('personB') || '').trim();
      if (!state.draft.personA || !state.draft.personB) return;
      persistDraft();
      navigate('mood');
    });

    document.querySelectorAll('.mood-option').forEach(button => button.addEventListener('click', () => {
      state.draft.mood = button.dataset.mood;
      persistDraft();
      render();
      document.querySelector(`[data-mood="${button.dataset.mood}"]`)?.focus();
    }));
    on('#backToNames', 'click', () => navigate('names'));
    on('#startQuestions', 'click', () => navigate('session'));

    const answer = document.querySelector('#answer');
    if (answer) {
      answer.addEventListener('input', event => {
        state.draft.answers[state.draft.questionIndex] = event.target.value;
        persistDraft();
      });
      answer.focus({ preventScroll:true });
    }
    on('#previousQuestion', 'click', () => {
      if (state.draft.questionIndex === 0) return navigate('mood');
      state.draft.questionIndex -= 1;
      persistDraft();
      render();
    });
    on('#nextQuestion', 'click', () => {
      if (state.draft.questionIndex < questions.length - 1) {
        state.draft.questionIndex += 1;
        persistDraft();
        render();
      } else navigate('review');
    });

    document.querySelectorAll('.reflection-input').forEach(input => input.addEventListener('input', event => {
      state.draft.reflection[event.target.dataset.field] = event.target.value;
      persistDraft();
    }));
    on('#backToQuestions', 'click', () => { state.draft.questionIndex = questions.length - 1; persistDraft(); navigate('session'); });
    on('#saveSession', 'click', saveSession);
    on('#newSessionButton', 'click', startFreshSession);
    on('#emptyStartButton', 'click', startFreshSession);
    document.querySelectorAll('.history-card').forEach(card => card.addEventListener('click', () => openRecord(card.dataset.recordId)));
  }

  function saveSession() {
    const record = {
      id: `wan-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: new Date().toISOString(),
      personA: state.draft.personA,
      personB: state.draft.personB,
      mood: state.draft.mood,
      answers: [...state.draft.answers],
      reflection: { ...state.draft.reflection }
    };
    state.records = [record, ...state.records];
    persistRecords();
    localStorage.removeItem(DRAFT_KEY);
    state.draft = structuredCloneSafe(initialDraft);
    showToast('今日のわんおーわんを保存しました 🐾');
    openSavedModal(record);
  }

  function startFreshSession() {
    const hasDraft = state.draft.personA || state.draft.personB || state.draft.answers.some(Boolean);
    if (!hasDraft) return navigate('names');
    openConfirm('新しい1on1を始めますか？', '入力途中の内容は消去されます。保存した過去の記録は残ります。', () => {
      state.draft = structuredCloneSafe(initialDraft);
      localStorage.removeItem(DRAFT_KEY);
      closeModal();
      navigate('names');
    });
  }

  function openSavedModal(record) {
    modalRoot.innerHTML = `<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="saved-title">
      <div class="modal"><div class="confirm-box">${dogMarkup('happy')}<h2 id="saved-title">今日もいっぱい話せたね！</h2><p>また次のわんおーわんで会おう🐾<br>${escapeHTML(record.personA)}さんと${escapeHTML(record.personB)}さんの記録を保存しました。</p><button class="btn btn-primary btn-large" id="goHistory" type="button">記録を見る</button></div></div>
    </div>`;
    document.getElementById('goHistory').addEventListener('click', () => { closeModal(); navigate('history'); });
    trapModalFocus();
  }

  function openRecord(id) {
    const record = state.records.find(item => item.id === id);
    if (!record) return;
    const mood = moods.find(m => m.id === record.mood) || moods[2];
    const date = new Date(record.date).toLocaleDateString('ja-JP', {year:'numeric',month:'long',day:'numeric',weekday:'short'});
    modalRoot.innerHTML = `<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div class="modal">
        <div class="modal-header"><div><h2 id="detail-title">${escapeHTML(record.personA)} × ${escapeHTML(record.personB)}</h2><p>${date}${record.sample ? '・サンプル記録' : ''}</p></div><button class="icon-button" id="closeModal" type="button" aria-label="閉じる">×</button></div>
        <div class="detail-hero"><span class="emoji">${mood.emoji}</span><span><strong>その日の気分：${mood.label}</strong><br><small>${escapeHTML(mood.reaction)}</small></span></div>
        ${(record.answers || []).map((answer, i) => `<section class="detail-section"><h3>${i + 1}. ${questions[i]?.text || '話したこと'}</h3><p>${escapeHTML(answer || '—')}</p></section>`).join('')}
        <section class="detail-section"><h3>💡 気づいたこと</h3><p>${escapeHTML(record.reflection?.insight || '—')}</p></section>
        <section class="detail-section"><h3>✓ 次にやること</h3><p>${escapeHTML(record.reflection?.nextAction || '—')}</p></section>
        <section class="detail-section"><h3>📅 次回話したいこと</h3><p>${escapeHTML(record.reflection?.nextTopic || '—')}</p></section>
        <div class="modal-actions"><button class="btn btn-danger" id="deleteRecord" type="button">この記録を削除</button><button class="btn btn-secondary" id="closeModalBottom" type="button">閉じる</button></div>
      </div>
    </div>`;
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('closeModalBottom').addEventListener('click', closeModal);
    document.getElementById('deleteRecord').addEventListener('click', () => {
      closeModal();
      openConfirm('この記録を削除しますか？', `${record.personA}さんと${record.personB}さんの記録は、削除すると元に戻せません。`, () => {
        state.records = state.records.filter(item => item.id !== id);
        persistRecords();
        closeModal();
        showToast('記録を削除しました');
        render();
      });
    });
    bindBackdropClose();
    trapModalFocus();
  }

  function openConfirm(title, message, onConfirm) {
    modalRoot.innerHTML = `<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div class="modal" style="max-width:520px"><div class="confirm-box"><div class="big-icon">🐾</div><h2 id="confirm-title">${escapeHTML(title)}</h2><p>${escapeHTML(message)}</p><div class="review-actions"><button class="btn btn-ghost" id="cancelConfirm" type="button">キャンセル</button><button class="btn btn-primary" id="acceptConfirm" type="button">続ける</button></div></div></div></div>`;
    document.getElementById('cancelConfirm').addEventListener('click', closeModal);
    document.getElementById('acceptConfirm').addEventListener('click', onConfirm);
    bindBackdropClose();
    trapModalFocus();
  }

  function bindBackdropClose() {
    document.querySelector('.modal-backdrop')?.addEventListener('click', event => {
      if (event.target.classList.contains('modal-backdrop')) closeModal();
    });
  }

  function trapModalFocus() {
    const modal = document.querySelector('.modal');
    const focusable = modal?.querySelector('button, input, textarea');
    setTimeout(() => focusable?.focus(), 20);
  }

  function closeModal() { modalRoot.innerHTML = ''; }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  homeButton.addEventListener('click', () => navigate('home'));
  historyButton.addEventListener('click', () => navigate('history'));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modalRoot.innerHTML) closeModal(); });

  render();
})();
