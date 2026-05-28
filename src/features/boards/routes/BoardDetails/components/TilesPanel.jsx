import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AddSquareIcon,
  Alert02Icon,
  Add01Icon,
  ArrowDown01Icon,
  CheckmarkSquare02Icon,
  ShuffleSquareIcon,
  ArrowReloadHorizontalIcon,
  Delete02Icon
} from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Icon } from '@/components/ui/Icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { getSpecialTileMeta } from '@/lib/constants/specialTileMeta'

function RegenNote({ children }) {
  return (
    <p className="flex items-center gap-1.5 rounded-lg bg-card border-2 border-dashed border-destructive px-3 py-2 text-xs text-destructive font-medium">
      <Icon icon={Alert02Icon} className="size-4" />
      {children}
    </p>
  )
}

function TileIcon({ tile, hasWarning = false }) {
  const icon = (
    <div className="relative size-16 shrink-0">
      <TileCard tile={tile} showShadow={false} className="w-full h-full border-3" />
      {hasWarning ? <span className="absolute -right-1 -top-1 size-4 animate-pulse rounded-full bg-destructive ring-2 ring-card" /> : null}
    </div>
  )

  if (!hasWarning) return icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent>This tile has no questions yet.</TooltipContent>
    </Tooltip>
  )
}

function TilesPanel({
  isEditing,
  hasActiveEditor,
  specialTiles,
  questionTiles,
  availableQuestionTiles,
  onRegenerateLayout,
  onToggleSpecial,
  onAddQuestionTile,
  onRemoveQuestionTile,
  onSwapQuestionTile,
}) {
  const [pickerAction, setPickerAction] = useState(null)
  const selectedQuestionTileIds = new Set(questionTiles.map((tile) => tile.id))
  const unselectedQuestionTiles = availableQuestionTiles.filter((tile) => !selectedQuestionTileIds.has(tile.id))

  const handlePickQuestionTile = (tile) => {
    if (pickerAction?.type === 'swap') {
      onSwapQuestionTile({ currentTileId: pickerAction.tileId, nextTile: tile })
    } else {
      onAddQuestionTile(tile)
    }
    setPickerAction(null)
  }

  return (
    <aside className="space-y-4 rounded-2xl border bg-card p-4 lg:col-span-4">
      <section className="space-y-2">
        {isEditing ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="warning" size="lg" className="w-full text-base" onClick={() => onRegenerateLayout()}>
                <Icon icon={ShuffleSquareIcon} className="size-4" />
                Regenerate layout
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rebuilds the full board using current tile selection.</TooltipContent>
          </Tooltip>
        ) : null}
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Special tiles</p>
        {isEditing ? <RegenNote>Toggling regenerates the full layout</RegenNote> : null}
        {specialTiles.map((tile) => {
          const isDisabled = !tile.enabled
          const tileMeta = getSpecialTileMeta(tile.type, 'boardDetails')
          return (
            <div key={tile.id} className={cn('flex gap-3 rounded-xl border p-3', isDisabled && 'opacity-50')}>
              <TileIcon tile={tile} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between items-center gap-2">
                  <p className="truncate font-semibold">{tile.name}</p>
                  <Toggle
                    pressed={tile.enabled}
                    onPressedChange={() => onToggleSpecial(tile.type)}
                    variant="outline"
                    size="sm"
                    disabled={!isEditing}
                    aria-label={`${tile.name} enabled`}
                    className="data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <Icon icon={tile.enabled ? CheckmarkSquare02Icon : AddSquareIcon} className="size-4" />
                    {tile.enabled ? 'Included' : 'Add tile'}
                  </Toggle>
                </div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="link"
                      className="group h-auto justify-start gap-1 p-0 text-xs text-muted-foreground"
                    >
                      <Icon icon={ArrowDown01Icon} className="size-3 transition-transform group-data-[state=open]:rotate-180" />
                      More details
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="pt-1 text-sm text-muted-foreground">{tileMeta.description}</p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          )
        })}
      </section>

      <section className="space-y-2 border-t pt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Question tiles</p>
        {isEditing ? <RegenNote>Adding or removing tiles regenerates the full layout</RegenNote> : null}
        {isEditing ? (
          <Button variant="outline" className="w-full" onClick={() => setPickerAction({ type: 'add' })} disabled={questionTiles.length >= 6}>
            <Icon icon={Add01Icon} className="size-4" />
            Add question tile
          </Button>
        ) : null}
        {questionTiles.map((tile) => {
          const hasNoQuestions = tile.questionCount === 0
          const content = (
            <div className={cn('flex items-center gap-3 rounded-xl border p-3')}>
              <TileIcon tile={tile} hasWarning={hasNoQuestions} />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold">{tile.name}</p>
                <Badge
                  variant={hasNoQuestions ? 'destructive' : 'ghost'}
                >
                  {tile.questionCount} questions
                </Badge>
              </div>
              {isEditing ? (
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        className="rounded-full p-4"
                        onClick={() => setPickerAction({ type: 'swap', tileId: tile.id })}
                        aria-label={`Swap ${tile.name}`}
                      >
                        <Icon icon={ArrowReloadHorizontalIcon} className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Swap tile</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          size="icon-xs"
                          variant="destructive-soft"
                          className="rounded-full p-4"
                          disabled={questionTiles.length <= 1}
                          onClick={() => onRemoveQuestionTile(tile.id)}
                          aria-label={`Remove ${tile.name}`}
                        >
                          <Icon icon={Delete02Icon} className="size-4" />
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {questionTiles.length <= 1 ? 'At least one question tile is required.' : 'Remove tile'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : null}
            </div>
          )
          if (isEditing || hasActiveEditor) {
            return <div key={tile.id}>{content}</div>
          }

          return <Link key={tile.id} to={`/tiles/questions/${tile.id}`} className="block">{content}</Link>
        })}
      </section>

      <Dialog open={Boolean(pickerAction)} onOpenChange={(open) => !open && setPickerAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose a question tile</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-90 mr-2 px-3 pb-6">
            <div className="space-y-2">
              {unselectedQuestionTiles.map((tile) => (
                <button key={tile.id} type="button" className="flex w-full items-center gap-3 rounded-xl border p-3 text-left hover:bg-muted" onClick={() => handlePickQuestionTile(tile)}>
                  <TileIcon tile={tile} hasWarning={tile.questionCount === 0} />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate font-semibold">{tile.name}</p>
                    <Badge
                      variant={tile.questionCount === 0 ? 'destructive' : 'ghost'}
                    >
                      {tile.questionCount} questions
                    </Badge>
                  </div>
                </button>
              ))}
              {!unselectedQuestionTiles.length ? <p className="py-4 text-center text-sm text-muted-foreground">No available question tiles.</p> : null}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </aside>
  )
}

export default TilesPanel
