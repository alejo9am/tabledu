import { cn } from '@/lib/utils'

function Token({
  color,
  className,
  style,
  ...props
}) {
  return (
    <div
      className={cn("size-8 shrink-0 rounded-full ring-1 ring-border-dark border-[0.2em] border-card bg-(--token-color)", className)}
      style={{ '--token-color': color, ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}

export default Token