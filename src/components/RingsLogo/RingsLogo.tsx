import React from 'react'

interface RingsLogoProps {
  className?: string
  size?: number
}

const RingsLogo: React.FC<RingsLogoProps> = ({ className, size = 36 }) => (
  <svg
    className={className}
    width={size * 1.67}
    height={size}
    viewBox="0 0 60 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="22" cy="18" r="14" stroke="var(--accent-gold)" strokeWidth="2.5" fill="none" />
    <circle cx="38" cy="18" r="14" stroke="var(--accent-rose-dark)" strokeWidth="2.5" fill="none" />
  </svg>
)

export default RingsLogo
