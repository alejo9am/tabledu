import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'

function AuthHeader({ title, subtitle, logoClassName = 'h-10 w-auto' }) {
  return (
    <header className="pb-5">
      <img src={logoLight} alt="tabledu" className={`${logoClassName} dark:hidden`} />
      <img src={logoDark} alt="tabledu" className={`hidden ${logoClassName} dark:block`} />
      <h1 className="mt-6 font-display text-3xl font-extrabold text-primary">{title}</h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{subtitle}</p>
    </header>
  )
}

export default AuthHeader
