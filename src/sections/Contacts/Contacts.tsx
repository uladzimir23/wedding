import { motion } from 'framer-motion'
import { Phone, Send, ChevronRight } from 'lucide-react'
import { TELEGRAM_CHANNEL_URL } from '../../services/telegram'
import styles from './Contacts.module.scss'

const fade = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const Contacts = () => (
  <section className={styles.section} id="contacts">
    <motion.div
      className={styles.container}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.p className={styles.label} variants={fade}>КОНТАКТЫ</motion.p>

      <motion.div className={styles.group} variants={fade}>
        <a href="tel:+375336326338" className={styles.row}>
          <div className={styles.rowIcon} style={{ background: 'rgba(107,26,42,0.08)', color: 'var(--accent-wine)' }}>
            <Phone size={15} strokeWidth={2} />
          </div>
          <div className={styles.rowBody}>
            <span className={styles.rowTitle}>Игорь</span>
            <span className={styles.rowSub}>+375 (33) 632-63-38</span>
          </div>
          <ChevronRight size={14} className={styles.chevron} />
        </a>

        <div className={styles.rowDivider} />

        <a href="tel:+375447344535" className={styles.row}>
          <div className={styles.rowIcon} style={{ background: 'rgba(107,26,42,0.08)', color: 'var(--accent-wine)' }}>
            <Phone size={15} strokeWidth={2} />
          </div>
          <div className={styles.rowBody}>
            <span className={styles.rowTitle}>Екатерина</span>
            <span className={styles.rowSub}>+375 (44) 734-45-35</span>
          </div>
          <ChevronRight size={14} className={styles.chevron} />
        </a>

      </motion.div>

      {TELEGRAM_CHANNEL_URL && (
        <motion.div className={styles.group} variants={fade}>
          <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className={styles.row}>
            <div className={styles.rowIcon} style={{ background: 'rgba(0,136,204,0.12)', color: '#0088CC' }}>
              <Send size={15} strokeWidth={2} />
            </div>
            <div className={styles.rowBody}>
              <span className={styles.rowTitle}>Telegram-канал</span>
              <span className={styles.rowSub}>Новости и конкурс</span>
            </div>
            <ChevronRight size={14} className={styles.chevron} />
          </a>
        </motion.div>
      )}
    </motion.div>
  </section>
)

export default Contacts
