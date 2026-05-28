import { useMemo, useState } from 'react'
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

function ReplaceTileDialog({
  editingPosition,
  layout,
  questionTiles,
  specialTiles,
  onClose,
  onReplaceTile,
}) {
  const [selectedTileId, setSelectedTileId] = useState(null)
  const isOpen = Boolean(editingPosition)

  const allOptions = useMemo(() => {
    return [
      ...questionTiles,
      ...Object.values(specialTiles ?? {}).filter((tile) => tile.enabled),
    ]
  }, [questionTiles, specialTiles])

  const currentTileId = layout.find((tile) => tile.position === editingPosition)?.tile?.id ?? null
  const selectedTile = allOptions.find((tile) => tile.id === (selectedTileId ?? currentTileId)) ?? null

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      setSelectedTileId(null)
      onClose()
    }
  }

  const handleApply = () => {
    if (!editingPosition || !selectedTile) return
    onReplaceTile(editingPosition, selectedTile)
    setSelectedTileId(null)
  }

  const renderOptionPill = (tile) => {
    const isSelected = tile.id === (selectedTileId ?? currentTileId)

    return (
        <button
        key={tile.id}
        type="button"
        onClick={() => setSelectedTileId(tile.id)}
        className={cn(
          'relative flex h-fit w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40',
          isSelected && 'border-2 border-primary bg-primary-200 hover:bg-primary-200/80'
        )}
        aria-pressed={isSelected}
      >
        <TileCard tile={tile} showShadow={false} className="size-16 shrink-0" />
        <p className="flex-1 truncate text-lg font-medium text-foreground">{tile.name}</p>
        {isSelected ? <Icon icon={CheckmarkCircle02Icon} className="size-4 shrink-0 text-primary" /> : null}
      </button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit tile {editingPosition}</DialogTitle>
          <DialogDescription>
            Pick another tile for this position. Use this for quick corrections after shuffling.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] md:gap-6">
            <section className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Special tiles</p>
              <div className="space-y-2">
                {allOptions.filter((tile) => tile.type !== 'question').map(renderOptionPill)}
              </div>
            </section>

            <div className="hidden w-px shrink-0 self-stretch bg-border md:block" />

            <section className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Question tiles</p>
              <ScrollArea className="h-90 pr-1">
                <div className="space-y-2">
                  {allOptions.filter((tile) => tile.type === 'question').map(renderOptionPill)}
                </div>
              </ScrollArea>
            </section>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 md:flex-row md:justify-end">
          <Button type="button" variant="secondary" className="w-full md:h-8 md:w-auto" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="w-full md:h-8 md:w-auto" onClick={handleApply} disabled={!selectedTile}>
            Apply change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReplaceTileDialog
