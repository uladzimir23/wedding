const BOT_TOKEN      = import.meta.env.VITE_TELEGRAM_BOT_TOKEN       as string | undefined
const ADMIN_CHAT_ID  = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID   as string | undefined
const GUEST_CHANNEL  = import.meta.env.VITE_TELEGRAM_GUEST_CHANNEL_ID as string | undefined

export const TELEGRAM_CHANNEL_URL =
  (import.meta.env.VITE_TELEGRAM_CHANNEL_URL as string | undefined) ?? ''

async function post(chat_id: string, text: string): Promise<void> {
  if (!BOT_TOKEN) {
    console.warn('[Telegram] VITE_TELEGRAM_BOT_TOKEN not set')
    return
  }
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
    },
  )
  if (!res.ok) {
    const err = await res.text()
    console.error(`[Telegram] API error (chat ${chat_id}):`, err)
    throw new Error(err)
  }
}

/* ── Данные гостя → приватная группа (молодожёны + организатор) ── */
export async function sendGuestData(text: string): Promise<void> {
  if (!ADMIN_CHAT_ID) {
    console.warn('[Telegram] VITE_TELEGRAM_ADMIN_CHAT_ID not set')
    return
  }
  await post(ADMIN_CHAT_ID, text)
}

/* ── Пожелание → гостевой канал (видят все гости) ── */
export async function sendWish(firstName: string, lastName: string, wish: string): Promise<void> {
  if (!GUEST_CHANNEL) {
    console.warn('[Telegram] VITE_TELEGRAM_GUEST_CHANNEL_ID not set')
    return
  }
  const text = `💌 <b>${[firstName, lastName].filter(Boolean).join(' ')}</b>\n\n${wish}`
  await post(GUEST_CHANNEL, text)
}

/* ── Обратная совместимость (GuestBook и другие) → admin chat ── */
export async function sendTelegramMessage(text: string): Promise<void> {
  await sendGuestData(text)
}
