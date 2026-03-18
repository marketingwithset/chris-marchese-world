'use client'

interface RoomTransitionProps {
  active: boolean
}

export default function RoomTransition({ active }: RoomTransitionProps) {
  return (
    <div
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{
        background: '#060606',
        opacity: active ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    />
  )
}
