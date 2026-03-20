import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronLeft, ChevronRight,
  Sparkles, Coffee, Heart, Shield, HeartHandshake, Gem, Flower2,
} from 'lucide-react'
import styles from './StoryGallery.module.scss'

import photoZnakомstvo    from '../../shared/assets/знакомство.png'
import photoSvidanie      from '../../shared/assets/первое свидание-новое.png'
import photoNachalo       from '../../shared/assets/начало отношений.jpg'
import photoArmiya        from '../../shared/assets/армия.jpg'
import photoVossoedinenie from '../../shared/assets/воссоединение.png'
import photoKoltso        from '../../shared/assets/предложение.JPG'

interface Slide {
  year:   string
  Icon:   LucideIcon
  title:  string
  desc:   string
  label:  string
  photo?: string
}

const slides: Slide[] = [
  {
    year: '2019', Icon: Sparkles,
    title: 'Знакомство', desc: 'Всё началось с одной встречи, которая изменила всё',
    label: 'Начало истории', photo: photoZnakомstvo,
  },
  {
    year: '2019', Icon: Coffee,
    title: 'Первое свидание', desc: 'Кофе, смех и понимание, что это что-то особенное',
    label: 'Первый шаг', photo: photoSvidanie,
  },
  {
    year: '2020', Icon: Heart,
    title: 'Начало отношений', desc: 'Взаимные чувства, общие интересы',
    label: 'Вместе', photo: photoNachalo,
  },
  {
    year: '2023', Icon: Shield,
    title: 'Армия', desc: 'Время, которое подтверждает, что любовь преодолевает всё',
    label: 'Испытание', photo: photoArmiya,
  },
  {
    year: '2024', Icon: HeartHandshake,
    title: 'Воссоединение', desc: 'Новая глава, в которой наша любовь — это не вздохи на скамейке',
    label: 'Снова вместе', photo: photoVossoedinenie,
  },
  {
    year: '2025', Icon: Gem,
    title: 'Предложение', desc: 'Игорь встал на одно колено и Екатерина сказала «Да»',
    label: 'Самый важный вопрос', photo: photoKoltso,
  },
  {
    year: '2026', Icon: Flower2,
    title: 'Свадьба', desc: '24 апреля — день, когда мы станем семьёй',
    label: 'Наш день',
  },
]

const textVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
}

const StoryGallery = () => {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return
    const { scrollLeft, clientWidth } = trackRef.current
    const index = Math.round(scrollLeft / clientWidth)
    if (index !== active) setActive(index)
  }, [active])

  const goTo = useCallback((index: number) => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: trackRef.current.clientWidth * index, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => track.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goTo(Math.max(0, active - 1))
      if (e.key === 'ArrowRight') goTo(Math.min(slides.length - 1, active + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  const slide = slides[active]

  return (
    <section className={styles.section} id="story">

      {/* ── Горизонтальный трек фотографий ── */}
      <div className={styles.track} ref={trackRef}>
        {slides.map((s) => (
          <div key={s.title} className={styles.slide}>

            {/* Фото */}
            <div className={styles.imageSide}>
              {s.photo ? (
                <img src={s.photo} alt={s.title} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  {/* декоративные лепестки */}
                  <svg className={styles.wpPetal1} viewBox="0 0 50 70" fill="none">
                    <ellipse cx="25" cy="35" rx="13" ry="26" fill="rgba(232,197,197,0.45)" transform="rotate(-20 25 35)" />
                  </svg>
                  <svg className={styles.wpPetal2} viewBox="0 0 50 70" fill="none">
                    <ellipse cx="25" cy="35" rx="13" ry="26" fill="rgba(232,197,197,0.35)" transform="rotate(30 25 35)" />
                  </svg>
                  <svg className={styles.wpPetal3} viewBox="0 0 50 70" fill="none">
                    <ellipse cx="25" cy="35" rx="13" ry="26" fill="rgba(201,162,39,0.12)" transform="rotate(10 25 35)" />
                  </svg>
                  {/* искры */}
                  <svg className={styles.wpSparkle1} viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.6)" strokeWidth="1.4">
                    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
                  </svg>
                  <svg className={styles.wpSparkle2} viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="1.4">
                    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
                  </svg>
                  <svg className={styles.wpSparkle3} viewBox="0 0 24 24" fill="none" stroke="rgba(232,197,197,0.7)" strokeWidth="1.4">
                    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
                  </svg>
                  {/* центральный контент */}
                  <div className={styles.wpCenter}>
                    <svg className={styles.wpRings} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="58" cy="50" r="40" stroke="rgba(107,26,42,0.18)" strokeWidth="5" />
                      <circle cx="102" cy="50" r="40" stroke="rgba(201,162,39,0.30)" strokeWidth="5" />
                      <circle cx="58" cy="50" r="40" stroke="rgba(107,26,42,0.06)" strokeWidth="14" />
                      <circle cx="102" cy="50" r="40" stroke="rgba(201,162,39,0.09)" strokeWidth="14" />
                    </svg>
                    <div className={styles.wpNames}>Игорь {'&'} Екатерина</div>
                    <div className={styles.wpDate}>24 · IV · 2026</div>
                    <div className={styles.wpVenue}>GRAND CHALET</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* ── Фиксированная текстовая панель ── */}
      <div className={styles.textSide}>

        {/* Год — тускло, сверху справа внутри панели */}
        <div className={styles.yearBadge}>{slide.year}</div>

        {/* Текст меняется через AnimatePresence */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className={styles.textContent}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <span className={styles.slideLabel}>{slide.label}</span>

            <div className={styles.titleRow}>
              <span className={styles.slideIcon}>
                <slide.Icon size={20} strokeWidth={1.8} />
              </span>
              <h2 className={styles.title}>{slide.title}</h2>
            </div>

            <p className={styles.desc}>{slide.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* ── Навигация — всегда на месте ── */}
        <div className={styles.navBar}>
          <button
            className={styles.navBtn}
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Назад"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>

          <div className={styles.dots}>
            {slides.map((_, j) => (
              <button
                key={j}
                className={`${styles.dot} ${active === j ? styles.dotActive : ''}`}
                onClick={() => goTo(j)}
                aria-label={`Слайд ${j + 1}`}
              />
            ))}
          </div>

          <button
            className={styles.navBtn}
            onClick={() => goTo(Math.min(slides.length - 1, active + 1))}
            disabled={active === slides.length - 1}
            aria-label="Вперёд"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

      </div>

    </section>
  )
}

export default StoryGallery
