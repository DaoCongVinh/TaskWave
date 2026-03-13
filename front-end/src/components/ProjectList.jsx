import { useState, useEffect } from 'react'
import { FolderOpen, Users, Calendar, MoreVertical, Plus, X, Save, Loader2 } from 'lucide-react'
import { projectsApi } from '../api/projects.js'

const uiColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

function ProjectList({ projects: propProjects }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getProjects();
      if (data && Array.isArray(data)) {
        const mappedProjects = data.map((p, index) => ({
          id: p.id,
          name: p.name || 'Untitled Project',
          description: p.description || 'No description available',
          members: p.memberIds ? p.memberIds.length + 1 : 1,
          progress: 0,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          color: uiColors[index % uiColors.length]
        }));
        setProjects(mappedProjects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propProjects && propProjects.length > 0) {
      setProjects(propProjects);
      setLoading(false);
    } else {
      fetchProjects();
    }
  }, [propProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!newProject.name.trim()) {
      setCreateError('Tên project không được để trống');
      return;
    }

    setCreating(true);
    try {
      await projectsApi.createProject({
        name: newProject.name.trim(),
        description: newProject.description.trim(),
      });
      setNewProject({ name: '', description: '' });
      setShowCreateForm(false);
      setLoading(true);
      await fetchProjects();
    } catch (err) {
      setCreateError(err.message || 'Không thể tạo project. Vui lòng thử lại.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-64 border border-border/50 rounded-2xl bg-card/30">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Project Button / Form */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 text-primary font-semibold group"
        >
          <Plus size={20} className="group-hover:scale-125 transition-transform duration-300" />
          Tạo Project mới
        </button>
      ) : (
        <form
          onSubmit={handleCreateProject}
          className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-2xl p-6 premium-shadow animate-scale-in space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              ➕ Tạo Project mới
            </h3>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setCreateError(''); }}
              className="p-1.5 hover:bg-muted/50 rounded-lg transition-all"
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>

          {createError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
              {createError}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5 block">
              Tên Project <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))}
              placeholder="Nhập tên project..."
              maxLength={100}
              autoFocus
              className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5 block">
              Mô tả
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
              placeholder="Nhập mô tả project..."
              rows={2}
              maxLength={500}
              className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-bold disabled:opacity-50"
            >
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {creating ? 'Đang tạo...' : 'Tạo Project'}
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setCreateError(''); }}
              disabled={creating}
              className="px-5 py-2.5 border border-border/50 rounded-xl hover:bg-muted/50 transition-all font-bold"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {projects.length === 0 && !showCreateForm && (
        <div className="flex flex-col items-center justify-center p-12 h-64 border border-border/50 border-dashed rounded-2xl bg-card/30 hover:bg-card/50 transition-colors">
          <FolderOpen size={48} className="text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No projects found</h3>
          <p className="text-sm text-muted-foreground text-center">Hãy tạo project đầu tiên để bắt đầu quản lý task.</p>
        </div>
      )}

      {/* Project List */}
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="group relative bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-2xl p-6 hover-lift premium-shadow overflow-hidden transition-all duration-300 animate-slide-in-left"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-40 -mt-40 group-hover:scale-150 transition-transform duration-700" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-14 h-14 ${project.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <FolderOpen size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                    {project.description}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-all duration-300 group-hover:scale-110" aria-label="Project actions">
                <MoreVertical size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                <div className={`h-full ${project.color} rounded-full transition-all duration-500 shadow-lg`} style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  <Users size={18} className="text-primary" />
                  <span className="font-semibold">{project.members} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  <Calendar size={18} className="text-accent" />
                  <span className="font-semibold">
                    {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex -space-x-3">
                {[...Array(Math.min(project.members, 3))].map((_, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-card shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, hsl(${(i * 120) % 360}, 70%, 50%), hsl(${((i + 1) * 120) % 360}, 70%, 50%))`,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {project.members > 3 && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-bold text-primary border-2 border-card shadow-lg">
                    +{project.members - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectList
