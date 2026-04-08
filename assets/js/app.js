/* ===== NAVIGATION ===== */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  const tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');
  window.scrollTo(0, 0);
}

/* ===== DASHBOARD ===== */
function toggleTask(el) {
  const box = el.querySelector('.check-box');
  const txt = el.querySelector('.task-text');
  box.classList.toggle('checked');
  txt.classList.toggle('done');
}

function addQuickTask() {
  const input = document.getElementById('quick-input');
  const subjectEl = document.getElementById('quick-subject');
  const val = input.value.trim();
  if (!val) return;
  const subject = subjectEl ? subjectEl.value : 'Custom';
  const subjectColors = {
    'Chemistry': 'var(--pink)', 'Mathematics': 'var(--lavender)', 'English Lit': 'var(--mint)',
    'History': 'var(--sky)', 'Biology': 'var(--yellow)', 'Physics': 'var(--peach)'
  };
  const subjectTextColors = {
    'Chemistry': 'var(--pink-text)', 'Mathematics': 'var(--lav-text)', 'English Lit': 'var(--mint-text)',
    'History': 'var(--sky-text)', 'Biology': 'var(--yel-text)', 'Physics': 'var(--peach-text)'
  };
  const bgColor = subjectColors[subject] || 'var(--peach)';
  const txColor = subjectTextColors[subject] || 'var(--peach-text)';
  const container = document.getElementById('quick-tasks');
  const div = document.createElement('div');
  div.className = 'task-check';
  div.setAttribute('data-course', subject);
  div.onclick = function() { toggleTask(this); };
  div.innerHTML = `<div class="check-box"></div><div class="task-text">${val}</div><div class="task-course-tag" style="background:${bgColor};color:${txColor};font-size:11px;padding:2px 8px;border-radius:50px;font-weight:800;">${subject}</div>`;
  container.appendChild(div);
  input.value = '';
  div.style.animation = 'slideUp 0.3s ease';
  // re-apply current filter
  const activeDashFilter = document.querySelector('.dash-filter-chip.active');
  if (activeDashFilter) filterDashboard(activeDashFilter, activeDashFilter._filterVal || 'all');
}
document.getElementById('quick-input').addEventListener('keydown', e => { if (e.key === 'Enter') addQuickTask(); });

/* ===== TASK 4: COURSE → TO-DO NAVIGATION WITH FILTERING ===== */
const allTasks = [
  { name: 'Organic Chemistry Lab Report', course: 'Chemistry', platform: 'Google Classroom', priority: 'high', due: 'Due Today', dueColor: 'var(--pink)', dueTextColor: 'var(--pink-text)', status: 'ongoing' },
  { name: 'Trigonometry Problem Set — Ex 4.3 to 4.8', course: 'Mathematics', platform: 'Canvas', priority: 'medium', due: 'Apr 9', dueColor: 'var(--yellow)', dueTextColor: 'var(--yel-text)', status: 'ongoing' },
  { name: 'Shakespeare Essay — Hamlet themes, 1000 words', course: 'English Lit', platform: 'Canvas', priority: 'medium', due: 'Apr 10', dueColor: 'var(--yellow)', dueTextColor: 'var(--yel-text)', status: 'ongoing' },
  { name: 'World War II Timeline Diagram', course: 'History', platform: 'Google Classroom', priority: 'low', due: 'Apr 13', dueColor: 'var(--mint)', dueTextColor: 'var(--mint-text)', status: 'ongoing' },
  { name: 'Cell Division Labelled Diagram', course: 'Biology', platform: 'Google Classroom', priority: 'low', due: 'Apr 15', dueColor: 'var(--mint)', dueTextColor: 'var(--mint-text)', status: 'ongoing' },
  { name: 'Newton\'s Laws Problem Sheet', course: 'Physics', platform: 'Canvas', priority: 'medium', due: 'Apr 16', dueColor: 'var(--mint)', dueTextColor: 'var(--mint-text)', status: 'ongoing' },
  { name: 'Read History Chapter 12', course: 'History', platform: 'Personal', priority: 'low', due: 'Done ✓', dueColor: 'var(--bg2)', dueTextColor: 'var(--text-soft)', status: 'completed' },
  { name: 'Physics Chapter 6 Summary', course: 'Physics', platform: 'Personal', priority: 'low', due: 'Done ✓', dueColor: 'var(--bg2)', dueTextColor: 'var(--text-soft)', status: 'completed' },
];

const priorityColors = { high: 'var(--accent)', medium: 'var(--yellow2)', low: 'var(--mint2)' };
const courseColors = {
  'Chemistry': 'var(--accent)', 'Mathematics': 'var(--lavender2)', 'English Lit': 'var(--mint2)',
  'History': 'var(--sky2)', 'Biology': 'var(--yellow2)', 'Physics': 'var(--peach2)'
};

let currentCourseFilter = 'all';
let currentStatusFilter = 'all';

function renderTasks() {
  const list = document.getElementById('task-list');
  let tasks = allTasks;
  if (currentCourseFilter !== 'all') tasks = tasks.filter(t => t.course === currentCourseFilter);
  if (currentStatusFilter === 'ongoing') tasks = tasks.filter(t => t.status === 'ongoing');
  if (currentStatusFilter === 'completed') tasks = tasks.filter(t => t.status === 'completed');
  if (currentStatusFilter === 'missed') tasks = tasks.filter(t => t.status === 'missed');

  list.innerHTML = tasks.map(t => {
    const isDone = t.status === 'completed';
    return `<div class="assignment-row${isDone ? ' completed' : ''}">
      <div class="assignment-priority" style="background:${priorityColors[t.priority]};"></div>
      <div class="assignment-check${isDone ? ' done' : ''}" onclick="this.classList.toggle('done');this.closest('.assignment-row').classList.toggle('completed');"></div>
      <div class="assignment-info">
        <div class="assignment-name"${isDone ? ' style="text-decoration:line-through;"' : ''}>${t.name}</div>
        <div class="assignment-meta">${t.course} · ${t.platform} · ${t.priority.charAt(0).toUpperCase()+t.priority.slice(1)} Priority</div>
      </div>
      <div class="assignment-due" style="background:${t.dueColor};color:${t.dueTextColor};">${t.due}</div>
    </div>`;
  }).join('');
}

function openCourse(courseName) {
  currentCourseFilter = courseName;
  currentStatusFilter = 'all';
  showScreen('assignments');
  updateTodoHeader();
  renderTasks();
  // sync sidebar
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('sb-' + courseName);
  if (btn) btn.classList.add('active');
}

function filterStatus(btn, f) {
  document.querySelectorAll('.assignments-sidebar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentStatusFilter = f;
  renderTasks();
}

function filterCourse(btn, c) {
  document.querySelectorAll('.assignments-sidebar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCourseFilter = c;
  updateTodoHeader();
  renderTasks();
}

function updateTodoHeader() {
  const title = document.getElementById('todo-title');
  const chip = document.getElementById('active-course-chip');
  const chipLabel = document.getElementById('chip-label');
  const chipInner = document.getElementById('course-chip-inner');
  if (currentCourseFilter === 'all') {
    title.textContent = 'All Tasks';
    chip.style.display = 'none';
  } else {
    title.textContent = currentCourseFilter + ' Tasks';
    chip.style.display = 'block';
    chipLabel.textContent = currentCourseFilter;
    chipInner.style.background = courseColors[currentCourseFilter] || 'var(--pink)';
    chipInner.style.color = 'var(--text)';
  }
}

function clearCourseFilter() {
  currentCourseFilter = 'all';
  updateTodoHeader();
  renderTasks();
  document.querySelectorAll('.assignments-sidebar .filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.assignments-sidebar .filter-btn')[0].classList.add('active');
}

renderTasks();

/* ===== DASHBOARD SUBJECT FILTER ===== */
function filterDashboard(btn, subject) {
  btn._filterVal = subject;
  document.querySelectorAll('.dash-filter-chip').forEach(b => {
    b.style.opacity = '0.55';
    b.classList.remove('active');
  });
  btn.style.opacity = '1';
  btn.classList.add('active');

  document.querySelectorAll('.deadline-item[data-course]').forEach(item => {
    item.style.display = (subject === 'all' || item.dataset.course === subject) ? '' : 'none';
  });
  document.querySelectorAll('.task-check[data-course]').forEach(item => {
    item.style.display = (subject === 'all' || item.dataset.course === subject) ? '' : 'none';
  });
  document.querySelectorAll('#quick-tasks .task-check').forEach(item => {
    item.style.display = (subject === 'all' || item.dataset.course === subject) ? '' : 'none';
  });
}
// Init chip opacity
document.querySelectorAll('.dash-filter-chip').forEach((b, i) => {
  b._filterVal = b.getAttribute('onclick') ? (b.getAttribute('onclick').match(/'([^']+)'\)/) || [])[1] || 'all' : 'all';
  b.style.opacity = i === 0 ? '1' : '0.55';
});

/* ===== ADD COURSE MODAL ===== */
let selCourseEmoji = '🎯';
let selCourseColor = 'var(--pink)';

function openAddCourseModal() {
  document.getElementById('add-course-modal').classList.add('show');
}
function closeAddCourseModal(e, force) {
  if (force || (e && e.target === document.getElementById('add-course-modal'))) {
    document.getElementById('add-course-modal').classList.remove('show');
  }
}
function pickCourseEmoji(el, emoji) {
  selCourseEmoji = emoji;
  document.querySelectorAll('.nc-emoji-opt').forEach(e => {
    e.style.border = '2px solid transparent';
    e.style.background = 'var(--bg2)';
  });
  el.style.border = '2px solid var(--accent)';
  el.style.background = 'var(--accent-bg)';
}
function pickCourseColor(el) {
  selCourseColor = el.dataset.color;
  document.querySelectorAll('.nc-color-opt').forEach(e => e.style.border = '3px solid transparent');
  el.style.border = '3px solid var(--text)';
}
function addNewCourse() {
  const name = document.getElementById('nc-name').value.trim();
  const teacher = document.getElementById('nc-teacher').value.trim();
  const days = document.getElementById('nc-days').value.trim();
  if (!name) { document.getElementById('nc-name').style.borderColor = 'var(--accent2)'; return; }
  const grid = document.querySelector('.courses-grid');
  const card = document.createElement('div');
  card.className = 'folder-card';
  card.innerHTML = `
    <div class="folder-tab" style="background:${selCourseColor};"></div>
    <div class="folder-body" style="background:${selCourseColor};">
      <span class="folder-emoji">${selCourseEmoji}</span>
      <div class="folder-name">${name}</div>
      <div class="folder-sub">${teacher ? teacher + ' · ' : ''}${days || 'Days TBD'}</div>
      <div class="folder-stats">
        <span class="folder-stat">0 tasks</span>
        <span class="folder-stat">0 notes</span>
        <span class="folder-stat">0 links</span>
      </div>
    </div>`;
  card.onclick = () => openCourse(name);
  grid.insertBefore(card, grid.lastElementChild);
  document.getElementById('nc-name').value = '';
  document.getElementById('nc-teacher').value = '';
  document.getElementById('nc-days').value = '';
  closeAddCourseModal(null, true);
}

/* ===== CLASS DETAIL MODAL ===== */
const classReminderStore = {};
function openClassDetail(subject, icon, time, room, description, reminders, color) {
  document.getElementById('cd-icon').style.cssText = `width:50px;height:50px;border-radius:14px;background:${color};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;`;
  document.getElementById('cd-icon').textContent = icon;
  document.getElementById('cd-subject').textContent = subject;
  document.getElementById('cd-time').textContent = `${time} · ${room}`;
  document.getElementById('cd-description').textContent = description;

  const key = subject + '|' + time;
  const allReminders = [...(reminders || []), ...(classReminderStore[key] || [])];
  const remDiv = document.getElementById('cd-reminders');
  const remList = document.getElementById('cd-reminders-list');
  if (allReminders.length > 0) {
    remDiv.style.display = 'block';
    remList.innerHTML = allReminders.map(r => `
      <div style="display:flex;align-items:flex-start;gap:8px;background:var(--yellow);border-radius:10px;padding:8px 12px;">
        <span style="font-size:14px;">⚠️</span>
        <span style="font-size:12px;font-weight:700;color:var(--yel-text);">${r}</span>
      </div>`).join('');
  } else {
    remDiv.style.display = 'none';
  }
  // store context for add-reminder
  document.getElementById('class-detail-modal')._ctx = { subject, icon, time, room, description, reminders, color, key };
  document.getElementById('class-detail-modal').classList.add('show');
}
function closeClassModal(e, force) {
  if (force || (e && e.target === document.getElementById('class-detail-modal'))) {
    document.getElementById('class-detail-modal').classList.remove('show');
  }
}
function addClassReminder() {
  const ctx = document.getElementById('class-detail-modal')._ctx;
  const reminder = prompt(`Add a reminder for ${ctx.subject}:`);
  if (!reminder || !reminder.trim()) return;
  if (!classReminderStore[ctx.key]) classReminderStore[ctx.key] = [];
  classReminderStore[ctx.key].push(reminder.trim());
  openClassDetail(ctx.subject, ctx.icon, ctx.time, ctx.room, ctx.description, ctx.reminders, ctx.color);
}

/* ===== NEW SET MODAL (simple prompt) ===== */
function openNewSetModal() {
  const title = prompt('Name your new study set:');
  if (!title || !title.trim()) return;
  const emoji = prompt('Pick an emoji for it (e.g. 📚):') || '📚';
  studySets.push({
    id: studySets.length,
    title: title.trim(),
    emoji: emoji.trim(),
    color: 'var(--peach)',
    barColor: 'var(--peach2)',
    meta: '0 cards · New',
    progress: 0,
    cards: [{ q: 'Add your first question here', a: 'Add the answer here' }]
  });
  renderSetCards();
}

/* ===== TASK 1: STUDY SETS — FULL JS DATA + INTERACTIVE ===== */
const studySets = [
  {
    id: 0, title: 'Organic Chemistry', emoji: '🧪', color: 'var(--pink)', barColor: 'var(--accent)',
    meta: '24 cards · Last studied 2 days ago', progress: 72,
    cards: [
      { q: 'What is the functional group of an Alcohol?', a: '—OH (Hydroxyl group)' },
      { q: 'What is the functional group of a Carboxylic Acid?', a: '—COOH (Carboxyl group)' },
      { q: 'Name the product when an alcohol is oxidised.', a: 'Aldehyde or Ketone' },
      { q: 'What is an isomer?', a: 'Compounds with same molecular formula but different structures' },
      { q: 'Define a homologous series.', a: 'Series with same functional group, differing by CH₂' },
    ]
  },
  {
    id: 1, title: 'Trigonometry Formulas', emoji: '📐', color: 'var(--lavender)', barColor: 'var(--lavender2)',
    meta: '18 cards · Last studied today', progress: 50,
    cards: [
      { q: 'What is sin²θ + cos²θ equal to?', a: '1 (Pythagorean identity)' },
      { q: 'What is tan θ equal to?', a: 'sin θ / cos θ' },
      { q: 'State the double angle formula for sin.', a: 'sin 2θ = 2 sin θ cos θ' },
      { q: 'What is the cosine rule?', a: 'c² = a² + b² − 2ab cos C' },
    ]
  },
  {
    id: 2, title: 'Shakespeare Key Quotes', emoji: '📖', color: 'var(--mint)', barColor: 'var(--mint2)',
    meta: '30 cards · Last studied 1 day ago', progress: 85,
    cards: [
      { q: 'Who says "To be or not to be, that is the question"?', a: 'Hamlet, Act 3 Scene 1' },
      { q: 'What does "The lady doth protest too much" mean?', a: 'Insisting too strongly on something (said by Gertrude)' },
      { q: 'Who says "Frailty, thy name is woman"?', a: 'Hamlet, Act 1 Scene 2' },
    ]
  },
  {
    id: 3, title: 'WW2 Key Dates & Events', emoji: '🌍', color: 'var(--sky)', barColor: 'var(--sky2)',
    meta: '22 cards · Not started', progress: 10,
    cards: [
      { q: 'When did World War II begin?', a: '1 September 1939' },
      { q: 'What was Operation Barbarossa?', a: "Germany's invasion of the Soviet Union, June 1941" },
      { q: 'When did the US join WW2?', a: 'December 8, 1941 — after Pearl Harbor' },
    ]
  },
  {
    id: 4, title: 'Cell Biology Terms', emoji: '🔬', color: 'var(--yellow)', barColor: 'var(--yellow2)',
    meta: '35 cards · Last studied 3 days ago', progress: 60,
    cards: [
      { q: 'What is the function of the mitochondria?', a: 'Produces ATP (energy) via cellular respiration' },
      { q: 'What is osmosis?', a: 'Movement of water from high to low concentration across a semi-permeable membrane' },
      { q: 'Define meiosis.', a: 'Cell division producing 4 haploid daughter cells for sexual reproduction' },
    ]
  },
];

let activeSetId = 0;
let currentCardIndex = 0;
let knownCount = 0;
let reviewCount = 0;

function renderSetCards() {
  const grid = document.getElementById('studysets-grid');
  const flashcardVisible = document.getElementById('flashcard-section').style.display !== 'none';
  grid.innerHTML = studySets.map(s => `
    <div class="studyset-card${flashcardVisible && s.id === activeSetId ? ' active-set' : ''}" onclick="selectSet(${s.id})" title="Click to practise this set">
      ${flashcardVisible && s.id === activeSetId ? '<div class="active-badge">Practising</div>' : ''}
      <div class="studyset-icon" style="background:${s.color};">${s.emoji}</div>
      <div class="studyset-name">${s.title}</div>
      <div class="studyset-meta">${s.meta}</div>
      <div class="studyset-progress"><div class="studyset-bar" style="width:${s.progress}%;background:${s.barColor};"></div></div>
    </div>
  `).join('') + `
    <div class="studyset-card create-new" onclick="openNewSetModal()">
      <div style="font-size:28px;margin-bottom:8px;">＋</div>
      <div style="font-family:'Segoe Script','Comic Sans MS',cursive;font-size:16px;color:var(--text-soft);">Create new set</div>
    </div>
  `;
}

function selectSet(id) {
  const section = document.getElementById('flashcard-section');
  // Toggle off when clicking the already-active set.
  if (section.style.display === 'block' && activeSetId === id) {
    section.style.display = 'none';
    activeSetId = -1;
    renderSetCards();
    return;
  }

  activeSetId = id;
  currentCardIndex = 0;
  knownCount = 0; reviewCount = 0;
  document.getElementById('flashcard').classList.remove('flipped');
  renderSetCards();
  updateFlashcardPanel();
  // Reveal the flashcard section and scroll to it
  section.style.display = 'block';
  setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

function updateFlashcardPanel() {
  const set = studySets[activeSetId];
  const card = set.cards[currentCardIndex];
  document.getElementById('fc-emoji').textContent = set.emoji;
  document.getElementById('fc-title').textContent = set.title;
  document.getElementById('fc-meta').textContent = set.meta;
  document.getElementById('fc-question').textContent = card.q;
  document.getElementById('fc-answer').textContent = card.a;
  const total = set.cards.length;
  document.getElementById('fc-count').textContent = `Card ${currentCardIndex + 1} of ${total}`;
  document.getElementById('fc-fill').style.width = ((currentCardIndex + 1) / total * 100) + '%';
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  const set = studySets[activeSetId];
  document.getElementById('flashcard').classList.remove('flipped');
  currentCardIndex = (currentCardIndex + 1) % set.cards.length;
  updateFlashcardPanel();
}

function prevCard() {
  const set = studySets[activeSetId];
  document.getElementById('flashcard').classList.remove('flipped');
  currentCardIndex = (currentCardIndex - 1 + set.cards.length) % set.cards.length;
  updateFlashcardPanel();
}

function markKnow() {
  knownCount++;
  nextCard();
}

function markReview() {
  reviewCount++;
  nextCard();
}

renderSetCards();
// flashcard section starts hidden — will show when user clicks a set folder

/* ===== TASK 2: BOOKMARK MODAL ===== */
function openBmModal(title, course, type, url, note, color, icon) {
  document.getElementById('bm-m-icon').textContent = icon;
  document.getElementById('bm-m-icon').style.background = color;
  document.getElementById('bm-m-title').textContent = title;
  document.getElementById('bm-m-course').textContent = `${course} · ${type}`;
  document.getElementById('bm-m-note').textContent = note;
  document.getElementById('bm-modal-overlay').classList.add('show');
}
function closeBmModal(e, force) {
  if (force || (e && e.target === document.getElementById('bm-modal-overlay'))) {
    document.getElementById('bm-modal-overlay').classList.remove('show');
  }
}

/* ===== TASK 3: PROFILE ID CARD EDITOR ===== */
const avatarOptions = ['😊','🧑‍🎓','👩‍🎓','🦊','🐱','🐼','🦋','🌸','⭐','🎓'];
const colorOptions = [
  { grad: 'linear-gradient(135deg,#FFD6E0,#E8DFFF,#D0EEFF)', name: 'Dreamy' },
  { grad: 'linear-gradient(135deg,#FFE4CC,#FFD6E0)', name: 'Peach' },
  { grad: 'linear-gradient(135deg,#D0EEFF,#D0F5E8)', name: 'Sky Mint' },
  { grad: 'linear-gradient(135deg,#FFF5C2,#FFE4CC)', name: 'Sunny' },
  { grad: 'linear-gradient(135deg,#E8DFFF,#D0EEFF)', name: 'Lavender' },
  { grad: 'linear-gradient(135deg,#D0F5E8,#FFF5C2)', name: 'Mint' },
  { grad: 'linear-gradient(135deg,#FF7BAC,#C9B8F5)', name: 'Bright' },
  { grad: 'linear-gradient(135deg,#1A1A2E,#2D1B4E)', name: 'Night' },
];
const logoOptions = [
  { text: '★ StudyOS ★', badge: 'Your Learning OS', font: 'Fredoka One' },
  { text: '⚡ Academic Slayer', badge: 'Top Student Energy', font: 'Fredoka One' },
  { text: '📚 Bookworm Club', badge: 'Always Reading', font: 'Fredoka One' },
  { text: '✦ Study Squad', badge: 'Struggling Together', font: 'Fredoka One' },
];

let selAvatar = 0, selColor = 0, selLogo = 0;

function buildProfileEditor() {
  // Avatar grid
  const ag = document.getElementById('avatar-grid');
  ag.innerHTML = avatarOptions.map((a, i) => `
    <div class="av-option${i === selAvatar ? ' selected' : ''}" onclick="pickAvatar(${i})">${a}</div>
  `).join('');

  // Colors
  const cs = document.getElementById('color-swatches');
  cs.innerHTML = colorOptions.map((c, i) => `
    <div class="color-swatch${i === selColor ? ' selected' : ''}" title="${c.name}"
      style="background:${c.grad};" onclick="pickColor(${i})"></div>
  `).join('');

  // Logo/badge
  const lg = document.getElementById('logo-grid');
  lg.innerHTML = logoOptions.map((l, i) => `
    <div class="logo-option${i === selLogo ? ' selected' : ''}" onclick="pickLogo(${i})">
      <div class="logo-title" style="font-family:'${l.font}',cursive;">${l.text}</div>
      <div class="logo-sub">${l.badge}</div>
    </div>
  `).join('');
}

function pickAvatar(i) {
  selAvatar = i;
  document.getElementById('id-portrait-el').textContent = avatarOptions[i];
  buildProfileEditor();
}

function pickColor(i) {
  selColor = i;
  document.getElementById('id-card-el').style.background = colorOptions[i].grad;
  buildProfileEditor();
}

function pickLogo(i) {
  selLogo = i;
  document.getElementById('id-logo-el').textContent = logoOptions[i].text;
  document.getElementById('id-badge-el').textContent = logoOptions[i].badge;
  buildProfileEditor();
}

function updateCard() {
  document.getElementById('id-name-el').textContent = document.getElementById('inp-name').value || 'Your Name';
  document.getElementById('id-bday-el').textContent = document.getElementById('inp-bday').value || '—';
  document.getElementById('id-school-el').textContent = document.getElementById('inp-school').value || '—';
  document.getElementById('id-year-el').textContent = document.getElementById('inp-year').value || '—';
}

buildProfileEditor();
