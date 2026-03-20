import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollProgressContext, useScrollMotionValue } from '../shared/ScrollContext'

import Background from '../components/Background/Background'
import AppBar     from '../components/AppBar/AppBar'
import BottomNav  from '../components/BottomNav/BottomNav'
import type { NavScreen } from '../components/BottomNav/BottomNav'

import Hero           from '../sections/Hero/Hero'
import Welcome        from '../sections/Welcome/Welcome'
import StoryGallery   from '../sections/StoryGallery/StoryGallery'
import WeddingTimeline from '../sections/WeddingTimeline/WeddingTimeline'
import Location       from '../sections/Location/Location'
import Calendar       from '../sections/Calendar/Calendar'
import QuizFunnel     from '../sections/QuizFunnel/QuizFunnel'
import TelegramContest from '../sections/TelegramContest/TelegramContest'
import GuestBook      from '../sections/GuestBook/GuestBook'
import Gifts          from '../sections/Gifts/Gifts'
import Dresscode      from '../sections/Dresscode/Dresscode'
import FAQ            from '../sections/FAQ/FAQ'
import Contacts       from '../sections/Contacts/Contacts'
import Footer         from '../sections/Footer/Footer'

import styles from './App.module.scss'

/* ─────────────────────────────────
   Конфигурация экранов
───────────────────────────────── */
const SCREENS: NavScreen[] = [
  { id: 'home',  label: 'Главная'   },
  { id: 'story', label: 'История'   },
  { id: 'day',   label: 'Программа' },
  { id: 'rsvp',  label: 'Гости'     },
  { id: 'info',  label: 'Инфо'      },
]

// true = вертикальный скролл, false = секция управляет скроллом сама
const SCROLLABLE = [true, false, false, false, true]

/* ─────────────────────────────────
   Tab transition — fade + soft shift
───────────────────────────────── */
const variants = {
  enter: (d: number) => ({
    opacity: 0,
    y: d > 0 ? 14 : -14,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (d: number) => ({
    opacity: 0,
    y: d > 0 ? -8 : 8,
  }),
}

const spring = { type: 'tween' as const, duration: 0.28, ease: [0.4, 0, 0.2, 1] }

/* ─────────────────────────────────
   App
───────────────────────────────── */
function App() {
  const [active, setActive] = useState(0)
  const [dir,    setDir]    = useState(0)
  const prevRef = useRef(0)
  const scrollProgress = useScrollMotionValue()

  const navigate = (i: number) => {
    if (i === active) return
    setDir(i > prevRef.current ? 1 : -1)
    prevRef.current = i
    setActive(i)
    scrollProgress.set(0)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollProgress.set(e.currentTarget.scrollTop)
  }

  return (
    <ScrollProgressContext.Provider value={scrollProgress}>
    <div className={styles.app}>
      <Background />

      <AppBar title={SCREENS[active].label} />

      {/* ── Экраны ── */}
      <main className={styles.main}>
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={active}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className={`${styles.screen} ${SCROLLABLE[active] ? styles.screenScroll : styles.screenFixed}`}
            onScroll={SCROLLABLE[active] ? handleScroll : undefined}
          >
            {active === 0 && (
              <>
                <Hero />
                <Welcome />
                <TelegramContest />
              </>
            )}

            {active === 1 && <StoryGallery />}

            {active === 2 && (
              <div className={styles.dayScreen}>
                <div className={styles.dayStack}>
                  <WeddingTimeline />
                  <Location />
                  <Calendar />
                </div>
              </div>
            )}

            {active === 3 && <QuizFunnel />}

            {active === 4 && (
              <>
                <div className={styles.infoStack}>
                  <Gifts />
                  <Dresscode />
                  <FAQ />
                  <Contacts />
                </div>
                <Footer />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav screens={SCREENS} current={active} onChange={navigate} />
    </div>
    </ScrollProgressContext.Provider>
  )
}

export default App
