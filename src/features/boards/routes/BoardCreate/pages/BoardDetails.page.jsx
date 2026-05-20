import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function BoardDetailsPage() {
  return (
    <article className="rounded-xl border bg-card p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Step 1</p>
        <h2 className="mt-1 text-2xl font-semibold text-primary">Board details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Name your board and configure the special categories that can appear in play.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="board-name">Board name</label>
          <Input id="board-name" placeholder="e.g. Ancient Civilizations Review" disabled />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="board-description">Description</label>
          <Textarea id="board-description" placeholder="Describe the goal of this board" disabled />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Special category cards will be added in the next step of implementation.
      </div>
    </article>
  )
}

export default BoardDetailsPage
