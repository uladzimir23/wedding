import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './ScrollLine.module.scss'

const ScrollLine = () => {
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div className={styles.container}>
      <svg
        className={styles.svg}
        viewBox="0 0 200 2000"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="
            M100,20
            C140,150 60,300 100,450
            C140,600 60,750 100,900
            C140,1050 60,1200 100,1350
            C140,1500 60,1650 100,1800
            C140,1950 100,1980 100,1980
          "
          stroke="var(--accent-gold)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  )
}

export default ScrollLine
