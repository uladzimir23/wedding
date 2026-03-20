import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Car, Bus, Clock, Copy, Check } from 'lucide-react'

import styles from './Location.module.scss'

const MAP_SRC = 'https://yandex.ru/map-widget/v1/?ll=27.1246%2C53.7407&z=15&pt=27.1246,53.7407,pm2blm&l=map'
const YANDEX_MAPS_URL = 'https://yandex.ru/maps/?rtext=~53.7407,27.1246&rtt=auto'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fade = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const VENUE_ADDRESS = 'д. Большие Новосёлки, ул. Садовая 37Б'

const Location = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(VENUE_ADDRESS).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
  <section className={styles.section} id="location">

    <motion.div
      className={styles.container}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* ── Map ── */}
      <motion.div className={styles.mapWrap} variants={fade}>
        <iframe
          src={MAP_SRC}
          className={styles.mapIframe}
          allowFullScreen
          loading="lazy"
          title="Карта места проведения"
        />
        <div className={styles.mapGradient} />
        {/* Venue badge overlay on map */}
        <div className={styles.mapBadge}>
          <MapPin size={12} strokeWidth={2.5} />
          GRAND CHALET
        </div>
      </motion.div>

      {/* ── Info sheet ── */}
      <motion.div className={styles.sheet} variants={fade}>

        {/* Venue row */}
        <div className={styles.venuRow}>
          <div className={styles.venuIcon}>
            <MapPin size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <div className={styles.venuInfo}>
            <div className={styles.venueName}>GRAND CHALET</div>
            <div className={styles.venueAddress}>{VENUE_ADDRESS}</div>
          </div>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
            onClick={handleCopy}
            title="Скопировать адрес"
          >
            {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2} />}
          </button>
        </div>

        <div className={styles.sheetDivider} />

        {/* Transport rows */}
        <div className={styles.transportList}>
          <div className={styles.transportCard}>
            <div className={styles.tIconWrap}>
              <Car size={16} strokeWidth={2} />
            </div>
            <div className={styles.tInfo}>
              <div className={styles.tTitle}>На своём транспорте</div>
              <div className={styles.tDesc}>Парковка на месте</div>
            </div>
            {/* <div className={styles.tBadge} style={{ color: '#5A7A55', borderColor: 'rgba(90,122,85,0.25)', background: 'rgba(90,122,85,0.07)' }}>
              Бесплатно
            </div> */}
          </div>

          <div className={styles.transportCard}>
            <div className={styles.tIconWrap} style={{ background: 'rgba(201,162,39,0.10)', color: 'var(--accent-gold)' }}>
              <Bus size={16} strokeWidth={2} />
            </div>
            <div className={styles.tInfo}>
              <div className={styles.tTitle}>Трансфер</div>
              {/* <div className={styles.tDesc}>Автобус · метро Восток</div> */}
            </div>

          </div>
        </div>

        <div className={styles.sheetDivider} />

        {/* Route button */}
        <motion.a
          href={YANDEX_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.routeBtn}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <Navigation size={16} strokeWidth={2.5} />
          Построить маршрут
        </motion.a>

      </motion.div>
    </motion.div>
  </section>
  )
}

export default Location
