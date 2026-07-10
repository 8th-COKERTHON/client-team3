import type { CatalogChore } from "../types/chore";

export function groupByCategory(items: CatalogChore[]) {
  const map = new Map<string, CatalogChore[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return Array.from(map.entries()).map(([category, tasks]) => ({
    category,
    tasks,
  }));
}
