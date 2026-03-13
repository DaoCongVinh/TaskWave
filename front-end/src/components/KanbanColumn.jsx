import TaskCard from './TaskCard.jsx'

function KanbanColumn({ title, columnId, tasks, onTaskClick, onMoveTask, onAddTask, color }) {
  const handleDragOver = (event) => {
    event.preventDefault()
    event.currentTarget.classList.add('opacity-50')
  }

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove('opacity-50')
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove('opacity-50')
    const data = event.dataTransfer.getData('task')
    if (data) {
      const [taskId, fromColumn] = data.split(':')
      if (fromColumn !== columnId) {
        onMoveTask(taskId, fromColumn, columnId)
      }
    }
  }

  return (
    <div
      className={`${color} rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 border border-border/30 overflow-hidden group hover-lift`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-card-foreground">{title}</h3>
        <span className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold shadow-lg animate-scale-in">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 relative z-10 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground/50 text-sm">
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div key={task.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slide-in-left">
              <TaskCard task={task} columnId={columnId} onTaskClick={onTaskClick} />
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={() => onAddTask && onAddTask(columnId)}
        className="relative z-10 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-card-foreground/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 text-sm font-semibold text-card-foreground hover:text-primary"
      >
        <span className="text-lg">+</span>
        Add Task
      </button>
    </div>
  )
}

export default KanbanColumn
