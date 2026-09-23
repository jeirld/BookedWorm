// Turns a book's id into a repeatable cloth colour and spine height, so
// the shelf looks varied without asking the user to pick a colour or
// storing one in the database.
//
// tokens.css defines 7 cloth colours: 6 named ones plus --cloth-primary
// (Dusty Oat, the seventh). See CLAUDE.md "Screens and behaviour".
const CLOTHS = ['blue', 'umber', 'ash', 'plum', 'olive', 'bronze', 'primary']

export function getSpineColor(id) {
  const index = Math.abs(Number(id)) % CLOTHS.length
  return `var(--cloth-${CLOTHS[index]})`
}

// Keeps spines a readable range of heights (120-176px) while still varying
// with the title, so longer titles tend to get slightly taller spines.
export function getSpineHeight(title = '') {
  const base = 120
  const extra = (title.length * 3) % 56
  return `${base + extra}px`
}
