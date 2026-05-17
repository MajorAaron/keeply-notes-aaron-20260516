export function removeCopiedItem(items, id) {
  if (!Array.isArray(items) || !id) {
    return { items: Array.isArray(items) ? items : [], removed: null };
  }

  const index = items.findIndex((item) => item?.id === id);
  if (index === -1) return { items, removed: null };

  return {
    items: [...items.slice(0, index), ...items.slice(index + 1)],
    removed: items[index]
  };
}
