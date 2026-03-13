import { useState, useEffect } from 'react'
import KanbanColumn from './KanbanColumn.jsx'
import TaskModal from './TaskModal.jsx'
import TaskFormModal from './TaskFormModal.jsx'
import { tasksApi } from '../api/tasks.js'

function KanbanBoard() {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], review: [], done: [] })
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)

  // Create/Edit modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createDefaultStatus, setCreateDefaultStatus] = useState('TODO')
  const [editingTask, setEditingTask] = useState(null)

  const fetchAndGroupTasks = async () => {
    try {
      const data = await tasksApi.getTasks();
      const grouped = { todo: [], inProgress: [], review: [], done: [] };

      if (data && Array.isArray(data)) {
        data.forEach(task => {
          const uiTask = {
            id: task.id,
            title: task.title || 'Untitled',
            description: task.description || '',
            priority: (task.priority || 'MEDIUM').toLowerCase(),
            status: task.status || 'TODO',
            assignee: task.assigneeUsername || task.assigneeId || 'Unassigned',
            dueDate: task.deadline || task.createdAt || new Date().toISOString(),
            deadline: task.deadline,
            projectId: task.projectId,
            projectName: task.projectName,
          };

          if (task.status === 'IN_PROGRESS') grouped.inProgress.push(uiTask);
          else if (task.status === 'REVIEW') grouped.review.push(uiTask);
          else if (task.status === 'DONE') grouped.done.push(uiTask);
          else grouped.todo.push(uiTask); // fallback for TODO or any other
        });
      }
      setTasks(grouped);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndGroupTasks();
  }, [])

  const moveTask = async (taskId, fromColumn, toColumn) => {
    const task = tasks[fromColumn].find((item) => item.id === taskId)
    if (!task) return

    // Optimistic UI update
    setTasks((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((item) => item.id !== taskId),
      [toColumn]: [...prev[toColumn], task],
    }))

    try {
      let newStatus = 'TODO';
      if (toColumn === 'inProgress') newStatus = 'IN_PROGRESS';
      if (toColumn === 'review') newStatus = 'REVIEW';
      if (toColumn === 'done') newStatus = 'DONE';

      const existingTask = await tasksApi.getTaskById(taskId);
      if (existingTask) {
        await tasksApi.updateTask(taskId, { ...existingTask, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update task status in backend", err);
      // Re-fetch to sync with backend if failed
      fetchAndGroupTasks();
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  // ---- CRUD Handlers ----

  const handleAddTask = (columnId) => {
    let status = 'TODO';
    if (columnId === 'inProgress') status = 'IN_PROGRESS';
    if (columnId === 'review') status = 'REVIEW';
    if (columnId === 'done') status = 'DONE';
    setCreateDefaultStatus(status)
    setShowCreateModal(true)
  }

  const handleCreateTask = async (taskData) => {
    await tasksApi.createTask(taskData)
    setShowCreateModal(false)
    await fetchAndGroupTasks()
  }

  const handleEditTask = (task) => {
    setSelectedTask(null)
    setEditingTask(task)
  }

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return
    await tasksApi.updateTask(editingTask.id, taskData)
    setEditingTask(null)
    await fetchAndGroupTasks()
  }

  const handleDeleteTask = async (taskId) => {
    await tasksApi.deleteTask(taskId)
    setSelectedTask(null)
    await fetchAndGroupTasks()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-[600px] border border-border/50 rounded-2xl bg-card/30">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KanbanColumn
          title="To Do"
          columnId="todo"
          tasks={tasks.todo}
          onTaskClick={handleTaskClick}
          onMoveTask={moveTask}
          onAddTask={handleAddTask}
          color="bg-slate-100 dark:bg-slate-800"
        />
        <KanbanColumn
          title="In Progress"
          columnId="inProgress"
          tasks={tasks.inProgress}
          onTaskClick={handleTaskClick}
          onMoveTask={moveTask}
          onAddTask={handleAddTask}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <KanbanColumn
          title="Review"
          columnId="review"
          tasks={tasks.review}
          onTaskClick={handleTaskClick}
          onMoveTask={moveTask}
          onAddTask={handleAddTask}
          color="bg-yellow-100 dark:bg-yellow-900/30"
        />
        <KanbanColumn
          title="Done"
          columnId="done"
          tasks={tasks.done}
          onTaskClick={handleTaskClick}
          onMoveTask={moveTask}
          onAddTask={handleAddTask}
          color="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <TaskFormModal
          defaultStatus={createDefaultStatus}
          onSave={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskFormModal
          task={editingTask}
          onSave={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  )
}

export default KanbanBoard
