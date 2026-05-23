import { cn } from '@/lib/utils'
import TileCard from '@/components/game/TileCard'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getTileGridStyle, SPIRAL_COORDINATES } from '@/features/games/routes/GamePlay/constants/tileLayout'
import { CORNER_BY_TILE } from '@/features/games/routes/GamePlay/constants/tokenLayout'

const startTile = { name: 'Start', showIcon: false }
const goalTile = { icon: 'system/goal.png', name: 'Goal' }

function BoardLayoutPreview({ layout = [], showGhost = false, onTileClick }) {
  const layoutByPosition = new Map(layout.map((tile) => [tile.position, tile]))

  const renderTile = (tile) => {
    const isInteractive = (
      !showGhost &&
      tile.id >=1 &&
      tile.id <= 29 &&
      typeof onTileClick === 'function' &&
      layoutByPosition.size === 29
    )
    const layoutTile = layoutByPosition.get(tile.id)
    const tileData = tile.id === 0
      ? startTile
      : tile.id === 30
        ? goalTile
        : layoutTile?.tile

    const badgeStyle = {
      top: CORNER_BY_TILE[tile.id] === 'topLeft' ? '12px' : '4px',
      left: CORNER_BY_TILE[tile.id] === 'topLeft' ? '12px' : '4px',
      width: '1.35rem',
      height: '1.35rem',
      fontSize: '0.75rem',
    }

    return (
      <TileCard
        key={tile.id}
        tile={tileData}
        tileNumber={tile.id}
        corner={CORNER_BY_TILE[tile.id] ?? 'none'}
        showShadow={false}
        isGhost={showGhost}
        badgeStyle={badgeStyle}
        className={cn('border-3', isInteractive ? 'cursor-pointer transition-opacity hover:opacity-90' : '')}
        style={getTileGridStyle(tile.id)}
        onClick={isInteractive ? () => onTileClick(tile.id) : undefined}
      />
    )
  }

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-center text-xs text-muted-foreground lg:hidden">Swipe horizontally to explore the board</p>

      <ScrollArea className="w-full max-w-full overflow-hidden lg:hidden">
        <section
          className="grid aspect-9/7 w-2xl max-w-none grid-cols-54 grid-rows-48 gap-2 p-2 sm:w-184 md:w-200"
          aria-label="Generated board layout preview"
        >
          {SPIRAL_COORDINATES.map(renderTile)}
        </section>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <section className="hidden grid-cols-54 grid-rows-48 gap-2 lg:grid lg:aspect-9/7 lg:w-full" aria-label="Generated board layout preview">
        {SPIRAL_COORDINATES.map(renderTile)}
      </section>
    </div>
  )
}

export default BoardLayoutPreview
