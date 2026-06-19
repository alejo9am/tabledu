import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import BoardCreateStepTitle from '@/features/boards/routes/BoardCreate/components/BoardCreateStepTitle'

function BoardInfoPage({ form }) {
  const boardTitleMaxLength = 100

  return (
    <div className="space-y-4">
      <BoardCreateStepTitle currentStep={1} />

      <article className="mx-auto w-full max-w-3xl rounded-2xl border bg-card p-5 sm:p-8">
        <div className="space-y-5">
          <div className="grid gap-2">
            <Label className="font-medium text-muted-foreground" htmlFor="board-name">Board title</Label>
            <Input
              id="board-name"
              value={form.name}
              placeholder="Name your board"
              maxLength={boardTitleMaxLength}
              onChange={(event) => form.setName(event.target.value)}
              className="h-auto rounded-none border-0 border-b-2 border-primary-200 bg-transparent px-0 py-1 font-display text-3xl font-extrabold text-primary placeholder:text-primary-200 focus-visible:ring-0 md:text-4xl"
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-medium text-muted-foreground" htmlFor="board-description">Board description</Label>
            <Textarea
              id="board-description"
              value={form.description}
              placeholder="Example: Review key concepts before the final exam. Students answer questions by topic and move across the board in teams."
              onChange={(event) => form.setDescription(event.target.value)}
              className="min-h-24 resize-none rounded-xl"
            />
          </div>
        </div>
      </article>
    </div>
  )
}

export default BoardInfoPage
