import { Alert02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'

function LayoutEditBar({
  isEditingLayout,
  isSavingLayout,
  hasUnsavedLayoutChanges,
  onStartLayoutEdit,
  onDiscardLayout,
  onSaveLayout,
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border lg:col-span-12 bg-card font-medium text-muted-foreground p-3 lg:col-span-12'">
      <p className={`flex items-center gap-2 text-sm ${hasUnsavedLayoutChanges ? 'bg-warning-200 font-semibold text-warning-850 rounded-full p-2' : ''}`}>
        <Icon
          icon={hasUnsavedLayoutChanges ? Alert02Icon : InformationCircleIcon}
          className="size-4 shrink-0"
        />
        <span>
          {isEditingLayout && hasUnsavedLayoutChanges
            ? 'You have unsaved layout changes. Save or discard them.'
            : isEditingLayout
              ? 'Make your edits, then click Save to apply them.'
              : 'Enable edit mode to change the layout.'}
        </span>
      </p>

      {isEditingLayout ? (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onDiscardLayout} disabled={isSavingLayout}>Discard</Button>
          <Button onClick={onSaveLayout} disabled={isSavingLayout}>{isSavingLayout ? 'Saving...' : 'Save'}</Button>
        </div>
      ) : (
        <Button variant="warning" onClick={onStartLayoutEdit}>Enable edit mode</Button>
      )}
    </div>
  )
}

export default LayoutEditBar
