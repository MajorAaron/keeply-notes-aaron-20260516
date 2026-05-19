export function getSearchClearState(query, options = {}) {
  const value = typeof query === "string" ? query.trim() : "";
  const view = options.view === "tasks" ? "tasks" : "notes";
  const noun = view === "tasks" ? "task" : "note";

  return {
    visible: value.length > 0,
    label: value.length > 0 ? `Clear ${noun} search for ${value}` : `Clear ${noun} search`,
    title: value.length > 0 ? `Clear search: ${value}` : "Clear search"
  };
}
