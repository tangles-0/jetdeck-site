import Link from 'next/link'

import { isSafeHref, isSafePagePath } from '@/lib/cmsValidation'
import type { Page, SiteSetting } from '@/payload-types'

type NavPage = Pick<Page, 'id' | 'path' | 'title' | 'navLabel'>
type SafeNavPage = NavPage & { path: string }

const isSafeNavPage = (page: NavPage): page is SafeNavPage => isSafePagePath(page.path)

export function Navigation({ pages, settings }: { pages: NavPage[]; settings: SiteSetting }) {
  const safePages = pages.filter(isSafeNavPage)
  const extraLinks = (settings.navLinks ?? []).filter((link) => isSafeHref(link.url))

  return (
    <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur">
      <nav className="container mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="font-orbitron text-cyan-300 text-lg font-bold tracking-wide">
          {settings.navBrandLabel || 'JetDeck SCOUT'}
        </Link>
        <div className="flex flex-wrap gap-4 text-sm font-mono">
          {safePages.map((page) => (
            <Link
              key={page.id}
              href={page.path}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {page.navLabel || page.title}
            </Link>
          ))}
          {extraLinks.map((link, index) => (
            <a
              key={link.id ?? index}
              href={link.url}
              target={link.url.startsWith('/') ? undefined : '_blank'}
              rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
