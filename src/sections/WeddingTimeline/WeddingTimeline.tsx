import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Wine, Gem, PartyPopper, Moon } from 'lucide-react'
import styles from './WeddingTimeline.module.scss'

interface Event {
  time:  string
  title: string
  desc:  string
  Icon:  LucideIcon
  color: string
  accentColor: string
}

const events: Event[] = [
  {
    time: '15:00', title: 'Сбор гостей',  desc: 'Welcome-фуршет',
    Icon: Wine,        color: 'linear-gradient(135deg,#C9A227,#e8c44a)', accentColor: '#C9A227',
  },
  {
    time: '16:00', title: 'Церемония',    desc: 'Торжественная часть',
    Icon: Gem,         color: 'linear-gradient(135deg,#6B1A2A,#9B2840)', accentColor: '#6B1A2A',
  },
  {
    time: '17:00', title: 'Банкет',       desc: 'Ужин, поздравления и танцы',
    Icon: PartyPopper, color: 'linear-gradient(135deg,#8B3A4A,#C4595A)', accentColor: '#8B3A4A',
  },
  {
    time: '23:00', title: 'Финал вечера', desc: 'Завершение праздника',
    Icon: Moon,        color: 'linear-gradient(135deg,#3C2A4A,#6B4E8A)', accentColor: '#3C2A4A',
  },
]

const card = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const WeddingTimeline = () => (
  <section className={styles.section} id="program">

    <motion.div
      className={styles.programCard}
      variants={card}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* ── Header ── */}
      <div className={styles.header}>
        <p className={styles.headerScript}>24 апреля</p>
        <div className={styles.headerMeta}>
          <span className={styles.headerMetaChip}>GRAND CHALET</span>
          <span className={styles.headerMetaChip}>ПЯТНИЦА</span>
        </div>
        <div className={styles.headerDivider}>
          <span className={styles.headerDividerLine} />
          <span className={styles.headerDividerGem}>✦</span>
          <span className={styles.headerDividerLine} />
        </div>
        <p className={styles.headerLabel}>ПРОГРАММА ДНЯ</p>
      </div>

      {/* ── Timeline events ── */}
      <motion.div
        className={styles.events}
        variants={{ visible: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {events.map((event, i) => (
          <motion.div
            key={event.time}
            variants={{
              hidden:  { opacity: 0, x: -16 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: 'easeOut' } },
            }}
          >
            <div className={styles.event}>
              {/* Thread dot */}
              <div className={styles.threadDot} style={{ background: event.color }} />

              {/* Time pill */}
              <div className={styles.timePill} style={{ background: event.color }}>
                <event.Icon size={11} color="rgba(255,255,255,0.92)" strokeWidth={2.2} />
                <span className={styles.timeText}>{event.time}</span>
              </div>

              {/* Event body */}
              <div className={styles.eventBody}>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventDesc}>{event.desc}</div>
              </div>
            </div>
            {i < events.length - 1 && <div className={styles.sep} />}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
)

export default WeddingTimeline
