import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send } from 'lucide-react'
import { sendTelegramMessage, sendWish } from '../../services/telegram'
import styles from './GuestBook.module.scss'

interface Message {
  name: string
  text: string
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const GuestBook = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    const entry = { name: name.trim(), text: text.trim() }
    setMessages(prev => [entry, ...prev])
    setName('')
    setText('')
    sendTelegramMessage(
      `💌 <b>ПОЖЕЛАНИЕ МОЛОДЫМ</b>\n\n✍️ <b>${entry.name}</b>\n«${entry.text}»\n\n⏰ ${new Date().toLocaleString('ru-RU')}`
    )
    sendWish(entry.name, '', entry.text)
  }

  return (
    <section className={styles.section} id="guestbook">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          <Heart size={22} className={styles.titleIcon} />
          Ваши пожелания
        </motion.h2>

        <motion.form onSubmit={handleSubmit} className={styles.form} variants={itemVariants}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.input}
            required
          />
          <textarea
            placeholder="Напишите тёплые слова..."
            value={text}
            onChange={e => setText(e.target.value)}
            className={styles.textarea}
            rows={3}
            required
          />
          <button type="submit" className={styles.button}>
            <Send size={16} />
            Отправить пожелание
          </button>
        </motion.form>

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.name}-${i}`}
              className={styles.messageCard}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <strong className={styles.msgName}>{msg.name}</strong>
              <p className={styles.msgText}>{msg.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default GuestBook
