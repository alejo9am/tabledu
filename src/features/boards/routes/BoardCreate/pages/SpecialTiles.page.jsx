import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/AuthContext'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'
import SpecialCategoryCard from '@/features/boards/routes/BoardCreate/components/SpecialCategoryCard'
import { fetchUserCategories } from '@/services/categories'

function SpecialTilesPage({ form }) {
  const { user } = useAuth()
  const [isLoadingSpecials, setIsLoadingSpecials] = useState(!form.specialCategoriesLoaded)
  const { hydrateSpecialCategories, specialCategoriesLoaded } = form

  const loadSpecialCategories = useCallback(async () => {
    // Skip re-fetching data if we already have it
    if (specialCategoriesLoaded) {
      setIsLoadingSpecials(false)
      return
    }

    setIsLoadingSpecials(true)

    try {
      const categories = await fetchUserCategories(user?.id)
      hydrateSpecialCategories(categories.filter((category) => category.type !== 'question'))
    } catch (error) {
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
              type="challenge"
              category={form.specialCategories.challenge}
              onChange={(updates) => form.updateSpecialCategory('challenge', updates)}
            />
            <SpecialCategoryCard
              type="attack"
              category={form.specialCategories.attack}
              onChange={(updates) => form.updateSpecialCategory('attack', updates)}
            />
            <SpecialCategoryCard
              type="pipe"
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
