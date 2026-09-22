import { env } from '@/config/env.js'
import { createApp } from '@/composition/createApp.js'

const app = createApp()

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`)
})
