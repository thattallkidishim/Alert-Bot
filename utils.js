const seen = new Set();

/**
 * removes duplicates so you don't get spammed
 */
export function filterNew(items) {
  return items.filter(item => {
    const key = item.title + item.url;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
