import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CoupleLines.module.scss'

gsap.registerPlugin(ScrollTrigger)

const CoupleLines = () => {
  const heartMaleRef = useRef<SVGPathElement>(null)
  const heartFemaleRef = useRef<SVGPathElement>(null)
  const tailMaleRef = useRef<SVGPathElement>(null)
  const tailFemaleRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const tailMale = tailMaleRef.current
    const tailFemale = tailFemaleRef.current
    if (!tailMale || !tailFemale) return

    const maleLen = tailMale.getTotalLength()
    const femaleLen = tailFemale.getTotalLength()

    gsap.set(tailMale, { strokeDasharray: maleLen, strokeDashoffset: maleLen })
    gsap.set(tailFemale, { strokeDasharray: femaleLen, strokeDashoffset: femaleLen })

    gsap.to([tailMale, tailFemale], {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    })

    gsap.fromTo(
      [heartMaleRef.current, heartFemaleRef.current],
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, delay: 0.2 }
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className={styles.container}>
      <svg
        className={styles.svg}
        viewBox="0 0 200 4000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={heartMaleRef}
          d="M100,100 C115,70 135,50 155,60 C175,70 180,110 170,140 C160,170 140,200 120,220 C100,240 80,250 70,270"
          stroke="var(--accent-gold)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={heartFemaleRef}
          d="M100,100 C85,70 65,50 45,60 C25,70 20,110 30,140 C40,170 60,200 80,220 C100,240 120,250 130,270"
          stroke="var(--accent-rose)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={tailMaleRef}
          d="M70,270 C90,300 115,330 135,360 C155,390 155,430 135,460 C115,490 75,510 50,540 C25,570 20,610 40,640 C60,670 100,690 125,720 C150,750 145,790 115,820 C85,850 35,880 20,920 C5,960 35,1000 75,1030 C115,1060 165,1090 185,1120 C205,1150 185,1190 155,1220 C125,1250 85,1270 55,1300 C25,1330 15,1370 35,1400 C55,1430 95,1450 125,1480 C155,1510 165,1550 145,1580 C125,1610 85,1630 55,1660 C25,1690 25,1730 45,1760 C65,1790 95,1810 115,1840"
          stroke="var(--accent-gold)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={tailFemaleRef}
          d="M130,270 C110,300 85,330 65,360 C45,390 45,430 65,460 C85,490 125,510 150,540 C175,570 180,610 160,640 C140,670 100,690 75,720 C50,750 55,790 85,820 C115,850 165,880 180,920 C195,960 165,1000 125,1030 C85,1060 35,1090 15,1120 C-5,1150 15,1190 45,1220 C75,1250 115,1270 145,1300 C175,1330 185,1370 165,1400 C145,1430 105,1450 75,1480 C45,1510 35,1550 55,1580 C75,1610 115,1630 145,1660 C175,1690 175,1730 155,1760 C135,1790 105,1810 85,1840"
          stroke="var(--accent-rose)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

export default CoupleLines
