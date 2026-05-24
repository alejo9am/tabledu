import { AddCircleHalfDotIcon, ArrowDown01Icon, Delete02Icon, RemoveCircleHalfDotIcon } from '@hugeicons/core-free-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Token from '@/components/ui/token'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function TeamEditorCard({
  index,
  team,
  teamsSetup,
  isSubmitting,
}) {
  const {
    teams,
    colors,
    canRemoveTeams,
    removeTeam,
    handleTeamNameChange,
    handleTeamColorChange,
    addMember,
    removeMember,
    handleMemberNameChange,
  } = teamsSetup

  return (
    <article className="rounded-xl border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Open color selector for team ${index + 1}`}
                      disabled={isSubmitting}
                      className="size-9"
                    >
                      <Token color={team.color} className="size-9" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Change team token color</TooltipContent>
              </Tooltip>

            <PopoverContent side="bottom" align="start" className="w-auto p-2">
              <div className="grid grid-cols-3 gap-2">
                {colors.map((color) => {
                  const isSelected = color === team.color
                  const isUsedByOtherTeam = teams.some((currentTeam, currentIndex) => currentIndex !== index && currentTeam.color === color)

                  return (
                    <Button
                      key={color}
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isSubmitting || isUsedByOtherTeam}
                      aria-label={isUsedByOtherTeam ? `Color ${color} is already in use` : `Select color ${color}`}
                      aria-pressed={isSelected}
                      onClick={() => handleTeamColorChange(index, color)}
                      className="relative size-8"
                    >
                      <Token color={color} className={`size-7 ${isSelected ? 'ring-2' : ''}`} />
                      {isUsedByOtherTeam ? (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                          <span className="block h-px w-6 rotate-45 bg-foreground" />
                        </span>
                      ) : null}
                    </Button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Input
            id={`team-name-${index}`}
            className="h-9"
            value={team.name}
            onChange={(event) => handleTeamNameChange(index, event.target.value)}
            placeholder={`Team ${index + 1}`}
            disabled={isSubmitting}
          />
        </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="destructive-soft"
                size="icon"
                onClick={() => removeTeam(index)}
                disabled={isSubmitting || !canRemoveTeams}
                aria-label={`Remove team ${index + 1}`}
              >
                <Icon icon={Delete02Icon} className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Remove team</TooltipContent>
          </Tooltip>
      </div>

      <div className="mt-2">
        <Collapsible>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger
                  disabled={isSubmitting}
                  className="group inline-flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="font-medium text-foreground">Members</span>
                    <Badge variant="outline" className="font-thin">
                      Optional
                    </Badge>
                  </span>
                  <Icon icon={ArrowDown01Icon} className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">Add member names for this team</TooltipContent>
            </Tooltip>

          <CollapsibleContent className="mt-2">
            <div className="space-y-2">
              {team.members.map((memberName, memberIndex) => (
                <div key={`team-${index}-member-${memberIndex}`} className="flex items-center gap-2">
                  <Input
                    value={memberName}
                    onChange={(event) => handleMemberNameChange(index, memberIndex, event.target.value)}
                    placeholder="Enter member name"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(index, memberIndex)}
                    disabled={isSubmitting}
                    aria-label={`Remove member ${memberIndex + 1}`}
                  >
                    <Icon icon={RemoveCircleHalfDotIcon} className="size-5" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => addMember(index)}
                disabled={isSubmitting}
                className="w-full justify-start rounded-md border border-dashed border-border text-muted-foreground"
              >
                <Icon icon={AddCircleHalfDotIcon} className="size-5" />
                <span>Add team member</span>
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </article>
  )
}

export default TeamEditorCard
