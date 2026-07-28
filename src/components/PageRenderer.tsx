import type { Page, SiteSetting } from '@/payload-types'

import { BlocksRenderer } from './blocks/BlocksRenderer'
import { KnowledgebaseIndex } from './knowledgebase/KnowledgebaseIndex'
import type { KnowledgebasePage } from './knowledgebase/knowledgebaseTree'
import { Navigation } from './Navigation'
import { SiteFooter } from './SiteFooter'

type NavPage = Pick<Page, 'id' | 'path' | 'title' | 'navLabel'>

type PageRendererProps = {
  page: Page
  currentPath: string
  navPages: NavPage[]
  settings: SiteSetting
  knowledgebasePages?: KnowledgebasePage[] | null
}

export const PageRenderer = ({ page, currentPath, navPages, settings, knowledgebasePages }: PageRendererProps) => {
  const isKnowledgebasePage = Boolean(page.isKnowledgebasePage)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative">
        {page.showNavigation ? <Navigation pages={navPages} settings={settings} /> : null}

        {isKnowledgebasePage ? (
          <main className="mx-auto grid w-full max-w-[1680px] gap-6 px-4 py-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-6 lg:py-8">
            <KnowledgebaseIndex
              pages={knowledgebasePages}
              currentPath={currentPath}
              variant="sidebar"
              heading="Knowledgebase"
            />
            <div className="min-w-0">
              <BlocksRenderer
                blocks={page.layout}
                currentPath={currentPath}
                knowledgebasePages={knowledgebasePages}
                variant="knowledgebase"
              />
            </div>
          </main>
        ) : (
          <BlocksRenderer
            blocks={page.layout}
            currentPath={currentPath}
            knowledgebasePages={knowledgebasePages}
          />
        )}
        <SiteFooter settings={settings} />
      </div>
    </div>
  )
}
