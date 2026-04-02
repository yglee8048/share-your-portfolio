'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  matchPrefix: string
  disabled?: boolean
}

const WalletIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-2M16 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const PieIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
)

const navItems: NavItem[] = [
  { label: '계좌 관리', href: '/accounts', icon: <WalletIcon />, matchPrefix: '/accounts' },
  { label: '투자 기록', href: '#', icon: <BookIcon />, matchPrefix: '/journal', disabled: true },
  { label: '성과 분석', href: '#', icon: <ChartIcon />, matchPrefix: '/analytics', disabled: true },
  { label: '포트폴리오', href: '#', icon: <PieIcon />, matchPrefix: '/portfolio', disabled: true },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 bg-white border-r border-brand-100 min-h-screen pt-4 pb-8">
      <nav className="flex flex-col gap-1 px-3 mt-2">
        {navItems.map((item) => {
          const isActive = !item.disabled && pathname.startsWith(item.matchPrefix)
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-disabled={item.disabled}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-100 text-brand-700'
                  : item.disabled
                  ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                  : 'text-gray-500 hover:bg-brand-50 hover:text-brand-600',
              ].join(' ')}
            >
              <span className={isActive ? 'text-brand-500' : ''}>{item.icon}</span>
              <span>{item.label}</span>
              {item.disabled && (
                <span className="ml-auto text-[10px] text-gray-300 font-normal bg-gray-100 px-1.5 py-0.5 rounded-full">
                  예정
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
