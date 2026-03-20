import { motion } from 'framer-motion'
import styles from './Dresscode.module.scss'

const colorRows = [
  {
    label: 'Песочные и оливковые',
    colors: ['#D4C9AA', '#C0B090', '#768050', '#444D28'],
  },
  {
    label: 'Нюдовые',
    colors: ['#EDE2D0', '#DFC5A8', '#D0AE88', '#C8A078'],
  },
  {
    label: 'Коричневые и шоколадные',
    colors: ['#B87848', '#9E6038', '#5A3018', '#1E1008'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const Dresscode = () => (
  <section className={styles.section} id="dresscode">
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.p className={styles.note} variants={itemVariants}>
        Мы очень старались сделать праздник красивым и будем рады, если в своих
        нарядах вы поддержите цветовую гамму нашей свадьбы, отдав предпочтение
        нейтральным оттенкам. Просим по возможности избегать рисунков и ярких
        цветов в ваших образах.
      </motion.p>

      <motion.div className={styles.palette} variants={itemVariants}>
        {colorRows.map((row) => (
          <div key={row.label} className={styles.paletteRow}>
            {row.colors.map((hex) => (
              <motion.div
                key={hex}
                className={styles.circle}
                style={{ background: hex }}
                whileHover={{ scale: 1.12, y: -4 }}
                transition={{ duration: 0.2 }}
                title={hex}
              />
            ))}
          </div>
        ))}
      </motion.div>

    </motion.div>
  </section>
)

export default Dresscode
