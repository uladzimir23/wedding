import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import RingsLogo from '../../components/RingsLogo'
import photoIgor    from '../../shared/assets/детское игорь.png'
import photoKatya   from '../../shared/assets/детское екатерина.png'
import styles from './Hero.module.scss'

/* ── Animations ── */
const slideFromLeft  = { hidden: { opacity: 0, x: -44 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }
const slideFromRight = { hidden: { opacity: 0, x: 44  }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }
const fadeUp         = { hidden: { opacity: 0, y: 28  }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.32 } } }
const container      = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

const Hero = () => (
  <section className={styles.section} id="hero">

    <motion.div
      className={styles.inner}
      variants={container}
      initial="hidden"
      animate="visible"
    >
    
                {/* ── Text block ── */}
      <motion.div className={styles.textBlock} variants={fadeUp}>

      {/* Decorative divider */}
      <div className={styles.dividerRow}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerGem}>✦</span>
        <span className={styles.dividerLine} />
      </div>

      {/* Date badge */}
      <div className={styles.dateBadge}>
        <MapPin size={12} strokeWidth={2.5} />
        24 апреля 2026 · GRAND CHALET
      </div>

      </motion.div>
      {/* ── Kicker — above portraits ── */}
      <motion.p className={styles.kicker} variants={fadeUp}>
        Когда-то мы были такими…
      </motion.p>

      {/* ── Portrait pair ── */}
      <div className={styles.portraits}>

        {/* Igor */}
        <motion.div variants={slideFromLeft} className={styles.portraitWrap}>
          <div className={styles.portraitFrame}>
            <img
              src={photoIgor}
              alt="Игорь в детстве"
              className={styles.portraitImg}
            />
          </div>
          {/* <span className={styles.portraitName}>Игорь</span> */}
        </motion.div>


        {/* Katerina */}
        <motion.div variants={slideFromRight} className={styles.portraitWrap}>
          <div className={styles.portraitFrame}>
            <img
              src={photoKatya}
              alt="Екатерина в детстве"
              className={styles.portraitImg}
            />
          </div>
          {/* <span className={styles.portraitName}>Екатерина</span> */}
        </motion.div>

      </div>

      {/* ── Tagline — below portraits ── */}
      <motion.p className={styles.tagline} variants={fadeUp}>
        А теперь решили пожениться!
      </motion.p>


      {/* ── Scroll hint ── */}
      <motion.div
        className={styles.scrollHint}
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.scrollDot} />
        <div className={styles.scrollTrack} />
      </motion.div>

    </motion.div>
  </section>
)

export default Hero
