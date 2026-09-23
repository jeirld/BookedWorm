import { getSpineColor, getSpineHeight } from '../utils/spine.js'

// Molecule. One per book on the Shelf screen. Props: title, height, onClick.
// `height` is optional — when left out, it's derived from the title so
// spines vary without asking the user to set one.
export default function BookSpine({ title, height, onClick }) {
  const style = {
    '--h': height || getSpineHeight(title),
    '--spine-bg': getSpineColor(title.length + title.charCodeAt(0)),
  }

  return (
    <button type="button" className="spine" style={style} onClick={onClick}>
      {title}
    </button>
  )
}
