import BoardTile from './BoardTile'
import { cn } from '@/lib/utils'
import { SPIRAL_COORDINATES } from '../constants/tileLayout'

function BoardGrid({ className }) {
  return (
    <section className={cn("grid grid-cols-54 grid-rows-48 gap-2", className)} aria-label="Board">
      {SPIRAL_COORDINATES.map((tile) => (
        <BoardTile key={tile.id} tileNumber={tile.id} />
      ))}
    </section>
  )
}

export default BoardGrid
