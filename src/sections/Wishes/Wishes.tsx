import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Heart, Send, ExternalLink } from 'lucide-react'
import styles from './Wishes.module.scss'

/* ─────────────────────────────────────────
   TODO (backend): заменить на GET /api/wishes
   и вызывать при монтировании через useEffect
   ───────────────────────────────────────── */

// Telegram-группа — замените на реальную ссылку
const TELEGRAM_GROUP = 'https://t.me/your_group'

/* ── Моковые пожелания ── */
interface Message {
  id:        string
  name:      string
  text:      string
  timestamp: string   // отображаемая строка (потом — ISO из БД → moment/dayjs)
  isMock:    boolean  // убрать флаг после подключения БД
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    name: 'Алина и Дима',
    text: 'Желаем вам двоим бесконечного счастья, в котором каждый день будет немного лучше предыдущего. Пусть ваш дом всегда будет полон смеха и тепла!',
    timestamp: '3 дня назад',
    isMock: true,
  },
  {
    id: 'm2',
    name: 'Мама Наташа',
    text: 'Деточки мои, смотрю на вас и сердце переполняется радостью. Любите друг друга, берегите и никогда не ложитесь спать в обиде. Я так горжусь вами 💕',
    timestamp: '2 дня назад',
    isMock: true,
  },
  {
    id: 'm3',
    name: 'Серёжа К.',
    text: 'Братан, наконец-то! 🎉 Катя — ты лучшее, что с ним случилось. Пусть каждый год только прибавляет поводов для гордости друг другом. Горько!!',
    timestamp: '2 дня назад',
    isMock: true,
  },
  {
    id: 'm4',
    name: 'Анна Петровна',
    text: 'Пусть ваша жизнь вместе будет как хорошее вино — с годами только лучше. Здоровья, путешествий и маленьких радостей каждый день!',
    timestamp: 'вчера',
    isMock: true,
  },
  {
    id: 'm5',
    name: 'Максим и Вика',
    text: 'Вы такая красивая пара! Желаем построить тот самый дом, где всегда вкусно пахнет и всегда рады гостям. Ждём вас в гости — отметить первую годовщину 🥂',
    timestamp: 'вчера',
    isMock: true,
  },
]

/* ── Цветовая палитра ── */
const colorRows = [
  { label: 'Песочные и оливковые', colors: ['#D4C9AA','#C0B090','#A89070','#768050','#606840','#444D28'] },
  { label: 'Нюдовые',              colors: ['#EDE2D0','#E8D5BE','#DFC5A8','#D8BA98','#D0AE88','#C8A078'] },
  { label: 'Коричневые',           colors: ['#B87848','#9E6038','#7A4828','#5A3018','#3A2010','#1E1008'] },
]

/* ── Утилита: инициалы для аватара ── */
function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

/* ── Анимации ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const panelVariants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.25 } },
}
const cardVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.35 } },
  exit:    { opacity: 0, scale: 0.93,         transition: { duration: 0.2 } },
}

type Tab = 'our' | 'yours'

/* ══════════════════════════════════════════
   Компонент карточки пожелания
   ══════════════════════════════════════════ */
const WishCard = ({ msg }: { msg: Message }) => (
  <motion.div
    key={msg.id}
    className={`${styles.messageCard} ${msg.isMock ? styles.messageCardMock : ''}`}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    layout
  >
    <div className={styles.cardHeader}>
      <div className={styles.avatar}>{initials(msg.name)}</div>
      <div className={styles.cardMeta}>
        <strong className={styles.msgName}>{msg.name}</strong>
        <span className={styles.msgTime}>{msg.timestamp}</span>
      </div>
    </div>
    <p className={styles.msgText}>{msg.text}</p>
  </motion.div>
)

/* ══════════════════════════════════════════
   Главный компонент
   ══════════════════════════════════════════ */
const Wishes = () => {
  const [tab, setTab]           = useState<Tab>('our')
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [name, setName]         = useState('')
  const [text, setText]         = useState('')
  const [sent, setSent]         = useState(false)   // анимация подтверждения

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return

    const newMsg: Message = {
      id:        `u-${Date.now()}`,
      name:      name.trim(),
      text:      text.trim(),
      timestamp: 'только что',
      isMock:    false,
    }

    /* TODO (backend):
       const res = await fetch('/api/wishes', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: newMsg.name, text: newMsg.text }),
       })
       const saved = await res.json()   // { id, name, text, createdAt }
       // backend сам отправит в Telegram через бота
    */

    setMessages(prev => [newMsg, ...prev])
    setName('')
    setText('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section className={styles.section} id="wishes">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* ── Заголовок ── */}
        <motion.h2 className={styles.title} variants={itemVariants}>
          Пожелания
        </motion.h2>

        {/* ── Табы (только мобайл/планшет) ── */}
        <motion.div className={styles.tabs} variants={itemVariants} role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'our'}
            className={`${styles.tab} ${tab === 'our' ? styles.tabActive : ''}`}
            onClick={() => setTab('our')}
          >
            <Palette size={16} />
            Наши пожелания
          </button>
          <button
            role="tab"
            aria-selected={tab === 'yours'}
            className={`${styles.tab} ${tab === 'yours' ? styles.tabActive : ''}`}
            onClick={() => setTab('yours')}
          >
            <Heart size={16} />
            Ваши пожелания
          </button>
        </motion.div>

        {/* ── Двухколоночная сетка ── */}
        <div className={styles.grid}>

          {/* ══ ЛЕВАЯ: Наши пожелания ══ */}
          <div className={`${styles.panel} ${tab === 'our' ? styles.panelActive : ''}`} role="tabpanel">
            <AnimatePresence mode="wait">
              {tab === 'our' && (
                <motion.div key="our" variants={panelVariants} initial="hidden" animate="visible" exit="exit" className={styles.panelInner}>
                  <h3 className={styles.panelTitle}>
                    <Palette size={20} className={styles.panelIcon} />
                    Наши пожелания
                  </h3>
                  <p className={styles.panelText}>
                    Для нас главное — разделить этот день с вами. Мы строим свой дом с нуля, наполняя его теплом. Наш праздник будет окружён изобилием живых цветов, поэтому приятным комплиментом вместо букета будет: бутылочка хорошего вина, ваша любимая книга или подарочный сертификат.
                  </p>
                  <div className={styles.palette}>
                    {colorRows.map(row => (
                      <div key={row.label} className={styles.paletteRow}>
                        {row.colors.map(hex => (
                          <motion.div
                            key={hex}
                            className={styles.circle}
                            style={{ background: hex }}
                            whileHover={{ scale: 1.15, y: -5 }}
                            transition={{ duration: 0.2 }}
                            title={hex}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className={styles.note}>
                    Мы будем рады, если в своих нарядах вы поддержите нашу цветовую гамму, отдав предпочтение нейтральным оттенкам. Просим избегать ярких рисунков и кричащих цветов.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══ ПРАВАЯ: Ваши пожелания ══ */}
          <div className={`${styles.panel} ${tab === 'yours' ? styles.panelActive : ''}`} role="tabpanel">
            <AnimatePresence mode="wait">
              {tab === 'yours' && (
                <motion.div key="yours" variants={panelVariants} initial="hidden" animate="visible" exit="exit" className={styles.panelInner}>
                  <h3 className={styles.panelTitle}>
                    <Heart size={20} className={styles.panelIcon} />
                    Ваши пожелания
                  </h3>

                  {/* ── Форма ── */}
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={styles.input}
                      required
                    />
                    <textarea
                      placeholder="Напишите тёплые слова..."
                      value={text}
                      onChange={e => setText(e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      required
                    />
                    <div className={styles.formFooter}>
                      <AnimatePresence>
                        {sent && (
                          <motion.span
                            className={styles.sentBadge}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            ✓ Отправлено и появится в ленте
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <button type="submit" className={styles.submitBtn}>
                        <Send size={15} />
                        Отправить
                      </button>
                    </div>
                  </form>

                  {/* ── Telegram-группа ── */}
                  <a
                    href={TELEGRAM_GROUP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.tgBanner}
                  >
                    <span className={styles.tgIcon}>✈</span>
                    <span className={styles.tgBannerText}>
                      <strong>Лента пожеланий в Telegram</strong>
                      <span>Все сообщения появляются в нашей группе в реальном времени</span>
                    </span>
                    <ExternalLink size={16} className={styles.tgExternal} />
                  </a>

                  {/* ── Лента сообщений ── */}
                  <div className={styles.feed}>
                    <div className={styles.feedHeader}>
                      <span className={styles.feedCount}>{messages.length} пожеланий</span>
                      <span className={styles.feedLive}>
                        <span className={styles.liveDot} />
                        в прямом эфире
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {messages.map(msg => (
                        <WishCard key={msg.id} msg={msg} />
                      ))}
                    </AnimatePresence>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </section>
  )
}

export default Wishes
