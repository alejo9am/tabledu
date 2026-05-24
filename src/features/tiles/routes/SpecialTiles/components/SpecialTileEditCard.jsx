import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowDown01Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import TileIconPickerDialog from '@/features/boards/routes/BoardCreate/components/TileIconPickerDialog'

const tileMetaByType = {
  duel: {
    label: 'Duel tile',
    mechanic:
      'When a team lands here, it challenges another team in a duel made of two questions. Duel scoring is resolved with board-level winner/loser/draw values.',
  },
  penalty: {
    label: 'Penalty tile',
    mechanic:
      'When a team lands here, it immediately receives the penalty score configured during board setup.',
  },
  reroll: {
    label: 'Reroll tile',
    mechanic:
      'When a team lands here, it gets an extra die roll and moves again right away.',
  },
}

function SpecialTileEditCard({ tile, onSave }) {
  const [draftName, setDraftName] = useState(tile.name ?? '')
  const [draftDescription, setDraftDescription] = useState(tile.description ?? '')
  const [draftIcon, setDraftIcon] = useState(tile.icon ?? '')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)
  const tileMeta = tileMetaByType[tile.type] ?? { label: 'Special tile', mechanic: '' }

  useEffect(() => {
    setDraftName(tile.name ?? '')
    setDraftDescription(tile.description ?? '')
    setDraftIcon(tile.icon ?? '')
  }, [tile.description, tile.icon, tile.name])

  const hasChanges =
    draftName.trim() !== String(tile.name ?? '').trim()
    || draftDescription.trim() !== String(tile.description ?? '').trim()
    || draftIcon.trim() !== String(tile.icon ?? '').trim()

  const startEdit = () => {
    setDraftName(tile.name ?? '')
    setDraftDescription(tile.description ?? '')
    setDraftIcon(tile.icon ?? '')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setDraftName(tile.name ?? '')
    setDraftDescription(tile.description ?? '')
    setDraftIcon(tile.icon ?? '')
    setIsEditing(false)
  }

  const saveChanges = async () => {
    const name = draftName.trim()
    const description = draftDescription.trim()
    const icon = draftIcon.trim()

    if (!name) {
      toast.error('Add a name before saving.')
      return
    }
    if (!description) {
      toast.error('Add a description before saving.')
      return
    }

    setIsSaving(true)

    try {
      await onSave({
        ...tile,
        name,
        description,
        icon,
      })
      setIsEditing(false)
      toast.success(`${tileMeta.label} updated.`)
    } catch {
      toast.error(`Could not update ${tileMeta.label}.`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className={`w-full max-w-xs rounded-2xl border bg-card p-4 ${isEditing ? 'border-primary shadow-sm shadow-primary/30' : ''}`}>
      <div className="mb-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsIconDialogOpen(true)}
          className={cn('size-24 shrink-0 rounded-xl transition', isEditing && 'hover:opacity-90')}
          aria-label={`Choose icon for ${tileMeta.label}`}
          disabled={!isEditing}
        >
          <TileCard tile={{ ...tile, icon: draftIcon, name: draftName || tile.name }} showShadow={false} className="aspect-square w-full" />
        </button>

        <div className="min-w-0 flex-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{tileMeta.label}</p>
            {isEditing ? (
              <div className="mt-3">
                <Label htmlFor={`${tile.id}-name`} className="text-xs">Tile name</Label>
                <Input
                  id={`${tile.id}-name`}
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Tile name"
                  className="-mt-1 h-auto rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 font-display text-xl! md:text-xl! font-bold shadow-none focus-visible:ring-0"
                />
              </div>
            ) : (
              <h2 className="truncate font-display text-2xl font-bold text-foreground">{draftName || tileMeta.label}</h2>
            )}
            {!isEditing ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{draftDescription}</p>
            ) : null}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="grid gap-1">
          <Label htmlFor={`${tile.id}-description`} className="text-xs font-semibold text-muted-foreground">Description / mechanic</Label>
          <Textarea
            id={`${tile.id}-description`}
            value={draftDescription}
            onChange={(event) => setDraftDescription(event.target.value)}
            className="min-h-20"
            placeholder="Explain what happens when a team lands here"
          />
        </div>
      ) : null}


      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="link" className="group h-8 px-1 text-xs text-muted-foreground">
            <Icon icon={ArrowDown01Icon} className="size-3 transition-transform group-data-[state=open]:rotate-180" />
            More details
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="p-3 text-sm text-foreground">{tileMeta.mechanic}</p>
        </CollapsibleContent>
      </Collapsible>

      {isEditing ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSaving} onClick={cancelEdit}>
            Cancel
          </Button>
          <Button type="button" disabled={!hasChanges || isSaving} onClick={saveChanges}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      ) : (
        <div className="mt-3">
          <Button type="button" variant="outline" className="w-full" onClick={startEdit}>
            <Icon icon={PencilEdit02Icon} className="size-4" />
            Edit
          </Button>
        </div>
      )}

      <TileIconPickerDialog
        open={isIconDialogOpen}
        onOpenChange={setIsIconDialogOpen}
        value={draftIcon}
        tileName={draftName || tileMeta.label}
        tileType={tile.type}
        onSelect={setDraftIcon}
      />
    </article>
  )
}

export default SpecialTileEditCard
