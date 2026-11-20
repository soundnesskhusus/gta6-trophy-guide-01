// Rendering: one card per trophy, the progress ring, and the empty state.
// Cards show the official name, description and grade, the Exophase rarity,
// the guide with its cited sources, and an earned checkbox.
import { isStorySpoiling, kindLabel } from './filters.js';
import { earnedCount, gradeCounts } from './tracker.js';

const RING_CIRCUMFERENCE = 326.7;

function rarityText(trophy) {
  if (trophy.rarity === 100) return '100% of tracked players';
  if (trophy.rarity === 0) return 'under 0.01% of tracked players';
  return `${trophy.rarity}% of tracked players`;
}

function sourceList(sources) {
  const list = document.createElement('ul');
  list.className = 'guide-sources';
  for (const s of sources) {
    const item = document.createElement('li');
    item.textContent = 'Source: ';
    const link = document.createElement('a');
    link.href = s.url;
    link.textContent = s.name;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    list.append(item);
  }
  return list;
}

export function buildTrophyCard(trophy, earned, spoilerOn, onToggle) {
  const hidden = spoilerOn && isStorySpoiling(trophy) && !earned;
  const card = document.createElement('li');
  card.className = 'trophy-card';
  card.id = `trophy-${trophy.id}`;
  if (earned) card.classList.add('earned');
  if (trophy.missable) card.classList.add('missable-card');

  const head = document.createElement('div');
  head.className = 'card-head';

  const boxWrap = document.createElement('label');
  boxWrap.className = 'earned-box';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned;
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => onToggle(trophy.id, box.checked));
  boxWrap.append(box);
  head.append(boxWrap);

  const main = document.createElement('div');
  main.className = 'card-main';

  const titleRow = document.createElement('div');
  titleRow.className = 'card-title-row';
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  titleRow.append(name);

  const grade = document.createElement('span');
  grade.className = `grade-badge grade-${trophy.grade}`;
  grade.textContent = trophy.grade;
  titleRow.append(grade);

  const kind = document.createElement('span');
  kind.className = 'kind-tag';
  kind.textContent = kindLabel(trophy.kind);
  titleRow.append(kind);

  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'missable-tag';
    flag.textContent = '⚠ Missable';
    titleRow.append(flag);
  }
  if (trophy.id === 49) {
    const flag = document.createElement('span');
    flag.className = 'unconfirmed-tag';
    flag.textContent = 'Unconfirmed method';
    titleRow.append(flag);
  }
  main.append(titleRow);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = hidden
    ? 'Spoiler hidden — tick the box once you have earned it to reveal the name and description.'
    : trophy.description;
  main.append(desc);

  if (!hidden) {
    const rarity = document.createElement('p');
    rarity.className = 'rarity-line';
    const strong = document.createElement('strong');
    strong.textContent = rarityText(trophy);
    rarity.append(strong);
    rarity.append(document.createTextNode(' — Exophase rarity, 20 Nov 2026'));
    main.append(rarity);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'guide-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Show guide ▸';
    main.append(toggle);

    const body = document.createElement('div');
    body.className = 'guide-body';
    body.hidden = true;
    const guideText = document.createElement('p');
    guideText.textContent = trophy.guide;
    body.append(guideText);
    body.append(sourceList(trophy.sources));
    main.append(body);

    toggle.addEventListener('click', () => {
      const open = body.hidden;
      body.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Hide guide ▾' : 'Show guide ▸';
    });
    // Let the boot code open a guide from a screenshot link.
    card._openGuide = () => {
      body.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.textContent = 'Hide guide ▾';
    };
  } else {
    const note = document.createElement('p');
    note.className = 'spoiler-hidden';
    note.textContent = 'Guide hidden until earned.';
    main.append(note);
  }

  head.append(main);
  card.append(head);
  return card;
}

export function renderList(listEl, trophies, earnedIds, spoilerOn, onToggle) {
  listEl.replaceChildren();
  for (const t of trophies) {
    listEl.append(buildTrophyCard(t, earnedIds.has(t.id), spoilerOn, onToggle));
  }
}

export function updateProgress(earnedIds, trophies) {
  const total = trophies.length;
  const n = earnedCount(earnedIds, trophies);
  const pct = total === 0 ? 0 : Math.round((n / total) * 100);
  const ring = document.getElementById('ring-fill');
  if (ring) ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - n / Math.max(total, 1)));
  const count = document.getElementById('progress-count');
  if (count) count.textContent = `${n} / ${total}`;
  const pctEl = document.getElementById('progress-pct');
  if (pctEl) pctEl.textContent = `${pct}%`;
  const note = document.getElementById('progress-note');
  if (note) {
    note.textContent = `${n} earned · ${total - n} to go`;
  }
}

export function showCount(lineEl, shown, trophies, kind, earnedIds) {
  if (!lineEl) return;
  const grades = gradeCounts(earnedIds, trophies);
  const base = kind === 'all'
    ? `Showing ${shown} of ${trophies.length} trophies`
    : `Showing ${shown} of ${trophies.length} trophies — ${kindLabel(kind)}`;
  lineEl.textContent = `${base} · Platinum ${grades.platinum[0]}/${grades.platinum[1]} · Gold ${grades.gold[0]}/${grades.gold[1]} · Silver ${grades.silver[0]}/${grades.silver[1]} · Bronze ${grades.bronze[0]}/${grades.bronze[1]}`;
}
