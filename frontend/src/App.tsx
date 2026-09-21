import { AppHeader } from './components/AppHeader'
import { Chat } from './components/Chat'
import { useChat } from './hooks/useChat'
import './App.css'

function App() {
  const { messages, draft, setDraft, sendMessage, isLoading } = useChat()

  return (
    <div className="app">
      <AppHeader />
      <Chat
        messages={messages}
        draft={draft}
        isLoading={isLoading}
        onDraftChange={setDraft}
        onSend={() => {
          void sendMessage()
        }}
      />
    </div>
  )
}

export default App
