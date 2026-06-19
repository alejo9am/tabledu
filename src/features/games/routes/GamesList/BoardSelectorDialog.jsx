import useAppNavigation from '@/hooks/useAppNavigation.hook'
import BoardCard from '@/components/cards/BoardCard'
import ErrorState from '@/components/ui/error-state'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AddCircleIcon, DashboardSquare02Icon } from '@hugeicons/core-free-icons'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function BoardSelectorDialog({ open, onOpenChange, boards = [], isLoading = false, error = null, onRetry }) {
  const { goTo } = useAppNavigation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(42rem,calc(100vh-2rem))] flex-col overflow-hidden p-0 md:max-w-3xl 2xl:max-w-6xl">
        <DialogHeader className="border-b border-border/70 p-6 pr-14">
          <DialogTitle>Board Selector</DialogTitle>
          <DialogDescription>
            Select the board you want to use for this game session.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {error ? (
            <div className="px-6 py-5">
              <ErrorState
                title="We could not load your boards"
                description="Something went wrong while preparing game setup. Please try again."
                technicalDetails={error.technicalMessage}
                onRetry={onRetry}
              />
            </div>
          ) : null}

          {!error && !isLoading && boards.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6 py-5">
              <Empty className="w-fit p-6 md:p-10">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Icon icon={DashboardSquare02Icon} className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle>No boards yet</EmptyTitle>
                  <EmptyDescription>Create a board first, then start your game session setup.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="warning" onClick={() => goTo('/boards/new')}>
                    <Icon icon={AddCircleIcon} className="size-4" />
                    Create a Board
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          ) : null}

          {!error && boards.length > 0 ? (
            <TooltipProvider>
              <ScrollArea className="min-h-0 flex-1">
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {boards.map((item) => {
                      const isDisabled = item.emptyQuestionTileCount > 0

                      if (isDisabled) {
                        return (
                          <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                              <span className="block">
                                <BoardCard
                                  board={item}
                                  isLoading={false}
                                  linkTo={`/games/new/${item.id}`}
                                  showActions={false}
                                  className="pointer-events-none cursor-not-allowed opacity-60 transition-none"
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">Add questions first</TooltipContent>
                          </Tooltip>
                        )
                      }

                      return (
                        <BoardCard
                          key={item.id}
                          board={item}
                          isLoading={false}
                          linkTo={`/games/new/${item.id}`}
                          showActions={false}
                        />
                      )
                    })}
                  </div>
                </div>
              </ScrollArea>
            </TooltipProvider>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BoardSelectorDialog
