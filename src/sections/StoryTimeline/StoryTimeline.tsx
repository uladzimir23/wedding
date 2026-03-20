import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Sparkles, Coffee, Heart, Shield, HeartHandshake, Gem, Flower2 } from 'lucide-react'
import styles from './StoryTimeline.module.scss'

import photoZnakомstvo    from '../../shared/assets/знакомство.JPG'
import photoSvidanie      from '../../shared/assets/первое свидание-новое.png'
import photoNachalo       from '../../shared/assets/начало отношений.HEIC'
import photoArmiya        from '../../shared/assets/армия.HEIC'
import photoVossoedinenie from '../../shared/assets/воссоединение.png'
import photoKoltso        from '../../shared/assets/предложение.JPG'

interface StoryItem {
  key:   string
  year:  string
  Icon:  LucideIcon
  title: string
  desc:  string
  photo?: string
}

const story: StoryItem[] = [
  {
    key: 'znakомstvo',
    year: '2019',
    Icon: Sparkles,
    title: 'Знакомство',
    desc: 'Всё началось с одной встречи, которая изменила всё',
    photo: photoZnakомstvo,
  },
  {
    key: 'svidanie',
    year: '2019',
    Icon: Coffee,
    title: 'Первое свидание',
    desc: 'Кофе, смех и понимание, что это что-то особенное',
    photo: photoSvidanie,
  },
  {
    key: 'nachalo',
    year: '2020',
    Icon: Heart,
    title: 'Начало отношений',
    desc: 'Взаимные чувства, общие интересы',
    photo: photoNachalo,
  },
  {
    key: 'armiya',
    year: '2023',
    Icon: Shield,
    title: 'Армия',
    desc: 'Время, которое подтверждает, что любовь преодолевает всё',
    photo: photoArmiya,
  },
  {
    key: 'vossoedinenie',
    year: '2024',
    Icon: HeartHandshake,
    title: 'Воссоединение',
    desc: 'Новая глава, в которой наша любовь — это не вздохи на скамейке',
    photo: photoVossoedinenie,
  },
  {
    key: 'predlozhenie',
    year: '2025',
    Icon: Gem,
    title: 'Предложение',
    desc: 'Игорь встал на одно колено и Екатерина сказала «Да»',
    photo: photoKoltso,
  },
  {
    key: 'svadba',
    year: '2026',
    Icon: Flower2,
    title: 'Свадьба',
    desc: '24 апреля — день, когда мы станем семьёй',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const leftVariant = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const rightVariant = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const StoryTimeline = () => (
  <section className={styles.section} id="story">
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.h2 className={styles.title} variants={leftVariant}>
        Наша история
      </motion.h2>

      <div className={styles.timeline}>
        <div className={styles.line} />
        {story.map((item, i) => (
          <motion.div
            key={item.key}
            className={`${styles.item} ${i % 2 === 0 ? styles.itemLeft : styles.itemRight}`}
            variants={i % 2 === 0 ? leftVariant : rightVariant}
          >
            <div className={styles.card}>
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.title}
                  className={styles.photo}
                />
              ) : item.key === 'svadba' && (
                <div className={styles.weddingPlaceholder} aria-hidden="true">
                  <svg className={styles.wpRings} viewBox="0 0 120 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="44" cy="38" r="30" stroke="rgba(107,26,42,0.22)" strokeWidth="4" />
                    <circle cx="76" cy="38" r="30" stroke="rgba(201,162,39,0.35)" strokeWidth="4" />
                    <circle cx="44" cy="38" r="30" stroke="rgba(107,26,42,0.08)" strokeWidth="10" />
                    <circle cx="76" cy="38" r="30" stroke="rgba(201,162,39,0.12)" strokeWidth="10" />
                  </svg>
                  <div className={styles.wpDate}>24 · IV · 2026</div>
                  <div className={styles.wpNames}>Игорь & Екатерина</div>
                  <svg className={styles.wpSparkle1} viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.55)" strokeWidth="1.4">
                    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
                  </svg>
                  <svg className={styles.wpSparkle2} viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="1.4">
                    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
                  </svg>
                  <svg className={styles.wpPetal1} viewBox="0 0 50 70" fill="none">
                    <ellipse cx="25" cy="35" rx="13" ry="26" fill="rgba(232,197,197,0.45)" transform="rotate(-20 25 35)" />
                  </svg>
                  <svg className={styles.wpPetal2} viewBox="0 0 50 70" fill="none">
                    <ellipse cx="25" cy="35" rx="13" ry="26" fill="rgba(232,197,197,0.35)" transform="rotate(25 25 35)" />
                  </svg>
                </div>
              )}
              <div className={styles.cardBody}>
                <div className={styles.iconWrap}>
                  <item.Icon size={16} strokeWidth={2} />
                </div>
                <div className={styles.year}>{item.year}</div>
                <div className={styles.itemTitle}>{item.title}</div>
                <p className={styles.desc}>{item.desc}</p>
              </div>
            </div>
            <div className={styles.dot} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
)

export default StoryTimeline
