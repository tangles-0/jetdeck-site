import type { Page, SiteSetting } from '@/payload-types'

import { BlocksRenderer } from './blocks/BlocksRenderer'
import { Navigation } from './Navigation'

type NavPage = Pick<Page, 'id' | 'path' | 'title' | 'navLabel'>

export function PageRenderer({
  page,
  navPages,
  settings,
}: {
  page: Page
  navPages: NavPage[]
  settings: SiteSetting
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative">
        {page.showNavigation && <Navigation pages={navPages} settings={settings} />}
        <BlocksRenderer blocks={page.layout} />
      </div>
    </div>
  )
}
