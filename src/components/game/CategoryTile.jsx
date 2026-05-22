import { forwardRef, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { getCategoryIconPublicUrl } from '@/services/api'

const tileVariants = cva(
  'flex items-center justify-center bg-card text-card-foreground ring-2 ring-border-dark border-[6px] shadow-[inset_0_0_0_2px_var(--card)] rounded-lg relative transition-colors duration-200',
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

const CategoryTile = forwardRef(function CategoryTile(
  {
    category,
    tileNumber,
    corner = 'none',
    active = false,
    showShadow = true,
    badgeStyle,
    className,
    style,
    children,
    ...props
  },
  ref
) {
  const [failedIconUrl, setFailedIconUrl] = useState(null)

  const tone = useMemo(() => {
    if (category?.type === 'question') return 'question'
    if (category?.type === 'attack') return 'danger'
    return 'special'
  }, [category?.type, category?.name])

  const iconUrl = useMemo(() => getCategoryIconPublicUrl(category?.icon), [category?.icon])
  const showIcon = category?.showIcon !== false && Boolean(iconUrl) && failedIconUrl !== iconUrl
  const fallbackLabel = category?.name?.charAt(0)?.toUpperCase() ?? '?'

  const isNumberedTile = typeof tileNumber === 'number'
  const showTileNumber = isNumberedTile && tileNumber !== 0

  return (
    <div
      ref={ref}
      className={cn(tileVariants({ corner, tone, active }), className)}
      style={style}
      aria-label={isNumberedTile ? `tile ${tileNumber}` : 'category tile'}
      {...props}
    >
      {showShadow ? (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 rounded-[inherit] shadow-2xl transition-shadow duration-200',
            active && 'shadow-[0_24px_64px_-4px_color-mix(in_srgb,var(--team-color)_100%,transparent)]'
          )}
        />
      ) : null}
      {showTileNumber && (
        <span
          className="absolute z-10 inline-flex items-center justify-center rounded-full border-2 border-border-dark bg-card text-border-dark font-semibold leading-none"
          style={badgeStyle}
        >
          {tileNumber}
        </span>
      )}

      <div className="inline-flex size-[70%] items-center justify-center">
        {showIcon ? (
          <img
            src={iconUrl}
            alt=""
            aria-hidden="true"
            className="size-full object-contain filter-[drop-shadow(2px_0_0_var(--card))_drop-shadow(-2px_0_0_var(--card))_drop-shadow(0_2px_0_var(--card))_drop-shadow(0_-2px_0_var(--card))]"
            onError={() => setFailedIconUrl(iconUrl)}
          />
        ) : category?.showIcon !== false ? (
          <span
            aria-hidden="true"
            role="presentation"
            className="inline-flex items-center justify-center font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-none text-card"
          >
            {fallbackLabel}
          </span>
        ) : null}
      </div>

      {children}
    </div>
  )
})

export default CategoryTile
