import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key)

            if (storedValue === null) {
                return defaultValue
            }

            return JSON.parse(storedValue) as T
        } catch {
            return defaultValue
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // Ignore localStorage errors
        }
    }, [key, value])

    return [value, setValue] as const
}