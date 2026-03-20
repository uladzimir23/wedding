import styles from './AppBar.module.scss'

const WEDDING_DATE = new Date('2026-04-24T16:00:00')

function daysLeft(): number {
  return Math.max(0, Math.ceil((WEDDING_DATE.getTime() - Date.now()) / 86_400_000))
}

interface Props {
  title: string
}

const AppBar = ({ title }: Props) => {
  const d = daysLeft()

  return (
    <header className={styles.bar}>
      <span className={styles.title}>{title}</span>

      <span className={styles.logo}>И &amp; Е</span>

      <span className={styles.countdown}>
        {d > 0 ? `${d} дней` : '🎉'}
      </span>
    </header>
  )
}

export default AppBar
