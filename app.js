// ── State ─────────────────────────────────────────────────────────────────────
let selectedWeekIdx = 0; // 0-based index into WEEKS
let sessionModalDay = null;
let exerciseModalId = null;

const DAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTH_NAMES = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

function fmt(date) {
  return `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}
function fmtShort(date) {
  return `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}`;
}

function isToday(date) {
  const t = new Date();
  return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
}

function getCurrentWeekIdx() {
  const today = new Date();
  today.setHours(0,0,0,0);
  if (today < PLAN_START) return 0;
  for (let i = WEEKS.length - 1; i >= 0; i--) {
    if (today >= WEEKS[i].startDate) return i;
  }
  return WEEKS.length - 1;
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  selectedWeekIdx = getCurrentWeekIdx();
  renderSidebar();
  renderCalendar();
  setupOverlayClose();
});

// ── Sidebar ───────────────────────────────────────────────────────────────────
function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const currentIdx = getCurrentWeekIdx();

  // Group weeks by phase
  const groups = [];
  let lastPhaseId = null;
  WEEKS.forEach((week, idx) => {
    if (week.phase.id !== lastPhaseId) {
      groups.push({ phase: week.phase, weeks: [] });
      lastPhaseId = week.phase.id;
    }
    groups[groups.length - 1].weeks.push({ week, idx });
  });

  sidebar.innerHTML = groups.map(group => `
    <div class="phase-group">
      <div class="phase-group-header">
        <span class="phase-dot" style="background:${group.phase.color}"></span>
        ${group.phase.name}
      </div>
      ${group.weeks.map(({ week, idx }) => `
        <div class="week-item ${idx === selectedWeekIdx ? 'active' : ''} ${idx === currentIdx ? 'current-week' : ''}"
             style="${idx === selectedWeekIdx ? `border-left-color:${week.phase.color}` : ''}"
             onclick="selectWeek(${idx})">
          <span class="current-dot"></span>
          Woche ${week.weekNum}
          ${week.isDeload ? '<span class="deload-badge">Deload</span>' : ''}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function selectWeek(idx) {
  selectedWeekIdx = idx;
  renderSidebar();
  renderCalendar();
}

// ── Calendar ──────────────────────────────────────────────────────────────────
function renderCalendar() {
  const week = WEEKS[selectedWeekIdx];
  const area = document.getElementById('calendarArea');

  // Update header chip
  const chip = document.getElementById('phaseChip');
  chip.textContent = `Phase ${week.phase.id} – ${week.phase.name}`;
  chip.style.background = week.phase.color;

  area.innerHTML = `
    <div class="week-headline">
      <div>
        <h2>Woche ${week.weekNum}${week.isDeload ? ' – Deload' : ''}</h2>
        <div class="range">${fmtShort(week.startDate)} – ${fmt(week.endDate)}</div>
        <div class="goal-text">${week.phase.goal}</div>
        <div class="week-tags">
          <span class="week-tag">Intensität: ${week.phase.intensity}</span>
          <span class="week-tag">Volumen: ${week.phase.volume}</span>
          ${week.isDeload ? '<span class="week-tag warning">Deload-Woche</span>' : ''}
        </div>
        <div class="goal-text" style="margin-top:6px;font-size:11px;">${getPhaseNote(week.weekNum)}</div>
      </div>
    </div>
    <div class="day-grid">
      ${week.days.map((day, j) => renderDayCard(day, j, week.phase.color)).join('')}
    </div>
  `;
}

function renderDayCard(day, dayIdx, phaseColor) {
  const isRest = day.type === 'rest';
  const isClickable = !isRest || day.notes;
  const todayClass = isToday(day.date) ? 'today-card' : '';
  const restClass = isRest && !day.notes ? 'rest-card' : '';
  const clickableClass = isClickable ? 'clickable' : '';
  const onclick = isClickable ? `onclick="openSession(${WEEKS.indexOf(WEEKS[selectedWeekIdx])}, ${dayIdx})"` : '';

  const tags = day.components.map(id => {
    const ex = EXERCISES[id];
    return ex ? `<span class="ex-tag">${ex.label}</span>` : '';
  }).join('');

  return `
    <div class="day-card ${todayClass} ${restClass} ${clickableClass}"
         style="--phase-color:${phaseColor}"
         ${onclick}>
      <div class="phase-bar" style="background:${isRest ? 'var(--border)' : phaseColor}"></div>
      ${day.locked ? '<span class="lock-icon">🔒</span>' : ''}
      <div class="day-label">${DAY_NAMES[dayIdx]}</div>
      <div class="day-date">${day.date.getDate()}</div>
      <div class="session-title">${day.title}</div>
      ${day.location ? `<div class="session-location">${day.location}</div>` : ''}
      ${tags ? `<div class="tag-row">${tags}</div>` : ''}
      ${day.type === 'optional' ? '<div class="optional-badge">optional</div>' : ''}
    </div>
  `;
}

// ── Session modal ─────────────────────────────────────────────────────────────
function openSession(weekIdx, dayIdx) {
  const week = WEEKS[weekIdx];
  const day = week.days[dayIdx];
  sessionModalDay = { week, day, weekIdx, dayIdx };

  const modal = document.getElementById('sessionModal');
  const content = document.getElementById('sessionModalContent');

  content.innerHTML = `
    <div class="modal-phase-bar" style="background:${week.phase.color}"></div>
    <button class="modal-close" onclick="closeSession()">✕</button>
    <div class="modal-title">${day.title}</div>
    <div class="modal-subtitle">
      Woche ${week.weekNum} · ${DAY_NAMES[dayIdx]}, ${fmt(day.date)}
      ${day.location ? ` · ${day.location}` : ''}
      ${day.locked ? ' · 🔒 Fixiert' : ''}
      ${day.type === 'optional' ? ' · optional' : ''}
    </div>
    ${day.notes ? `<div class="modal-notes">${day.notes}</div>` : ''}
    ${day.components.length === 0 && !day.notes ? '<div class="modal-notes">Ruhe &amp; Erholung.</div>' : ''}
    ${day.components.map(id => renderComponentBlock(id)).join('')}
  `;

  modal.classList.remove('hidden');
}

function renderComponentBlock(exerciseId) {
  const ex = EXERCISES[exerciseId];
  if (!ex) return '';
  return `
    <div class="component-block" onclick="openExercise('${exerciseId}')">
      <div class="component-block-left">
        <div class="component-label">${ex.emoji} ${ex.label}</div>
        <div class="component-name">${ex.name}</div>
        <div class="component-meta">${ex.category} · ${ex.duration}</div>
      </div>
      <div class="chevron">›</div>
    </div>
  `;
}

function closeSession() {
  document.getElementById('sessionModal').classList.add('hidden');
}

// ── Exercise detail modal ─────────────────────────────────────────────────────
function openExercise(exerciseId) {
  exerciseModalId = exerciseId;
  const ex = EXERCISES[exerciseId];
  if (!ex) return;

  const modal = document.getElementById('exerciseModal');
  const content = document.getElementById('exerciseModalContent');

  content.innerHTML = `
    <button class="modal-close" onclick="closeExercise()">✕</button>
    <button class="back-btn" onclick="closeExercise(); document.getElementById('sessionModal').classList.remove('hidden')">
      ← Zurück zur Session
    </button>
    <h2 class="modal-title">${ex.emoji} ${ex.name}</h2>
    <div class="ex-category">${ex.category} · ${ex.duration}</div>
    ${ex.note ? `<div class="modal-notes">${ex.note}</div>` : ''}
    ${ex.content.map(block => renderContentBlock(block)).join('')}
  `;

  modal.classList.remove('hidden');
}

function renderContentBlock(block) {
  switch (block.type) {
    case 'section': {
      let html = `<div class="detail-section"><h3>${block.title}</h3>`;
      if (block.warning) html += `<div class="warn-box">${block.warning}</div>`;
      if (block.items) {
        html += `<ul class="step-list">${block.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
      }
      if (block.table) {
        html += renderTable(block.table.headers, block.table.rows);
      }
      if (block.note) html += `<div class="modal-notes" style="margin-top:8px">${block.note}</div>`;
      html += '</div>';
      return html;
    }
    case 'kv': {
      return `<div class="detail-section"><div class="kv-grid">
        ${block.rows.map(([k,v]) => `<div class="kv-row"><span class="kv-label">${k}</span><span class="kv-value">${v}</span></div>`).join('')}
      </div></div>`;
    }
    case 'text': {
      return `<div class="detail-section"><h3>${block.title}</h3><p>${block.text}</p></div>`;
    }
    case 'table': {
      return `<div class="detail-section">
        ${block.title ? `<h3>${block.title}</h3>` : ''}
        ${renderTable(block.headers, block.rows)}
      </div>`;
    }
    case 'list': {
      return `<div class="detail-section">
        <h3>${block.title}</h3>
        <ul class="step-list">${block.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>`;
    }
    case 'warn': {
      return `<div class="warn-box">${block.text}</div>`;
    }
    default: return '';
  }
}

function renderTable(headers, rows) {
  return `<table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}

function closeExercise() {
  document.getElementById('exerciseModal').classList.add('hidden');
}

// ── Overlay close on backdrop click ──────────────────────────────────────────
function setupOverlayClose() {
  document.getElementById('sessionModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSession();
  });
  document.getElementById('exerciseModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeExercise();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSession(); closeExercise(); }
  });
}
