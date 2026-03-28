import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

function getInitialDark(): boolean {
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function AppShell() {
  const [dark, setDark] = useState(getInitialDark)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-white dark:bg-gray-900 transition-colors">
      <header className="flex justify-end px-4 pt-2">
        <button
          onClick={() => setDark((d) => !d)}
          className="text-xl p-1 text-gray-400 dark:text-gray-500 active:scale-95 transition-transform"
          aria-label="Dark Mode umschalten"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
