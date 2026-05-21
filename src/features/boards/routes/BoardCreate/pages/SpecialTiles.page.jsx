import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
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
    <article className="rounded-2xl border bg-card p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Step 1</p>
        <h2 className="mt-1 font-display text-3xl font-semibold text-primary sm:text-4xl">Board details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Name your board and configure the special tiles that can appear in play.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="board-name">Board name</label>
          <Input
            id="board-name"
            value={form.name}
            placeholder="e.g. Ancient Civilizations Review"
            onChange={(event) => form.setName(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="board-description">Description</label>
          <Textarea
            id="board-description"
            value={form.description}
            placeholder="Describe the goal of this board"
            onChange={(event) => form.setDescription(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Special tiles</h3>
            <p className="text-sm text-muted-foreground">These tiles add surprises to the board. Disable any you do not want to use.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {isLoadingSpecials ? (
            <>
              <Skeleton className="h-72 rounded-xl" />
              <Skeleton className="h-72 rounded-xl" />
              <Skeleton className="h-72 rounded-xl" />
            </>
          ) : (
            <>
              <SpecialCategoryCard
                type="attack"
                category={form.specialCategories.attack}
                onChange={(updates) => form.updateSpecialCategory('attack', updates)}
              />
              <SpecialCategoryCard
                type="challenge"
                category={form.specialCategories.challenge}
                onChange={(updates) => form.updateSpecialCategory('challenge', updates)}
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
    </article>
  )
}

export default SpecialTilesPage
