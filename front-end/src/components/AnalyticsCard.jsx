function AnalyticsCard({ title, value, change, icon: Icon, trend, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    accent: 'bg-accent/15 text-accent',
  }

  const gradientClasses = {
    primary: 'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    accent: 'from-accent/20 to-accent/5',
  }

  const trendColor = trend === 'down' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'

  return (
    <div className={`relative group overflow-hidden bg-gradient-to-br ${gradientClasses[color]} border border-border rounded-2xl p-6 hover-lift premium-shadow`}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/5 to-transparent rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-4 rounded-xl ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={28} className="animate-float" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-sm ${trendColor}`}>
              <span className="text-sm font-bold">{trend === 'down' ? '↓' : '↑'}</span>
              <span className="text-sm font-semibold">{change}</span>
            </div>
          )}
        </div>
        <h3 className="text-muted-foreground text-sm font-medium mb-3">{title}</h3>
        <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{value}</p>
      </div>
    </div>
  )
}

export default AnalyticsCard
