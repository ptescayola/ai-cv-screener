import { expect, test } from '@playwright/test'

const mockAnswer =
  'Candidates with TypeScript experience include Ada Lovelace.'

test('sends a question and shows the assistant reply', async ({ page }) => {
  await page.route('**/api/dataset/status', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ready: true }),
    })
  })

  await page.route('**/api/chat', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        answer: mockAnswer,
        sources: [{ fileName: 'ada-lovelace-ab12cd34.pdf' }],
      }),
    })
  })

  await page.goto('/')

  await page.getByLabel('Your question').fill('Who knows TypeScript?')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByRole('log')).toContainText(mockAnswer)
})
