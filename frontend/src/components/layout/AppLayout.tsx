import type { ReactNode } from 'react'

type AppLayoutProps = {
  header: ReactNode
  footer: ReactNode
  children: ReactNode
}

export function AppLayout({ header, footer, children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      {header}
      <main className="app-layout__main">
        <div className="app-layout__content">{children}</div>
      </main>
      {footer}
    </div>
  )
}
