import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import RingsLogo from '../RingsLogo'
import styles from './Header.module.scss'

const WEDDING_DATE = new Date('2026-04-24T16:00:00')

const getDaysLeft = () => {
  const diff = WEDDING_DATE.getTime() - Date.now()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

const pluralDays = (n: number) => {
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дня'
  return 'дней'
}

const Header = () => {
  const [days, setDays] = useState(getDaysLeft)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 120], [0, 1])
  const y = useTransform(scrollY, [0, 120], [-60, 0])

  useEffect(() => {
    const timer = setInterval(() => setDays(getDaysLeft()), 3_600_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.header className={styles.header} style={{ opacity, y }}>
      <div className={styles.container}>
        <div className={styles.left}>
          <RingsLogo size={28} className={styles.logo} />
          <span className={styles.names}>Игорь & Екатерина</span>
        </div>
        <div className={styles.countdown}>
          <span className={styles.daysNumber}>{days}</span>
          <span className={styles.daysLabel}>{pluralDays(days)}</span>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
