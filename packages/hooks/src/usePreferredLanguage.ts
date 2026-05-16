import { useEffect, useState } from 'react'

/**
 * Hook to get the user's preferred language from the browser
 * @returns The user's preferred language code (e.g., 'en-US', 'fr', 'es-ES')
 */
function usePreferredLanguage(): string {
    const [language, setLanguage] = useState<string>(() => {
        if (
            typeof window === 'undefined' ||
            typeof window.navigator === 'undefined'
        ) {
            return 'en-US'
        }
        return window.navigator.language || 'en-US'
    })

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        const handleLanguageChange = () => {
            setLanguage(window.navigator.language || 'en-US')
        }

        window.addEventListener('languagechange', handleLanguageChange)

        return () => {
            window.removeEventListener('languagechange', handleLanguageChange)
        }
    }, [])

    return language
}

export default usePreferredLanguage
