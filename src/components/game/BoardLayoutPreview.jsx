import TileCard from '@/components/game/TileCard'
import { getTileGridStyle } from '@/features/games/routes/GamePlay/constants/tileLayout'

function BoardLayoutPreview({ layout }) {
  const layoutRows = [
    { id: 'start', position: 0, name: 'Start', showIcon: false },
    ...(layout ?? []),
    { id: 'goal', position: 30, name: 'Goal', icon: 'system/goal.png' },
  ]

  return (
    <div className="grid w-fit h-fit grid-cols-54 grid-rows-48 gap-1.5">
      {layoutRows.map((tile) => {
        return (
          <TileCard
            key={tile.position}
            tile={tile}
            className="border-0"
            style={getTileGridStyle(tile.position, null)}
          />
        )
      })}
    </div>
  )
}

export default BoardLayoutPreview
