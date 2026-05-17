import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function useAppNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const goTo = useCallback((to, options = {}) => {
    if (typeof to !== 'string') {
      navigate(to, options)
      return
    }

    const state = options.state ?? {}
    const nextState = state.from ? state : { ...state, from: location.pathname }

    navigate(to, {
      ...options,
      state: nextState,
    })
  }, [location.pathname, navigate])

  // Use this for auth redirects and canonical route rewrites, where you should not keep the previous page in history.
  const replaceTo = useCallback((to, options = {}) => {
    goTo(to, { ...options, replace: true })
  }, [goTo])

  const goBack = useCallback((fallbackTo = '/') => {
    const fromState = location.state?.from

    if (
      typeof fromState === 'string' &&
      fromState.startsWith('/') &&
      fromState !== location.pathname
    ) {
      navigate(fromState)
      return
    }

    let hasSafeInternalReferrer = false
    if (
      typeof document !== 'undefined' &&
      typeof window !== 'undefined' &&
      document.referrer
    ) {
      try {
        const referrerUrl = new URL(document.referrer)
        hasSafeInternalReferrer = referrerUrl.origin === window.location.origin
      } catch {
        hasSafeInternalReferrer = false
      }
    }

    if (window.history.length > 1 && hasSafeInternalReferrer) {
      navigate(-1)
      return
    }

    navigate(fallbackTo, { replace: true })
  }, [location.pathname, location.state, navigate])

  return { goTo, replaceTo, goBack }
}

export default useAppNavigation
