import { motion } from 'framer-motion'
import { Mic, Send, Trophy, ChevronRight } from 'lucide-react'
import { TELEGRAM_CHANNEL_URL } from '../../services/telegram'
import styles from './TelegramContest.module.scss'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const steps = [
  { Icon: Mic,    text: 'Запишите голосовое или видео с криком «Горько!»' },
  { Icon: Send,   text: 'Отправьте его в наш Telegram-канал' },
  { Icon: Trophy, text: 'Самое громкое «Горько!» получит приз на свадьбе' },
]

const TelegramContest = () => (
  <section className={styles.section}>
    <motion.div
      className={styles.card}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.div className={styles.iconWrap} variants={item}>
        <Mic size={28} strokeWidth={1.5} />
      </motion.div>

      <motion.h2 className={styles.title} variants={item}>
        Конкурс «Горько!»
      </motion.h2>

      <motion.p className={styles.subtitle} variants={item}>
        Подтвердите присутствие и побудьте настоящими гостями — даже до свадьбы
      </motion.p>

      <motion.div className={styles.steps} variants={item}>
        {steps.map(({ Icon, text }, i) => (
          <div key={i} className={styles.step}>
            <div className={styles.stepNum}>{i + 1}</div>
            <div className={styles.stepIcon}>
              <Icon size={16} strokeWidth={1.8} />
            </div>
            <p className={styles.stepText}>{text}</p>
          </div>
        ))}
      </motion.div>

      {TELEGRAM_CHANNEL_URL ? (
        <motion.a
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
          variants={item}
          whileTap={{ scale: 0.97 }}
        >
          Открыть Telegram-канал
          <ChevronRight size={18} strokeWidth={2} />
        </motion.a>
      ) : (
        <motion.div className={styles.btnPlaceholder} variants={item}>
          Telegram-канал скоро появится
        </motion.div>
      )}
    </motion.div>
  </section>
)

export default TelegramContest
