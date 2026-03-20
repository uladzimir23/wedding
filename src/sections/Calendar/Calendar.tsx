import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Check, Sparkles } from 'lucide-react'
import * as ics from 'ics'
import styles from './Calendar.module.scss'

const WEDDING = new Date('2026-04-24T16:00:00')
const WEEKDAYS = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота']

const handleAddToCalendar = (onDone: () => void) => {
  const event: ics.EventAttributes = {
    start:       [2026, 4, 24, 16, 0],
    duration:    { hours: 8 },
    title:       'Свадьба Игоря и Екатерины Юрастовых',
    description: 'Приглашаем вас разделить этот особенный день с нами!',
    location:    'GRAND CHALET, д. Большие Новосёлки, ул. Садовая 37Б',
    status:      'CONFIRMED',
    busyStatus:  'BUSY',
  }
  ics.createEvent(event, (error, value) => {
    if (error) { console.error(error); return }
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href  = url
    link.download = 'igor-katsiaryna-wedding.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    onDone()
  })
}

const Calendar = () => {
  const [added, setAdded] = useState(false)
  const weekday = WEEKDAYS[WEDDING.getDay()]

  return (
    <section className={styles.section} id="calendar">

      <motion.div
        className={styles.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* ── Label ── */}
        <motion.div
          className={styles.sectionLabel}
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
        >
          <CalendarDays size={13} strokeWidth={2} />
          Сохранить дату
        </motion.div>

        {/* ── Romantic subtitle ── */}
        <motion.p
          className={styles.subtitle}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05 } } }}
        >
          Добавь в календарь, чтобы не забыть<br />самый важный день
        </motion.p>

        {/* ── Widget ── */}
        <motion.div
          className={styles.widget}
          variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } } }}
          whileHover={{ y: -4 }}
        >
          {/* Red/wine header */}
          <div className={styles.calHeader}>
            <span className={styles.monthLabel}>Апрель 2026</span>
          </div>

          {/* Body */}
          <div className={styles.calBody}>
            {/* Week strip */}
            <div className={styles.weekStrip}>
              {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((d, i) => (
                <span key={d} className={`${styles.weekDay} ${i === 4 ? styles.weekDayActive : ''}`}>{d}</span>
              ))}
            </div>

            <div className={styles.dayNumber}>24</div>
            <div className={styles.weekdayName}>{weekday}</div>

            <div className={styles.divider} />

            <div className={styles.eventRow}>
              <span className={styles.eventDot} />
              <span className={styles.eventLabel}>Бракосочетание · 16:00</span>
            </div>
            <div className={styles.eventRow}>
              <span className={styles.eventDot} style={{ background: '#C9A227' }} />
              <span className={styles.eventLabel}>Банкет · 17:00 — 23:00</span>
            </div>
          </div>
        </motion.div>

        {/* ── CTA button ── */}
        <motion.button
          className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`}
          onClick={() => !added && handleAddToCalendar(() => setAdded(true))}
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          whileHover={!added ? { scale: 1.03, y: -1 } : {}}
          whileTap={!added ? { scale: 0.97 } : {}}
          disabled={added}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="done"
                className={styles.btnInner}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <Check size={16} strokeWidth={2.5} />
                Добавлено в Календарь
              </motion.span>
            ) : (
              <motion.span
                key="add"
                className={styles.btnInner}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <Sparkles size={16} strokeWidth={1.8} />
                Добавить в Календарь
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

      </motion.div>
    </section>
  )
}

export default Calendar
