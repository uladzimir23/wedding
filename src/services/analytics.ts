export interface VisitorInfo {
  ip: string
  city: string
  country: string
  device: string
  screen: string
  referrer: string
  language: string
  timestamp: string
  visitCount: number
}

export async function getVisitorInfo(): Promise<VisitorInfo> {
  let ip      = 'н/д'
  let city    = 'н/д'
  let country = 'н/д'

  try {
    const res = await fetch('https://ipapi.co/json/')
    if (res.ok) {
      const d = await res.json()
      ip      = d.ip           ?? ip
      city    = d.city         ?? city
      country = d.country_name ?? country
    }
  } catch {
    // silent — не критично
  }

  const ua = navigator.userAgent
  let device = '💻 Компьютер'
  if      (/iPhone/.test(ua))  device = '📱 iPhone'
  else if (/iPad/.test(ua))    device = '📱 iPad'
  else if (/Android/.test(ua)) device = '📱 Android'

  const visitCount = (() => {
    const n = parseInt(localStorage.getItem('w_visits') ?? '0', 10) + 1
    localStorage.setItem('w_visits', String(n))
    return n
  })()

  return {
    ip,
    city,
    country,
    device,
    screen:     `${window.screen.width}×${window.screen.height}`,
    referrer:   document.referrer || 'прямой переход',
    language:   navigator.language,
    timestamp:  new Date().toLocaleString('ru-RU'),
    visitCount,
  }
}
