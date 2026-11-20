// Boot: load the trophy data, wire the toolbar, and render the list.
// Screenshot states come from ?shot=: list (default), guide&id=N (one guide
// open), roadmap (the roadmap in view), tracker (spoiler on, a few earned),
// missable (the missable filter). Nothing here fetches off this site.
import { loadProgress, saveProgress, downloadProgress, readProgressFile } from './tracker.js';
import { visibleTrophies, emptyStateText } from './filters.js';
import { renderList, updateProgress, showCount } from './render.js';

const listEl = document.getElementById('trophy-list');
const countLine = document.getElementById('count-line');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search');
const spoilerToggle = document.getElementById('spoiler-toggle');
const filtersEl = document.getElementById('filters');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
let earnedIds = loadProgress();
let activeKind = 'all';
let spoilerOn = false;

function render() {
  const query = searchInput.value.trim();
  const shown = visibleTrophies(trophies, activeKind, query);
  renderList(listEl, shown, earnedIds, spoilerOn, (id, checked) => {
    if (checked) earnedIds.add(id);
    else earnedIds.delete(id);
    saveProgress(earnedIds);
    updateProgress(earnedIds, trophies);
    render();
  });
  updateProgress(earnedIds, trophies);
  showCount(countLine, shown.length, trophies, activeKind, earnedIds);
  if (shown.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = emptyStateText(activeKind, query);
  } else {
    emptyState.hidden = true;
  }
}

filtersEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-kind]');
  if (!button) return;
  activeKind = button.dataset.kind;
  for (const chip of filtersEl.querySelectorAll('[data-kind]')) {
    chip.classList.toggle('chip-active', chip === button);
  }
  render();
});

searchInput.addEventListener('input', render);

spoilerToggle.addEventListener('change', () => {
  spoilerOn = spoilerToggle.checked;
  render();
});

document.getElementById('export-btn').addEventListener('click', () => {
  downloadProgress(earnedIds);
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earnedIds = await readProgressFile(file);
    saveProgress(earnedIds);
    render();
  } catch {
    emptyState.hidden = false;
    emptyState.textContent = 'That file is not a progress export from this guide. Nothing was changed.';
  }
  event.target.value = '';
});

function applyShotParam() {
  const params = new URLSearchParams(window.location.search);
  const kind = params.get('kind');
  if (kind && ['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(kind)) {
    activeKind = kind;
    for (const chip of filtersEl.querySelectorAll('[data-kind]')) {
      chip.classList.toggle('chip-active', chip.dataset.kind === kind);
    }
    render();
  }
  const shot = params.get('shot');
  if (!shot) return;
  if (shot === 'missable') {
    activeKind = 'missable';
    for (const chip of filtersEl.querySelectorAll('[data-kind]')) {
      chip.classList.toggle('chip-active', chip.dataset.kind === 'missable');
    }
    render();
  } else if (shot === 'roadmap') {
    // Move the roadmap above the list so it is in view without scrolling.
    const roadmap = document.getElementById('roadmap');
    const mainEl = document.querySelector('main');
    mainEl.parentNode.insertBefore(roadmap, mainEl);
  } else if (shot === 'tracker') {
    spoilerOn = true;
    spoilerToggle.checked = true;
    // Earn two trophies so the shot shows both states: an earned story
    // trophy revealed, and the next story trophy still hidden by the spoiler.
    for (const id of [2, 20]) earnedIds.add(id);
    saveProgress(earnedIds);
    render();
  } else if (shot === 'guide') {
    // Narrow the list to the one trophy, then open its guide: the card
    // sits at the top of the page, so no scrolling is needed.
    const id = Number(params.get('id') || '40');
    const trophy = trophies.find((t) => t.id === id);
    if (!trophy) return;
    searchInput.value = trophy.name;
    render();
    const card = document.getElementById(`trophy-${id}`);
    if (card && card._openGuide) card._openGuide();
  }
}

render();
applyShotParam();
