import { motion } from 'framer-motion'
import { Wine, BookOpen, Gift } from 'lucide-react'
import styles from './Gifts.module.scss'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const chips = [
  { Icon: Wine,     label: 'Бутылочка хорошего вина' },
  { Icon: BookOpen, label: 'Ваша любимая книга'       },
  { Icon: Gift,     label: 'Подарочный сертификат'    },
]

const Gifts = () => (
  <section className={styles.section} id="gifts">
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      <motion.p className={styles.label} variants={itemVariants}>ПОЖЕЛАНИЯ</motion.p>

      <motion.div className={styles.card} variants={itemVariants}>
        <p className={styles.main}>
          Для нас главное — разделить этот день с вами
        </p>
        <p className={styles.sub}>
          Мы строим свой дом с нуля, наполняя его теплом. Наш праздник будет окружён
          изобилием цветов, поэтому приятным комплиментом для нас вместо букета будет:
        </p>

        <div className={styles.chips}>
          {chips.map(({ Icon, label }) => (
            <div key={label} className={styles.chip}>
              <Icon size={15} strokeWidth={1.8} className={styles.chipIcon} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
)

export default Gifts
