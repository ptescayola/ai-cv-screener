import { useTheme } from '../hooks/useTheme'
import { Toggle } from '../ui/Toggle'
import './AppHeader.css'

export function AppHeader() {
  const { isDark, setTheme } = useTheme()

  return (
    <header className="app-header">
      <div className="layout-inner app-header__inner">
        <div className="app-header__brand">
          <p className="app-header__eyebrow">Hiring assistant</p>
          <h1 className="app-header__title">AI CV Screener</h1>
          <p className="app-header__subtitle">
            Frontend A.I Engineer Technical Task
          </p>
        </div>
        <Toggle
          className="app-header__theme-toggle"
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>
    </header>
  )
}
