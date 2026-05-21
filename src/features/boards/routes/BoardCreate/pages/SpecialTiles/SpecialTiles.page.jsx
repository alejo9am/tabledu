import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/AuthContext'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import SpecialCategoryCard from '@/features/boards/routes/BoardCreate/pages/SpecialTiles/SpecialCategoryCard'
import { fetchUserCategories } from '@/services/categories'

function SpecialTilesPage({ form }) {
  const { user } = useAuth()
  const [isLoadingSpecials, setIsLoadingSpecials] = useState(!form.specialCategoriesLoaded)
  const { hydrateSpecialCategories, specialCategoriesLoaded } = form

  const loadSpecialCategories = useCallback(async () => {
    if (specialCategoriesLoaded) {
      setIsLoadingSpecials(false)
      return
    }

    setIsLoadingSpecials(true)

    try {
      const categories = await fetchUserCategories(user?.id)
      hydrateSpecialCategories(categories.filter((category) => category.type !== 'question'))
    } catch {
      toast.error('Could not load your saved special tiles. Defaults are available.')
      hydrateSpecialCategories([])
    } finally {
      setIsLoadingSpecials(false)
    }
  }, [hydrateSpecialCategories, specialCategoriesLoaded, user?.id])

  useEffect(() => {
    loadSpecialCategories()
  }, [loadSpecialCategories])

  return (
    <div className="space-y-4">
      <BoardCreateStepTitle currentStep={2} />

      <div className="grid gap-4 xl:grid-cols-3">
        {isLoadingSpecials ? (
          <>
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </>
        ) : (
          <>
            <SpecialCategoryCard
              category={form.specialCategories.challenge}
              onChange={(updates) => form.updateSpecialCategory('challenge', updates)}
            />
            <SpecialCategoryCard
              category={form.specialCategories.attack}
              onChange={(updates) => form.updateSpecialCategory('attack', updates)}
            />
            <SpecialCategoryCard
              category={form.specialCategories.pipe}
              onChange={(updates) => form.updateSpecialCategory('pipe', updates)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default SpecialTilesPage
