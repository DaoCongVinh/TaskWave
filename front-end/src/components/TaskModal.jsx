import { useState } from 'react'
import { Flag, User, Calendar, X, Pencil, Trash2, AlertTriangle } from 'lucide-react'

function TaskModal({ task, onClose, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(task.id)
    } catch (err) {
      console.error('Failed to delete task:', err)
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto premium-shadow">
          <div className="flex items-center justify-between p-8 border-b border-border/30 sticky top-0 bg-gradient-to-r from-card to-card/80 backdrop-blur-xl">
            <div className="flex-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {task.title}
              </h2>
              {task.projectName && (
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  📁 {task.projectName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-300 hover-lift ml-4"
              aria-label="Close task details"
            >
              <X size={24} className="text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="animate-slide-in-left" style={{ animationDelay: '0.05s' }}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Description</h3>
              <p className="text-card-foreground leading-relaxed text-lg">
                {task.description || 'Không có mô tả'}
              </p>
            </div>

            <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <Flag size={16} className="text-accent" />
                Priority Level
              </h3>
              <span className={`inline-block text-sm font-bold px-4 py-2 rounded-lg backdrop-blur-sm ${priorityColors[task.priority]}`}>
                {task.priority === 'high' && '🔴 '}
                {task.priority === 'medium' && '🟡 '}
                {task.priority === 'low' && '🟢 '}
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>

            <div className="animate-slide-in-left" style={{ animationDelay: '0.15s' }}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={16} className="text-accent" />
                Assigned Team Member
              </h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30 group hover:bg-muted/50 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {(task.assignee || 'U').charAt(0)}
                </div>
                <span className="text-card-foreground font-semibold">{task.assignee || 'Unassigned'}</span>
              </div>
            </div>

            <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-accent" />
                Due Date
              </h3>
              <p className="text-card-foreground font-semibold text-lg">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Chưa đặt deadline'}
              </p>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-scale-in">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle size={20} className="text-red-400" />
                  <p className="text-red-400 font-semibold">Bạn có chắc chắn muốn xóa task này?</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Hành động này không thể hoàn tác. Task "{task.title}" sẽ bị xóa vĩnh viễn.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50"
                  >
                    {deleting ? 'Đang xóa...' : '🗑️ Xác nhận xóa'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 border border-border/50 rounded-xl font-bold hover:bg-muted/50 transition-all duration-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border/30 animate-slide-in-left" style={{ animationDelay: '0.25s' }}>
              <button
                type="button"
                onClick={() => onEdit && onEdit(task)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-bold hover-lift"
              >
                <Pencil size={18} />
                Edit Task
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold hover-lift"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-border/50 rounded-xl hover:bg-muted/50 transition-all duration-300 font-bold hover:border-primary/50 hover-lift"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TaskModal
