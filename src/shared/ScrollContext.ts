import { createContext, useContext } from 'react'
import { MotionValue, useMotionValue } from 'framer-motion'

export const ScrollProgressContext = createContext<MotionValue<number>>(null!)
export const useScrollProgress = () => useContext(ScrollProgressContext)

/** Создаётся один раз в App и пробрасывается вниз через провайдер */
export const useScrollMotionValue = () => useMotionValue(0)
