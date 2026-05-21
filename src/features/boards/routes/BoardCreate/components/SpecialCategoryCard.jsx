import { AddSquareIcon } from '@hugeicons/core-free-icons'
import CategoryTile from '@/components/game/CategoryTile'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

const tileLabels = {
  attack: 'Attack tile',
  challenge: 'Duel tile',
  pipe: 'Bonus tile',
}

function NumberInput({ id, label, value, disabled, onChange }) {
  return (
    <label className="grid gap-1 text-xs font-semibold text-muted-foreground" htmlFor={id}>
      {label}
      <Input
        id={id}
        type="number"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 rounded-lg bg-card text-center font-semibold"
      />
    </label>
  )
}

function SpecialCategoryCard({ type, category, onChange }) {
  const tileLabel = tileLabels[type]
  const tileCategory = { ...category, type }

  return (
    <article className="rounded-2xl border bg-card p-4">
      <div className={cn('flex items-center justify-between gap-3 transition-opacity', !category.enabled && 'opacity-60')}>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">{tileLabel}</p>
        <Toggle
          pressed={category.enabled}
          onPressedChange={(enabled) => onChange({ enabled })}
          variant="outline"
          size="sm"
          aria-label={`${tileLabel} enabled`}
          className="data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Icon icon={AddSquareIcon} className="size-4" />
          Use it
        </Toggle>
      </div>

      <div className={cn('mt-4 space-y-4 transition-opacity', !category.enabled && 'pointer-events-none opacity-60')}>
        <div className="grid grid-cols-[5.5rem_1fr] items-center gap-4 sm:grid-cols-[6.5rem_1fr]">
          <CategoryTile category={tileCategory} showShadow={false} className="aspect-square w-full" />

          <div className="min-w-0">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${type}-tile-name`}>Title</label>
            <Input
              id={`${type}-tile-name`}
              value={category.name}
              disabled={!category.enabled}
              aria-label={`${tileLabel} name`}
              onChange={(event) => onChange({ name: event.target.value })}
              className="h-auto rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 font-display text-2xl font-semibold text-foreground shadow-none focus-visible:border-primary focus-visible:ring-0"
            />
          </div>
        </div>

        <label className="grid gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${type}-tile-description`}>
          Description
          <Textarea
            id={`${type}-tile-description`}
            value={category.description}
            disabled={!category.enabled}
            aria-label={`${tileLabel} description`}
            className="min-h-18 rounded-xl bg-card text-sm"
            onChange={(event) => onChange({ description: event.target.value })}
          />
        </label>
      </div>

      {type === 'attack' ? (
        <div className={cn('mt-4 transition-opacity', !category.enabled && 'pointer-events-none opacity-60')}>
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
        <div className={cn('mt-4 grid grid-cols-2 gap-3 transition-opacity', !category.enabled && 'pointer-events-none opacity-60')}>
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
