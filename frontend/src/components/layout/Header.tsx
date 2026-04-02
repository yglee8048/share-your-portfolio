import Link from 'next/link'

const SproutIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15 C10 15 7 13 7 9 C9 9 12 11 12 15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 13 C14 13 17 11 17 7 C15 7 12 9 12 13" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21 h8" />
  </svg>
)

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-brand-100 h-14 flex items-center px-5">
      <Link
        href="/accounts"
        className="flex items-center gap-1.5 text-brand-600 font-bold text-base tracking-tight hover:text-brand-700 transition-colors"
      >
        <SproutIcon />
        자산 포트폴리오
      </Link>
    </header>
  )
}
