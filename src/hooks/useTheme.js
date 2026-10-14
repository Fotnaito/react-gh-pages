import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}
