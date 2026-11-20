// Filter matching: kind chips, text search, and the spoiler setting.
// A trophy is "story-spoiling" when it is a story trophy or a hidden one;
// the spoiler setting hides its name and description until it is earned.
export function isStorySpoiling(trophy) {
  return trophy.kind === 'story' || trophy.secret === true;
}

export function kindLabel(kind) {
  switch (kind) {
    case 'story': return 'Story';
    case 'missable': return 'Missable';
    case 'collectibles': return 'Collectibles';
    case 'activities': return 'Activities';
    case 'platinum': return 'Platinum';
    default: return kind;
  }
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'online') return false;
  if (kind === 'missable') return trophy.missable === true;
  return trophy.kind === kind;
}

export function trophyMatchesSearch(trophy, query) {
  if (!query) return true;
  const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => hay.includes(word));
}

export function visibleTrophies(trophies, kind, query) {
  return trophies.filter((t) => trophyMatchesKind(t, kind) && trophyMatchesSearch(t, query));
}

export function emptyStateText(kind, query) {
  if (kind === 'online') {
    return 'No online trophies. All 55 trophies are earned in single-player — there is nothing to track under Online.';
  }
  if (query) {
    return `No trophies match “${query}” under this filter. Try a different word or clear the search.`;
  }
  return 'No trophies under this filter yet.';
}
