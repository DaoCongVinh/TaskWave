import { Flag } from 'lucide-react'

function TaskCard({ task, columnId, onTaskClick }) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const priorityFlag = {
    low: '#3b82f6',
    medium: '#f59e0b',
    high: '#ef4444',
  }

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('task', `${task.id}:${columnId}`)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onTaskClick(task)}
      className="group relative bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl p-4 cursor-grab active:cursor-grabbing hover-lift premium-shadow overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="font-bold text-card-foreground leading-tight flex-1 group-hover:text-primary transition-colors duration-300">
            {task.title}
          </h4>
          <Flag
            size={18}
            className="mt-0.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"
            fill={priorityFlag[task.priority]}
            color={priorityFlag[task.priority]}
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">
          {task.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority === 'high' && '🔴 '}
            {task.priority === 'medium' && '🟡 '}
            {task.priority === 'low' && '🟢 '}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
              {task.assignee.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
