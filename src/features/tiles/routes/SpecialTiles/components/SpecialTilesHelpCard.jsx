import {
  ArrowDown01Icon,
  ChampionIcon,
  CircleLock01Icon,
  InformationCircleIcon,
  PaintBoardIcon,
} from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'

function SpecialTilesHelpCard() {
  return (
    <Collapsible defaultOpen className="rounded-xl border bg-card data-[state=closed]:p-2.5 data-[state=open]:p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-foreground">
          <Icon icon={InformationCircleIcon} className="size-4 shrink-0 text-primary" />
          <p className="text-sm font-semibold">How this section works</p>
        </div>

        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="group size-7 rounded-md border border-border bg-background">
            <Icon icon={ArrowDown01Icon} className="size-4 text-foreground transition-transform group-data-[state=open]:rotate-180" />
            <span className="sr-only">Toggle rules details</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="pt-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-6 md:p-2">
          <article className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Icon icon={CircleLock01Icon} className="size-4 text-destructive" />
              Fixed Set
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Tabledu provides exactly three special tiles. You cannot create or delete special tile types.</p>
          </article>
          <Separator orientation="vertical" className="hidden md:block" />
          <Separator className="md:hidden" />

          <article className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Icon icon={PaintBoardIcon} className="size-4 text-primary" />
              Customizable
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Here you can edit each tile&apos;s icon, name, and description.</p>
          </article>
          <Separator orientation="vertical" className="hidden md:block" />
          <Separator className="md:hidden" />

          <article className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Icon icon={ChampionIcon} className="size-4 text-warning" />
              Scoring
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Scoring for these mechanics is configured later per board during setup.</p>
          </article>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default SpecialTilesHelpCard
