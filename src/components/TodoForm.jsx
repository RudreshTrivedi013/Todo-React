export default function TodoForm({
  
  newTitle,
  setNewTitle,
  handleAddTask,
  
  showAdvanced,
  setShowAdvanced,
  setShowFilters,
  
  newDescription,
  setNewDescription,
  newCategory,
  setNewCategory,
  newPriority,
  setNewPriority,
  newDueDate,
  setNewDueDate,
}) {
  return (
    <>
      {/* Primary Input Row */}
      <form onSubmit={handleAddTask} className="input-row">
        <input
          id="task-title-input"
          type="text"
          className="simple-input"
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          maxLength={80}
          required
        />
        <button type="submit" className="add-btn" id="add-task-btn">
          Add
        </button>
      </form>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="drawer-panel animate-slide-down">
          <div className="drawer-input-group">
            <label className="drawer-label" htmlFor="task-desc-input">Task Details</label>
            <textarea
              id="task-desc-input"
              className="drawer-textarea"
              placeholder="Optional description..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="drawer-meta-grid">
            <div className="drawer-input-group">
              <label className="drawer-label" htmlFor="task-category-select">Category</label>
              <select
                id="task-category-select"
                className="drawer-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="general">📁 General</option>
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="fitness">🏃 Fitness</option>
              </select>
            </div>

            <div className="drawer-input-group">
              <label className="drawer-label" htmlFor="task-priority-select">Priority</label>
              <select
                id="task-priority-select"
                className="drawer-input"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="drawer-input-group">
              <label className="drawer-label" htmlFor="task-date-input">Due Date</label>
              <input
                id="task-date-input"
                type="date"
                className="drawer-input"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '500' }}>
            ℹ️ Advanced options apply when clicking the main "Add" button.
          </div>
        </div>
      )}
    </>
  )
}