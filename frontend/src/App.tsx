import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppLayout } from '@/components/layout/AppLayout'
import { Chat } from '@/components/Chat'
import { useChat } from '@/hooks/useChat'
import { useDatasetStatus } from '@/hooks/useDatasetStatus'

function App() {
  const { messages, draft, setDraft, sendMessage, resetChat, isLoading } =
    useChat()
  const { datasetReady } = useDatasetStatus()

  return (
    <AppLayout header={<AppHeader />} footer={<AppFooter />}>
      <Chat
        messages={messages}
        draft={draft}
        isLoading={isLoading}
        datasetReady={datasetReady}
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
