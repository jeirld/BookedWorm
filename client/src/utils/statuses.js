// The four book statuses. Each one pairs an icon name with a word, so
// status is never shown by colour alone (accessibility rule from the
// design system).
//
// `icon` names match the <symbol> ids we'll add to an SVG icon sprite later.
// For now components can render a placeholder until the sprite exists.
export const STATUSES = [
  { id: 'want-to-read', label: 'Want to read', icon: 'bookmark' },
  { id: 'reading', label: 'Reading', icon: 'book-open' },
  { id: 'finished', label: 'Finished', icon: 'check-circle' },
  { id: 'dropped', label: 'Dropped', icon: 'x-circle' },
]

export function getStatus(id) {
  return STATUSES.find((status) => status.id === id)
}
