import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Play, Pause, Volume2, VolumeX, Disc } from 'lucide-react'
import styles from './MusicPlayer.module.scss'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const discRef = useRef<HTMLDivElement>(null)
  const spinTween = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onCanPlay = () => setIsLoaded(true)
    const onError = () => setError(true)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return
    if (isPlaying) {
      audioRef.current.pause()
      spinTween.current?.pause()
    } else {
      audioRef.current.play().then(() => {
        spinTween.current = gsap.to(discRef.current, {
          rotate: 360,
          duration: 3,
          repeat: -1,
          ease: 'linear',
        })
      }).catch(() => setError(true))
    }
    setIsPlaying(!isPlaying)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (val === 0) setIsMuted(true)
    else if (isMuted) setIsMuted(false)
  }

  if (error) {
    return (
      <div className={styles.player}>
        <Disc size={24} className={styles.discIcon} style={{ color: '#999' }} />
        <span className={styles.errorText}>Музыка недоступна</span>
      </div>
    )
  }

  return (
    <div className={styles.player}>
      <audio ref={audioRef} loop preload="auto">
        {/* Заменить на реальный трек после получения от пользователя */}
        <source src="/music/wedding-song.mp3" type="audio/mpeg" />
      </audio>

      <div className={styles.discContainer} ref={discRef}>
        <Disc size={40} className={styles.discIcon} />
      </div>

      <div className={styles.controls}>
        <button
          onClick={togglePlay}
          className={styles.controlButton}
          disabled={!isLoaded}
          aria-label={isPlaying ? 'Пауза' : 'Играть'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className={styles.volumeControl}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={styles.volumeButton}
            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className={styles.slider}
            aria-label="Громкость"
          />
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
