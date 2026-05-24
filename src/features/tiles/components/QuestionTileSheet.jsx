import { useState } from 'react'
import { InformationCircleIcon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import TileIconPickerDialog from '@/features/boards/routes/BoardCreate/components/TileIconPickerDialog'

function QuestionTileSheet({
  open,
  mode,
  isSaving,
  name,
  icon,
  description,
  onOpenChange,
  onNameChange,
  onIconChange,
  onDescriptionChange,
  onSave,
}) {
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)

  const previewTile = {
    id: null,
    type: 'question',
    name: name || 'Tile',
    icon: icon || '',
    description: '',
  }

  const isEditMode = mode === 'edit'
  const sheetMetadata = isEditMode
    ? {
      title: 'Edit question tile',
      description: 'This tile represents a topic from your class. Edit its name, icon, or intro without changing its questions.',
      actionLabel: 'Save changes',
      actionLoadingLabel: 'Saving changes...',
    }
    : {
      title: 'Create question tile',
      description: 'Create a tile for a concept, topic, or unit you teach. Later, you will add the questions that belong inside it.',
      actionLabel: 'Create tile',
      actionLoadingLabel: 'Creating tile...',
    }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{sheetMetadata.title}</SheetTitle>
            <SheetDescription>
              {sheetMetadata.description}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-3 px-6 pb-2">
            <div className="flex flex-col items-center gap-2">
              <Label className="self-start">Tile icon</Label>
              <button
                type="button"
                onClick={() => setIsIconDialogOpen(true)}
                className="w-fit rounded-xl transition hover:opacity-90"
                aria-label="Choose tile icon"
                disabled={isSaving}
              >
                <TileCard tile={previewTile} showShadow={false} className="size-32" />
              </button>
              <p className="w-3/4 text-xs text-muted-foreground text-center">
                Choose an icon for the board tile, or keep the first letter of the topic.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-question-tile-name">Topic name</Label>
              <Input
                id="create-question-tile-name"
                value={name}
                placeholder="e.g. Culture"
                onChange={(event) => onNameChange(event.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-question-tile-description">Gameplay intro</Label>
              <Textarea
                id="create-question-tile-description"
                value={description}
                placeholder="Tell students what kind of questions to expect."
                onChange={(event) => onDescriptionChange(event.target.value)}
                required
                disabled={isSaving}
                className="min-h-32"
              />
              <p className="flex items-start gap-2 rounded-lg border border-warning bg-warning-200 px-3 py-2 text-xs font-semibold text-warning-850">
                <Icon icon={InformationCircleIcon} className="mt-0.5 size-4 shrink-0" />
                Students see this before the question appears. Keep it short and focused on the topic.
              </p>
            </div>

          </div>

          <SheetFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave} disabled={isSaving}>
              {isSaving ? sheetMetadata.actionLoadingLabel : sheetMetadata.actionLabel}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <TileIconPickerDialog
        open={isIconDialogOpen}
        onOpenChange={setIsIconDialogOpen}
        value={icon}
        tileName={name || 'Tile'}
        tileType="question"
        onSelect={onIconChange}
      />
    </>
  )
}

export default QuestionTileSheet
