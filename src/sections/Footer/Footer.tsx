import { motion } from 'framer-motion'
import styles from './Footer.module.scss'

const Footer = () => (
  <footer className={styles.footer} id="footer">
    <motion.div
      className={styles.inner}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <p className={styles.withLove}>С любовью,</p>
      <p className={styles.names}>Игорь &amp; Екатерина</p>
      <p className={styles.year}>2026</p>

      <div className={styles.divider} />

      <p className={styles.date}>24 апреля 2026</p>
    </motion.div>
  </footer>
)

export default Footer
