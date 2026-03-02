// hooks/useDarkMode.ts
// Placez ce fichier dans votre dossier hooks/ (ex: src/hooks/useDarkMode.ts)
// Importez-le dans home-page et classifier avec : import { useDarkMode } from '@/hooks/useDarkMode'

import { useState, useEffect } from 'react'

const KEY = 'heritage-dark'

export function useDarkMode() {
  const [dark, setDark] = useState(false)

  // Au montage : lire localStorage, sinon préférence système
  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored !== null) {
      setDark(stored === 'true')
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  const toggle = () =>
    setDark(prev => {
      const next = !prev
      localStorage.setItem(KEY, String(next))
      return next
    })

  return { dark, toggle }
}
