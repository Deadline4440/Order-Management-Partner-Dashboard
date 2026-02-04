import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-center">
      <div className="space-y-2">
        <h1 className="text-8xl font-bold text-primary font-headline">404</h1>
        <p className="text-2xl font-semibold tracking-tight">
          Oops! Page not found.
        </p>
        <p className="text-muted-foreground">
          The page you are looking for might have been moved or doesn't exist.
        </p>
      </div>
      <Button asChild className="bg-accent hover:bg-accent/90">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}
