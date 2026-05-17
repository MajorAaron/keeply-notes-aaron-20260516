export function toggleNotePin(notes, id, options = {}) {
  const now = options.now || new Date().toISOString();
  let changedNote = null;

  const nextNotes = notes.map((note) => {
    if (note.id !== id) return note;
    changedNote = {
      ...note,
      pinned: !note.pinned,
      updatedAt: now
    };
    return changedNote;
  });

  return {
    notes: nextNotes,
    note: changedNote,
    pinned: Boolean(changedNote?.pinned)
  };
}

export function getNotePinLabel(note) {
  return note?.pinned ? "Unpin note" : "Pin note";
}
