import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import AnalyticsCard from './AnalyticsCard.jsx'
import ProjectList from './ProjectList.jsx'

function DashboardView() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-6 animate-slide-in-top">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Quick Stats
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">Your task management overview at a glance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnalyticsCard title="Total Tasks" value="48" change="12%" trend="up" icon={CheckCircle2} color="primary" />
          <AnalyticsCard title="In Progress" value="8" change="3%" trend="up" icon={Clock} color="secondary" />
          <AnalyticsCard title="Overdue" value="2" change="50%" trend="down" icon={AlertCircle} color="accent" />
          <AnalyticsCard title="Completed" value="38" change="8%" trend="up" icon={TrendingUp} color="primary" />
        </div>
      </div>

      <div>
        <div className="mb-6 animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Active Projects
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">Track and manage your ongoing projects</p>
        </div>
        <ProjectList />
      </div>
    </div>
  )
}

export default DashboardView
