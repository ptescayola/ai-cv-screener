import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/hooks/useTheme'
import { Toggle } from '@/components/ui/Toggle'

export function AppHeader() {
  const { isDark, setTheme } = useTheme()

  return (
    <header className="w-full py-6 pb-4">
      <div className="layout-inner layout-bar">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Hiring assistant
          </p>
          <h1 className="my-1 flex items-center gap-2 text-[clamp(1.5rem,4vw,1.875rem)] leading-tight tracking-tight text-foreground">
            <DocumentMagnifyingGlassIcon className="size-[1.35em] shrink-0 text-primary" />
            AI CV Screener
          </h1>
          <p className="m-0 text-[0.8125rem] text-muted-foreground">
            Frontend A.I Engineer Technical Task
          </p>
        </div>
        <Toggle
          className="shrink-0"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>
    </header>
  )
}
