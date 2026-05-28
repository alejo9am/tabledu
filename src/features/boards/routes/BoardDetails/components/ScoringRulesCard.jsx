import { Edit02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { NumberInput } from '@/components/ui/number-input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const formatScore = (value) => `${value > 0 ? '+' : ''}${value} ${Math.abs(value) === 1 ? 'pt' : 'pts'}`

function ScoreRow({ isLoading, label, value, isEditing, onChange }) {
  const valueClassName = value >= 0 ? 'text-success-700' : 'text-destructive-700'

  return (
    <div className="flex items-center justify-between gap-3 border-b py-1.5 last:border-b-0">
      <span className="text-sm truncate">{label}</span>
      {isLoading ? (
        <Skeleton className="h-5 w-16" />
      ) : isEditing ? (
        <NumberInput value={value} min={-20} max={20} onChange={onChange} />
      ) : (
        <span className={cn('text-sm font-semibold', valueClassName)}>{formatScore(value)}</span>
      )}
    </div>
  )
}

function ScoringRulesCard({ isLoading, scoring, isEditingScoring, isSavingScoring, onChange, onEdit, onCancel, onSave }) {
  return (
    <article className="rounded-2xl border bg-card p-4 lg:col-span-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Scoring rules</h2>
        {isEditingScoring ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onCancel} disabled={isSavingScoring || isLoading}>Cancel</Button>
            <Button size="sm" onClick={onSave} disabled={isSavingScoring || isLoading}>{isSavingScoring ? 'Saving...' : 'Save'}</Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={onEdit} disabled={isLoading}>
            <Icon icon={Edit02Icon} className="size-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded-xl bg-accent border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Question tile</p>
          <ScoreRow isLoading={isLoading} label="Correct" value={scoring.scoreCorrect} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreCorrect: value })} />
          <ScoreRow isLoading={isLoading} label="Incorrect" value={scoring.scoreIncorrect} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreIncorrect: value })} />
        </section>
        <section className="rounded-xl bg-accent border p-3 md:row-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Duel tile</p>
          <ScoreRow isLoading={isLoading} label="Win" value={scoring.scoreChallengeWinner} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreChallengeWinner: value })} />
          <ScoreRow isLoading={isLoading} label="Loss" value={scoring.scoreChallengeLoser} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreChallengeLoser: value })} />
          <div className="mt-3 rounded-xl border-2 border-dashed -m-1.5 p-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Draw</p>
            <ScoreRow isLoading={isLoading} label="Attacker" value={scoring.scoreChallengeDrawAttacker} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreChallengeDrawAttacker: value })} />
            <ScoreRow isLoading={isLoading} label="Defender" value={scoring.scoreChallengeDrawDefender} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreChallengeDrawDefender: value })} />
          </div>
        </section>
        <section className="rounded-xl bg-accent border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Penalty tile</p>
          <ScoreRow isLoading={isLoading} label="Penalty" value={scoring.scoreAttack} isEditing={isEditingScoring} onChange={(value) => onChange({ scoreAttack: value })} />
        </section>
      </div>
    </article>
  )
}

export default ScoringRulesCard
