import { isSafeHref } from '@/lib/cmsValidation'
import type { SiteSetting } from '@/payload-types'

type SiteFooterProps = {
  settings: SiteSetting
}

export const SiteFooter = ({ settings }: SiteFooterProps) => {
  const columns = settings.footerColumns ?? []

  return (
    <footer className="border-t border-slate-800 py-8">
      <div className="container mx-auto px-4">
        {columns.length > 0 ? (
          <div className="mb-8 grid gap-8 text-sm md:grid-cols-3">
            {columns.map((column, index) => (
              <div key={column.id ?? index}>
                <h3 className="mb-3 font-mono text-cyan-400">{column.title}</h3>
                <div className="flex flex-col gap-2">
                  {(column.links ?? [])
                    .filter(link => isSafeHref(link.url))
                    .map((link, linkIndex) => {
                      const isExternal = !link.url.startsWith('/')

                      return (
                        <a
                          key={link.id ?? linkIndex}
                          href={link.url}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className="text-slate-500 transition-colors hover:text-cyan-300"
                        >
                          {link.label}
                        </a>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="text-center font-mono text-sm text-slate-500">
          {settings.footerLine1 ? <p>{settings.footerLine1}</p> : null}
          {settings.footerLine2 ? <p className="mt-2">{settings.footerLine2}</p> : null}
        </div>
      </div>
    </footer>
  )
}
