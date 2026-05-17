import { Icon } from '@/components/ui/Icon'
import { CrazyIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import useAppNavigation from '@/hooks/useAppNavigation.hook'

function NotFoundPage() {
  const { goBack } = useAppNavigation()

  return (
    <main className='flex min-h-screen items-center justify-center p-6 animate-in fade-in zoom-in' aria-label="404 Not Found">
      <div className='flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-12 shadow-sm'>
        <Icon className='size-20 bg-secondary p-4 rounded-full border border-border text-secondary-foreground' icon={CrazyIcon} />
        <h1 className='text-5xl font-bold font-display tracking-tight'>
          <span className='text-primary'>4</span>
          <span className='text-warning'>0</span>
          <span className='text-destructive'>4</span>
        </h1>
        <p className='text-lg text-muted-foreground'>Oops! The page you're looking for doesn't exist.</p>
        <button
          onClick={() => goBack('/')}
          className='inline-flex items-center gap-2 rounded-full border border-transparent bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80'
        >
          <Icon className='size-4' icon={ArrowLeft01Icon} />
          Take me back
        </button>
      </div>
    </main>
  )
}

export default NotFoundPage
