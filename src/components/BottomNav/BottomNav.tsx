import { motion } from 'framer-motion'
import { Home, BookOpen, CalendarDays, ClipboardList, Info } from 'lucide-react'
import styles from './BottomNav.module.scss'

export interface NavScreen {
  id:    string
  label: string
}

interface Props {
  screens: NavScreen[]
  current: number
  onChange: (idx: number) => void
}

const ICONS = [Home, BookOpen, CalendarDays, ClipboardList, Info]

const BottomNav = ({ screens, current, onChange }: Props) => (
  <nav className={styles.nav}>
    {screens.map((s, i) => {
      const Icon   = ICONS[i]
      const active = current === i

      return (
        <button
          key={s.id}
          className={`${styles.item} ${active ? styles.itemActive : ''}`}
          onClick={() => onChange(i)}
          aria-label={s.label}
        >
          {/* Активный фон-пилюля */}
          {active && (
            <motion.span
              layoutId="nav-pill"
              className={styles.pill}
              transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            />
          )}

          <span className={styles.iconWrap}>
            <Icon
              size={22}
              strokeWidth={active ? 2.2 : 1.6}
              className={styles.icon}
            />
          </span>

          <span className={styles.label}>{s.label}</span>
        </button>
      )
    })}
  </nav>
)

export default BottomNav
