import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import styles from './Gallery.module.scss'

const placeholders = [1, 2, 3, 4]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const Gallery = () => {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className={styles.section} id="gallery">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        ref={containerRef}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          Наши моменты
        </motion.h2>

        <div className={styles.grid}>
          {placeholders.map((_, i) => (
            <motion.div
              key={i}
              className={styles.card}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -4 }}
              onClick={() => setLightbox(i)}
            >
              <div className={styles.placeholder}>
                <Camera size={36} strokeWidth={1} />
                <span>Фото {i + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {lightbox !== null && (
        <motion.div
          className={styles.lightbox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
        >
          <button className={styles.closeBtn} onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <div className={styles.lightboxPlaceholder}>
              <Camera size={64} strokeWidth={1} />
              <span>Фото {lightbox + 1}</span>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}

export default Gallery
