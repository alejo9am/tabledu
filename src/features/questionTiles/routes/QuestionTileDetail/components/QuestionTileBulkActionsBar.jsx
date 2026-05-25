import { useState } from 'react'
import { Delete02Icon, MoveIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function QuestionTileBulkActionsBar({ model }) {
  const [isMovePopoverOpen, setIsMovePopoverOpen] = useState(false)

  if (!model.selectedQuestionIds.length) {
    return null
  }

  const hasManyDestinationTiles = model.availableDestinationTiles.length > 4

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
      <p className="text-sm font-semibold">{model.selectedQuestionIds.length} selected</p>
      <div className="flex items-center gap-2">
        <Popover
          open={isMovePopoverOpen}
          onOpenChange={(open) => {
            setIsMovePopoverOpen(open)
            if (!open) {
              model.setDestinationTileId('')
            }
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button size="sm" variant="secondary" disabled={model.isApplyingBulkAction || !model.availableDestinationTiles.length}>
                  <Icon icon={MoveIcon} className="size-4" />
                  Move to tile
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Pick destination tile</TooltipContent>
          </Tooltip>
          <PopoverContent align="start" className="w-72 p-4">
            <p className="text-sm font-semibold">Select destination tile</p>
            <ScrollArea className={hasManyDestinationTiles ? 'h-36 overflow-hidden' : ''}>
              <div className="space-y-1">
                {model.availableDestinationTiles.map((destinationTile) => {
                  const isSelected = model.destinationTileId === destinationTile.id
                  return (
                    <button
                      key={destinationTile.id}
                      type="button"
                      onClick={() => model.setDestinationTileId(destinationTile.id)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'}`}
                    >
                      {destinationTile.name}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
            <p className="mt-3 text-xs text-muted-foreground">
              This action removes the selected questions from this tile and adds them to the destination tile.
            </p>
            <Button
              size="sm"
              className="-mt-1 w-full"
              onClick={model.applyBulkMove}
              disabled={model.isApplyingBulkAction || !model.destinationTileId}
            >
              Confirm move
            </Button>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="destructive" onClick={model.requestDeleteManyQuestions} disabled={model.isApplyingBulkAction}>
              <Icon icon={Delete02Icon} className="size-4" />
              Delete
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete selected questions</TooltipContent>
        </Tooltip>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={model.clearSelection}>
            Clear selection
          </Button>
        </TooltipTrigger>
        <TooltipContent>Unselect all rows</TooltipContent>
      </Tooltip>
    </div>
  )
}

export default QuestionTileBulkActionsBar
