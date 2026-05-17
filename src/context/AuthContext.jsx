import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        // Check if we have an email verification token in the URL
        const params = new URLSearchParams(window.location.search)
        const tokenHash = params.get('token_hash')
        const tokenType = params.get('type')

        if (tokenHash && tokenType) {
          // User clicked confirmation link in email
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: tokenType,
          })

          if (verifyError) {
            console.error('Email verification failed:', verifyError)
            setError(verifyError)
          }

          // Clean up URL parameters
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        // Now check for existing session
        const { data, error: sessionError } = await supabase.auth.getSession()
        const session = data?.session ?? null

        if (!isMounted) return

        if (sessionError) {
          setError(sessionError)
          setIsLoading(false)
          return
        }

        if (session) {
          const { error: claimsError } = await supabase.auth.getClaims()
          if (!isMounted) return
          if (claimsError) {
            setSession(null)
            setUser(null)
          } else {
            setSession(session)
            setUser(session.user)
          }
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (isMounted) {
          setError(err)
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: authData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setIsLoading(false)
    })
    const subscription = authData?.subscription

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      setSession(null)
      setUser(null)
    }
  }

  const value = { session, user, isLoading, error, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
