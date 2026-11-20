// Progress tracker: which trophies the reader has earned, saved in localStorage,
// with export to a file and import back. Earned trophies are kept by id.
const STORAGE_KEY = 'leonida-trophy-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earnedIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedIds].sort((a, b) => a - b)));
  } catch {
    // Private mode or a full store: the page still works for this visit.
  }
}

export function earnedCount(earnedIds, trophies) {
  let n = 0;
  for (const t of trophies) if (earnedIds.has(t.id)) n += 1;
  return n;
}

export function gradeCounts(earnedIds, trophies) {
  const out = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const t of trophies) {
    if (!out[t.grade]) continue;
    out[t.grade][1] += 1;
    if (earnedIds.has(t.id)) out[t.grade][0] += 1;
  }
  return out;
}

export function downloadProgress(earnedIds) {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earnedIds].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export async function readProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('Not a progress file');
  return new Set(list.filter((n) => Number.isInteger(n)));
}
