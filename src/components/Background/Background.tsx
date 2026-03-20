import { useTransform, useSpring, motion } from 'framer-motion'
import { useScrollProgress } from '../../shared/ScrollContext'
import styles from './Background.module.scss'

/* ── SVG primitives ── */
const PetalSvg = ({ fill = 'rgba(232,197,197,0.45)', angle = 0 }: { fill?: string; angle?: number }) => (
  <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <ellipse cx="25" cy="35" rx="13" ry="26" fill={fill} transform={`rotate(${angle} 25 35)`} />
  </svg>
)

const SparkleSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M12 2L13.5 9L20 8L14.5 12.5L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12.5L4 8L10.5 9L12 2Z" />
  </svg>
)

const HeartSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const RingsSvg = () => (
  <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="52" cy="45" r="38" stroke="currentColor" strokeWidth="5" />
    <circle cx="88" cy="45" r="38" stroke="currentColor" strokeWidth="5" opacity="0.65" />
  </svg>
)

const Background = () => {
  const scrollYProgress = useScrollProgress()

  // Три слоя параллакса: scrollY в пикселях × коэффициент
  // Slow (дальний план) — 8% скорости скролла
  // Med  (средний план) — 16%
  // Fast (ближний план) — 28%
  const ySlow = useSpring(useTransform(scrollYProgress, (v) => v * -0.08), { stiffness: 28, damping: 22 })
  const yMed  = useSpring(useTransform(scrollYProgress, (v) => v * -0.16), { stiffness: 28, damping: 22 })
  const yFast = useSpring(useTransform(scrollYProgress, (v) => v * -0.28), { stiffness: 28, damping: 22 })

  return (
    <div className={styles.background} aria-hidden="true">

      {/* ── Ambient gradient blobs ── */}
      <div className={styles.blobTL} />
      <div className={styles.blobBR} />
      <div className={styles.blobCenter} />
      <div className={styles.blobMid} />

      {/* ── Rings — самый медленный слой ── */}
      <motion.div className={`${styles.el} ${styles.ringsTR}`} style={{ y: ySlow }}>
        <RingsSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.ringsBL}`} style={{ y: yMed }}>
        <RingsSvg />
      </motion.div>

      {/* ── Petals — средний слой ── */}
      <motion.div className={`${styles.el} ${styles.petal1}`} style={{ y: ySlow }}>
        <PetalSvg fill="rgba(232,197,197,0.38)" angle={-15} />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.petal2}`} style={{ y: yMed }}>
        <PetalSvg fill="rgba(201,162,39,0.15)" angle={32} />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.petal3}`} style={{ y: ySlow }}>
        <PetalSvg fill="rgba(197,213,192,0.26)" angle={-42} />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.petal4}`} style={{ y: yFast }}>
        <PetalSvg fill="rgba(232,197,197,0.30)" angle={20} />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.petal5}`} style={{ y: yMed }}>
        <PetalSvg fill="rgba(184,212,227,0.20)" angle={-28} />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.petal6}`} style={{ y: ySlow }}>
        <PetalSvg fill="rgba(232,197,197,0.24)" angle={44} />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.petal7}`} style={{ y: yMed }}>
        <PetalSvg fill="rgba(201,162,39,0.12)" angle={-10} />
      </motion.div>

      {/* ── Sparkles — быстрый слой ── */}
      <motion.div className={`${styles.el} ${styles.sparkle1}`} style={{ y: yFast }}>
        <SparkleSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.sparkle2}`} style={{ y: yMed }}>
        <SparkleSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.sparkle3}`} style={{ y: ySlow }}>
        <SparkleSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.sparkle4}`} style={{ y: yFast }}>
        <SparkleSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.sparkle5}`} style={{ y: yMed }}>
        <SparkleSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.sparkle6}`} style={{ y: ySlow }}>
        <SparkleSvg />
      </motion.div>

      {/* ── Paper grain texture ── */}
      <div className={styles.grain} />
      <div className={styles.vignette} />

      {/* ── Hearts — самый быстрый слой (ближе к зрителю) ── */}
      <motion.div className={`${styles.el} ${styles.heart1}`} style={{ y: yFast }}>
        <HeartSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.heart2}`} style={{ y: yMed }}>
        <HeartSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.heart3}`} style={{ y: yFast }}>
        <HeartSvg />
      </motion.div>
      <motion.div className={`${styles.el} ${styles.heart4}`} style={{ y: ySlow }}>
        <HeartSvg />
      </motion.div>

    </div>
  )
}

export default Background
