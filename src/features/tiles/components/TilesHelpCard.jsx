import { ArrowDown01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

function TilesHelpCard({ title = 'How this section works', sections = [], defaultOpen = false }) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="rounded-xl border bg-card data-[state=closed]:p-2.5 data-[state=open]:p-4">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center justify-between gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2 text-foreground">
            <Icon icon={InformationCircleIcon} className="size-4 shrink-0 text-primary" />
            <p className="text-sm font-semibold">{title}</p>
          </div>

          <span className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-background">
            <Icon icon={ArrowDown01Icon} className="size-4 text-foreground transition-transform group-data-[state=open]:rotate-180" />
          </span>
          <span className="sr-only">Toggle section details</span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-6 md:p-2">
          {sections.map((section, index) => (
            <div key={section.title} className="contents">
              <article className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon icon={section.icon} className={`size-4 ${section.iconClassName ?? ''}`} />
                  {section.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
              </article>

              {index < sections.length - 1 ? (
                <>
                  <Separator orientation="vertical" className="hidden md:block" />
                  <Separator className="md:hidden" />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default TilesHelpCard
