import CategoryTile from '@/components/game/CategoryTile'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getTileGridStyle, SPIRAL_COORDINATES } from '@/features/games/routes/GamePlay/constants/tileLayout'
import { CORNER_BY_TILE } from '@/features/games/routes/GamePlay/constants/tokenLayout'

const startCategory = { name: 'Start', showIcon: false }
const goalCategory = { icon: 'system/goal.png', name: 'Goal' }

function BoardLayoutPreview({ layout = [], showGhost = false }) {
  const layoutByPosition = new Map(layout.map((tile) => [tile.position, tile]))

  const renderTile = (tile) => {
    const layoutTile = layoutByPosition.get(tile.id)
    const category = tile.id === 0
      ? startCategory
      : tile.id === 30
        ? goalCategory
        : layoutTile?.category

    const badgeStyle = {
      top: CORNER_BY_TILE[tile.id] === 'topLeft' ? '12px' : '4px',
      left: CORNER_BY_TILE[tile.id] === 'topLeft' ? '12px' : '4px',
      width: '1.35rem',
      height: '1.35rem',
      fontSize: '0.75rem',
    }

    return (
      <CategoryTile
        key={tile.id}
        category={category}
        tileNumber={tile.id}
        corner={CORNER_BY_TILE[tile.id] ?? 'none'}
        showShadow={false}
        isGhost={showGhost}
        badgeStyle={badgeStyle}
        className="border-3"
        style={getTileGridStyle(tile.id)}
      />
    )
  }

  return (
    <div className="min-w-0 space-y-2 p-3 sm:p-4">
      <p className="text-center text-xs text-muted-foreground lg:hidden">Swipe horizontally to explore the board</p>

      <ScrollArea className="w-full max-w-full overflow-hidden lg:hidden">
        <section
          className="grid aspect-9/7 w-2xl max-w-none grid-cols-54 grid-rows-48 gap-2 pr-2 sm:w-184 md:w-200"
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
