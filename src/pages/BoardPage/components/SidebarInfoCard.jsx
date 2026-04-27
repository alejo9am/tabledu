import { Button } from "@/components/ui/button"

function SidebarInfoCard({ title, description, buttonLabel, onConfirm }) {
  return (
    <section className="flex flex-col items-center justify-between gap-4 p-8 w-4/5 bg-card text-card-foreground border-2 border-border rounded-xl" aria-label={title}>
      <h2 className="text-3xl font-semibold font-display">{title}</h2>
      {description && <p className="text-center text-xl">{description}</p>}
      <Button className="p-6 text-xl" onClick={onConfirm}>{buttonLabel}</Button>
    </section>
  )
}

export default SidebarInfoCard
