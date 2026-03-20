import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './FAQ.module.scss'

const faqs = [
  {
    q: 'Как добраться до места?',
    a: 'Мы организуем трансфер. Если едете самостоятельно — GRAND CHALET, д. Большие Новосёлки, ул. Садовая 37Б.',
  },
  {
    q: 'Есть ли парковка на месте?',
    a: 'Да, на территории GRAND CHALET есть бесплатная парковка для гостей.',
  },
  {
    q: 'Можно ли приходить с детьми?',
    a: 'Конечно! Дети — желанные гости. Пожалуйста, укажите в форме подтверждения, если придёте с маленькими детьми.',
  },
  // {
  //   q: 'Каков дресс-код?',
  //   a: 'Просим придерживаться палитры: белый, зелёный или бежевый. Пожалуйста, воздержитесь от полностью белых нарядов — этот цвет зарезервирован для невесты.',
  // },
  {
    q: 'До какого числа нужно подтвердить участие?',
    a: 'Просим ответить до 1 апреля 2026 года через форму на этом сайте.',
  },
  // {
  //   q: 'Когда заканчивается вечер?',
  //   a: 'В 23:30. ',
  // },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className={styles.section} id="faq">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.p className={styles.label} variants={itemVariants}>ВОПРОСЫ</motion.p>

        <div className={styles.list}>
          {faqs.map((item, i) => (
            <motion.div key={i} className={styles.item} variants={itemVariants}>
              <button
                className={`${styles.question} ${openIndex === i ? styles.questionOpen : ''}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <motion.span
                  className={styles.chevron}
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className={styles.answerWrap}
                  >
                    <p className={styles.answer}>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default FAQ
