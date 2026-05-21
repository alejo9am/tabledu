import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

function BoardInfoPage({ form }) {
  return (
    <article className="rounded-2xl border bg-card p-4 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr_auto_minmax(18rem,0.55fr))] lg:items-stretch">
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="board-name">Board title</label>
            <Input
              id="board-name"
              value={form.name}
              placeholder="ANCIENT CIVILIZATIONS REVIEW"
              onChange={(event) => form.setName(event.target.value)}
              className="h-auto rounded-none border-0 border-b-2 border-primary/30 bg-transparent px-0 py-1 font-display text-3xl font-extrabold uppercase text-primary shadow-none focus-visible:border-primary focus-visible:ring-0 md:text-4xl"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="board-description">Board description</label>
            <Textarea
              id="board-description"
              value={form.description}
              placeholder="Describe the classroom activity this board supports."
              onChange={(event) => form.setDescription(event.target.value)}
              className="min-h-20 rounded-none border-0 border-b-2 border-border bg-transparent px-0 py-1 shadow-none focus-visible:border-primary focus-visible:ring-0"
            />
          </div>
        </div>

        <Separator orientation="vertical" className="hidden h-auto lg:block" />
        <Separator className="lg:hidden" />

        <div className="flex flex-col justify-center rounded-xl bg-muted/40 p-4">
          <p className="text-sm font-semibold text-foreground">Start with the idea</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Give the board a clear title and short description so students understand what they are about to play.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            You will configure the board tiles in the next steps.
          </p>
        </div>
      </div>
    </article>
  )
}

export default BoardInfoPage
