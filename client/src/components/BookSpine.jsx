import { getSpineColor, getSpineHeight } from '../utils/spine.js'

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
