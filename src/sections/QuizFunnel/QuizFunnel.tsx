import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ChevronLeft, ExternalLink, Check,
  User, Smile, Phone, Users, Car, AlertCircle, Target, Heart,
  Gem, PartyPopper, Pencil, Sparkles, Trophy,
  Bus, Minus,
  CheckCircle2, AlertTriangle,
  CalendarDays, XCircle, MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { sendGuestData, sendWish, TELEGRAM_CHANNEL_URL } from '../../services/telegram'
import { getVisitorInfo } from '../../services/analytics'
import styles from './QuizFunnel.module.scss'

/* ════════════════════════════════════
   SVG Primitives
════════════════════════════════════ */
const HeartSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

/* ════════════════════════════════════
   Types
════════════════════════════════════ */
interface QuizData {
  firstName:       string
  lastName:        string
  phone:           string
  guests:          string
  guestNames:      string[]
  transport:       string
  hasAllergies:    boolean | null
  allergiesDetail: string
  trivia:          string
  wishes:          string
}

interface SavedSummary {
  firstName:        string
  lastName:         string
  phone:            string
  guests:           string
  guestNames:       string[]
  transport:        string
  hasAllergies?:    boolean | null
  allergiesDetail?: string
  wishes?:          string
}

const EMPTY: QuizData = {
  firstName: '', lastName: '', phone: '',
  guests: '', guestNames: [],
  transport: '',
  hasAllergies: null, allergiesDetail: '',
  trivia: '', wishes: '',
}

const TOTAL = 8

/* ── Step label map ── */
const STEP_LABEL: Record<number, string> = {
  1: 'Знакомство',
  2: 'Знакомство',
  3: 'Контакты',
  4: 'Гости',
  5: 'Логистика',
  6: 'Питание',
  7: 'Викторина',
  8: 'Пожелания',
}

/* ── Display helpers ── */
const guestsLabel = (g: string) => {
  if (g === '1') return 'Только я'
  if (g === '2') return 'Нас двое'
  if (g === '3') return 'Нас трое'
  if (g === '4+') return '4 и больше'
  return g
}
const transportLabel = (t: string) => {
  if (t === 'Трансфер') return 'Трансфер'
  if (t === 'Не указано') return 'Не определился'
  return t
}

/* ── Extra name-field count per guest option ── */
const extraNameCount = (guests: string) => {
  if (guests === '2') return 1
  if (guests === '3') return 2
  if (guests === '4+') return 3
  return 0
}

/* ─── Slide animation ─── */
const slide = {
  enter:  (d: number) => ({ y: d > 0 ? '10%' : '-10%', opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit:   (d: number) => ({ y: d > 0 ? '-25%' : '25%', opacity: 0 }),
}
const spring = { type: 'spring' as const, damping: 28, stiffness: 300, mass: 0.8 }

/* ─── OptionCard ─── */
interface OptionProps {
  Icon:     LucideIcon
  label:    string
  sub?:     string
  selected: boolean
  onClick:  () => void
}
const OptionCard = ({ Icon, label, sub, selected, onClick }: OptionProps) => (
  <button
    type="button"
    className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
    onClick={onClick}
  >
    <span className={styles.optionIconWrap}>
      <Icon size={22} strokeWidth={selected ? 2.2 : 1.8} />
    </span>
    <span className={styles.optionLabel}>{label}</span>
    {sub && <span className={styles.optionSub}>{sub}</span>}
    {selected && (
      <span className={styles.optionCheck}>
        <Check size={12} strokeWidth={3} />
      </span>
    )}
  </button>
)

/* ─── TriviaCard — special year pick ─── */
interface TriviaCardProps {
  year:     string
  selected: boolean
  onPick:   () => void
}
const TriviaCard = ({ year, selected, onPick }: TriviaCardProps) => {
  const isCorrect = year === '2019'
  return (
    <motion.button
      type="button"
      className={`${styles.triviaCard} ${selected ? (isCorrect ? styles.triviaCorrect : styles.triviaWrong) : ''}`}
      onClick={onPick}
      whileTap={{ scale: 0.93 }}
    >
      {selected && (
        <motion.span
          className={styles.triviaResultIcon}
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 220 }}
        >
          {isCorrect ? <Trophy size={18} strokeWidth={2} /> : <XCircle size={18} strokeWidth={2} />}
        </motion.span>
      )}
      <span className={styles.triviaYear}>{year}</span>
    </motion.button>
  )
}

/* ─── StepIcon ─── */
type IconVariant = 'default' | 'gold' | 'rose' | 'green'
const STEP_VARIANT: Record<number, IconVariant> = {
  1: 'rose', 2: 'default', 3: 'default',
  4: 'default', 5: 'default', 6: 'green',
  7: 'gold', 8: 'rose',
}
const StepIcon = ({ Icon, variant = 'default' }: { Icon: LucideIcon; variant?: IconVariant }) => (
  <div className={`${styles.stepIcon} ${styles[`stepIcon_${variant}`]}`}>
    <Icon size={28} strokeWidth={1.6} />
  </div>
)

/* ─── Step label badge ─── */
const StepLabel = ({ label }: { label: string }) => (
  <span className={styles.stepLabel}>{label}</span>
)

/* ════════════════════════════════════
   Main component
════════════════════════════════════ */
const QuizFunnel = () => {
  const [step,     setStep]     = useState(0)
  const [dir,      setDir]      = useState(1)
  const [data,     setData]     = useState<QuizData>(EMPTY)
  const [sending,  setSending]  = useState(false)
  const [editMode, setEditMode] = useState(false)

  const alreadyDone = localStorage.getItem('quiz_done') === '1'

  const savedSummary = (() => {
    try {
      const raw = localStorage.getItem('quiz_summary')
      return raw ? JSON.parse(raw) as SavedSummary : null
    } catch { return null }
  })()

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const set = <K extends keyof QuizData>(key: K, val: QuizData[K]) =>
    setData(prev => ({ ...prev, [key]: val }))

  const pick = <K extends keyof QuizData>(key: K, val: QuizData[K]) => {
    set(key, val)
  }

  const handleTriviaPick = (year: string) => {
    set('trivia', year)
    if (year === '2019') {
      confetti({
        particleCount: 55, spread: 55, origin: { y: 0.65 },
        colors: ['#C9A227', '#EDD0D0', '#FAF4F2', '#6B1A2A'],
      })
    }
  }

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return data.firstName.trim().length > 0
      case 2: return data.lastName.trim().length > 0
      case 3: return data.phone.replace(/\D/g, '').length >= 7
      case 4: {
        if (data.guests === '') return false
        const needed = extraNameCount(data.guests)
        if (needed === 0) return true
        return Array.from({ length: needed }, (_, i) => data.guestNames[i] ??
      '').every(n => n.trim().length > 0)
      }
      case 5: return data.transport !== ''
      case 6: return data.hasAllergies !== null &&
                     (!data.hasAllergies || data.allergiesDetail.trim().length > 0)
      case 7: return data.trivia !== ''
      case 8: return true
      default: return true
    }
  }

  const handleFinish = async () => {
    setSending(true)
    try {
      const v       = await getVisitorInfo()
      const correct = data.trivia === '2019'
      const names   = data.guestNames.filter(n => n.trim())
      const guestLine = names.length > 0
        ? `👥 Гостей: ${data.guests} (${names.join(', ')})`
        : `👥 Гостей: ${data.guests}`

      // → Приватная группа: полные данные гостя
      const adminLines = [
        `🎊 <b>НОВЫЙ ГОСТЬ!</b>`, ``,
        `👤 <b>${data.firstName} ${data.lastName}</b>`,
        `📞 ${data.phone}`,
        guestLine,
        `🚌 Транспорт: ${data.transport}`,
        data.hasAllergies ? `⚠️ Аллергии: ${data.allergiesDetail}` : `✅ Аллергий нет`,
        `🎯 Викторина: ${correct ? '✅ 2019 — верно!' : `❌ ответ: ${data.trivia}`}`,
        data.wishes ? `💌 Пожелание: «${data.wishes}»` : '',
        ``, `📊 <b>Аналитика</b>`,
        `🌍 ${v.ip} · ${v.city}, ${v.country}`,
        `${v.device} · 🖥 ${v.screen}`,
        `🔗 ${v.referrer}`, `🌐 ${v.language}`,
        `⏰ ${v.timestamp}`,
        `👁 Визит #${v.visitCount} с этого устройства`,
      ]
      localStorage.setItem('quiz_done', '1')
      localStorage.setItem('quiz_summary', JSON.stringify({
        firstName:        data.firstName,
        lastName:         data.lastName,
        phone:            data.phone,
        guests:           data.guests,
        guestNames:       data.guestNames,
        transport:        data.transport,
        hasAllergies:     data.hasAllergies,
        allergiesDetail:  data.allergiesDetail,
        wishes:           data.wishes,
      } satisfies SavedSummary))

      await sendGuestData(adminLines.filter(l => l !== '').join('\n'))

      // → Гостевой канал: только пожелание (если заполнено)
      if (data.wishes.trim()) {
        await sendWish(data.firstName, data.lastName, data.wishes.trim())
      }
    } catch (e) {
      console.error('Quiz submit error:', e)
    } finally {
      setSending(false)
    }
    confetti({
      particleCount: 160, spread: 80, origin: { y: 0.55 },
      colors: ['#C9A227', '#EDD0D0', '#FAF4F2', '#6B1A2A', '#C5D5C0'],
    })
    go(9)
  }

  const handleNext = () => {
    if (!canAdvance()) return
    if (step === TOTAL) { handleFinish(); return }
    go(step + 1)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step < TOTAL && canAdvance()) {
      e.preventDefault()
      go(step + 1)
    }
  }

  /* ─── Edit mode ─── */
  const enterEditMode = () => {
    if (savedSummary) {
      setData({
        firstName:       savedSummary.firstName || '',
        lastName:        savedSummary.lastName  || '',
        phone:           savedSummary.phone      || '',
        guests:          savedSummary.guests     || '',
        guestNames:      savedSummary.guestNames || [],
        transport:       savedSummary.transport  || '',
        hasAllergies:    savedSummary.hasAllergies    ?? null,
        allergiesDetail: savedSummary.allergiesDetail || '',
        trivia:          '',
        wishes:          savedSummary.wishes || '',
      })
    }
    setEditMode(true)
  }

  const canEditSave = () =>
    data.firstName.trim().length > 0 &&
    data.lastName.trim().length > 0 &&
    data.phone.replace(/\D/g, '').length >= 7

  const handleEditSave = async () => {
    if (!canEditSave()) return
    setSending(true)
    try {
      const v     = await getVisitorInfo()
      const names = data.guestNames.filter(n => n.trim())
      const guestLine = names.length > 0
        ? `👥 Гостей: ${data.guests} (${names.join(', ')})`
        : data.guests ? `👥 Гостей: ${data.guests}` : ''
      const allergyLine = data.hasAllergies === true
        ? `⚠️ Аллергии: ${data.allergiesDetail}`
        : data.hasAllergies === false ? `✅ Аллергий нет` : ''
      const adminLines = [
        `✏️ <b>ОБНОВЛЕНЫ ДАННЫЕ ГОСТЯ</b>`, ``,
        `👤 <b>${data.firstName} ${data.lastName}</b>`,
        `📞 ${data.phone}`,
        guestLine,
        data.transport ? `🚌 Транспорт: ${data.transport}` : '',
        allergyLine,
        data.wishes ? `💌 Пожелание: «${data.wishes}»` : '',
        ``, `⏰ ${v.timestamp}`,
      ]
      await sendGuestData(adminLines.filter(l => l !== '').join('\n'))
      if (data.wishes.trim()) {
        await sendWish(data.firstName, data.lastName, data.wishes.trim())
      }
      localStorage.setItem('quiz_summary', JSON.stringify({
        firstName:        data.firstName,
        lastName:         data.lastName,
        phone:            data.phone,
        guests:           data.guests,
        guestNames:       data.guestNames,
        transport:        data.transport,
        hasAllergies:     data.hasAllergies,
        allergiesDetail:  data.allergiesDetail,
        wishes:           data.wishes,
      } satisfies SavedSummary))
    } catch (e) {
      console.error('Edit save error:', e)
    } finally {
      setSending(false)
      setEditMode(false)
    }
  }

  const renderEditForm = () => (
    <div className={styles.editFormWrap}>
      <div className={styles.editForm}>

        {/* Header */}
        <div className={styles.editHeader}>
          <button className={styles.editBackBtn} onClick={() => setEditMode(false)} aria-label="Назад">
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <span className={styles.editTitle}>Обновить данные</span>
        </div>

        {/* Имя и фамилия */}
        <div className={styles.editGroup}>
          <span className={styles.editGroupLabel}>Имя и фамилия</span>
          <input type="text" className={styles.input}
            placeholder="Имя" value={data.firstName}
            onChange={e => set('firstName', e.target.value)}
            autoComplete="given-name" autoFocus />
          <input type="text" className={styles.input}
            placeholder="Фамилия" value={data.lastName}
            onChange={e => set('lastName', e.target.value)}
            autoComplete="family-name" />
        </div>

        {/* Телефон */}
        <div className={styles.editGroup}>
          <span className={styles.editGroupLabel}>Телефон</span>
          <input type="tel" className={styles.input}
            placeholder="+375 (29) ___-__-__" value={data.phone}
            onChange={e => set('phone', e.target.value)}
            autoComplete="tel" inputMode="tel" />
        </div>

        {/* Кол-во гостей */}
        <div className={styles.editGroup}>
          <span className={styles.editGroupLabel}>Сколько вас придёт?</span>
          <div className={styles.editSegmented}>
            {([
              { val: '1',  label: 'Только я' },
              { val: '2',  label: 'Двое'     },
              { val: '3',  label: 'Трое'     },
              { val: '4+', label: '4+'       },
            ] as const).map(o => (
              <button key={o.val}
                className={`${styles.editSegBtn} ${data.guests === o.val ? styles.editSegBtnActive : ''}`}
                onClick={() => setData(prev => ({ ...prev, guests: o.val, guestNames: [] }))}
              >
                {o.label}
              </button>
            ))}
          </div>
          {extraNameCount(data.guests) > 0 && (
            <div className={styles.editNamesWrap}>
              <span className={styles.editGroupLabel}>Имена сопровождающих</span>
              {Array.from({ length: extraNameCount(data.guests) }, (_, i) => (
                <input key={i} type="text" className={styles.input}
                  placeholder={`Гость ${i + 1}`}
                  value={data.guestNames[i] ?? ''}
                  onChange={e => {
                    const names = [...data.guestNames]
                    names[i] = e.target.value
                    set('guestNames', names)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Транспорт */}
        <div className={styles.editGroup}>
          <span className={styles.editGroupLabel}>Транспорт</span>
          <div className={styles.editTransportStack}>
            {([
              { val: 'Свой транспорт', label: 'На своём транспорте' },
              { val: 'Трансфер',       label: 'Нужен трансфер'      },
              { val: 'Не указано',     label: 'Определюсь позже'    },
            ] as const).map(o => (
              <button key={o.val}
                className={`${styles.editTransportRow} ${data.transport === o.val ? styles.editTransportRowActive : ''}`}
                onClick={() => set('transport', o.val)}
              >
                <span className={`${styles.editTransportDot} ${data.transport === o.val ? styles.editTransportDotActive : ''}`}>
                  {data.transport === o.val && <Check size={9} strokeWidth={3} color="#fff" />}
                </span>
                <span className={styles.editTransportLabel}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Аллергии */}
        <div className={styles.editGroup}>
          <span className={styles.editGroupLabel}>Аллергии или ограничения в еде</span>
          <div className={styles.editSegmented} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button
              className={`${styles.editSegBtn} ${data.hasAllergies === false ? styles.editSegBtnActive : ''}`}
              onClick={() => set('hasAllergies', false)}
            >
              Нет, всё ок
            </button>
            <button
              className={`${styles.editSegBtn} ${data.hasAllergies === true ? styles.editSegBtnActive : ''}`}
              onClick={() => set('hasAllergies', true)}
            >
              Да, есть
            </button>
          </div>
          {data.hasAllergies === true && (
            <input type="text" className={styles.input}
              placeholder="Что именно? Например: орехи, глютен…"
              value={data.allergiesDetail}
              onChange={e => set('allergiesDetail', e.target.value)} />
          )}
        </div>

        {/* Пожелания */}
        <div className={styles.editGroup}>
          <span className={styles.editGroupLabel}>Пожелания молодым</span>
          <textarea className={styles.textarea} rows={3}
            placeholder="Напишите тёплые слова…"
            value={data.wishes}
            onChange={e => set('wishes', e.target.value)} />
        </div>

        {/* Save */}
        <button
          className={styles.editSaveBtn}
          onClick={handleEditSave}
          disabled={!canEditSave() || sending}
        >
          {sending ? 'Сохраняем…' : 'Сохранить изменения'}
        </button>

      </div>
    </div>
  )

  /* ─── Steps ─── */
  const renderStep = () => {
    switch (step) {

      /* ── Welcome ── */
      case 0:
        return (
          <div className={styles.welcome}>
            <motion.div
              className={styles.welcomeIcon}
              animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Gem size={48} strokeWidth={1.2} />
            </motion.div>
            <h1 className={styles.welcomeTitle}>
              Игорь <span className={styles.amp}>&amp;</span> Екатерина
            </h1>
            <div className={styles.welcomeDateBadge}>
              <MapPin size={12} strokeWidth={2} />
              24 апреля 2026 · GRAND CHALET
            </div>
            <p className={styles.welcomeText}>
              {alreadyDone
                ? 'Ты уже зарегистрировался! Можешь обновить данные.'
                : 'Привет! Ответь на несколько вопросов — мы всё подготовим специально для тебя.'}
            </p>

            {/* ── Saved summary card ── */}
            {alreadyDone && (
              <motion.div
                className={styles.savedCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className={styles.savedHeader}>
                  <span className={styles.savedBadge}>
                    <Check size={10} strokeWidth={3} />
                    В списке гостей
                  </span>
                  <button className={styles.savedEditBtn} onClick={enterEditMode}>
                    <Pencil size={11} strokeWidth={2} />
                    Изменить
                  </button>
                </div>
                {savedSummary ? (
                  <div className={styles.savedRows}>
                    <div className={styles.savedRow}>
                      <span className={styles.savedRowIcon}><User size={13} /></span>
                      <span className={styles.savedRowText}>
                        {savedSummary.firstName} {savedSummary.lastName}
                      </span>
                    </div>
                    {savedSummary.phone && (
                      <div className={styles.savedRow}>
                        <span className={styles.savedRowIcon}><Phone size={13} /></span>
                        <span className={styles.savedRowText}>{savedSummary.phone}</span>
                      </div>
                    )}
                    {savedSummary.guests && (
                      <div className={styles.savedRow}>
                        <span className={styles.savedRowIcon}><Users size={13} /></span>
                        <div>
                          <span className={styles.savedRowText}>{guestsLabel(savedSummary.guests)}</span>
                          {savedSummary.guestNames?.filter(n => n.trim()).length > 0 && (
                            <span className={styles.savedRowSub}>
                              {savedSummary.guestNames.filter(n => n.trim()).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {savedSummary.transport && (
                      <div className={styles.savedRow}>
                        <span className={styles.savedRowIcon}>
                          {savedSummary.transport === 'Трансфер' ? <Bus size={13} /> : <Car size={13} />}
                        </span>
                        <span className={styles.savedRowText}>{transportLabel(savedSummary.transport)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className={styles.savedNoData}>
                    Данные зарегистрированы. Нажмите «Изменить», чтобы уточнить информацию.
                  </p>
                )}
              </motion.div>
            )}

            {!alreadyDone && (
              <motion.button
                className={styles.startBtn}
                onClick={() => go(1)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Sparkles size={16} /> Начать
              </motion.button>
            )}
          </div>
        )

      /* ── Имя ── */
      case 1:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[1]} />
            <StepIcon Icon={User} variant={STEP_VARIANT[1]} />
            <h2 className={styles.question}>Как тебя зовут?</h2>
            <p className={styles.hint}>Напиши своё имя</p>
            <input type="text" className={styles.input}
              placeholder="Имя"
              value={data.firstName}
              onChange={e => set('firstName', e.target.value)}
              onKeyDown={handleKey}
              autoComplete="given-name"
              autoFocus />
          </div>
        )

      /* ── Фамилия ── */
      case 2:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[2]} />
            <StepIcon Icon={Smile} variant={STEP_VARIANT[2]} />
            <h2 className={styles.question}>Отлично, {data.firstName}!<br />А фамилия?</h2>
            <p className={styles.hint}>Фамилия</p>
            <input type="text" className={styles.input}
              placeholder="Фамилия"
              value={data.lastName}
              onChange={e => set('lastName', e.target.value)}
              onKeyDown={handleKey}
              autoComplete="family-name" />
          </div>
        )

      /* ── Телефон ── */
      case 3:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[3]} />
            <StepIcon Icon={Phone} variant={STEP_VARIANT[3]} />
            <h2 className={styles.question}>Твой номер телефона</h2>
            <p className={styles.hint}>Только для связи при необходимости</p>
            <input type="tel" className={styles.input}
              placeholder="+375 (29) ___-__-__"
              value={data.phone}
              onChange={e => set('phone', e.target.value)}
              onKeyDown={handleKey}
              autoComplete="tel"
              inputMode="tel" />
          </div>
        )

      /* ── Кол-во гостей ── */
      case 4: {
        const nameCount = extraNameCount(data.guests)
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[4]} />
            <StepIcon Icon={Users} variant={STEP_VARIANT[4]} />
            <h2 className={styles.question}>Сколько вас придёт?</h2>
            <div className={styles.optionGrid}>
              {([
                { val: '1',  Icon: User,       label: 'Только я',   sub: '1 гость'  },
                { val: '2',  Icon: Users,       label: 'Нас двое',   sub: '2 гостя'  },
                { val: '3',  Icon: Users,       label: 'Нас трое',   sub: '3 гостя'  },
                { val: '4+', Icon: PartyPopper, label: '4 и больше', sub: 'весело!'  },
              ] as const).map(o => (
                <OptionCard key={o.val} Icon={o.Icon} label={o.label} sub={o.sub}
                  selected={data.guests === o.val}
                  onClick={() => {
                    setData(prev => ({ ...prev, guests: o.val, guestNames: [] }))
                  }}
                />
              ))}
            </div>
            <div className={styles.guestNamesWrap}>
              <AnimatePresence mode="wait">
                {nameCount > 0 && (
                  <motion.div
                    key={data.guests}
                    className={styles.guestNamesInner}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <p className={styles.hint}>
                      Имена сопровождающих{data.guests === '4+' ? ' (можно первых трёх)' : ''}
                    </p>
                    {Array.from({ length: nameCount }, (_, i) => (
                      <input
                        key={i}
                        type="text"
                        className={styles.input}
                        placeholder={`Гость ${i + 1}`}
                        value={data.guestNames[i] ?? ''}
                        autoFocus={i === 0}
                        onChange={e => {
                          const names = [...data.guestNames]
                          names[i] = e.target.value
                          set('guestNames', names)
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      }

      /* ── Транспорт ── */
      case 5:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[5]} />
            <StepIcon Icon={Car} variant={STEP_VARIANT[5]} />
            <h2 className={styles.question}>Как планируешь добраться?</h2>
            <div className={styles.optionStack}>
              {([
                { val: 'Свой транспорт', Icon: Car,   label: 'На своём транспорте',  sub: 'Парковка на месте'               },
                { val: 'Трансфер',       Icon: Bus,   label: 'Нужен трансфер',       sub: 'Организуем' },
                { val: 'Не указано',     Icon: Minus, label: 'Определюсь позже',     sub: 'Без ответа'                      },
              ] as const).map(o => (
                <OptionCard key={o.val} Icon={o.Icon} label={o.label} sub={o.sub}
                  selected={data.transport === o.val} onClick={() => pick('transport', o.val)} />
              ))}
            </div>
          </div>
        )

      /* ── Аллергии ── */
      case 6:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[6]} />
            <StepIcon Icon={AlertCircle} variant={STEP_VARIANT[6]} />
            <h2 className={styles.question}>Есть аллергии или<br />ограничения в еде?</h2>
            <div className={styles.optionRow}>
              {([
                { val: false, Icon: CheckCircle2,  label: 'Нет, всё ок'  },
                { val: true,  Icon: AlertTriangle, label: 'Да, есть'     },
              ] as const).map(o => (
                <OptionCard key={String(o.val)} Icon={o.Icon} label={o.label}
                  selected={data.hasAllergies === o.val}
                  onClick={() => set('hasAllergies', o.val)} />
              ))}
            </div>
            <AnimatePresence>
              {data.hasAllergies === true && (
                <motion.div
                  className={styles.allergyInputWrap}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <input type="text" className={`${styles.input} ${styles.inputMt}`}
                    placeholder="Что именно? Например: орехи, глютен…"
                    value={data.allergiesDetail}
                    onChange={e => set('allergiesDetail', e.target.value)}
                    onKeyDown={handleKey} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )

      /* ── Викторина ── */
      case 7:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[7]} />
            <StepIcon Icon={Target} variant={STEP_VARIANT[7]} />
            <h2 className={styles.question}>В каком году<br />мы познакомились?</h2>
            <p className={styles.hint}>Вспомни нашу историю — там был ответ 😉</p>
            <div className={styles.triviaGrid}>
              {(['2017', '2018', '2019', '2020'] as const).map(y => (
                <TriviaCard key={y} year={y} selected={data.trivia === y} onPick={() => handleTriviaPick(y)} />
              ))}
            </div>
            <AnimatePresence>
              {data.trivia !== '' && data.trivia !== '2019' && (
                <motion.div className={styles.triviaHintBox}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  <Sparkles size={14} strokeWidth={1.8} />
                  <span>Подсказка: правильный ответ — 2019</span>
                </motion.div>
              )}
            </AnimatePresence>
            {data.trivia === '2019' && (
              <motion.div className={styles.triviaSuccessBox}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              >
                <Trophy size={14} strokeWidth={2} />
                <span>Верно! Именно в 2019-м всё началось ✨</span>
              </motion.div>
            )}
          </div>
        )

      /* ── Пожелания ── */
      case 8:
        return (
          <div className={styles.stepContent}>
            <StepLabel label={STEP_LABEL[8]} />
            <StepIcon Icon={Heart} variant={STEP_VARIANT[8]} />
            <h2 className={styles.question}>Пожелания<br />молодым</h2>
            <p className={styles.hint}>Необязательно, но очень приятно</p>
            <div className={styles.wishesWrap}>
              <textarea className={styles.textarea}
                placeholder="Напишите тёплые слова…"
                value={data.wishes}
                onChange={e => set('wishes', e.target.value)}
                rows={4} />
              <div className={styles.wishesDecorHeart}><HeartSvg /></div>
            </div>
          </div>
        )

      /* ── Success ── */
      case 9:
        return (
          <div className={styles.success}>
            <motion.div
              className={styles.successBadge}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05, type: 'spring', damping: 18, stiffness: 220 }}
            >
              <Check size={13} strokeWidth={2.8} />
              В списке гостей
            </motion.div>

            <motion.div className={styles.successIcon}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.15 }}
            >
              <PartyPopper size={56} strokeWidth={1.2} />
            </motion.div>

            <motion.h2 className={styles.successTitle}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Спасибо, {data.firstName}!
            </motion.h2>

            <motion.p className={styles.successText}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              Ты официально в нашем списке гостей. Ждём тебя на самый важный день нашей жизни!
            </motion.p>

            <motion.div
              className={styles.successDateBadge}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CalendarDays size={14} strokeWidth={1.8} />
              24 апреля 2026 · GRAND CHALET
            </motion.div>

            {TELEGRAM_CHANNEL_URL && (
              <motion.a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className={styles.tgBtn}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.78 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              >
                <ExternalLink size={16} />
                Наш Telegram канал
              </motion.a>
            )}

            <motion.p className={styles.successHint}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            >
              Там — новости, фото и вся информация о свадьбе
            </motion.p>
          </div>
        )

      default: return null
    }
  }

  const showProgress = step >= 1 && step <= TOTAL
  const progress     = TOTAL > 1 ? ((step - 1) / (TOTAL - 1)) * 100 : 0
  const showNav      = step >= 1 && step <= TOTAL
  const isLast       = step === TOTAL

  return (
    <section className={styles.section}>
      <AnimatePresence mode="wait" initial={false}>

        {editMode ? (

          /* ── Edit form ── */
          <motion.div key="edit" className={styles.contentArea}
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {renderEditForm()}
          </motion.div>

        ) : (

          /* ── Normal quiz flow ── */
          <motion.div key="quiz" style={{ display: 'contents' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress */}
            <AnimatePresence>
              {showProgress && (
                <motion.div className={styles.progressWrap}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className={styles.progressTrack}>
                    <motion.div
                      className={styles.progressBar}
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={styles.progressLabel}>{step} / {TOTAL}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className={styles.contentArea}>
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={spring}
                  className={styles.stepFrame}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav */}
            <AnimatePresence>
              {showNav && (
                <motion.div className={styles.navRow}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  <button className={styles.backBtn} onClick={() => go(step - 1)} aria-label="Назад">
                    <ChevronLeft size={20} strokeWidth={2} />
                  </button>
                  <button
                    className={`${styles.nextBtn} ${!canAdvance() ? styles.nextDisabled : ''}`}
                    onClick={handleNext}
                    disabled={!canAdvance() || sending}
                  >
                    {sending ? 'Отправляем…' : isLast ? 'Готово ✓' : 'Далее'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        )}

      </AnimatePresence>
    </section>
  )
}

export default QuizFunnel
