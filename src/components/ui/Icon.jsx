import { HugeiconsIcon } from "@hugeicons/react"

const DEFAULT_STROKE_WIDTH = 2

function Icon({ icon, strokeWidth = DEFAULT_STROKE_WIDTH, className, ...props }) {
  return (
    <HugeiconsIcon
      icon={icon}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  )
}

export { Icon }