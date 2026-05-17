import PageHeader from "@/components/layout/PageHeader"

function BoardCreatePage() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0" aria-label="Create board page">
      <PageHeader title="Create Board" description="Set up a new board for your students." />
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Board creation form will go here.</p>
      </div>
    </section>
  )
}

export default BoardCreatePage
