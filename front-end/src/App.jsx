import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import DashboardHeader from './components/DashboardHeader.jsx'
import DashboardView from './components/DashboardView.jsx'
import KanbanBoard from './components/KanbanBoard.jsx'
import ProjectList from './components/ProjectList.jsx'
import LoginScreen from './screens/Login.jsx'
import SignupScreen from './screens/Signup.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [authScreen, setAuthScreen] = useState('login')
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsBootstrapping(false)
      return
    }
    const storedUser = window.localStorage.getItem('user')

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user from storage', error)
      }
    }

    setIsBootstrapping(false)
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setActiveTab('dashboard')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const handleLogout = () => {
    setUser(null)
    setAuthScreen('login')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('user')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <DashboardHeader title="Dashboard" description="Welcome back! Here's your task overview." />
            <div className="p-6 md:p-8 overflow-auto">
              <DashboardView />
            </div>
          </>
        )
      case 'board':
        return (
          <>
            <DashboardHeader title="Task Board" description="Organize your tasks across different stages" />
            <div className="p-6 md:p-8 overflow-auto">
              <KanbanBoard />
            </div>
          </>
        )
      case 'projects':
        return (
          <>
            <DashboardHeader title="Projects" description="Manage and track your active projects" />
            <div className="p-6 md:p-8 overflow-auto">
              <ProjectList />
            </div>
          </>
        )
      case 'analytics':
        return (
          <>
            <DashboardHeader title="Analytics" description="View detailed project statistics" />
            <div className="p-6 md:p-8">
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Analytics page coming soon</p>
              </div>
            </div>
          </>
        )
      case 'settings':
        return (
          <>
            <DashboardHeader title="Settings" description="Manage your preferences" />
            <div className="p-6 md:p-8">
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Settings page coming soon</p>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return authScreen === 'login' ? (
      <LoginScreen onSuccess={handleAuthSuccess} onSwitch={setAuthScreen} />
    ) : (
      <SignupScreen onSuccess={handleAuthSuccess} onSwitch={setAuthScreen} />
    )
  }

  return (
    <div className="relative h-screen flex bg-gradient-to-br from-background via-background to-background/95 text-foreground dark overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0 relative z-10">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
