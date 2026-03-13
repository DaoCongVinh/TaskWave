import { Search, Bell, Settings } from 'lucide-react'

function DashboardHeader({ title, description }) {
  return (
    <div className="bg-gradient-to-r from-card to-card/80 border-b border-border sticky top-0 z-30 backdrop-blur-xl bg-opacity-95 premium-shadow">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between gap-4 mb-6 animate-slide-in-top">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && <p className="text-muted-foreground mt-2 font-medium">{description}</p>}
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Active
          </div>
        </div>

        <div className="flex items-center gap-3 animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-300 hover-lift"
            />
          </div>
          <button className="p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all duration-300 hover-lift group" aria-label="Notifications">
            <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors group-hover:animate-scale-in" />
          </button>
          <button className="p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all duration-300 hover-lift group" aria-label="Settings">
            <Settings
              size={20}
              className="text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-90"
              style={{ transitionDuration: '0.4s' }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
