// Atom. Props: variant, disabled, onClick, children (see CLAUDE.md components table).
export default function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  children,
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
