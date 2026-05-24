import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import useAppNavigation from '@/hooks/useAppNavigation.hook'
import { Mail02Icon, LockPasswordIcon, ViewOffIcon, ViewIcon, Loading02Icon } from '@hugeicons/core-free-icons'
import { supabase } from '@/lib/supabase'
import registerBg from '@/assets/register-bg.svg'
import AuthHeader from '@/features/auth/components/AuthHeader'
import AuthVisualPanel from '@/features/auth/components/AuthVisualPanel'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from '@/components/ui/input-group'

function LoginPage() {
  const { replaceTo } = useAppNavigation()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const from = location.state?.from ?? '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signError) {
        setError([{ message: signError.message }])
        setLoading(false)
        return
      }

      replaceTo(from)
    } catch (error) {
      setError([{ message: error?.message ?? String(error) }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full animate-in fade-in" aria-label="Sign in">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-2">
        <AuthVisualPanel
          backgroundImage={registerBg}
          title="Welcome back"
          subtitle="Sign in to continue creating your games"
        />

        {/* Form panel */}
        <div className="flex flex-1 flex-col items-center justify-start bg-card px-6 py-8 sm:px-8 lg:justify-center lg:px-10">
          <div className="w-full max-w-md">
            <AuthHeader
              title="Sign in"
              subtitle="Enter your credentials to continue"
              logoClassName="h-10 lg:h-15 w-auto"
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field>
                <FieldLabel>Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Icon icon={Mail02Icon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Icon icon={LockPasswordIcon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon icon={showPassword ? ViewOffIcon : ViewIcon} />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              {error && (
                <Field invalid>
                  <FieldError errors={error} />
                </Field>
              )}

              <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <Link to="/register" state={{ from: location.pathname }} className="text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                  Don't have an account? Register
                </Link>
                <Button type="submit" disabled={loading} size="lg" className="justify-center">
                  {loading && <Icon icon={Loading02Icon} className="size-4 animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
