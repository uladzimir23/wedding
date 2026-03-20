import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import styles from './RSVP.module.scss'

// ← замени на свой Telegram username (без @)
const TELEGRAM_USERNAME = 'your_telegram'

interface RSVPForm {
  guestName: string
  attending: 'yes' | 'no'
  withGuests: boolean
  additionalGuests: string[]
  transferNeeded: boolean
  allergies: string
  contact: string
}

const initial: RSVPForm = {
  guestName: '',
  attending: 'yes',
  withGuests: false,
  additionalGuests: [''],
  transferNeeded: false,
  allergies: '',
  contact: '',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

const SuccessScreen = () => (
  <motion.div
    className={styles.success}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className={styles.successIcon}>🎉</div>
    <h3 className={styles.successTitle}>Спасибо!</h3>
    <p className={styles.successText}>
      Мы очень рады, что вы будете с нами.<br />
      Ждём вас 24 апреля!
    </p>
  </motion.div>
)

const RSVP = () => {
  const [tab, setTab] = useState<'telegram' | 'form'>('telegram')
  const [form, setForm] = useState<RSVPForm>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPForm, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!form.guestName.trim()) e.guestName = 'Введите ваше имя'
    if (!form.contact.trim()) e.contact = 'Укажите телефон'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    if (form.attending === 'yes') {
      confetti({ particleCount: 150, spread: 70, colors: ['#D4AF37', '#E8C5C5', '#FFFAF7', '#6B1A2A'] })
    }
  }

  const set = <K extends keyof RSVPForm>(key: K, value: RSVPForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const updateGuest = (index: number, value: string) => {
    const updated = [...form.additionalGuests]
    updated[index] = value
    set('additionalGuests', updated)
  }

  const addGuest = () => set('additionalGuests', [...form.additionalGuests, ''])

  const removeGuest = (index: number) => {
    const updated = form.additionalGuests.filter((_, i) => i !== index)
    set('additionalGuests', updated.length > 0 ? updated : [''])
  }

  if (submitted) return (
    <section className={styles.section} id="rsvp">
      <div className={styles.container}><SuccessScreen /></div>
    </section>
  )

  return (
    <section className={styles.section} id="rsvp">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          Подтверждение участия
        </motion.h2>
        <motion.p className={styles.subtitle} variants={itemVariants}>
          Пожалуйста, ответьте до 1 апреля 2026 года
        </motion.p>

        {/* ── Табы ── */}
        <motion.div className={styles.tabs} variants={itemVariants}>
          <button
            className={`${styles.tab} ${tab === 'telegram' ? styles.tabActive : ''}`}
            onClick={() => setTab('telegram')}
          >
            <TelegramIcon />
            Через Telegram
          </button>
          <button
            className={`${styles.tab} ${tab === 'form' ? styles.tabActive : ''}`}
            onClick={() => setTab('form')}
          >
            📝 Форма на сайте
          </button>
        </motion.div>

        {/* ── Содержимое таба ── */}
        <AnimatePresence mode="wait">

          {/* Telegram */}
          {tab === 'telegram' && (
            <motion.div
              key="telegram"
              className={styles.tabPanel}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.telegramCard}>
                <div className={styles.telegramCircleWrap}>
                  <div className={styles.telegramCircle}>
                    <span className={styles.telegramCircleEmoji}>🥂</span>
                  </div>
                  <div className={styles.telegramCircleRing} />
                </div>

                <p className={styles.telegramMain}>
                  Запишите нам кружочек в Telegram
                </p>
                <p className={styles.telegramSub}>
                  Просто скажите в камеру <strong>«Горько!»</strong> —<br />
                  это и будет ваше подтверждение 🎊
                </p>

                <a
                  href={`https://t.me/${TELEGRAM_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.telegramBtn}
                >
                  <TelegramIcon />
                  Открыть Telegram
                </a>

                <p className={styles.telegramHint}>
                  Нет Telegram?{' '}
                  <button className={styles.switchLink} onClick={() => setTab('form')}>
                    Заполните форму
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* Форма */}
          {tab === 'form' && (
            <motion.div
              key="form"
              className={styles.tabPanel}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.field}>
                  <label className={styles.label}>Ваше имя *</label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.guestName ? styles.inputError : ''}`}
                    value={form.guestName}
                    onChange={e => set('guestName', e.target.value)}
                    placeholder="Имя и фамилия"
                  />
                  {errors.guestName && <span className={styles.error}>{errors.guestName}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Смогу присутствовать?</label>
                  <div className={styles.radioGroup}>
                    {(['yes', 'no'] as const).map(val => (
                      <label key={val} className={`${styles.radioLabel} ${form.attending === val ? styles.radioActive : ''}`}>
                        <input
                          type="radio"
                          name="attending"
                          value={val}
                          checked={form.attending === val}
                          onChange={() => set('attending', val)}
                          className={styles.radioInput}
                        />
                        {val === 'yes' ? '✓ Да, приду!' : '✗ К сожалению, нет'}
                      </label>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {form.attending === 'yes' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={styles.extraFields}
                    >
                      <div className={styles.field}>
                        <label className={styles.checkLabel}>
                          <input
                            type="checkbox"
                            checked={form.withGuests}
                            onChange={e => set('withGuests', e.target.checked)}
                            className={styles.checkbox}
                          />
                          Приду с партнёром / детьми
                        </label>
                      </div>

                      <AnimatePresence>
                        {form.withGuests && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className={styles.guestList}
                          >
                            <p className={styles.guestListHint}>Укажите имя и фамилию каждого</p>
                            {form.additionalGuests.map((name, i) => (
                              <motion.div
                                key={i}
                                className={styles.guestRow}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <input
                                  type="text"
                                  className={styles.input}
                                  value={name}
                                  onChange={e => updateGuest(i, e.target.value)}
                                  placeholder={i === 0 ? 'Партнёр — Имя Фамилия' : 'Ребёнок — Имя Фамилия'}
                                />
                                {form.additionalGuests.length > 1 && (
                                  <button type="button" className={styles.removeBtn} onClick={() => removeGuest(i)} aria-label="Удалить">
                                    <X size={16} />
                                  </button>
                                )}
                              </motion.div>
                            ))}
                            <button type="button" className={styles.addBtn} onClick={addGuest}>
                              <Plus size={16} />
                              Добавить ещё
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className={styles.field}>
                        <label className={styles.label}>Нужен трансфер?</label>
                        <div className={styles.radioGroup}>
                          {([true, false] as const).map(val => (
                            <label key={String(val)} className={`${styles.radioLabel} ${form.transferNeeded === val ? styles.radioActive : ''}`}>
                              <input
                                type="radio"
                                name="transfer"
                                checked={form.transferNeeded === val}
                                onChange={() => set('transferNeeded', val)}
                                className={styles.radioInput}
                              />
                              {val ? '✓ Да, нужен' : '✗ Нет, доберусь сам'}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.label}>Аллергии или ограничения в еде/напитках</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={form.allergies}
                          onChange={e => set('allergies', e.target.value)}
                          placeholder="Если есть — укажите"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={styles.field}>
                  <label className={styles.label}>Телефон *</label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                    value={form.contact}
                    onChange={e => set('contact', e.target.value)}
                    placeholder="+375..."
                  />
                  {errors.contact && <span className={styles.error}>{errors.contact}</span>}
                </div>

                <button type="submit" className={styles.submitButton}>
                  {form.attending === 'yes' ? '🎉 Подтвердить участие' : 'Отправить ответ'}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default RSVP
