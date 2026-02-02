import { useState, useCallback } from 'react'

export function useHover() {
  const [hoveredId, setHoveredId] = useState<string | number | null>(null)

  const handleHover = useCallback((id: string | number | null) => {
    setHoveredId(id)
  }, [])

  return {
    hoveredId,
    setHoveredId: handleHover,
    isHovered: (id: string | number) => hoveredId === id,
  }
}

export function useToggle(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { isOpen, toggle, open, close, setIsOpen }
}
