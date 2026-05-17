import { useEffect } from 'react'

/** Blocks leaving gameplay while the turn is in progress. */
export function usePreventGameExit(enabled) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled])
}
