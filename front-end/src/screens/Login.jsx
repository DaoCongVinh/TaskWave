import { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { auth } from '../api/auth.js'

function LoginScreen({ onSuccess, onSwitch }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!username || password.length < 6) {
        setError('Please enter your username and password (min 6 characters)')
        setIsLoading(false)
        return
      }

      const response = await auth.login(username, password)
      const authData = response.data || response

      const userData = {
        email: username,
        name: authData.username || username,
        token: authData.token
      }

      if (onSuccess) {
        onSuccess(userData)
      } else if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground flex items-center justify-center p-4 dark overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 premium-shadow backdrop-blur-xl animate-scale-in">
          <div className="flex items-center justify-center mb-8 animate-slide-in-top">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">TM</span>
            </div>
          </div>

          <div className="text-center mb-8 animate-slide-in-top" style={{ animationDelay: '0.05s' }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground font-medium">Sign in to your TaskPro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium animate-slide-in-top">
                {error}
              </div>
            )}

            <div className="group">
              <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="your_username"
                  className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-300 hover:border-primary/50"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-300 hover:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border border-border bg-muted/50 checked:bg-primary checked:border-primary transition-all" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-xs text-muted-foreground font-medium">OR</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-2.5 px-4 border border-border/50 rounded-xl hover:bg-muted/50 transition-all duration-300 font-semibold text-sm hover:border-primary/50"
              >
                Google
              </button>
              <button
                type="button"
                className="py-2.5 px-4 border border-border/50 rounded-xl hover:bg-muted/50 transition-all duration-300 font-semibold text-sm hover:border-primary/50"
              >
                GitHub
              </button>
            </div>
          </form>

          <div className="mt-8 text-center animate-slide-in-top" style={{ animationDelay: '0.15s' }}>
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <button type="button" className="text-primary hover:text-primary/80 font-bold transition-colors" onClick={() => onSwitch?.('signup')}>
                Sign up
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p>Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
