import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getCategoryIconPublicUrl } from '@/services/api'

const categoryMeta = {
  attack: {
    label: 'Attack',
    description: 'Penalty tile',
    className: 'border-destructive/40 bg-destructive/5',
  },
  challenge: {
    label: 'Challenge',
    description: 'Duel tile',
    className: 'border-primary/40 bg-primary/5',
  },
  pipe: {
    label: 'Pipe',
    description: 'Bonus tile',
    className: 'border-warning/40 bg-warning/5',
  },
}

function NumberInput({ id, label, value, disabled, onChange }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-muted-foreground" htmlFor={id}>
      {label}
      <Input
        id={id}
        type="number"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9"
      />
    </label>
  )
}

function SpecialCategoryCard({ type, category, onChange }) {
  const [failedIconUrl, setFailedIconUrl] = useState(null)
  const meta = categoryMeta[type]
  const iconUrl = getCategoryIconPublicUrl(category.icon)
  const showIcon = Boolean(iconUrl) && failedIconUrl !== iconUrl

  return (
    <article className={cn('rounded-xl border p-4 transition-opacity', meta.className, !category.enabled && 'opacity-50')}>
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-card text-lg font-semibold text-muted-foreground">
          {showIcon ? (
            <img
              src={iconUrl}
              alt=""
              aria-hidden="true"
              className="size-9 object-contain"
              onError={() => setFailedIconUrl(iconUrl)}
            />
          ) : (
            category.name.charAt(0) || '?'
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{meta.description}</p>
              <h3 className="text-base font-semibold">{meta.label}</h3>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={category.enabled}
              onClick={() => onChange({ enabled: !category.enabled })}
              className={cn(
                'flex h-6 w-11 items-center rounded-full border p-0.5 transition-colors',
                category.enabled ? 'border-primary bg-primary' : 'border-border bg-muted'
              )}
            >
              <span
                className={cn(
                  'size-4 rounded-full bg-card shadow-sm transition-transform',
                  category.enabled && 'translate-x-5'
                )}
              />
            </button>
          </div>

          <div className="grid gap-2">
            <Input
              value={category.name}
              disabled={!category.enabled}
              aria-label={`${meta.label} tile name`}
              onChange={(event) => onChange({ name: event.target.value })}
            />
            <Input
              value={category.icon}
              disabled={!category.enabled}
              aria-label={`${meta.label} tile icon path`}
              onChange={(event) => onChange({ icon: event.target.value })}
            />
            <Textarea
              value={category.description}
              disabled={!category.enabled}
              aria-label={`${meta.label} tile description`}
              className="min-h-20"
              onChange={(event) => onChange({ description: event.target.value })}
            />
          </div>
        </div>
      </div>

      {type === 'attack' ? (
        <div className="mt-4">
          <NumberInput
            id="score-attack"
            label="Points deducted"
            value={category.scoreAttack}
            disabled={!category.enabled}
            onChange={(scoreAttack) => onChange({ scoreAttack })}
          />
        </div>
      ) : null}

      {type === 'challenge' ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <NumberInput
            id="score-challenge-winner"
            label="Winner"
            value={category.scoreChallengeWinner}
            disabled={!category.enabled}
            onChange={(scoreChallengeWinner) => onChange({ scoreChallengeWinner })}
          />
          <NumberInput
            id="score-challenge-loser"
            label="Loser"
            value={category.scoreChallengeLoser}
            disabled={!category.enabled}
            onChange={(scoreChallengeLoser) => onChange({ scoreChallengeLoser })}
          />
          <NumberInput
            id="score-challenge-draw-attacker"
            label="Draw attacker"
            value={category.scoreChallengeDrawAttacker}
            disabled={!category.enabled}
            onChange={(scoreChallengeDrawAttacker) => onChange({ scoreChallengeDrawAttacker })}
          />
          <NumberInput
            id="score-challenge-draw-defender"
            label="Draw defender"
            value={category.scoreChallengeDrawDefender}
            disabled={!category.enabled}
            onChange={(scoreChallengeDrawDefender) => onChange({ scoreChallengeDrawDefender })}
          />
        </div>
      ) : null}
    </article>
  )
}

export default SpecialCategoryCard
