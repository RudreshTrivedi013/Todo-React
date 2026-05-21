
export default function TodoItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={`task-item-row ${task.completed ? 'completed' : ''}`}
      id={`task-row-${task.id}`}
    >
      {/* Custom Checkbox */}
      <label className="mockup-checkbox-wrapper">
        <input
          id={`checkbox-${task.id}`}
          type="checkbox"
          className="mockup-checkbox-hidden"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <div className="mockup-checkbox-visual" id={`checkbox-visual-${task.id}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </label>

      {/* Title */}
      <div className="task-text-container">
        <span
          className="task-item-title"
          id={`task-title-text-${task.id}`}
          title={task.description}
        >
          {task.title}
        </span>
      </div>

      {/* Delete button (revealed on hover via CSS) */}
      <div className="task-row-actions">
        <button
          id={`delete-btn-${task.id}`}
          className="task-row-action-btn delete"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
        >
          ✕
        </button>
      </div>
    </div>
  )
}