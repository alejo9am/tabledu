import { Button } from '@/components/ui/button'

function NumberInput({ value, disabled, onChange, min, max, step = 1, ...props }) {
  const decrease = () => onChange(min !== undefined ? Math.max(min, value - step) : value - step)
  const increase = () => onChange(max !== undefined ? Math.min(max, value + step) : value + step)

  return (
    <div className="flex h-9 items-center gap-1 rounded-lg border border-input bg-card px-1" role="group" {...props}>
      <Button
        type="button"
        variant="answerFalse"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
        disabled={disabled || (min !== undefined && value <= min)}
        onClick={decrease}
      >
        -
      </Button>
      <span className="flex-1 text-center text-sm font-semibold tabular-nums">
        {value > 0 ? `+${value}` : value}
      </span>
      <Button
        type="button"
        variant="answerTrue"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={increase}
      >
        +
      </Button>
    </div>
  )
}

export { NumberInput }
