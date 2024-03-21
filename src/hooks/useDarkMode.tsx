import { useEffect, useState } from 'react'

type UseDarkModeType = [string, () => void]

function useDarkMode(): UseDarkModeType {

    const [theme, setTheme] = useState<string>(localStorage.theme || 'light')
    const colorTheme = theme === 'dark' ? 'light' : 'dark'


    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove(colorTheme)
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme, colorTheme])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return [colorTheme, toggleTheme]
}

export default useDarkMode