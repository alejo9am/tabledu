// import useAppNavigation from "@/hooks/useAppNavigation.hook"
// import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BoardLayoutPreview from '@/components/game/BoardLayoutPreview'

function BoardCard({
  board = null,
  isLoading = false,
}) {
  // const { goTo } = useAppNavigation()

  const title = board?.name ?? "Unknown Board"
  const description = board?.description ?? "Open board to see more details"
  const boardLabel = title || `Board #${board?.id ?? 'unknown'}`
  const layoutRows = (board?.layout ?? [])//.slice(0, 8)



  if (isLoading) {
    return <Skeleton className="h-56 rounded-xl animate-in fade-in" />
  }

  return (
    <article className="flex w-full flex-col rounded-xl border bg-card animate-in fade-in">
        <div className="flex items-center justify-center overflow-hidden border-b border-border bg-accent p-5 rounded-t-xl">
          <BoardLayoutPreview layout={layoutRows} />
        </div>
        
        <div className="p-5">
          <p className="truncate font-display font-semibold text-3xl leading-tight text-primary">{boardLabel}</p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          {/* <Button type="button" variant="default" size="sm" onClick={() => goTo(`/boards/${board?.id}`)}>
            See Details
          </Button> */}
        </div>

    </article>
  )
}

export default BoardCard
