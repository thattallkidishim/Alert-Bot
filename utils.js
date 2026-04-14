const seen = new Set();

export function filterNew(items) {
  return items.filter(i => {
    const key = i.title + i.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
