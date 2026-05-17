import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-md text-center">
        <div className="text-8xl font-black text-primary/30 mb-4">404</div>
        <h1 className="text-3xl font-black mb-3">Page Not Found</h1>
        <p className="text-muted mb-8">The page you are looking for does not exist or has been moved.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/intake" className="btn-secondary">Start Appeal</Link>
          <Link href="/contact" className="btn-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
