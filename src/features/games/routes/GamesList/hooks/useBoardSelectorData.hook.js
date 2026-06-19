import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchBoards } from '@/services/boards'

export function useBoardSelectorData(open) {
  const { user } = useAuth()
  const [boards, setBoards] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadBoards = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!user?.id) {
        setBoards([])
        return
      }

      const data = await fetchBoards()
      setBoards(data)
    } catch (fetchError) {
      setError({
        technicalMessage: fetchError?.message ?? null,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (open) {
      loadBoards()
    }
  }, [loadBoards, open])

  return {
    boards,
    isLoading,
    error,
    reload: loadBoards,
  }
}
