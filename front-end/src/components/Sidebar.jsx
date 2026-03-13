import { useState } from 'react'
import {
  Menu,
  X,
  LayoutDashboard,
  ListTodo,
  FolderOpen,
  Settings,
  BarChart3,
  LogOut,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'board', label: 'Task Board', icon: ListTodo },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function Sidebar({ activeTab, onTabChange, onLogout, user }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <button
        className="fixed z-40 p-2 md:hidden top-4 left-4 hover:bg-accent rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-black/50" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 md:relative md:translate-x-0 flex flex-col overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative p-6 border-b border-sidebar-border animate-slide-in-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-xl flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shadow-lg">
              TM
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 bg-clip-text text-transparent">
                TaskPro
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Management Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 relative">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  setIsOpen(false)
                }}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 animate-slide-in-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:shadow-md'
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'animate-float' : 'group-hover:scale-110 transition-transform'}
                />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-shimmer-light" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-6 border-t border-sidebar-border relative space-y-3">
          <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-br from-sidebar-accent/40 to-sidebar-accent/20 hover:from-sidebar-accent/60 hover:to-sidebar-accent/40 transition-all duration-300 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-full flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shadow-lg">
              {(user?.name ?? 'John Doe').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name ?? 'John Doe'}</p>
              <p className="text-xs opacity-60 truncate">{user?.email ?? 'john@example.com'}</p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-300 group font-semibold text-sm"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              Sign Out
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
