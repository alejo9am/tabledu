import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { Mail02Icon, LockPasswordIcon, ViewOffIcon, ViewIcon, Loading02Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { supabase } from '@/lib/supabase'
import registerBg from '@/assets/register-bg.svg'
import AuthHeader from '@/features/auth/components/AuthHeader'
import AuthVisualPanel from '@/features/auth/components/AuthVisualPanel'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from '@/components/ui/input-group'

function parseSupabaseError(error) {
  if (error?.name === 'AuthWeakPasswordError' && error?.reasons) {
    const messages = []
    if (error.reasons.includes('length')) messages.push({ message: 'Password must be at least 6 characters.' })
    if (error.reasons.includes('characters')) messages.push({ message: 'Password must include uppercase, lowercase, and numbers.' })
    if (error.reasons.includes('pwned')) messages.push({ message: 'This password has been exposed in a data breach.' })
    return messages.length > 0 ? messages : [{ message: error.message ?? 'Weak password.' }]
  }

  return [{ message: error?.message ?? String(error) }]
}

function RegisterPage() {
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (password !== confirmPassword) {
      setError([{ message: 'Passwords do not match.' }])
      return
    }

    setLoading(true)

    try {
      const { error: signError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (signError) {
        setError(parseSupabaseError(signError))
        return
      }

      setNotice('Verify your email using the link we just sent. No email? The account may already exist.')
    } catch (err) {
      setError(parseSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full animate-in fade-in" aria-label="Create account">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-2">
        <AuthVisualPanel
          backgroundImage={registerBg}
          title="Join the platform"
          subtitle="Start building board games for your students"
          subtitleClassName="font-semibold leading-relaxed"
        />

        {/* Form panel */}
        <div className="flex flex-1 flex-col items-center justify-start bg-card px-6 py-8 sm:px-8 lg:justify-center lg:px-10">
          <div className="w-full max-w-md">
            <AuthHeader title="Create account" subtitle="Let's start with a few details." />

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
                    onChange={(e) => {
                      const val = e.target.value
                      setPassword(val)
                      setError(confirmPassword && val !== confirmPassword ? [{ message: 'Passwords do not match.' }] : null)
                    }}
                    required
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
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

              <Field>
                <FieldLabel>Confirm password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Icon icon={LockPasswordIcon} />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      const val = e.target.value
                      setConfirmPassword(val)
                      setError(password && val !== password ? [{ message: 'Passwords do not match.' }] : null)
                    }}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      <Icon icon={showConfirm ? ViewOffIcon : ViewIcon} />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              {error && (
                <Field data-invalid={true}>
                  <FieldError errors={error} />
                </Field>
              )}

              {notice && (
                <div className="flex items-start gap-2.5 rounded-xl border-2 border-success-700 bg-success-200 p-3 text-sm font-semibold text-success-700" role="status">
                  <Icon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4 shrink-0" />
                  <span>{notice}</span>
                </div>
              )}

              <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <Link to="/login" state={{ from: location.pathname }} className="text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
                  Already have an account? Login
                </Link>
                <Button type="submit" disabled={loading} size="lg" className="justify-center">
                  {loading && <Icon icon={Loading02Icon} className="size-4 animate-spin" />}
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
