import { Cancel01Icon, CheckmarkCircle02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import TileCard from '@/components/game/TileCard'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function QuestionTileHeaderCard({
  tile,
  questionCount,
  isEditingTileHeader,
  isSavingTileHeader,
  nameDraft,
  descriptionDraft,
  iconDraft,
  onNameDraftChange,
  onDescriptionDraftChange,
  onOpenIconPicker,
  onSave,
  onCancel,
  onBeginEdit,
}) {
  return (
    <div className="relative rounded-3xl border bg-card p-4 sm:p-6">
      <div
        className={isEditingTileHeader
          ? 'mb-3 flex justify-end sm:absolute sm:right-6 sm:top-6 sm:mb-0'
          : 'absolute right-4 top-4 sm:right-6 sm:top-6'}
      >
        {isEditingTileHeader ? (
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <Button size="sm" className="min-w-24 sm:min-w-28" variant="default" onClick={onSave} disabled={isSavingTileHeader}>
              <Icon icon={CheckmarkCircle02Icon} className="size-4" />
              Save
            </Button>
            <Button size="sm" className="min-w-24 sm:min-w-28" variant="outline" onClick={onCancel} disabled={isSavingTileHeader}>
              <Icon icon={Cancel01Icon} className="size-4" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={onBeginEdit}>
            <Icon icon={Edit02Icon} className="size-4" />
            Edit tile
          </Button>
        )}
      </div>

      {isEditingTileHeader ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          You can edit icon, title and description
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1.4fr)] sm:items-start sm:pr-40">
        <div className="flex min-w-0 flex-col items-start gap-3">
          <button
            type="button"
            className={`rounded-xl ${isEditingTileHeader ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
            onClick={() => {
              if (isEditingTileHeader) onOpenIconPicker()
            }}
            disabled={!isEditingTileHeader}
            aria-label="Choose tile icon"
          >
            <TileCard tile={{ ...tile, icon: iconDraft }} showShadow={false} className="size-24" />
          </button>
        </div>

        <div className="min-w-0 pt-0.5">
          {isEditingTileHeader ? (
            <Input
              value={nameDraft}
              onChange={(event) => onNameDraftChange(event.target.value)}
              className="h-11 max-w-md rounded-2xl font-display text-2xl! font-semibold"
              autoFocus
            />
          ) : (
            <h2 className="truncate font-display text-4xl font-semibold text-foreground">{tile.name}</h2>
          )}

          {isEditingTileHeader ? (
            <Textarea
              value={descriptionDraft}
              onChange={(event) => onDescriptionDraftChange(event.target.value)}
              className="mt-3 min-h-24 max-w-4xl rounded-2xl"
            />
          ) : (
            <p className="mt-3 max-w-4xl text-sm text-muted-foreground">{tile.description || 'Add a short intro for students.'}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-start">
        <Badge variant="ghost" className="px-3 py-1 text-sm">Total questions: {questionCount}</Badge>
      </div>
    </div>
  )
}

export default QuestionTileHeaderCard
