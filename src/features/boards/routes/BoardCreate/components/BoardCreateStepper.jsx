import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const steps = [
  {
    value: 1,
    label: 'Board Details',
    activeClassName: 'border-primary-350 bg-primary-200 text-primary-850 shadow-primary-200',
    lineClassName: 'bg-primary-350',
  },
  {
    value: 2,
    label: 'Special',
    activeClassName: 'border-primary bg-primary text-primary-foreground shadow-primary-200',
    idleClassName: 'border-primary text-primary',
    lineClassName: 'bg-primary',
  },
  {
    value: 3,
    label: 'Questions',
    activeClassName: 'border-warning bg-warning text-warning-foreground shadow-warning-200',
    idleClassName: 'border-warning text-warning',
    lineClassName: 'bg-warning',
  },
  {
    value: 4,
    label: 'Layout',
    activeClassName: 'border-destructive bg-destructive text-destructive-foreground shadow-destructive-200',
    idleClassName: 'border-destructive text-destructive',
    lineClassName: 'bg-destructive',
  },
]

function BoardCreateStepper({ currentStep, onBack, onNext, stepValidationError }) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === steps.length
  const hasStepError = Boolean(stepValidationError)
  const hasBackButton = !isFirstStep
  const hasNextButton = !isLastStep

  const backButton = hasBackButton ? (
    <Button type="button" variant="secondary" onClick={onBack}>
      <Icon icon={ArrowLeft01Icon} className="size-4" />
      Back
    </Button>
  ) : null

  const nextButton = hasNextButton ? (
    <Button
      type="button"
      variant="warning"
      onClick={onNext}
      aria-disabled={hasStepError}
      className={cn(hasStepError && 'cursor-not-allowed opacity-50 hover:bg-warning')}
    >
      Next
      <Icon icon={ArrowRight01Icon} className="size-4" />
    </Button>
  ) : null

  return (
    <nav aria-label="Board creation progress" className="py-2 sm:py-3">
      <div className="rounded-2xl border bg-card/80 p-3 sm:grid sm:grid-cols-[8rem_1fr_8rem] sm:items-center sm:gap-4 sm:p-4">
        <div className="hidden sm:flex sm:justify-start">
          {backButton ?? <span aria-hidden="true" className="h-9 w-full" />}
        </div>

        <ol className="grid grid-cols-4 items-start gap-2">
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
                    'relative z-10 flex size-8 items-center justify-center rounded-full border-3 bg-card text-sm font-display font-semibold transition-colors sm:size-10',
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

        <div className="hidden sm:flex sm:justify-end">
          {nextButton ?? <span aria-hidden="true" className="h-9 w-full" />}
        </div>

        {backButton || nextButton ? (
          <div className={cn(
            'mt-4 flex items-center gap-3 sm:hidden',
            hasBackButton && hasNextButton ? 'justify-between' : hasBackButton ? 'justify-start' : 'justify-end'
          )}>
            {backButton}
            {nextButton}
          </div>
        ) : null}
      </div>
    </nav>
  )
}

export default BoardCreateStepper
