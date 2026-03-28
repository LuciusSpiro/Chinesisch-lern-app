import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Start', icon: '🏠' },
  { to: '/lernen', label: 'Lernen', icon: '📖' },
  { to: '/trainer', label: 'Vokabeln', icon: '📚' },
  { to: '/abmalen', label: 'Abmalen', icon: '✏️' },
  { to: '/schreiben', label: 'Schreiben', icon: '🖊️' },
  { to: '/spiele', label: 'Spiele', icon: '🎮' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center justify-center py-2 text-xs gap-0.5 transition-colors ${
              isActive ? 'text-red-600 font-semibold' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span className="text-[10px]">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
