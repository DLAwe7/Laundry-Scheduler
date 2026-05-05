import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark'
export type Language = 'en' | 'fr'

export function usePreferences() {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark')
    const [language, setLanguage] = useLocalStorage<Language>('language', 'en')

    return {
        theme,
        setTheme,
        language,
        setLanguage,
    }
}