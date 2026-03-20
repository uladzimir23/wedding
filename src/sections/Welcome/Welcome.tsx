import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import styles from './Welcome.module.scss'

const TEXT =
  // 'Дорогие родные и близкие! ' +
  'С радостью и трепетом в сердце, ' +
  'мы приглашаем вас разделить ' +
  'с нами самый важный день ' +
  'в нашей жизни - ' +
  'День нашей свадьбы.'

const words = TEXT.split(' ')

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
}

const word = {
  hidden:  { opacity: 0, y: 18, rotateX: -15 },
  visible: { opacity: 1, y: 0,  rotateX: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const Welcome = () => (
  <section className={styles.section} id="welcome">

    <div className={styles.container}>

      {/* ── Decorative label ── */}
      <motion.div
        className={styles.label}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Heart size={12} strokeWidth={2} fill="currentColor" />
        Дорогие гости
      </motion.div>

      {/* ── Divider ── */}
      <motion.div
        className={styles.dividerRow}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className={styles.dividerLine} />
        <span className={styles.dividerGem}>✦</span>
        <span className={styles.dividerLine} />
      </motion.div>

      {/* ── Animated text ── */}
      <motion.p
        className={styles.greeting}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {words.map((w, i) => (
          <motion.span key={i} className={styles.word} variants={word}>
            {w}{' '}
          </motion.span>
        ))}
      </motion.p>

    </div>
  </section>
)

export default Welcome
