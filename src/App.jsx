import React, { useState, useEffect, useMemo } from 'react'
import './App.css'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import FilterButton from './components/FilterButtons'

// Helper: date string relative to today
const getRelativeDateString = (offsetDays) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().split('T')[0]
}

const INITIAL_TASKS = [
  { id: 't1', title: 'Buy groceries',     description: 'Milk, eggs, sourdough, and berries.',    category: 'shopping', priority: 'low',    dueDate: getRelativeDateString(0), completed: false, createdAt: Date.now() - 1000 },
  { id: 't2', title: 'Finish report',     description: 'Refine analysis and submit slide deck.', category: 'work',     priority: 'high',   dueDate: getRelativeDateString(0), completed: true,  createdAt: Date.now() - 2000 },
  { id: 't3', title: 'Call the dentist',  description: 'Book semi-annual cleaning.',             category: 'personal', priority: 'medium', dueDate: getRelativeDateString(0), completed: false, createdAt: Date.now() - 3000 },
  { id: 't4', title: 'Walk the dog',      description: 'Around the neighborhood loop.',          category: 'personal', priority: 'low',    dueDate: getRelativeDateString(0), completed: false, createdAt: Date.now() - 4000 },
  { id: 't5', title: 'Book flight tickets', description: 'Weekend trip reservation.',            category: 'general',  priority: 'high',   dueDate: getRelativeDateString(1), completed: false, createdAt: Date.now() - 5000 },
  { id: 't6', title: 'Read a book',       description: 'Read next chapter of Sci-Fi novel.',    category: 'personal', priority: 'low',    dueDate: getRelativeDateString(2), completed: false, createdAt: Date.now() - 6000 },
  { id: 't7', title: 'Schedule meeting',  description: 'Q3 synchronization sync.',              category: 'work',     priority: 'medium', dueDate: getRelativeDateString(3), completed: false, createdAt: Date.now() - 7000 },
]

function App() {
  // ── Tasks ──────────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('mockup_todo_tasks_v2')
    if (saved) { try { return JSON.parse(saved) } catch (e) { console.error(e) } }
    return INITIAL_TASKS
  })

  // ── Theme ──────────────────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mockup_todo_theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // ── UI Toggles ─────────────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showFilters,  setShowFilters]  = useState(false)

  // ── New Task Fields ────────────────────────────────────────────────────────
  const [newTitle,       setNewTitle]       = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCategory,    setNewCategory]    = useState('general')
  const [newPriority,    setNewPriority]    = useState('medium')
  const [newDueDate,     setNewDueDate]     = useState('')

  // ── Filter / Search ────────────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilter,   setActiveFilter]   = useState('all')
  const [sortBy,         setSortBy]         = useState('createdAt')

  // ── Sync Effects ───────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('mockup_todo_tasks_v2', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('mockup_todo_theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setTasks((prev) => [{
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate || null,
      completed: false,
      createdAt: Date.now(),
    }, ...prev])
    setNewTitle(''); setNewDescription(''); setNewCategory('general')
    setNewPriority('medium'); setNewDueDate(''); setShowAdvanced(false)
  }

  const handleToggleComplete = (id) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t))

  const handleDeleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id))

  const handleClearCompleted = () =>
    setTasks((prev) => prev.filter((t) => !t.completed))

  const handleResetFilters = () => {
    setSearchQuery(''); setActiveCategory('all')
    setActiveFilter('all'); setSortBy('createdAt'); setShowFilters(false)
  }

  // ── Derived Data ───────────────────────────────────────────────────────────
  const processedTasks = useMemo(() => {
    const priorityWeight = { high: 3, medium: 2, low: 1 }
    return tasks
      .filter((t) => {
        const matchSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchCat    = activeCategory === 'all' || t.category === activeCategory
        const matchStatus =
          activeFilter === 'all' ||
          (activeFilter === 'active'    && !t.completed) ||
          (activeFilter === 'completed' &&  t.completed)
        return matchSearch && matchCat && matchStatus
      })
      .sort((a, b) => {
        if (sortBy === 'createdAt') return b.createdAt - a.createdAt
        if (sortBy === 'dueDate')   return !a.dueDate ? 1 : !b.dueDate ? -1 : new Date(a.dueDate) - new Date(b.dueDate)
        if (sortBy === 'priority')  return priorityWeight[b.priority] - priorityWeight[a.priority]
        if (sortBy === 'title')     return a.title.localeCompare(b.title)
        return 0
      })
  }, [tasks, searchQuery, activeCategory, activeFilter, sortBy])

  const isFiltered = useMemo(() =>
    searchQuery !== '' || activeCategory !== 'all' || activeFilter !== 'all' || sortBy !== 'createdAt',
    [searchQuery, activeCategory, activeFilter, sortBy]
  )

  const groupedTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    return processedTasks.reduce(
      (acc, task) => {
        if (!task.dueDate || task.dueDate <= todayStr) acc.today.push(task)
        else acc.upcoming.push(task)
        return acc
      },
      { today: [], upcoming: [] }
    )
  }, [processedTasks])

  const completedCount = tasks.filter((t) => t.completed).length

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Theme toggle (fixed above card) */}
      <div className="theme-switch-absolute">
        <span className="theme-switch-label">{isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
        <button
          className="header-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
          title="Toggle Color Theme"
          aria-label="Theme Toggle"
        >🌓</button>
      </div>

      <div className="todo-app-card animate-fade-in">

        {/* ── Header ── */}
        <header className="card-header">
          {/* Filter toggle with active-dot indicator */}
          <div style={{ position: 'relative' }}>
            <button
              className="header-btn"
              onClick={() => { setShowFilters(!showFilters); setShowAdvanced(false) }}
              title="Search / Filter / Sort"
              aria-label="Toggle Filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ width: '18px', height: '18px' }}>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            {isFiltered && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: 'var(--brand-blue)',
                border: '2px solid var(--bg-card)', pointerEvents: 'none',
              }} />
            )}
          </div>

          <h1 className="card-title">My To-Do List</h1>

          <button
            className="header-btn"
            onClick={() => { setShowAdvanced(!showAdvanced); setShowFilters(false) }}
            title="Create Task with Options"
            aria-label="Toggle Advanced Form"
            style={{ fontSize: '20px' }}
          >＋</button>
        </header>

        {/* ── TodoForm (quick input + advanced drawer) ── */}
        <TodoForm
          newTitle={newTitle}           setNewTitle={setNewTitle}
          handleAddTask={handleAddTask}
          showAdvanced={showAdvanced}   setShowAdvanced={setShowAdvanced}
          setShowFilters={setShowFilters}
          newDescription={newDescription} setNewDescription={setNewDescription}
          newCategory={newCategory}     setNewCategory={setNewCategory}
          newPriority={newPriority}     setNewPriority={setNewPriority}
          newDueDate={newDueDate}       setNewDueDate={setNewDueDate}
        />

        {/* ── Filter / Search Drawer ── */}
        {showFilters && (
          <div className="filter-drawer-panel animate-slide-down">
            {/* Search */}
            <div className="drawer-input-group">
              <label className="drawer-label" htmlFor="search-input">Search Title or Details</label>
              <input
                id="search-input" type="text" className="drawer-input"
                placeholder="Type to filter..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="drawer-input-group">
              <label className="drawer-label" htmlFor="sort-select">Sort Tasks by</label>
              <select id="sort-select" className="drawer-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">📅 Date Created</option>
                <option value="dueDate">⏳ Due Date</option>
                <option value="priority">🔥 Priority</option>
                <option value="title">🔤 Task Name</option>
              </select>
            </div>

            {/* Status chips — using FilterButton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="drawer-label">Filter by Status</span>
              <div className="chip-row">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: '⭕ Active' },
                  { id: 'completed', label: '✅ Completed' },
                ].map((s) => (
                  <FilterButton
                    key={s.id}
                    id={`status-chip-${s.id}`}
                    label={s.label}
                    active={activeFilter === s.id}
                    onClick={() => setActiveFilter(s.id)}
                  />
                ))}
              </div>
            </div>

            {/* Category chips — using FilterButton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span className="drawer-label">Filter by Tag</span>
              <div className="chip-row">
                {[
                  { id: 'all',      label: 'All' },
                  { id: 'general',  label: '📁 General' },
                  { id: 'work',     label: '💼 Work' },
                  { id: 'personal', label: '👤 Personal' },
                  { id: 'shopping', label: '🛒 Shopping' },
                  { id: 'fitness',  label: '🏃 Fitness' },
                ].map((c) => (
                  <FilterButton
                    key={c.id}
                    id={`cat-chip-${c.id}`}
                    label={c.label}
                    active={activeCategory === c.id}
                    onClick={() => setActiveCategory(c.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TodoList (Today + Upcoming + Empty state) ── */}
        <TodoList
          groupedTasks={groupedTasks}
          processedTasks={processedTasks}
          onToggle={handleToggleComplete}
          onDelete={handleDeleteTask}
        />

        {/* ── Footer ── */}
        <footer className="card-footer">
          <button
            id="clear-completed-footer-btn"
            className="footer-action-text"
            onClick={handleClearCompleted}
            disabled={completedCount === 0}
            style={{ opacity: completedCount === 0 ? 0.3 : 0.8, cursor: completedCount === 0 ? 'default' : 'pointer' }}
          >
            Clear Completed
          </button>

          <button
            id="view-all-footer-btn"
            className="footer-link-blue"
            onClick={handleResetFilters}
            disabled={!isFiltered}
          >
            View All Tasks {isFiltered && '(Active)'} ❯
          </button>
        </footer>

      </div>
    </>
  )
}

export default App