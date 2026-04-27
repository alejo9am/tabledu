import { useEffect, useState } from 'react'
import { getCategoryIconPublicUrl } from '@/services/api'

import Token from '@/components/ui/token'
import { cn } from '@/lib/utils'

function BoardTile({
  tileNumber,
  category,
  teamsOnTile = [],
  activeTeam,
  className,
  style,
  ...props
}) {
  const [failedIconUrl, setFailedIconUrl] = useState(null)
  const iconUrl = getCategoryIconPublicUrl(category?.icon)

  useEffect(() => {
    if (!iconUrl) {
      return
    }

    if (failedIconUrl === iconUrl) {
      return
    }

    const probeImage = new Image()
    probeImage.onerror = () => setFailedIconUrl(iconUrl)
    probeImage.src = iconUrl

    return () => {
      probeImage.onerror = null
    }
  }, [iconUrl, failedIconUrl])

  const showIcon = tileNumber !== 0 && Boolean(iconUrl) && failedIconUrl !== iconUrl
  const cornerType = 
    tileNumber === 6 || tileNumber === 22 ? 'bottom-right' :
      tileNumber === 10 || tileNumber === 24 ? 'top-right' :
        tileNumber === 15 || tileNumber == 27 ? 'top-left' : null

  const tileStyle = {
    ...style,
    ...(activeTeam // variable for border and shadow colors based on active team
      ? {
        '--tile-color': activeTeam.color,
        '--tile-active-shadow': `0 16px 40px -8px color-mix(in srgb, ${activeTeam.color} 90%, transparent)`
      }
      : null),
    ...(showIcon // variable for background image if icon is valid and should be shown
      ? { '--tile-icon-url': `url("${iconUrl}")` }
      : null),
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-card text-card-foreground border-2 border-foreground rounded-lg relative transition-colors duration-200",
        activeTeam && "border-(--tile-border-color)",
        showIcon && "bg-(image:--tile-icon-url) bg-center bg-size-[70%] bg-no-repeat",
        cornerType === 'bottom-left' && "rounded-bl-[3rem]",
        cornerType === 'bottom-right' && "rounded-br-[3rem]",
        cornerType === 'top-right' && "rounded-tr-[3rem]",
        cornerType === 'top-left' && "rounded-tl-[3rem]",
        tileNumber === 30 && "rounded-r-[3rem]",
        category?.type === 'question' && "bg-primary-350",
        (category?.type !== 'question' && category?.name !== 'Attack' ) && "bg-warning-350",
        category?.name === 'Attack' && "bg-destructive-350",
        activeTeam && "bg-(--tile-color)",
        className
      )}
      style={tileStyle}
      {...props}
      aria-label={`tile ${tileNumber}`}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] shadow-2xl transition-shadow duration-200",
          activeTeam && "shadow-(--tile-active-shadow)"
        )}
      />
      {tileNumber !== 0 && (
        <span className={cn("absolute z-10 top-1 left-1 inline-flex min-h-8 min-w-8 items-center justify-center text-xl font-semibold leading-none rounded-full border-2 border-foreground bg-card",
          cornerType === 'top-left' && "top-4 left-4",
        )}>
          {tileNumber}
        </span>
      )}
      
      {tileNumber !== 0 && !showIcon && (
        <span
          aria-hidden="true"
          role="presentation"
          className="inline-flex size-20 items-center justify-center"
        >
          {category?.name.charAt(0) ?? '?'}
        </span>
      )}

      <div className="absolute inset-0 z-20 flex items-center justify-center" aria-label="Teams on this tile">
        <div className={cn(
          "grid place-items-center",
          teamsOnTile.length === 1 && "grid-cols-1",
          teamsOnTile.length === 2 && "grid-cols-2 gap-1",
          teamsOnTile.length === 3 && "grid-cols-2 gap-1",
          teamsOnTile.length >= 4 && "grid-cols-2 gap-1"
        )}>
          {teamsOnTile.map((team, index) => (
            <Token
              key={team.id}
              color={team.color}
              className={cn(
                "inline-block size-6",
                teamsOnTile.length === 1 && "justify-self-center",
                teamsOnTile.length === 3 && index === 0 && "col-span-2 justify-self-center"
              )}
              title={team.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardTile
