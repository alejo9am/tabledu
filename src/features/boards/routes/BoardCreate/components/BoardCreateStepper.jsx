import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

const steps = [
  {
    value: 1,
    label: 'Details',
    activeClassName: 'border-primary bg-primary text-primary-foreground shadow-primary-200',
    lineClassName: 'bg-primary',
  },
  {
    value: 2,
    label: 'Questions',
    activeClassName: 'border-warning bg-warning text-warning-foreground shadow-warning-200',
    idleClassName: 'border-warning text-warning',
    lineClassName: 'bg-warning',
  },
  {
    value: 3,
    label: 'Layout',
    activeClassName: 'border-destructive bg-destructive text-destructive-foreground shadow-destructive-200',
    idleClassName: 'border-destructive text-destructive',
    lineClassName: 'bg-destructive',
  },
]

function BoardCreateStepper({ currentStep }) {
  return (
    <nav aria-label="Board creation progress" className="py-2 sm:py-3">
      <ol className="grid grid-cols-3 items-start gap-2 rounded-2xl border bg-card/80 p-3 shadow-sm sm:p-4">
        {steps.map((step, index) => {
          const isCompleted = step.value < currentStep
          const isActive = step.value === currentStep
          const previousStep = steps[index - 1]

          return (
            <li key={step.value} className="relative flex flex-col items-center gap-2 text-center">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute right-1/2 top-4 flex h-1 w-full overflow-hidden rounded-full sm:top-5"
                >
                  <span className={cn('h-full flex-1', previousStep.lineClassName)} />
                  <span className={cn('h-full flex-1', step.lineClassName)} />
                </span>
              ) : null}
              <span
                className={cn(
                  'relative z-10 flex size-8 items-center justify-center rounded-full border-3 bg-card text-sm font-display font-semibold shadow-lg transition-colors sm:size-10',
                  isCompleted || isActive ? step.activeClassName : step.idleClassName
                )}
              >
                {isCompleted ? <Icon icon={CheckmarkCircle02Icon} className="size-4 sm:size-5" /> : step.value}
              </span>
              <span className={cn('text-xs font-medium sm:text-sm', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default BoardCreateStepper
