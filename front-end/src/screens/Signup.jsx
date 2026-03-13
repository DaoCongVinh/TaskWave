import { useMemo, useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Check, X } from 'lucide-react'
import { auth } from '../api/auth.js'

const passwordChecks = [
  { id: 'length', test: (value) => value.length >= 8, label: 'At least 8 characters' },
  { id: 'uppercase', test: (value) => /[A-Z]/.test(value), label: 'One uppercase letter' },
  { id: 'number', test: (value) => /\d/.test(value), label: 'One number' },
]

function SignupScreen({ onSuccess, onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agree, setAgree] = useState(false)

  const passwordScore = useMemo(() => {
    const passed = passwordChecks.filter((item) => item.test(password)).length
    return (passed / passwordChecks.length) * 100
  }, [password])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!agree) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }
      if (!name || !email || password.length < 8) {
        setError('Please fill all fields correctly (password min 8 chars)')
        setIsLoading(false)
        return
      }

      await auth.register(name, email, password)
      const loginResponse = await auth.login(name, password)
      const authData = loginResponse.data || loginResponse

      const userData = {
        name,
        email,
        token: authData.token
      }

      if (onSuccess) {
        onSuccess(userData)
      } else if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground flex items-center justify-center p-4 dark overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 premium-shadow backdrop-blur-xl animate-slide-in-top">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6">
              <span className="text-lg font-bold text-primary-foreground">TM</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Create your account
            </h2>
            <p className="text-muted-foreground mb-8 font-medium">
              Join thousands of teams who manage their work efficiently with TaskPro.
            </p>
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground">What's included</p>
                <ul className="mt-3 space-y-2 text-sm font-medium text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary" /> Unlimited projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary" /> Real-time collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-primary" /> Advanced analytics
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground">Why teams switch to TaskPro</p>
                <p className="mt-3 text-sm font-medium text-foreground/80">
                  "TaskPro has transformed our workflow. The AI-powered insights and automation features are game-changing."
                </p>
                <p className="mt-3 text-sm text-muted-foreground">— Sarah, Product Lead</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 premium-shadow backdrop-blur-xl animate-slide-in-top" style={{ animationDelay: '0.05s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Jane Cooper"
                    className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-300 hover:border-primary/50"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Work email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
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

              <div className="group">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-foreground mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-300 hover:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span>Password strength</span>
                  <span className={passwordScore > 65 ? 'text-emerald-500' : 'text-amber-500'}>
                    {passwordScore > 65 ? 'Strong' : passwordScore > 30 ? 'Medium' : 'Weak'}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${passwordScore > 65 ? 'bg-emerald-500' : passwordScore > 30 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    style={{ width: `${Math.min(passwordScore, 100)}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {passwordChecks.map((item) => {
                    const passed = item.test(password)
                    return (
                      <div key={item.id} className="flex items-center gap-2 text-sm font-medium">
                        {passed ? <Check size={16} className="text-emerald-500" /> : <X size={16} className="text-muted-foreground" />}
                        <span className={passed ? 'text-emerald-500' : 'text-muted-foreground'}>{item.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                  className="mt-1 w-4 h-4 rounded border border-border bg-muted/50 checked:bg-primary checked:border-primary transition-all"
                />
                <span className="text-muted-foreground">
                  I agree to the{' '}
                  <button type="button" className="text-primary font-semibold hover:text-primary/80">Terms of Service</button>
                  {' '}and{' '}
                  <button type="button" className="text-primary font-semibold hover:text-primary/80">Privacy Policy</button>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-lg transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button type="button" className="text-primary font-semibold hover:text-primary/80" onClick={() => onSwitch?.('login')}>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupScreen
