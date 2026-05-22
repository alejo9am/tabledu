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
import { cn } from '@/lib/utils'

const getTileKey = (tile) => tile.localId ?? tile.id ?? `${tile.type}:${tile.name}`

function ReplaceTileDialog({
  editingTilePosition,
  generatedLayout,
  selectedQuestionTiles,
  specialTiles,
  onClose,
  onReplaceTile,
}) {
  const [selectedRef, setSelectedRef] = useState(null)
  const isOpen = Boolean(editingTilePosition)

  const { specialOptions, questionOptions, optionByKey } = useMemo(() => {
    const allOptions = [
      ...selectedQuestionTiles,
      ...Object.values(specialTiles ?? {}).filter((tile) => tile.enabled),
    ].map((tile) => ({
      tile,
      tileKey: getTileKey(tile),
    }))

    const byKey = new Map(allOptions.map((option) => [option.tileKey, option]))

    return {
      specialOptions: allOptions.filter((option) => option.tile.type !== 'question'),
      questionOptions: allOptions.filter((option) => option.tile.type === 'question'),
      optionByKey: byKey,
    }
  }, [selectedQuestionTiles, specialTiles])

  const currentTile = generatedLayout.find((tile) => tile.position === editingTilePosition)?.tile ?? null
  const currentTileKey = currentTile ? getTileKey(currentTile) : null
  const effectiveSelectedRef = selectedRef ?? currentTileKey
  const selectedTileOption = optionByKey.get(effectiveSelectedRef) ?? null

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      setSelectedRef(null)
      onClose()
    }
  }

  const handleApply = () => {
    if (!editingTilePosition || !selectedTileOption) return
    onReplaceTile(editingTilePosition, selectedTileOption)
    setSelectedRef(null)
  }

  const renderOptionPill = (option) => {
    const isSelected = option.tileKey === effectiveSelectedRef

    return (
        <button
        key={option.tileKey}
        type="button"
        onClick={() => setSelectedRef(option.tileKey)}
        className={cn(
          'relative flex h-fit w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40',
          isSelected && 'border-2 border-primary bg-primary-200 hover:bg-primary-200/80'
        )}
        aria-pressed={isSelected}
      >
        <TileCard tile={option.tile} showShadow={false} className="size-16 shrink-0" />
        <p className="flex-1 truncate text-lg font-medium text-foreground">{option.tile.name}</p>
        {isSelected ? <Icon icon={CheckmarkCircle02Icon} className="size-4 shrink-0 text-primary" /> : null}
      </button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit tile {editingTilePosition}</DialogTitle>
          <DialogDescription>
            Pick another tile for this position. Use this for quick corrections after shuffling.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] md:gap-6">
            <section className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Special tiles</p>
              <div className="space-y-2">{specialOptions.map(renderOptionPill)}</div>
            </section>

            <div className="hidden w-px shrink-0 self-stretch bg-border md:block" />

            <section className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Question tiles</p>
              <div className="space-y-2">{questionOptions.map(renderOptionPill)}</div>
            </section>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 md:flex-row md:justify-end">
          <Button type="button" variant="secondary" className="w-full md:h-8 md:w-auto" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="w-full md:h-8 md:w-auto" onClick={handleApply} disabled={!selectedTileOption}>
            Apply change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReplaceTileDialog
