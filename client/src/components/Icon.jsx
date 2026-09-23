// A small hand-built icon set, since no icon sprite came with the design
// system files. Stroke style matches components.css's `svg.icon` rule
// (1.75 stroke width, round caps, no fill by default).
//
// Add new names here as pages need them. Each book status also has its
// own icon name in utils/statuses.js — keep the two lists in sync.
const PATHS = {
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  'book-open': 'M4 5v14c3-1.5 5-1.5 8 0V5c-3-1.5-5-1.5-8 0Zm16 0v14c-3-1.5-5-1.5-8 0V5c3-1.5 5-1.5 8 0Z',
  'check-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1.5 12.5-3.5-3.5 1.4-1.4 2.1 2.1 5.1-5.1 1.4 1.4-6.5 6.5Z',
  'x-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 11-1.4 1.4L12 13.4l-2.1 2.1L8.5 14l2.1-2.1L8.5 9.8l1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4L13.4 12l2.1 2Z',
  star: 'm12 3 2.6 5.6 6 .7-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.2 6-.7L12 3Z',
  plus: 'M12 4v16M4 12h16',
  'chevron-left': 'm14 4-8 8 8 8',
  home: 'm4 11 8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9Z',
  note: 'M6 3h9l5 5v13H6V3Zm9 0v5h5M9 12h6M9 16h6',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  edit: 'M4 20h4l10-10-4-4L4 16v4Zm12-14 4 4',
  x: 'M6 6l12 12M18 6 6 18',
  trash: 'M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13',
}

export default function Icon({ name, className = 'icon', label }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={d} />
    </svg>
  )
}
