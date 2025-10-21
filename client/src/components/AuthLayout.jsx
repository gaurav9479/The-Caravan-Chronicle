export default function AuthLayout({ title, subtitle, children, right }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-700 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl backdrop-blur">
        <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 text-white">
          <h1 className="text-3xl font-bold mb-2 drop-shadow">{title}</h1>
          {subtitle && <p className="text-white/80 mb-8">{subtitle}</p>}
          <div className="bg-white/20 rounded-xl p-4 md:p-6 shadow-inner">
            {children}
          </div>
        </div>
        <div className="hidden md:flex bg-white/5 backdrop-blur-md items-center justify-center p-10">
          <div className="max-w-md text-white/90 space-y-4">
            {right || (
              <>
                <h2 className="text-2xl font-semibold">Welcome to The Caravan Chronicle</h2>
                <p>
                  Track, resolve, and celebrate fixes across our moving city. Transparency, speed,
                  and accountability—wherever the caravan goes.
                </p>
                <div className="space-y-3">
                  <blockquote className="bg-white/10 p-4 rounded-lg">“Filing a complaint takes seconds. Seeing it resolved is even faster.”</blockquote>
                  <blockquote className="bg-white/10 p-4 rounded-lg">“Our crew dashboard keeps the whole team aligned and responsive.”</blockquote>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
