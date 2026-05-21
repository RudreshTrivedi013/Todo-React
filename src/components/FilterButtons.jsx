
export default function FilterButton({ id, label, active, onClick }) {
  return (
    <button
      id={id}
      type="button"
      className={`mockup-chip ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}