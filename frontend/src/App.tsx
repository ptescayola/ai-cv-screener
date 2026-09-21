import { AppHeader } from './components/AppHeader'
import { useScreening } from './hooks/useScreening'
import './App.css'

function App() {
  const { status, candidates } = useScreening()

  return (
    <div className="app">
      <AppHeader />
      <main className="empty-state">
        <p>
          {candidates.length === 0
            ? 'No CVs uploaded yet.'
            : `${candidates.length} CV${candidates.length === 1 ? '' : 's'} ready to screen.`}
        </p>
        <p className="status">Status: {status}</p>
      </main>
    </div>
  )
}

export default App
