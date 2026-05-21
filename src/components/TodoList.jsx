
import TodoItem from './TodoItem'

export default function TodoList({ groupedTasks, processedTasks, onToggle, onDelete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1 }}>

      {/* TODAY SECTION */}
      {groupedTasks.today.length > 0 && (
        <div className="section-container" id="section-today">
          <div className="section-header-row">
            <span className="section-title">Today</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {groupedTasks.today.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING SECTION */}
      {groupedTasks.upcoming.length > 0 && (
        <div className="section-container" id="section-upcoming">
          <div className="section-header-row">
            <span className="section-title">Upcoming</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {groupedTasks.upcoming.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {processedTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🎉</span>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>All Caught Up!</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            No tasks in this list. Try adding one or resetting filters!
          </p>
        </div>
      )}
    </div>
  )
}