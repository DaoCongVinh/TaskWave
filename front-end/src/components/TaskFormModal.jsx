import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { projectsApi } from '../api/projects.js'

function TaskFormModal({ task, defaultStatus, onSave, onClose }) {
    const isEdit = !!task
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: defaultStatus || 'TODO',
        deadline: '',
        projectId: '',
    })
    const [projects, setProjects] = useState([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectsApi.getProjects()
                if (data && Array.isArray(data)) {
                    setProjects(data.map(p => ({ id: p.id, name: p.name })).filter(p => p.id))
                }
            } catch (err) {
                console.error('Failed to fetch projects:', err)
            }
        }
        fetchProjects()
    }, [])

    useEffect(() => {
        if (isEdit && task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                priority: (task.priority || 'MEDIUM').toUpperCase(),
                status: (task.status || 'TODO').toUpperCase().replace(' ', '_'),
                deadline: task.deadline || task.dueDate || '',
                projectId: task.projectId || '',
            })
        }
    }, [task, isEdit])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.title.trim()) {
            setError('Tiêu đề task không được để trống')
            return
        }
        if (!form.projectId) {
            setError('Vui lòng chọn project')
            return
        }

        setSaving(true)
        try {
            const taskData = {
                title: form.title.trim(),
                description: form.description.trim(),
                priority: form.priority,
                status: form.status,
                projectId: form.projectId,
            }
            if (form.deadline) {
                taskData.deadline = form.deadline.includes('T') ? form.deadline : form.deadline + 'T00:00:00'
            }
            await onSave(taskData)
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setSaving(false)
        }
    }

    const statusOptions = [
        { value: 'TODO', label: '📋 To Do' },
        { value: 'IN_PROGRESS', label: '🔄 In Progress' },
        { value: 'REVIEW', label: '👀 Review' },
        { value: 'DONE', label: '✅ Done' },
    ]

    const priorityOptions = [
        { value: 'LOW', label: '🟢 Low', color: 'bg-blue-500' },
        { value: 'MEDIUM', label: '🟡 Medium', color: 'bg-yellow-500' },
        { value: 'HIGH', label: '🔴 High', color: 'bg-red-500' },
    ]

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
                <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto premium-shadow">
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 pb-4 border-b border-border/30 sticky top-0 bg-gradient-to-r from-card to-card/80 backdrop-blur-xl rounded-t-3xl">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                {isEdit ? '✏️ Chỉnh sửa Task' : '➕ Tạo Task mới'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted/50 rounded-xl transition-all duration-300 hover-lift ml-4"
                            aria-label="Close form"
                        >
                            <X size={24} className="text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium animate-slide-in-left">
                                {error}
                            </div>
                        )}

                        {/* Title */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.05s' }}>
                            <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                                Tiêu đề <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Nhập tiêu đề task..."
                                maxLength={200}
                                className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                            />
                        </div>

                        {/* Description */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                            <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả task..."
                                rows={3}
                                maxLength={2000}
                                className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none"
                            />
                        </div>

                        {/* Project */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.15s' }}>
                            <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                                Project <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="projectId"
                                value={form.projectId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                            >
                                <option value="">-- Chọn project --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority & Status row */}
                        <div className="grid grid-cols-2 gap-4 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                            <div>
                                <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                                    Độ ưu tiên
                                </label>
                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    {priorityOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                                    Trạng thái
                                </label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.25s' }}>
                            <label className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                                Deadline
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={form.deadline ? form.deadline.split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-border/30 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-bold hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo Task'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="flex-1 px-6 py-3 border-2 border-border/50 rounded-xl hover:bg-muted/50 transition-all duration-300 font-bold hover:border-primary/50 hover-lift disabled:opacity-50"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TaskFormModal
