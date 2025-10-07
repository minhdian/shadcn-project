import { CSSProperties } from 'react'

export const hoverTimeStyle = (hoverX: number): CSSProperties => ({
  position: 'absolute',
  left: hoverX,
  top: -28,
  background: '#222',
  color: '#fff',
  fontSize: 12,
  padding: '2px 6px',
  borderRadius: 4,
  pointerEvents: 'none',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
})
