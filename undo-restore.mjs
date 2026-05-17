export function captureItemRestore(items, id) {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return {
    index,
    item: { ...items[index] }
  };
}

export function restoreItem(items, snapshot) {
  if (!snapshot?.item?.id) return items;
  const existingIndex = items.findIndex((item) => item.id === snapshot.item.id);
  if (existingIndex !== -1) {
    return items.map((item, index) => (index === existingIndex ? { ...snapshot.item } : item));
  }

  const restored = [...items];
  const index = Math.min(Math.max(Number(snapshot.index) || 0, 0), restored.length);
  restored.splice(index, 0, { ...snapshot.item });
  return restored;
}
