import { useState } from 'react'
import { AddSquareIcon, ArrowRight01Icon, CheckmarkSquare02Icon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import TileIconPickerDialog from '@/components/tiles/TileIconPickerDialog'

const tileMetaByType = {
  duel: {
    name: 'Duel',
    label: 'Duel tile',
    mechanic:
      'When a team lands here, it challenges another team in a duel made of two questions. Configure the winner, loser, and draw scores here for this board.',
  },
  penalty: {
    name: 'Penalty',
    label: 'Penalty tile',
    mechanic:
      'When a team lands here, it immediately receives the penalty score configured here for this board.',
  },
  reroll: {
    name: 'Reroll',
    label: 'Reroll tile',
    mechanic:
      'When a team lands here, it gets an extra die roll and moves again right away. This mechanic has no extra score setting.',
  },
}

function SpecialTileCard({ tile, scores, onChange, onScoresChange }) {
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)
  const type = tile.type
  const tileMeta = tileMetaByType[type] ?? { name: 'Tile', label: 'Special tile', mechanic: '' }
  const tileLabel = tileMeta.label

  return (
    <article className="rounded-2xl border bg-card p-4">
      <div className={cn('flex items-center justify-between gap-3 transition-opacity', !tile.enabled && 'opacity-60')}>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">{tileLabel}</p>
        <Toggle
          pressed={tile.enabled}
          onPressedChange={(enabled) => onChange({ enabled })}
          variant="outline"
          size="sm"
          aria-label={`${tileLabel} enabled`}
          className="data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Icon icon={tile.enabled ? CheckmarkSquare02Icon : AddSquareIcon} className="size-4" />
          {tile.enabled ? 'Included' : 'Add tile'}
        </Toggle>
      </div>

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="link" className="group h-8 w-fit px-1 text-xs text-muted-foreground">
            <Icon icon={ArrowRight01Icon} className="size-3 transition-transform group-data-[state=open]:rotate-90" />
            More details
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="rounded-xl bg-muted/40 p-3 text-sm text-foreground">{tileMeta.mechanic}</p>
        </CollapsibleContent>
      </Collapsible>

      <div className={cn('mt-4 space-y-4 transition-opacity', !tile.enabled && 'pointer-events-none opacity-60')}>
        <div className="grid grid-cols-[5.5rem_1fr] items-center gap-4 sm:grid-cols-[6.5rem_1fr]">
          <button
            type="button"
            onClick={() => setIsIconDialogOpen(true)}
            className="rounded-xl transition hover:opacity-90"
            aria-label={`Choose icon for ${tileLabel}`}
            disabled={!tile.enabled}
          >
            <TileCard tile={tile} showShadow={false} className="aspect-square w-full" />
          </button>

          <div className="min-w-0">
            <Label className="font-semibold text-muted-foreground" htmlFor={`${type}-tile-name`}>Title</Label>
            <Input
              id={`${type}-tile-name`}
              value={tile.name}
              disabled={!tile.enabled}
              aria-label={`${tileLabel} name`}
              onChange={(event) => onChange({ name: event.target.value })}
              className="h-auto rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 font-display font-semibold text-xl text-foreground focus-visible:ring-0 md:text-xl"
            />
          </div>
        </div>

        <div className="grid gap-1">
          <Label className="ml-1 font-semibold text-muted-foreground" htmlFor={`${type}-tile-description`}>Description</Label>
          <Textarea
            id={`${type}-tile-description`}
            value={tile.description}
            disabled={!tile.enabled}
            aria-label={`${tileLabel} description`}
            className="min-h-18 mt-1 bg-card"
            onChange={(event) => onChange({ description: event.target.value })}
          />
        </div>
      </div>

      {type === 'duel' ? (
        <div className={cn('mt-4 grid grid-cols-2 gap-3 transition-opacity', !tile.enabled && 'pointer-events-none opacity-60')}>
          <div className="grid gap-1">
            <Label id="score-challenge-winner-label" className="justify-center text-xs font-semibold text-muted-foreground">Winner</Label>
              <NumberInput
                aria-labelledby="score-challenge-winner-label"
                value={scores.scoreChallengeWinner}
                disabled={!tile.enabled}
                onChange={(scoreChallengeWinner) => onScoresChange({ scoreChallengeWinner })}
              />
          </div>
          <div className="grid gap-1">
            <Label id="score-challenge-loser-label" className="justify-center text-xs font-semibold text-muted-foreground">Loser</Label>
              <NumberInput
                aria-labelledby="score-challenge-loser-label"
                value={scores.scoreChallengeLoser}
                disabled={!tile.enabled}
                onChange={(scoreChallengeLoser) => onScoresChange({ scoreChallengeLoser })}
              />
          </div>
          <div className="grid gap-1">
            <Label id="score-challenge-draw-attacker-label" className="justify-center text-xs font-semibold text-muted-foreground">Draw attacker</Label>
              <NumberInput
                aria-labelledby="score-challenge-draw-attacker-label"
                value={scores.scoreChallengeDrawAttacker}
                disabled={!tile.enabled}
                onChange={(scoreChallengeDrawAttacker) => onScoresChange({ scoreChallengeDrawAttacker })}
              />
          </div>
          <div className="grid gap-1">
            <Label id="score-challenge-draw-defender-label" className="justify-center text-xs font-semibold text-muted-foreground">Draw defender</Label>
              <NumberInput
                aria-labelledby="score-challenge-draw-defender-label"
                value={scores.scoreChallengeDrawDefender}
                disabled={!tile.enabled}
                onChange={(scoreChallengeDrawDefender) => onScoresChange({ scoreChallengeDrawDefender })}
              />
          </div>
        </div>
      ) : null}

      {type === 'penalty' ? (
        <div className={cn('mt-4 flex flex-col items-center transition-opacity', !tile.enabled && 'pointer-events-none opacity-60')}>
          <div className="grid w-full max-w-40 gap-1">
            <Label id="score-attack-label" className="justify-center text-xs font-semibold text-muted-foreground">Points deducted</Label>
            <NumberInput
              aria-labelledby="score-attack-label"
              value={scores.scoreAttack}
              disabled={!tile.enabled}
              onChange={(scoreAttack) => onScoresChange({ scoreAttack })}
            />
          </div>
        </div>
      ) : null}

      <TileIconPickerDialog
        open={isIconDialogOpen}
        onOpenChange={setIsIconDialogOpen}
        value={tile.icon}
        tileName={tile.name || tileMeta.name}
        tileType={type}
        onSelect={(icon) => onChange({ icon })}
      />
    </article>
  )
}

export default SpecialTileCard
