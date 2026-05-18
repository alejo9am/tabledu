function AuthVisualPanel({ backgroundImage, title, subtitle, subtitleClassName = 'leading-relaxed' }) {
  return (
    <div
      className="relative h-[35vh] min-h-52 shrink-0 bg-cover bg-center lg:order-last lg:h-auto lg:min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-label="Visual decoration"
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/0" aria-hidden="true" />

      <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
        <div className="max-w-md">
          <p className="text-balance font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {title}
          </p>
          <p className={`mt-2 text-sm text-white/80 ${subtitleClassName}`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthVisualPanel
