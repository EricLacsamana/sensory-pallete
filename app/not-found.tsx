import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-light flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <p className="text-xl text-muted mb-8">Page not found</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-secondary hover:bg-accent text-white rounded-lg font-semibold transition-all hover:shadow-glow"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
