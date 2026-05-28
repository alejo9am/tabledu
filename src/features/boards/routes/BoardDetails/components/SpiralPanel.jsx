

import { useState } from 'react'
import TileCard from '@/components/game/TileCard'
import ReplaceTileDialog from '@/features/boards/components/ReplaceTileDialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'
import { Touch08Icon } from '@hugeicons/core-free-icons'
import { getTileGridStyle, SPIRAL_COORDINATES } from '@/features/games/routes/GamePlay/constants/tileLayout'
import { CORNER_BY_TILE } from '@/features/games/routes/GamePlay/constants/tokenLayout'

const startTile = { name: 'Start', showIcon: false }
const goalTile = { icon: 'system/goal.png', name: 'Goal' }

function SpiralPanel({ isEditing, layout, questionTiles, specialTiles, onUpdateCell }) {
  const [editingPosition, setEditingPosition] = useState(null)
  const layoutByPosition = new Map(layout.map((layoutEntry) => [layoutEntry.position, layoutEntry]))
  const enabledSpecialTiles = Object.fromEntries(specialTiles.map((tile) => [tile.type, tile]))

  const handleTileClick = (position) => {
    if (!isEditing) return
    setEditingPosition(position)
  }

  const handleReplaceTile = (position, tile) => {
    onUpdateCell({ position, tile })
    setEditingPosition(null)
  }

  const renderTile = (spiralTile) => {
    const tileId = spiralTile.id
    const isInteractive = isEditing && tileId >= 1 && tileId <= 29
    const layoutEntry = layoutByPosition.get(tileId)

    const tileData = tileId === 0
      ? startTile
      : tileId === 30
        ? goalTile
        : layoutEntry?.tile

    const badgeStyle = {
      top: CORNER_BY_TILE[tileId] === 'topLeft' ? '12px' : '4px',
      left: CORNER_BY_TILE[tileId] === 'topLeft' ? '12px' : '4px',
      width: '1.35rem',
      height: '1.35rem',
      fontSize: '0.75rem',
    }

    return (
      <TileCard
        key={tileId}
        tile={tileData}
        tileNumber={tileId}
        corner={CORNER_BY_TILE[tileId] ?? 'none'}
        showShadow={false}
        badgeStyle={badgeStyle}
        className={cn('border-3', isInteractive ? 'cursor-pointer transition-opacity hover:opacity-90' : '')}
        style={getTileGridStyle(tileId)}
        onClick={isInteractive ? () => handleTileClick(tileId) : undefined}
      />
    )
  }

  return (
    <article className="min-w-0 rounded-2xl border bg-card p-4 lg:col-span-8">
      {isEditing ? (
        <p className="flex items-center justify-center gap-2 mb-3 w-fit mx-auto rounded-lg bg-primary-200 px-4 py-2 text-sm text-primary-700">
          <Icon icon={Touch08Icon} className="size-4" />
          Click any cell to replace its tile.
        </p>
      ) : null}

      <div className="min-w-0 space-y-2 overflow-x-hidden">
        <p className="text-center text-xs text-muted-foreground lg:hidden">Swipe horizontally to explore the board</p>

        <ScrollArea className="w-full max-w-full overflow-hidden lg:hidden">
          <section
            className="grid aspect-9/7 w-2xl max-w-none grid-cols-54 grid-rows-48 gap-2 p-2 sm:w-184 md:w-200"
            aria-label="Board layout preview"
          >
            {SPIRAL_COORDINATES.map(renderTile)}
          </section>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <section
          className="hidden p-1 min-w-0 w-full grid-cols-54 grid-rows-48 gap-2 lg:grid lg:aspect-9/7"
          aria-label="Board layout preview"
        >
          {SPIRAL_COORDINATES.map(renderTile)}
        </section>
      </div>

      <ReplaceTileDialog
        editingPosition={editingPosition}
        layout={layout}
        questionTiles={questionTiles}
        specialTiles={enabledSpecialTiles}
        onClose={() => setEditingPosition(null)}
        onReplaceTile={handleReplaceTile}
      />
    </article>
  )
}

export default SpiralPanel
