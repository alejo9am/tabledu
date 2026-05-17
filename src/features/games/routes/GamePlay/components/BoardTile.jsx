import { useEffect, useRef, useState } from 'react'

import CategoryTile from '@/components/game/CategoryTile'
import Token from '@/components/ui/token'

import { useGame } from '../context/GameContext'

import { CORNER_BY_TILE, getTokenPosition, getTokenSizePx } from '../constants/tokenLayout'
import { getTileGridStyle } from '../constants/tileLayout'

function BoardTile({ tileNumber }) {

  const tileRef = useRef(null)
  const [tileMinSize, setTileMinSize] = useState(0)

  // Contexto global
  const { teams, currentTeam, boardCategory, categories } = useGame()

  // Variables derivadas
  const teamsOnTile = teams.filter((team) => team.position === tileNumber)
  const activeTeam = currentTeam?.position === tileNumber ? currentTeam : null
  const category = (() => {
    if (tileNumber === 0) {
      return { name: 'Start', showIcon: false }
    }
    if (tileNumber === 30) {
      return { icon: 'system/goal.png', name: 'Goal' }
    }
    const tileData = boardCategory.find((tile) => tile.position === tileNumber)
    return categories.find((cat) => cat.id === tileData?.category_id)
  })()
  const numberFontSizePx = Math.max(10, Math.min(18, tileMinSize * 0.16))
  const numberBadgeDiameterPx = Math.max(20, Math.min(34, numberFontSizePx * 1.85))
  const numberInsetPx = CORNER_BY_TILE[tileNumber] === 'topLeft'
    ? Math.max(4, Math.min(10, tileMinSize * 0.12))
    : Math.max(2, Math.min(6, tileMinSize * 0.04))

  useEffect(() => {
    const element = tileRef.current
    if (!element) return

    const updateSize = ({ width, height }) => {
      setTileMinSize(Math.min(width, height))
    }

    updateSize(element.getBoundingClientRect())

    const observer = new ResizeObserver(([entry]) => {
      updateSize(entry.contentRect)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <CategoryTile
      ref={tileRef}
      category={category}
      tileNumber={tileNumber}
      corner={CORNER_BY_TILE[tileNumber] ?? 'none'}
      active={Boolean(activeTeam)}
      badgeStyle={{
        top: `${numberInsetPx}px`,
        left: `${numberInsetPx}px`,
        width: `${numberBadgeDiameterPx}px`,
        height: `${numberBadgeDiameterPx}px`,
        fontSize: `${numberFontSizePx}px`
      }}
      style={getTileGridStyle(tileNumber, activeTeam?.color)}
    >
      <div className='pointer-events-none absolute inset-0 z-20' aria-label='Teams on this tile'>
        {teamsOnTile.map((team, index) => {
          const tokenCount = teamsOnTile.length
          const position = getTokenPosition(tokenCount, index)
          const size = getTokenSizePx({ tileMinSize, tokenCount })

          return (
            <Token
              key={team.id}
              color={team.color}
              className='absolute'
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)'
              }}
              title={team.name}
            />
          )
        })}
      </div>
    </CategoryTile>
  )
}

export default BoardTile
