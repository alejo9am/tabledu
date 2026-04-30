import { useEffect, useRef, useState } from 'react'

import { getCategoryIconPublicUrl } from '@/services/api'
import Token from '@/components/ui/token'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

import { useGame } from '../context/GameContext'

import { CORNER_BY_TILE, getTokenPosition, getTokenSizePx } from '../constants/tokenLayout'
import { getTileGridStyle } from '../constants/tileLayout'

const tileVariants = cva(
  'flex items-center justify-center bg-card text-card-foreground ring-2 ring-border-dark border-[6px] rounded-lg relative transition-colors duration-200',
  {
    variants: {
      corner: {
        none: '',
        bottomRight: 'rounded-br-tile',
        topRight: 'rounded-tr-tile',
        topLeft: 'rounded-tl-tile',
        goal: 'rounded-r-tile'
      },
      tone: {
        question: 'bg-primary',
        danger: 'bg-destructive',
        special: 'bg-warning'
      },
      active: {
        true: 'border-(--team-color)',
        false: 'border-card'
      }
    },
    defaultVariants: {
      corner: 'none',
      tone: 'question',
      active: false
    }
  }
)

function BoardTile({ tileNumber }) {

  const tileRef = useRef(null)
  const [failedIconUrl, setFailedIconUrl] = useState(null)
  const [tileMinSize, setTileMinSize] = useState(0)

  // Contexto global
  const { teams, currentTeam, boardCategory, categories } = useGame()

  // Variables derivadas
  const teamsOnTile = teams.filter((team) => team.position === tileNumber)
  const activeTeam = currentTeam?.position === tileNumber ? currentTeam : null
  const category = (() => {
    if (tileNumber === 0) {
      return { name: 'Start' }
    }
    if (tileNumber === 30) {
      return { icon: 'system/goal.png', name: 'Goal' }
    }
    const tileData = boardCategory.find((tile) => tile.position === tileNumber)
    return categories.find((cat) => cat.id === tileData?.category_id)
  })()
  const iconUrl = getCategoryIconPublicUrl(category?.icon)
  const showIcon = tileNumber !== 0 && Boolean(iconUrl) && failedIconUrl !== iconUrl
  const tileTone = category?.type === 'question'
    ? 'question'
    : category?.name?.toLowerCase() === 'attack'
      ? 'danger'
      : 'special'
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
    <div
      ref={tileRef}
      className={tileVariants({
        corner: CORNER_BY_TILE[tileNumber] ?? 'none',
        tone: tileTone,
        active: Boolean(activeTeam)
      })}
      style={getTileGridStyle(tileNumber, activeTeam?.color)}
      aria-label={`tile ${tileNumber}`}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] shadow-2xl transition-shadow duration-200",
          activeTeam && "shadow-[0_24px_64px_-4px_color-mix(in_srgb,var(--team-color)_100%,transparent)]"
        )}
      />
      {tileNumber !== 0 && (
        <span
          className='absolute z-10 inline-flex items-center justify-center rounded-full border-2 border-border-dark bg-card text-border-dark font-semibold leading-none'
          style={{
            top: `${numberInsetPx}px`,
            left: `${numberInsetPx}px`,
            width: `${numberBadgeDiameterPx}px`,
            height: `${numberBadgeDiameterPx}px`,
            fontSize: `${numberFontSizePx}px`
          }}
        >
          {tileNumber}
        </span>
      )}

      {tileNumber !== 0 && (
        <div className='inline-flex size-[70%] items-center justify-center'>
          {showIcon ? (
            <img
              src={iconUrl}
              alt=''
              aria-hidden='true'
              className='size-full object-contain filter-[drop-shadow(2px_0_0_var(--card))_drop-shadow(-2px_0_0_var(--card))_drop-shadow(0_2px_0_var(--card))_drop-shadow(0_-2px_0_var(--card))]'
              onError={() => setFailedIconUrl(iconUrl)}
            />
          ) : (
            <span aria-hidden='true' role='presentation'>
              {category?.name?.charAt(0) ?? '?'}
            </span>
          )}
        </div>
      )}

      <div className='pointer-events-none absolute inset-0 z-20' aria-label='Teams on this tile'>
        {teamsOnTile.map((team, index) => {
          const tokenCount = teamsOnTile.length
          const position = getTokenPosition(tokenCount, index)
          const size = getTokenSizePx({ tileMinSize, totalTeams: teams.length, tokenCount })

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
    </div>
  )
}

export default BoardTile
