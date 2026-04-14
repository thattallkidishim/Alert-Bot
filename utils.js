const seen = new Set();

export function filterNew(items) {
  return items.filter(item => {
    const key = item.title + item.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
