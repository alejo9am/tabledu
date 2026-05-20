import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/Icon'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import useAppNavigation from '@/hooks/useAppNavigation.hook'

function BackButton({ to, fallbackTo = '/', label = 'Back', className, variant = 'ghost', disabled = false }) {
  const { goBack, goTo } = useAppNavigation()

  return (
    <Button type="button" variant={variant} size="sm" className={className} onClick={() => (to ? goTo(to) : goBack(fallbackTo))} disabled={disabled}>
      <Icon icon={ArrowLeft01Icon} className="size-4" />
      {label}
    </Button>
  )
}

export default BackButton
