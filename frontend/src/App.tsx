import { AppFooter } from './components/AppFooter'
import { AppHeader } from './components/AppHeader'
import { AppLayout } from './components/AppLayout'
import { Chat } from './components/Chat'
import { useChat } from './hooks/useChat'

function App() {
  const { messages, draft, setDraft, sendMessage, resetChat, isLoading } =
    useChat()

  return (
    <AppLayout header={<AppHeader />} footer={<AppFooter />}>
      <Chat
        messages={messages}
        draft={draft}
        isLoading={isLoading}
        onDraftChange={setDraft}
        onSend={(text) => {
          void sendMessage(text)
        }}
        onReset={resetChat}
      />
    </AppLayout>
  )
}

export default App
