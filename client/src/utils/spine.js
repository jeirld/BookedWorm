const CLOTHS = ['blue', 'umber', 'ash', 'plum', 'olive', 'bronze', 'primary']

export function getSpineColor(id) {
  const index = Math.abs(Number(id)) % CLOTHS.length
  return `var(--cloth-${CLOTHS[index]})`
}

export function getSpineHeight(title = '') {
  const base = 120
  const extra = (title.length * 3) % 56
  return `${base + extra}px`
}
