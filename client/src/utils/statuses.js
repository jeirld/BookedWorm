export const STATUSES = [
  { id: 'want-to-read', label: 'Want to read', icon: 'bookmark' },
  { id: 'reading', label: 'Reading', icon: 'book-open' },
  { id: 'finished', label: 'Finished', icon: 'check-circle' },
  { id: 'dropped', label: 'Dropped', icon: 'x-circle' },
]

export function getStatus(id) {
  return STATUSES.find((status) => status.id === id)
}
